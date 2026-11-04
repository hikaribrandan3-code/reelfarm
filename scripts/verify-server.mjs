import assert from 'node:assert/strict';
import {videos} from '../src/content.js';
const base=process.env.TEST_ORIGIN||'http://localhost:4173';
for(const path of ['/','/explore','/packages','/quote','/contact','/privacy','/es/','/pt/',...videos.map(v=>`/explore/${v.slug}`)]){
 const response=await fetch(base+path);assert.equal(response.status,200,path);const text=await response.text();assert.ok(text.includes('<h1'),path);assert.ok(!text.includes('{{ORIGIN}}'),`${path}: unresolved origin`);assert.ok(text.includes(`${base}/`),`${path}: absolute metadata`);
}
let response=await fetch(base+'/media/acai-brasil.mp4',{headers:{Range:'bytes=0-1023'}});assert.equal(response.status,206);assert.equal((await response.arrayBuffer()).byteLength,1024);assert.match(response.headers.get('content-range'),/^bytes 0-1023\//);
response=await fetch(base+'/media/acai-brasil.mp4',{headers:{Range:'bytes=999999999999-'}});assert.equal(response.status,416);
response=await fetch(base+'/not-a-page');assert.equal(response.status,404);
response=await fetch(base+'/robots.txt');assert.ok((await response.text()).includes(base+'/sitemap.xml'));
response=await fetch(base+'/sitemap.xml');assert.ok(!(await response.text()).includes('{{ORIGIN}}'));
response=await fetch(base+'/quote',{method:'POST'});assert.equal(response.status,405);
console.log('HTTP checks passed: routes, metadata, video range streaming, 404s, robots, sitemap, unsupported methods.');
