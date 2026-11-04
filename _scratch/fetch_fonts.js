const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = 'C:\\Users\\HaroonSheikh\\Desktop\\claude test 2\\public\\fonts';
fs.mkdirSync(outDir, { recursive: true });

function fetchCss(name, cssUrl) {
  const cssPath = path.join(outDir, `${name}.css`);
  let css;
  try {
    css = execSync(`curl -sL "${cssUrl}"`, { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
  } catch (e) { console.log('CSS FAIL', name, e.message); return; }
  fs.writeFileSync(cssPath, css);
  const urls = [...css.matchAll(/url\(([^)]+)\) format\('truetype'\)/g)].map(m => m[1]);
  console.log(name, 'URLs:', urls.length);
  for (const url of urls) {
    const fname = url.split('/').pop();
    const dest = path.join(outDir, fname);
    if (fs.existsSync(dest)) { console.log('  skip', fname); continue; }
    try {
      execSync(`curl -sL "${url}" -o "${dest}"`, { stdio: 'inherit' });
      console.log('  ok', fname, fs.statSync(dest).size, 'bytes');
    } catch (e) { console.log('  FAIL', fname, e.message); }
  }
}

// Fraunces (display serif) — already have CSS
fetchCss('fraunces', 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&display=swap');
// Sora (text sans)
fetchCss('sora', 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
// JetBrains Mono (utility)
fetchCss('jetbrains-mono', 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
console.log('DONE');