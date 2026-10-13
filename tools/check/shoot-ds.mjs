import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const DS='/home/claude/work/src/design-system/previews';
const FONTS='/home/claude/work/fonts';
const out=process.argv[2]||'/home/claude/work/ds-shots';
const names=(process.argv[3]||'').split(',').filter(Boolean);
const width=+(process.argv[4]||1440);
const files=names.length?names.map(n=>n+'.html'):fs.readdirSync(DS).filter(f=>f.endsWith('.html'));
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1});
await ctx.route(/fonts\.googleapis\.com/,r=>r.fulfill({contentType:'text/css',body:fs.readFileSync(FONTS+'/fonts.css','utf8').replaceAll('./','http://fonts.local/')}));
await ctx.route(/fonts\.local\//,r=>r.fulfill({contentType:'font/woff2',body:fs.readFileSync(FONTS+'/'+path.basename(new URL(r.request().url()).pathname))}));
await ctx.route(/fonts\.gstatic/,r=>r.abort());
for(const f of files){const p=await ctx.newPage();await p.goto('file://'+DS+'/'+f);await p.waitForTimeout(500);await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:`${out}/${f.replace('.html','')}-${width}.png`,fullPage:true});await p.close();}
await b.close(); console.log('ok',files.length);
