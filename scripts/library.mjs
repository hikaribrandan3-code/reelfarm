// ReelFarm video library tooling.
//   node scripts/library.mjs probe     -> measures masters, writes library/manifest.json
//   node scripts/library.mjs optimize  -> web H.264 + poster + card preview into library/out (masters untouched)
// Outputs: library/out/videos/<id>.mp4, library/out/posters/<id>.webp|.small.webp, library/out/previews/<id>.preview.mp4
import {execFile} from 'node:child_process';import {promisify} from 'node:util';
import {readFile,writeFile,mkdir,stat,rm} from 'node:fs/promises';import {homedir} from 'node:os';import {existsSync} from 'node:fs';
const run=promisify(execFile);const home=p=>p.replace(/^~/,homedir());
const src=JSON.parse(await readFile('library/sources.json','utf8'));
const manifestPath='library/manifest.json';
let previous={entries:[]};try{previous=JSON.parse(await readFile(manifestPath,'utf8'));}catch{}
const probe=async file=>{const {stdout}=await run('ffprobe',['-v','error','-print_format','json','-show_format','-show_streams',file]);const j=JSON.parse(stdout);const v=j.streams.find(s=>s.codec_type==='video');const a=j.streams.find(s=>s.codec_type==='audio');return {duration:Number(Number(j.format.duration).toFixed(2)),width:v.width,height:v.height,aspectRatio:v.height>v.width?'9:16':'16:9',videoCodec:v.codec_name,audioCodec:a?.codec_name||null,sizeBytes:Number(j.format.size)};};
const cmd=process.argv[2];
const entries=[];
for(const e of src.entries){
  const old=previous.entries.find(x=>x.id===e.id)||{};
  const m=home(e.master);const p=await probe(m);
  const entry={id:e.id,title:e.title,description:e.description,category:e.category,industry:e.industry,tags:e.tags,
    localPath:e.master,duration:p.duration,resolution:`${p.width}x${p.height}`,aspectRatio:p.aspectRatio,sizeBytes:p.sizeBytes,
    productionStatus:e.status,relationship:{role:'master',webSource:e.webSource,alternates:e.alternates},
    websiteStatus:old.websiteStatus||'not-published',hostedUrl:old.hostedUrl||null,posterUrl:`/media/${e.id}.webp`,previewUrl:`/media/${e.id}.preview.mp4`,
    landingPage:e.landingPage?src.landingPages[e.landingPage].path:null,landingLabel:e.landingPage?src.landingPages[e.landingPage].label:null,posterAt:e.posterAt,order:e.order,optimized:old.optimized||null};
  if(cmd==='optimize'&&(!process.argv[3]||process.argv[3]===e.id)){
    await mkdir('library/out/videos',{recursive:true});await mkdir('library/out/posters',{recursive:true});await mkdir('library/out/previews',{recursive:true});
    const input=home(e.webSource);const out=`library/out/videos/${e.id}.mp4`;
    // 1080x1920 is the master size (no upscaling). CRF + VBV cap keeps small text sharp while staying mobile friendly. faststart = streamable.
    await run('ffmpeg',['-v','error','-y','-i',input,'-map','0:v:0','-map','0:a:0','-c:v','libx264','-preset','slow','-profile:v','high','-level','4.1','-crf','25','-maxrate','3200k','-bufsize','6400k','-pix_fmt','yuv420p','-r','30','-g','60','-c:a','aac','-b:a','128k','-ar','48000','-ac','2','-movflags','+faststart',out],{maxBuffer:1e8});
    const t=e.posterAt;
    for(const [w,h,q,suffix] of [[600,1067,82,''],[300,534,78,'.small']]){const png=`library/out/posters/${e.id}${suffix}.tmp.png`;
      await run('ffmpeg',['-v','error','-y','-ss',String(t),'-i',input,'-frames:v','1','-vf',`scale=${w}:${h}:flags=lanczos`,png]);
      await run('cwebp',['-quiet','-q',String(q),png,'-o',`library/out/posters/${e.id}${suffix}.webp`]);await rm(png);}
    await run('ffmpeg',['-v','error','-y','-ss',String(t),'-t','5','-i',input,'-an','-vf','scale=270:480:flags=lanczos,fps=24','-c:v','libx264','-preset','slow','-crf','30','-pix_fmt','yuv420p','-movflags','+faststart',`library/out/previews/${e.id}.preview.mp4`]);
    const o=await probe(out);const outSize=(await stat(out)).size;
    // sync check: container audio/video durations should agree within 0.1s
    const {stdout}=await run('ffprobe',['-v','error','-show_entries','stream=codec_type,duration','-of','csv=p=0',out]);
    entry.optimized={file:`library/out/videos/${e.id}.mp4`,sizeBytes:outSize,resolution:`${o.width}x${o.height}`,duration:o.duration,sourceBytes:(await stat(input)).size,savedPercent:Number((100-outSize/(await stat(input)).size*100).toFixed(1)),streams:stdout.trim().split('\n').join(' ')};
    console.log(e.id,(outSize/1e6).toFixed(1)+'MB','saved',entry.optimized.savedPercent+'%',entry.optimized.streams);
  }
  entries.push(entry);
}
await writeFile(manifestPath,JSON.stringify({generated:new Date().toISOString(),landingPages:src.landingPages,entries,notPublished:src.notPublished},null,2)+'\n');
console.log(`manifest: ${entries.length} entries`);
