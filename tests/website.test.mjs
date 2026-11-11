import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {videos,categoryMatches,durationLabel} from '../src/content.js';
import {dictionaries,localPath,parsePath} from '../src/i18n.js';
import {validateBrief,buildBrief,emailLink,LEAD_EMAIL} from '../src/lead.js';
test('real video library is complete, unique, playable, and compressed',async()=>{
 assert.equal(videos.length,35);assert.equal(new Set(videos.map(v=>v.id)).size,35);
 for(const v of videos){assert.ok(v.duration>0);for(const l of ['en','es','pt']){assert.ok(v.title[l]);assert.ok(v.description[l]);}if(v.video.startsWith('/')){const media=await stat('public'+v.video);assert.ok(media.size<9_000_000,`${v.id} exceeds web budget`);}else{assert.match(v.video,/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/videos\/[a-z0-9-]+\.mp4$/,`${v.id} must be hosted in Blob, not bundled`);}assert.ok((await stat('public'+v.poster)).size<100_000);assert.ok((await stat(`public/media/${v.id}.small.webp`)).size>0);assert.ok((await stat(`public/media/${v.id}.preview.mp4`)).size<300_000);}
});
test('filters use actual metadata and durations',()=>{assert.equal(videos.filter(v=>categoryMatches(v,'comedy')).length,5);assert.equal(videos.filter(v=>categoryMatches(v,'promotions')).length,2);assert.equal(videos.filter(v=>categoryMatches(v,'explainers')).length,26);assert.equal(durationLabel(70.9),'1:10');});
test('locale dictionaries preserve all field and state translations',()=>{
 const walk=(base,other,path='')=>{for(const key of Object.keys(base)){assert.ok(key in other,`Missing ${path}${key}`);if(Array.isArray(base[key]))assert.equal(other[key].length,base[key].length,`${path}${key}`);else if(typeof base[key]==='object')walk(base[key],other[key],`${path}${key}.`);}};
 walk(dictionaries.en,dictionaries.es);walk(dictionaries.en,dictionaries.pt);
 assert.deepEqual(parsePath('/pt/explore/acai-brasil'),{locale:'pt',route:'/explore/acai-brasil'});assert.equal(localPath('/quote?package=Growth','es'),'/es/quote?package=Growth');
});
test('manual email brief validates contact details and includes complete context',()=>{
 assert.deepEqual(validateBrief({name:' ',email:'not valid'}),{name:'required',email:'invalidEmail'});assert.ok(validateBrief({name:'Alex',email:'a@b.com\r\nBcc:bad@bad.com'}).email);assert.deepEqual(validateBrief({name:'Alex',email:'alex@example.com'}),{});
 const body=buildBrief({name:'Alex',email:'alex@example.com',business:'Açaí & Co',formats:['3D animation'],package:'Growth',languages:['Portuguese'],project:'A summer campaign'},[videos.find(v=>v.id==='acai-brasil')],'https://example.com/pt/quote','2026-11-04T12:00:00Z');
 assert.match(body,/Açaí & Co/);assert.match(body,/Growth/);assert.match(body,/acai-brasil/);assert.match(body,/https:\/\/example.com\/explore\/acai-brasil/);assert.match(body,/Portuguese/);
 const link=emailLink('New quote\r\nSafe',body);assert.ok(link.startsWith(`mailto:${LEAD_EMAIL}?`));const parameters=new URLSearchParams(link.split('?')[1]);assert.equal(parameters.get('body'),body);assert.equal(parameters.get('subject'),'New quote  Safe');
});
test('all public pages are prerendered and language-specific',async()=>{for(const l of ['en','es','pt'])for(const r of ['/','/explore','/packages','/quote','/contact','/privacy',...videos.map(v=>`/explore/${v.slug}`)]){const html=await readFile(`dist${localPath(r,l)}${r==='/'?'':'/'}index.html`,'utf8');assert.match(html,/<h1/);assert.match(html,/application\/ld\+json/);assert.match(html,/meta name="description"/);assert.match(html,/ReelFarm/);assert.ok(!html.includes('Account'));assert.ok(!html.includes('undefined'));}});

