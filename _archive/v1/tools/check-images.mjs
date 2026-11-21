// Pre-build URL check (Image Manifest §4). Prints any dead image.
import { readFile } from 'node:fs/promises';
const data = JSON.parse(await readFile(new URL('../data/images.json', import.meta.url)));
let bad = 0;
await Promise.all(data.map(async (i) => {
  try { const r = await fetch(i.thumb_url, { method: 'HEAD' }); if (!r.ok) { bad++; console.log('FAIL', i.id, r.status); } }
  catch (e) { bad++; console.log('FAIL', i.id, e.message); }
}));
console.log(`check done — ${data.length} images, ${bad} failed`);
process.exit(bad ? 1 : 0);
