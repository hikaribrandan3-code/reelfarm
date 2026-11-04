import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {videos,categoryMatches,durationLabel} from '../src/content.js';
import {dictionaries,localPath,parsePath} from '../src/i18n.js';
import {validateBrief,buildBrief,emailLink,LEAD_EMAIL} from '../src/lead.js';
test('real video library is complete, unique, playable, and compressed',async()=>{
 assert.equal(videos.length,9);assert.equal(new Set(videos.map(v=>v.id)).size,9);
 for(const v of videos){assert.ok(v.duration>0);for(const l of ['en','es','pt']){assert.ok(v.title[l]);assert.ok(v.description[l]);}const media=await stat('public'+v.video);assert.ok(media.size<9_000_000,`${v.id} exceeds web budget`);assert.ok((await stat('public'+v.poster)).size<100_000);assert.ok((await stat(`public/media/${v.id}.preview.mp4`)).size<300_000);}
});
test('filters use actual metadata and durations',()=>{assert.equal(videos.filter(v=>categoryMatches(v,'comedy')).length,5);assert.equal(videos.filter(v=>categoryMatches(v,'promotions')).length,1);assert.equal(videos.filter(v=>categoryMatches(v,'explainers')).length,2);assert.equal(durationLabel(70.9),'1:10');});
test('locale dictionaries preserve all field and state translations',()=>{
 const walk=(base,other,path='')=>{for(const key of Object.keys(base)){assert.ok(key in other,`Missing ${path}${key}`);if(Array.isArray(base[key]))assert.equal(other[key].length,base[key].length,`${path}${key}`);else if(typeof base[key]==='object')walk(base[key],other[key],`${path}${key}.`);}};
 walk(dictionaries.en,dictionaries.es);walk(dictionaries.en,dictionaries.pt);
 assert.deepEqual(parsePath('/pt/explore/acai-brasil'),{locale:'pt',route:'/explore/acai-brasil'});assert.equal(localPath('/quote?package=Growth','es'),'/es/quote?package=Growth');
});
test('manual email brief validates contact details and includes complete context',()=>{
 assert.deepEqual(validateBrief({name:' ',email:'not valid'}),{name:'required',email:'invalidEmail'});assert.ok(validateBrief({name:'Alex',email:'a@b.com\r\nBcc:bad@bad.com'}).email);assert.deepEqual(validateBrief({name:'Alex',email:'alex@example.com'}),{});
 const body=buildBrief({name:'Alex',email:'alex@example.com',business:'Açaí & Co',formats:['3D animation'],package:'Growth',languages:['Portuguese'],project:'A summer campaign'},[videos[0]],'https://example.com/pt/quote','2026-11-04T12:00:00Z');
 assert.match(body,/Açaí & Co/);assert.match(body,/Growth/);assert.match(body,/acai-brasil/);assert.match(body,/https:\/\/example.com\/explore\/acai-brasil/);assert.match(body,/Portuguese/);
 const link=emailLink('New quote\r\nSafe',body);assert.ok(link.startsWith(`mailto:${LEAD_EMAIL}?`));const parameters=new URLSearchParams(link.split('?')[1]);assert.equal(parameters.get('body'),body);assert.equal(parameters.get('subject'),'New quote  Safe');
});
test('all public pages are prerendered and language-specific',async()=>{for(const l of ['en','es','pt'])for(const r of ['/','/explore','/packages','/quote','/contact','/privacy',...videos.map(v=>`/explore/${v.slug}`)]){const html=await readFile(`dist${localPath(r,l)}${r==='/'?'':'/'}index.html`,'utf8');assert.match(html,/<h1/);assert.match(html,/application\/ld\+json/);assert.match(html,/meta name="description"/);assert.match(html,/ReelFarm/);assert.ok(!html.includes('Account'));assert.ok(!html.includes('undefined'));}});