test('four scoped packages have consistent pricing, translations, and quote links',async()=>{
 const {plans,planCopy}=await import('../src/plans.js');assert.deepEqual(plans.map(p=>[p.id,p.price,p.type]),[['Starter',50,'pack'],['Content',140,'pack'],['Growth',300,'monthly'],['Creator',null,'project']]);
 for(const locale of ['en','es','pt']){const html=await readFile(`dist${localPath('/packages',locale)}/index.html`,'utf8');for(const p of plans){assert.ok(p[locale][2].length>=6);assert.ok(html.includes(`/quote?package=${p.id}`));if(p.price)assert.ok(html.replace(/<!--.*?-->/g,'').includes(`$${p.price}`));}assert.ok(html.includes(planCopy[locale].allowance));assert.ok(html.includes('Sponsored &amp; Created with'));assert.ok(html.includes('<strong>Montaj.ag</strong>'));assert.ok(html.includes('apple-touch-icon'));assert.ok(!html.includes('2 videos per day'));}
});

test('large videos are hosted in Blob, not bundled into the deploy',async()=>{
 const {readdir}=await import('node:fs/promises');const files=(await readdir('public/media')).filter(f=>f.endsWith('.mp4')&&!f.endsWith('.preview.mp4'));
 for(const f of files)assert.ok(!['hdd-vs-ssd','roof-build','roof-storm-uplift','privacy-fence','solar-home','ac-not-cooling','pool-build','brick-wall'].some(id=>f===id+'.mp4'));
 const manifest=JSON.parse(await readFile('library/manifest.json','utf8'));
 for(const e of manifest.entries){assert.ok(e.hostedUrl?.startsWith('https://'));assert.ok(e.localPath.startsWith('~/'));}
});
test('only videos with a configured landing page show demo CTAs, and the page is prerendered',async()=>{
 const withLanding=videos.filter(v=>v.landing);assert.deepEqual(withLanding.map(v=>v.id),['roof-storm-uplift']);assert.equal(withLanding[0].landing.path,'/demo/roofing');
 const html=await readFile('dist/demo/roofing/index.html','utf8');assert.match(html,/Roof Storm Damage\?/);assert.match(html,/Get a Free Roof Estimate/);assert.match(html,/noindex/);assert.ok(!html.includes('mailto:'));
 const explore=await readFile('dist/explore/index.html','utf8');assert.match(explore,/View Live Roofing Demo/);assert.equal(explore.split('View Live Roofing Demo').length-1,1);
 const detail=await readFile('dist/explore/roof-storm-uplift/index.html','utf8');assert.match(detail,/See This Video in a Real Landing Page/);
 const other=await readFile('dist/explore/privacy-fence/index.html','utf8');assert.ok(!other.includes('Landing Page'));
 assert.match(await readFile('dist/index.html','utf8'),/Roof Repair[^<]*(?:<!--.*?-->)?[^<]*<em>Estimator/);
});
test('estimate form validation',async()=>{
 const {validateLead}=await import('../src/demo/leadSchema.js');
 assert.deepEqual(Object.keys(validateLead({}).errors).sort(),['email','name','phone','service','zip']);
 const ok=validateLead({name:'Ana Ruiz',phone:'(425) 555-0188',email:'ana@example.com',zip:'98004',service:'inspection',message:''});assert.ok(ok.ok);assert.equal(ok.value.phone,'4255550188');
 assert.ok(validateLead({name:'Ana',phone:'123',email:'a@b.co',zip:'9800',service:'x'}).errors.zip);
});
test('lead API never fakes success: 503 when no provider, delivers via webhook when configured',async()=>{
 const {default:handler}=await import('../api/lead.js');
 const call=async(body,env={})=>{const keep={...process.env};for(const k of ['RESEND_API_KEY','LEAD_NOTIFY_EMAIL','LEAD_FROM_EMAIL','LEAD_WEBHOOK_URL'])delete process.env[k];Object.assign(process.env,env);
  const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(b){this.body=b;}};await handler({method:'POST',headers:{host:'x.test'},body,socket:{remoteAddress:'9.9.9.'+Math.floor(Math.random()*250)}},res);process.env=keep;return {status:res.statusCode,json:JSON.parse(res.body)};};
 const valid={name:'Ana Ruiz',phone:'4255550188',email:'ana@example.com',zip:'98004',service:'storm-damage',campaign:'roofing-demo',startedAt:Date.now()-5000};
 assert.equal((await call(valid)).status,503);assert.equal((await call(valid)).json.error,'not_configured');
 assert.equal((await call({...valid,startedAt:Date.now()})).status,400);assert.equal((await call({...valid,email:'x'})).status,422);
 const {createServer}=await import('node:http');let got;const srv=createServer((q,r)=>{let b='';q.on('data',c=>b+=c);q.on('end',()=>{got=JSON.parse(b);r.end('ok');});});await new Promise(r=>srv.listen(0,r));
 const r=await call(valid,{LEAD_WEBHOOK_URL:`http://localhost:${srv.address().port}`});srv.close();assert.equal(r.status,200);assert.equal(got.zip,'98004');
});
