import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat,readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../dist',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webp':'image/webp'};
const port=Number(process.env.PORT||4173);
const server=createServer(async(req,res)=>{
 const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'SAMEORIGIN','Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
 for(const [key,value]of Object.entries(headers))res.setHeader(key,value);
 if(req.url.split('?')[0]==='/api/lead'){const {default:handler}=await import('../api/lead.js');return handler(req,res);}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
 let path;try{path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
 let file=resolve(root,'.'+path);if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);return res.end();}
 try{let info=await stat(file);if(info.isDirectory()){file=resolve(file,'index.html');info=await stat(file);}const extension=extname(file);res.setHeader('Content-Type',types[extension]||'application/octet-stream');res.setHeader('Cache-Control',extension==='.html'||extension==='.css'||extension==='.js'?'no-cache':extension==='.mp4'||extension==='.jpg'?'public, max-age=86400':'public, max-age=3600');
  if(extension==='.html'||path==='/robots.txt'||path==='/sitemap.xml'){const origin=process.env.SITE_URL||`http://${req.headers.host||`localhost:${port}`}`;const text=(await readFile(file,'utf8')).replaceAll('{{ORIGIN}}',origin);res.writeHead(200);return res.end(req.method==='HEAD'?undefined:text);}
  const range=req.headers.range;
  if(extension==='.mp4'){res.setHeader('Accept-Ranges','bytes');if(range){const match=/^bytes=(\d*)-(\d*)$/.exec(range);let start,end;if(match){if(!match[1]){start=Math.max(0,info.size-Number(match[2]));end=info.size-1;}else{start=Number(match[1]);end=match[2]?Number(match[2]):info.size-1;}}
   if(!match||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=info.size||end<start){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}end=Math.min(end,info.size-1);res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});if(req.method==='HEAD')return res.end();return createReadStream(file,{start,end}).pipe(res);}}
  res.writeHead(200,{'Content-Length':info.size});if(req.method==='HEAD')return res.end();createReadStream(file).pipe(res);
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:await readFile(resolve(root,'404.html')));}
});
server.listen(port,'0.0.0.0',()=>console.log(`ReelFarm local: http://localhost:${port}`));
process.on('SIGTERM',()=>server.close());
