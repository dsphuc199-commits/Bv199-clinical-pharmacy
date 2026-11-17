/* Kiểu hiển thị module Nhiễm khuẩn tai mũi họng (màn hình + bản in một trang). */
export function EntStyle() {
  return <style>{`
.ent-page { max-width: 920px; margin: 0 auto; padding: 16px; color: #10243e; font-size: 14px; line-height: 1.55; }
.ent-page h1 { font-size: 21px; margin: 6px 0 2px; color: #0b3a5b; }
.ent-page h2 { font-size: 16px; margin: 14px 0 6px; color: #0b3a5b; }
.ent-page h3 { font-size: 14px; margin: 10px 0 4px; color: #0b6b3a; }
.ent-en { font-weight: 400; color: #4b6576; font-size: 15px; }
.ent-nav a { font-size: 13px; color: #087f89; }
.ent-muted { color: #4b6576; font-size: 12.5px; }
.ent-scope { background: #f1f6f9; border-radius: 8px; padding: 6px 10px; font-size: 13px; }
.ent-card { border: 1px solid #cfdde6; border-radius: 12px; padding: 12px; background: #fff; display: grid; gap: 8px; }
.ent-card h2 { margin: 0; }
.ent-inputs { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 8px; }
.ent-in { display: grid; gap: 3px; font-size: 13px; font-weight: 600; color: #33505f; }
.ent-in input[type=number], .ent-in select { min-height: 36px; border: 1px solid #b9cdd6; border-radius: 8px; padding: 4px 8px; font: inherit; }
.ent-in input[type=checkbox] { width: 20px; height: 20px; }
.ent-decision { margin: 0; padding: 8px 10px; background: #eef8f2; border-radius: 8px; }
.ent-list, .ent-st, .ent-src { margin: 0; padding-left: 18px; display: grid; gap: 6px; }
.ent-dose { border-bottom: 1px solid #edf2f6; padding-bottom: 6px; }
.ent-dose-h { display: flex; gap: 8px; align-items: center; }
.ent-calc { font-size: 13px; color: #1d4f8a; }
.ent-badge { display: inline-block; font-size: 11px; border-radius: 6px; padding: 0 6px; margin-top: 2px; background: #e6f0fb; color: #1d4f8a; }
.ent-tier-B { background: #fff3d6; color: #8a5a00; }
.ent-tier-REF { background: #eceff1; color: #455a64; }
.ent-badge-x { background: #fde4e4; color: #9b1c1c; }
.ent-nv { display: inline-block; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 0 6px; background: #fde4e4; color: #9b1c1c; margin-left: 4px; }
.ent-red { border: 1px solid #f6cfb5; background: #fff4ed; border-radius: 8px; padding: 8px 10px; }
.ent-red ul, .ent-gap ul, .ent-ns ul { margin: 4px 0; padding-left: 18px; }
.ent-gap { border: 1px dashed #b9cdd6; border-radius: 8px; padding: 8px 10px; }
.ent-ns { background: #f7fafc; border-radius: 8px; padding: 8px 10px; }
.ent-err { color: #9b1c1c; margin: 0; }
.ent-cmp summary { cursor: pointer; font-weight: 700; color: #8a5a00; }
.ent-conf { display: grid; gap: 6px; }
.ent-conf-row { border: 1px solid #e3eaf0; border-radius: 8px; padding: 6px 8px; }
.ent-conf-t { font-weight: 700; }
.ent-conf-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ent-grade { color: #4b6576; }
.ent-sec { margin-top: 8px; }
.ent-foot { margin-top: 16px; border-top: 1px solid #e3eaf0; padding-top: 8px; font-size: 12.5px; }
.ent-warn { font-weight: 800; color: #9b1c1c; }
.ent-index { display: grid; gap: 6px; padding-left: 18px; }
@media (max-width: 640px) { .ent-conf-cols { grid-template-columns: 1fr; } }
@media print {
  .ent-page { max-width: none; padding: 0; font-size: 10.5px; }
  .ent-nav, .ent-inputs, .ent-cmp summary::marker { display: none; }
  .ent-cmp { display: block; }
  .ent-cmp[open] > *, .ent-cmp > * { display: block; }
  .ent-card { border: 0; padding: 0; }
  .ent-sec { break-inside: avoid; }
  .ent-src a { color: inherit; text-decoration: none; }
  @page { size: A4; margin: 10mm; }
}
`}</style>;
}
