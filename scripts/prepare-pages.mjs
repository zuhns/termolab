import { cp, mkdir, rm, writeFile, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const target=path.resolve(root,'docs');
if(path.dirname(target)!==path.resolve(root)||path.basename(target)!=='docs') throw new Error('Cartella di pubblicazione non valida.');
await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await cp(path.resolve(root,'dist'),target,{recursive:true});
// Modern browsers use WOFF2. Remove redundant legacy font formats from the published copy.
const assets=path.join(target,'assets');
for(const name of await readdir(assets)) {
  const file=path.join(assets,name);
  if(name.endsWith('.css')) {
    const css=await readFile(file,'utf8');
    await writeFile(file,css.replace(/,url\([^)]*\.(?:woff|ttf)\)\s*format\("(?:woff|truetype)"\)/g,''));
  }
  if(/\.(woff|ttf)$/.test(name)) await rm(file);
}
await writeFile(path.join(target,'.nojekyll'),'');
console.log('Build copiata in docs/: pronta per GitHub Pages (main /docs).');
