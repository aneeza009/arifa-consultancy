// Production build: copies the static site to dist/ and minifies CSS and JS with esbuild (run via npx, no install needed).
import { cpSync, rmSync, mkdirSync, statSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
for (const p of [...readdirSync('.').filter((f) => f.endsWith('.html')), 'assets', 'data']) cpSync(p, `dist/${p}`, { recursive: true });
const run = (args) => { const r = spawnSync('npx', ['--yes', 'esbuild@0.24.0', ...args], { stdio: 'inherit', shell: true }); if (r.status) process.exit(r.status); };
run(['css/styles.css', '--minify', '--outfile=dist/css/styles.css']);
run(['css/fonts.css', '--minify', '--outfile=dist/css/fonts.css']);
run(['js/main.js', '--minify', '--format=esm', '--outfile=dist/js/main.js']);
const kb = (f) => (statSync(f).size / 1024).toFixed(1) + ' KB';
console.log('built: css', kb('dist/css/styles.css'), '· js', kb('dist/js/main.js'));
