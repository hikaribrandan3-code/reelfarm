import * as esbuild from 'esbuild';
import {mkdir,rm,cp,writeFile,readdir,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {renderToString} from 'react-dom/server';
import React from 'react';
import {pathToFileURL} from 'node:url';
import {getSEO} from '../src/seo.js';
import {videos} from '../src/content.js';
import {dictionaries,localPath,locales,parsePath} from '../src/i18n.js';
const root=process.cwd();
await rm('dist',{recursive:true,force:true});
await mkdir('dist/assets',{recursive:true});await mkdir('.cache',{recursive:true});
const bundle=await esbuild.build({entryPoints:['src/client.jsx'],bundle:true,minify:true,splitting:true,format:'esm',target:'es2020',outdir:'dist/assets',entryNames:'app-[hash]',chunkNames:'chunk-[hash]',jsx:'automatic',metafile:true,define:{'process.env.NODE_ENV':'"production"'}});
await writeFile('.cache/bundle-analysis.json',JSON.stringify(bundle.metafile,null,2));
const appJs=Object.keys(bundle.metafile.outputs).find(p=>bundle.metafile.outputs[p].entryPoint==='src/client.jsx');
const appCss=bundle.metafile.outputs[appJs].cssBundle;
await esbuild.build({entryPoints:['src/App.jsx'],bundle:true,platform:'node',format:'esm',outfile:'.cache/ssr.mjs',packages:'external',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
const {default:App,faqCopy}=await import(pathToFileURL(resolve('.cache/ssr.mjs')).href+`?v=${Date.now()}`);
await cp('public','dist',{recursive:true});
await cp('motion/hyperframes','dist/motion/brand',{recursive:true,filter:source=>!source.includes('/.hyperframes')});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const origin=process.env.SITE_URL?.replace(/\/$/,'')||'{{ORIGIN}}';
const routeNames=['/','/explore','/packages','/quote','/contact','/privacy',...videos.map(v=>`/explore/${v.slug}`)];
for(const locale of locales){
 for(const route of routeNames){
  const path=localPath(route,locale);const t=dictionaries[locale];const video=videos.find(v=>route===`/explore/${v.slug}`);
  const {title,description,structured}=getSEO(locale,route,origin);
  const absolute=origin?origin+path:'';const poster=origin?origin+(video?.poster||'/brand/reelfarm-logo.webp'):(video?.poster||'/brand/reelfarm-logo.webp');
  const body=renderToString(React.createElement(App,{initialPath:path}));
  const html=`<!doctype html><html lang="${locale==='pt'?'pt-BR':locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#ffffff"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-video-preview:-1"><meta property="og:type" content="${video?'video.other':'website'}"><meta property="og:site_name" content="ReelFarm"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:locale" content="${locale==='pt'?'pt_BR':locale==='es'?'es_AR':'en_US'}"><meta property="og:image" content="${poster}"><meta name="twitter:card" content="summary_large_image">${absolute?`<link rel="canonical" href="${absolute}"><meta property="og:url" content="${absolute}">${locales.map(l=>`<link rel="alternate" hreflang="${l==='pt'?'pt-BR':l}" href="${origin+localPath(route,l)}">`).join('')}<link rel="alternate" hreflang="x-default" href="${origin+route}">`:''}<link rel="icon" type="image/svg+xml" href="/brand/favicon.svg"><link rel="stylesheet" href="/${appCss.slice(5)}">${structured.map(data=>`<script type="application/ld+json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>`).join('')}</head><body><div id="root">${body}</div><script type="module" src="/${appJs.slice(5)}"></script></body></html>`;
  const dir=resolve('dist',path.slice(1));await mkdir(dir,{recursive:true});await writeFile(resolve(dir,'index.html'),html);
 }
}
// Unknown routes get a real 404 response from the included server.
await writeFile('dist/404.html',`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Page not found | ReelFarm</title><link rel="stylesheet" href="/${appCss.slice(5)}"><body><main class="not-found wrap page"><h1>This page is between takes.</h1><a class="button" href="/explore">Explore videos</a></main></body></html>`);
const urlBase=origin||'{{ORIGIN}}';
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locales.flatMap(l=>routeNames.filter(r=>r!=='/quote').map(r=>`<url><loc>${urlBase+localPath(r,l)}</loc></url>`)).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${urlBase}/sitemap.xml\n`);
console.log(`ReelFarm: ${routeNames.length*3} crawlable pages, 3 languages, ${videos.length} real videos.`);
