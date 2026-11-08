/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS audit utility, shared with the existing CJS test loader. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'audit-69-2026/codex-review/UI8_ALL');
fs.mkdirSync(OUT, { recursive: true });
const load = require('../tests/empiric/tsrun.cjs');
const C = load('data/antibiotics/empiric/catalog.ts');
const R = load('data/antibiotics/empiric/regimens/index.ts');
const S = load('lib/antibiotics/regimen-structure.ts');
const E = load('lib/antibiotics/selection-engine.ts');
const I = load('data/antibiotics/empiric/international.ts');
const CAP = load('components/antibiotics/CapByt2026.tsx');
const HAP = load('components/antibiotics/HapVap2023.tsx');
const COPD = load('data/antibiotics/copd-2131.ts');
const A = load('data/antibiotics/empiric/approvals.ts');
const save = (name, value) => fs.writeFileSync(path.join(OUT, name), JSON.stringify(value, null, 2));
function walk(dir) { return fs.readdirSync(path.join(ROOT, dir), {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]); }
function fingerprint() {
  const files = [...walk('data'), 'lib/antibiotics/selection-engine.ts', 'lib/antibiotics/clinical-filters.ts', 'lib/antibiotics/regimen-structure.ts'].filter(p => /\.(ts|json)$/.test(p));
  return Object.fromEntries(files.sort().map(p => [p, crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,p))).digest('hex')]));
}
function clinicalState() {
  const vectors = [];
  for (const d of C.DISEASES) for (const population of ['adult','child']) for (const mode of ['normal','unknown','impaired']) {
    let input = { population, pregnant: 'no', penicillinAllergy: mode === 'unknown' ? 'unknown' : 'no', renal: mode, crcl: mode === 'impaired' ? 25 : undefined, micro: 'none', severity: 'unknown', mdr: 'unknown' };
    if (mode === 'normal') input.renal = 'normal';
    for (let n=0; n<8; n++) { const todo = E.questionsFor(d.id,input).filter(q => q.required && q.key !== 'scenario' && input[q.key] === undefined); if (!todo.length) break; for (const q of todo) input[q.key] = q.kind === 'number' ? 45 : q.options.find(o=>o.value==='unknown')?.value ?? q.options[0]?.value; }
    const scenarios = E.questionsFor(d.id,input).find(q=>q.key==='scenario')?.options.map(o=>o.value) ?? [undefined];
    for (const scenario of scenarios) vectors.push({ diseaseId:d.id, input:{...input,scenario}, result:E.evaluate(d.id,{...input,scenario}) });
  }
  return { catalog:C.DISEASES, regimens:R.ALL_REGIMENS, cap:CAP.CAP_SCENARIOS, hapvap:HAP.HAPVAP_SCENARIOS, copd:COPD, international:I.INTL_ENTRIES, approvals:A, structures:R.ALL_REGIMENS.map(r=>S.structureOf(r)), vectors, fileHashes:fingerprint() };
}
if (process.argv.includes('--baseline')) {
  if (fs.existsSync(path.join(OUT,'baseline.json'))) throw Error('Baseline exists; refusing to overwrite');
  const state = clinicalState(); save('baseline.json', state);
  save('inventory-baseline.json', C.DISEASES.map(d => ({...d, stream:C.getStream(d), route:`/antibiotics/empiric/guideline-v9?disease=${d.id}`, regimenIds:R.getRegimensForDisease(d.id).map(r=>r.id)})));
  console.log(JSON.stringify({catalog:C.DISEASES.length, ids:new Set(C.DISEASES.map(d=>d.id)).size, regimens:R.ALL_REGIMENS.length, vectors:state.vectors.length, protectedFiles:Object.keys(state.fileHashes).length}));
} else if (process.argv.includes('--integrity')) {
  const before = JSON.parse(fs.readFileSync(path.join(OUT,'baseline.json'),'utf8'));
  const after = clinicalState(); const differences = Object.keys(before).filter(key=>JSON.stringify(before[key])!==JSON.stringify(after[key]));
  const result={pass:differences.length===0,differences,catalog:after.catalog.length,vectors:after.vectors.length,checkedAt:new Date().toISOString()}; save('integrity.json',result);console.log(JSON.stringify(result));process.exitCode=result.pass?0:1;
}
module.exports = { ROOT, OUT, C, R, S, I, CAP, HAP, COPD, save, clinicalState };
