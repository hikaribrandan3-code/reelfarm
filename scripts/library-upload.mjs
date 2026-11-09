// Uploads optimized videos + posters from library/out to the public Vercel Blob store and records URLs in the manifest.
// Needs BLOB_READ_WRITE_TOKEN (from `vercel env pull .env.local`). Never deletes anything locally.
import {execFile} from 'node:child_process';import {promisify} from 'node:util';import {readFile,writeFile} from 'node:fs/promises';
const run=promisify(execFile);
const env=Object.fromEntries((await readFile('.env.local','utf8')).split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1).replace(/^"|"$/g,'')];}));
const token=process.env.BLOB_READ_WRITE_TOKEN||env.BLOB_READ_WRITE_TOKEN;if(!token)throw new Error('BLOB_READ_WRITE_TOKEN missing');
const manifest=JSON.parse(await readFile('library/manifest.json','utf8'));
const put=async(file,pathname,type)=>{const {stdout,stderr}=await run('vercel',['blob','put',file,'--access','public','--pathname',pathname,'--content-type',type,'--allow-overwrite','true','--cache-control-max-age','31536000','--rw-token',token,'--non-interactive'],{maxBuffer:1e7});const m=(stdout+stderr).match(/https:\/\/\S+\.public\.blob\.vercel-storage\.com\/\S+/);if(!m)throw new Error('no url: '+stdout+stderr);return m[0].replace(/[)\].,]+$/,'');};
for(const e of manifest.entries){
  if(!e.optimized||(e.hostedUrl&&!process.argv.includes('--force')))continue;
  e.hostedUrl=await put(e.optimized.file,`videos/${e.id}.mp4`,'video/mp4');
  e.hostedPosterUrl=await put(`library/out/posters/${e.id}.webp`,`posters/${e.id}.webp`,'image/webp');
  e.websiteStatus='published';
  console.log(e.id,e.hostedUrl);
  await writeFile('library/manifest.json',JSON.stringify(manifest,null,2)+'\n');
}
// Public, slim projection of the manifest for the site bundle (no local paths).
const data=Object.fromEntries(manifest.entries.map(e=>[e.id,{video:e.hostedUrl,duration:e.duration,aspectRatio:e.aspectRatio,industry:e.industry,landing:e.landingPage,landingLabel:e.landingLabel}]));
await writeFile('src/library-data.json',JSON.stringify(data,null,1)+'\n');
