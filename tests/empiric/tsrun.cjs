// Nap TS/TSX du an (alias @/) de chay unit test empiric bang node (khong can build).
const path = require("path"), fs = require("fs"), Module = require("module");
const ROOT = process.env.PROJ || path.resolve(__dirname, "..", "..");
const ts = require(path.join(ROOT, "node_modules/typescript"));
const orig = Module._resolveFilename;
const tryExt = (p) => [p, p + ".ts", p + ".tsx", path.join(p, "index.ts")].find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
Module._resolveFilename = function (req, parent, ...rest) {
  if (req.startsWith("@/") || (req.startsWith(".") && parent && /\.(ts|tsx)$/.test(parent.filename))) {
    const base = req.startsWith("@/") ? path.join(ROOT, req.slice(2)) : path.resolve(path.dirname(parent.filename), req);
    const hit = tryExt(base); if (hit) return hit;
  }
  try { return orig.call(this, req, parent, ...rest); } catch (e) { return orig.call(this, req, { ...parent, paths: [path.join(ROOT, "node_modules")] }, ...rest); }
};
for (const ext of [".ts", ".tsx"]) require.extensions[ext] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, "utf8"), { compilerOptions: { module: 1, target: 9, jsx: 4, esModuleInterop: true, resolveJsonModule: true }, fileName: f }).outputText, f);
module.exports = (p) => require(path.join(ROOT, p));
