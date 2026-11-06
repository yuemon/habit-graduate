/**
 * Post-process Expo web export for static hosts (GitHub Pages).
 * - Ensures .nojekyll exists (Jekyll would hide _expo/)
 * - Copies index.html → 404.html for SPA fallback on deep links
 */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(dist)) {
  console.error('dist/ missing — run expo export --platform web first');
  process.exit(1);
}

const nojekyll = path.join(dist, '.nojekyll');
if (!fs.existsSync(nojekyll)) {
  fs.writeFileSync(nojekyll, '');
  console.log('wrote dist/.nojekyll');
}

const indexHtml = path.join(dist, 'index.html');
const notFound = path.join(dist, '404.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFound);
  console.log('wrote dist/404.html (SPA fallback)');
} else {
  console.warn('dist/index.html missing — skipped 404.html');
}
