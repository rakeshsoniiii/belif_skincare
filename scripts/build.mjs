import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
await build({entryPoints:['src/scene.js'],bundle:true,minify:true,format:'iife',outfile:'dist/scene.js'});
execFileSync(process.execPath,['node_modules/@tailwindcss/cli/dist/index.mjs','-i','src/tailwind.css','-o','dist/tailwind.css','--minify'],{stdio:'inherit'});
let html=readFileSync('dist/index.html','utf8');
for(const file of ['tailwind.css','style.css','shop.css'])html=html.replace(`<link rel="stylesheet" href="${file}">`,()=>`<style>${readFileSync('dist/'+file,'utf8')}</style>`);
for(const file of ['app.js','scene.js'])html=html.replace(new RegExp(`<script src="${file}"[^>]*></script>`),()=>`<script>${readFileSync('dist/'+file,'utf8').replaceAll('</script','<\\/script')}</script>`);
// A standalone handoff includes each local product image as a data URL.
const slugs=['anti-acne-gel','glow-brightening-lotion','onion-bhringraj-hair-mask','kojic-night-cream','herbal-hair-powder'];const assets={};
for(const slug of slugs)for(const type of ['front','info']){const path=`images/products/${slug}/${type}.webp`;assets[path]='data:image/webp;base64,'+readFileSync('dist/'+path).toString('base64')}
for(const [path,data] of Object.entries(assets))html=html.replaceAll(`src="${path}"`,`src="${data}"`);
html=html.replace('const imagePath=(p,type)=>`images/products/${p.id}/${type}.webp`;','const embeddedAssets='+JSON.stringify(assets)+';const imagePath=(p,type)=>embeddedAssets[`images/products/${p.id}/${type}.webp`];');
for(const src of ['media/gemini_generated_video_eb90fa9e.mp4','images/gemini_generated_video_eb90fa9e.mp4','media/belif-hero.mp4']){
  if(html.includes(`src="${src}"`)){
    html=html.replaceAll(`src="${src}"`,'src="data:video/mp4;base64,'+readFileSync('dist/media/belif-hero.mp4').toString('base64')+'"');
  }
}
writeFileSync('../Belif Demo.html',html);console.log('Built Three.js, Tailwind and standalone demo.');
