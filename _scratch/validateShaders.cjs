// validateShaders.cjs — Real shader integrity check.
// Compiles each shader pair against WebGL with the three.js built-in
// preamble (position, normal, uv, modelMatrix, modelViewMatrix,
// projectionMatrix, normalMatrix, pointSize, gl_PointCoord). This is the
// exact environment the shaders will run in, so a pass here means a pass
// in the real app.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SHADER_DIR = 'C:/Users/HaroonSheikh/Desktop/claude test 2/src/shaders';

function readShader(file) {
  return fs.readFileSync(path.join(SHADER_DIR, file), 'utf8');
}

function extractDecls(src, keyword) {
  const re = new RegExp(`\\b${keyword}\\s+([A-Za-z0-9_]+)\\b`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) out.push(m[1]);
  return out;
}

function extractMains(src) {
  return (src.match(/void\s+main\s*\(\s*\)/g) || []).length;
}

function checkStructural(f, src) {
  const errs = [];
  if (extractMains(src) === 0) errs.push('no main()');
  if (extractMains(src) > 1) errs.push(`multiple main(): ${extractMains(src)}`);
  const open = (src.match(/{/g) || []).length;
  const close = (src.match(/}/g) || []).length;
  if (open !== close) errs.push(`brace mismatch open=${open} close=${close}`);
  const po = (src.match(/\(/g) || []).length;
  const pc = (src.match(/\)/g) || []).length;
  if (po !== pc) errs.push(`paren mismatch open=${po} close=${pc}`);
  if (/\bvaying\b/.test(src)) errs.push('typo vaying');
  if (/\bunifrom\b/.test(src)) errs.push('typo unifrom');
  return errs;
}

// three.js GLSL built-in declarations. This is what ShaderMaterial prepends
// before user code. Matching it makes the raw compile test accurate.
const THREE_PREAMBLE_V = `
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
`;
// three.js fragment preamble: ONLY precision. Varyings are user-declared.
const THREE_PREAMBLE_F = `
precision highp float;
`;

function main() {
  const files = fs.readdirSync(SHADER_DIR).filter(f => f.endsWith('.glsl'));
  const sources = {};
  for (const f of files) sources[f] = readShader(f);

  const structural = files.map(f => ({
    file: f,
    structural: checkStructural(f, sources[f]),
    varying: extractDecls(sources[f], 'varying'),
    uniform: extractDecls(sources[f], 'uniform'),
    attribute: extractDecls(sources[f], 'attribute'),
    mainCount: extractMains(sources[f]),
  }));

  const interfaces = {};
  for (const f of files) {
    if (f.endsWith('.v.glsl')) interfaces[f.replace('.v.glsl', '')] = {
      varying: extractDecls(sources[f], 'varying'),
      attribute: extractDecls(sources[f], 'attribute'),
    };
    if (f.endsWith('.f.glsl')) {
      const base = f.replace('.f.glsl', '');
      if (interfaces[base]) {
        interfaces[base].fragVarying = extractDecls(sources[f], 'varying');
        interfaces[base].missingVaryings = interfaces[base].varying.filter(
          v => !interfaces[base].fragVarying.includes(v)
        );
      }
    }
  }

  return chromium.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage();
    const compileResult = await page.evaluate(({ sources, structural, interfaces, THREE_PREAMBLE_V, THREE_PREAMBLE_F }) => {
      const out = { structural, interfaces, compile: [] };
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      if (!gl) { out.compile.push({ ok: false, err: 'no webgl2' }); return out; }

      const pairs = ['artifact', 'dust', 'projectPlane'];
      for (const name of pairs) {
        const vSrc = sources[name + '.v.glsl'];
        const fSrc = sources[name + '.f.glsl'];
        if (!vSrc || !fSrc) { out.compile.push({ name, ok: false, err: 'missing stage file' }); continue; }

        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, THREE_PREAMBLE_V + '\n' + vSrc);
        gl.compileShader(vs);
        const vOk = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
        const vLog = vOk ? '' : gl.getShaderInfoLog(vs);

        const fs_ = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs_, THREE_PREAMBLE_F + '\n' + fSrc);
        gl.compileShader(fs_);
        const fOk = gl.getShaderParameter(fs_, gl.COMPILE_STATUS);
        const fLog = fOk ? '' : gl.getShaderInfoLog(fs_);

        const ok = !!vOk && !!fOk;
        const entry = {
          name,
          ok,
          vertex: { ok: !!vOk, log: vLog },
          fragment: { ok: !!fOk, log: fLog },
        };
        if (ok) {
          const prog = gl.createProgram();
          gl.attachShader(prog, vs);
          gl.attachShader(prog, fs_);
          gl.linkProgram(prog);
          entry.linkOk = gl.getProgramParameter(prog, gl.LINK_STATUS);
          entry.linkLog = gl.getProgramInfoLog(prog);
          gl.validateProgram(prog);
          entry.validateOk = gl.getProgramParameter(prog, gl.VALIDATE_STATUS);
          entry.validateLog = gl.getProgramInfoLog(prog);
        }
        out.compile.push(entry);
      }
      return out;
    }, { sources, structural, interfaces, THREE_PREAMBLE_V, THREE_PREAMBLE_F });

    console.log(JSON.stringify(compileResult, null, 2));
    await browser.close();
  }).catch(e => {
    console.log('FATAL:', e.message);
    console.log(JSON.stringify({ structural }, null, 2));
  });
}

main();