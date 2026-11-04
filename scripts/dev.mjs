import {spawn} from 'node:child_process';
const build=spawn(process.execPath,['scripts/build.mjs'],{stdio:'inherit',env:process.env});
build.on('exit',code=>{if(code)process.exit(code);import('../server/index.mjs');});
