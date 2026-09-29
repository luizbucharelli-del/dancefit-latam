import { readdir, mkdir, copyFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const project = fileURLToPath(new URL('..', import.meta.url));
export const source = path.resolve(project, '..', 'imagens funil');
export const normalize = name => name.replace(/\.(png|jpe?g|webp)$/i, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();

export async function syncAssets() {
  const destination = path.join(project, 'dist', 'assets');
  await mkdir(destination, { recursive: true });
  const files = (await readdir(source)).filter(name => /\.(png|jpe?g|webp)$/i.test(name)).sort();
  const manifest = {};
  for (const file of files) {
    const key = normalize(file);
    const cleanName = key + path.extname(file).toLowerCase();
    const from = path.join(source, file);
    const to = path.join(destination, cleanName);
    const original = await stat(from);
    const copied = await stat(to).catch(() => null);
    if (!copied || copied.size !== original.size || copied.mtimeMs < original.mtimeMs) await copyFile(from, to);
    manifest[key] = `assets/${encodeURIComponent(cleanName)}`;
  }
  const aliases = {
    welcome: ['etapa05', 'etapa5'],
    ritmo1: ['pergunta11', 'zumba-e-saude-das-mulheres-3'],
    ritmo2: ['pergunta11(2)', 'zumba-e-saude-das-mulheres-3(1)'],
    before: ['antesedepoisetapafinal', 'pergunta3(3)'],
    after: ['antesedepoisetapafinal(2)', 'pergunta3'],
    guarantee: ['garantia7dias', 'selogarantia', 'garantia'],
    proof: ['etapa09-sem-fonte', 'etapa09-es', 'etapa09', 'provasocial', 'etapa10'],
    logo: ['logo', 'dancefit-logo'],
  };
  for (const [key, candidates] of Object.entries(aliases)) {
    const found = candidates.find(candidate => manifest[candidate]);
    if (found) manifest[key] = manifest[found];
  }
  await writeFile(path.join(project, 'dist', 'assets-manifest.js'), `// Gerado por scripts/sync-assets.mjs.\nwindow.DANCEFIT_ASSETS = ${JSON.stringify(manifest, null, 2)};\n`);
  return { files: files.length, keys: Object.keys(manifest).length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(JSON.stringify(await syncAssets()));
