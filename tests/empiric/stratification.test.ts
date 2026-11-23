import { test } from "node:test";
import assert from "node:assert/strict";
import tables from "../../data/antibiotics/antibiogram-bv199-tables.json";
import { ALL_REGIMENS, getRegimensForDisease } from "../../data/antibiotics/empiric/regimens";
import { STRATIFICATIONS, cleanRef } from "../../data/antibiotics/empiric/stratification";
import { CAP_SCENARIOS } from "../../components/antibiotics/CapByt2026";
import { HAPVAP_SCENARIOS } from "../../components/antibiotics/HapVap2023";

test("stratification references only existing BYT regimens of the same disease", () => {
  for (const s of STRATIFICATIONS) {
    const ids = [...s.columns.flatMap((c) => c.byt), ...(s.focus ?? []).flatMap((f) => f.byt)];
    for (const id of ids) {
      const r = ALL_REGIMENS.find((x) => x.id === id);
      assert.ok(r, `${id} missing`);
      assert.ok(r!.diseaseIds.some((d) => s.diseaseIds.includes(d)), `${id} not for ${s.diseaseIds}`);
      assert.ok(s.diseaseIds.some((d) => getRegimensForDisease(d).some((x) => x.id === id)), `${id} is superseded in tab Việt Nam`);
    }
  }
});

test("international blocks come from the verified module and are not empty", () => {
  for (const s of STRATIFICATIONS) {
    for (const c of s.columns) for (const b of c.intl) assert.ok(b.items.length > 0, `${c.id} ${b.source}`);
    assert.ok(s.principles.items.length > 0);
    for (const c of s.columns) for (const b of c.vn ?? []) assert.ok(b.items.length > 0, `${c.id} ${b.source}`);
  }
});

test("antibiogram organisms and codes exist in the BV199 tables", () => {
  const t = (tables as { tables: { id: string; gramNegative: { columns: { code: string }[]; rows: { group: string }[] }; gramPositive: { columns: { code: string }[]; rows: { group: string }[] } }[] }).tables.find((x) => x.id === "toan-vien")!;
  for (const s of STRATIFICATIONS) {
    for (const [key, panel] of [["gramNegative", t.gramNegative], ["gramPositive", t.gramPositive]] as const) {
      const spec = s.antibiogram[key];
      for (const o of spec.organisms) assert.ok(panel.rows.some((r) => r.group === o), o);
      for (const c of spec.codes) assert.ok(panel.columns.some((x) => x.code === c), c);
    }
  }
});

test("sepsis stratification mirrors QĐ 708 mục 4.1.2 a/b and SWAB 3GCR-E tiers", () => {
  const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-11"))!;
  assert.deepEqual(s.columns.map((c) => c.byt[0]), ["r-sepsis-a", "r-sepsis-b", "r-sepsis-neutro"]);
  assert.match(s.columns[0].intl[0].source, /Nguy cơ thấp 3GCR-E/);
  assert.match(s.columns[1].intl[1].source, /Nguy cơ cao/);
});

test("pneumonia stratification uses the current Vietnamese documents shown in tab Việt Nam", () => {
  const cap = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-1"))!;
  assert.deepEqual(cap.columns.map((c) => c.id), ["out-low", "out-risk", "ward", "icu"]);
  for (const c of cap.columns) assert.match(c.vn![0].source, /QĐ 2147\/QĐ-BYT 2026/);
  for (const id of ["v8-4", "v8-5"]) {
    const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes(id))!;
    assert.equal(s.columns.length, 2);
    for (const c of s.columns) for (const b of c.vn!) assert.match(b.source, /Hội Hô hấp VN/);
  }
  const text = JSON.stringify(STRATIFICATIONS.map((s) => s.columns.map((c) => c.vn)));
  assert.doesNotMatch(text, /Phụ lục|Bảng \d|DTQG|tr\. \d|không ghi liều/);
});

/* Khung phân tầng thay toàn bộ phần cũ ở tab Việt Nam: không được mất phương án hay liều nào. */
const doseTokens = (s: string) => (s.match(/\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+(?:[.,]\d+)?)?\s*(?:mg\/kg|mg|MIU|g)(?!\p{L})/giu) ?? []).map((t) => t.replace(/\s+/g, ""));

test("every active BYT regimen of a stratified disease is shown in the panel", () => {
  for (const s of STRATIFICATIONS) {
    const shown = new Set([...s.columns.flatMap((c) => c.byt), ...(s.focus ?? []).flatMap((f) => f.byt)]);
    for (const d of s.diseaseIds) for (const r of getRegimensForDisease(d)) assert.ok(shown.has(r.id), `${d}: ${r.id} missing`);
  }
});

test("Vietnamese module regimens (QĐ 2147, Hội Hô hấp 2023) are all shown with every dose", () => {
  const modules: [string, { id: string; regimens: { id: string; drugs: { name: string; dose: string }[] }[] }[]][] = [
    ["v8-1", CAP_SCENARIOS], ["v8-4", HAPVAP_SCENARIOS.hap], ["v8-5", HAPVAP_SCENARIOS.vap],
  ];
  for (const [disease, scenarios] of modules) {
    const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes(disease))!;
    const items = s.columns.flatMap((c) => (c.vn ?? []).flatMap((b) => b.items));
    for (const sc of scenarios) for (const r of sc.regimens) {
      const it = items.find((i) => i.ref === r.id);
      assert.ok(it, `${disease}: ${sc.id}/${r.id} missing`);
      for (const d of r.drugs) for (const t of doseTokens(d.dose)) assert.ok(it!.text.replace(/\s+/g, "").includes(t), `${r.id} ${d.name}: ${t} lost`);
    }
  }
});

test("cleanRef keeps every dose and renal adjustment of BYT regimens", () => {
  for (const s of STRATIFICATIONS) for (const id of [...s.columns.flatMap((c) => c.byt), ...(s.focus ?? []).flatMap((f) => f.byt)]) {
    for (const d of ALL_REGIMENS.find((r) => r.id === id)!.drugs) {
      const out = cleanRef(d.dose).replace(/\s+/g, "");
      for (const t of doseTokens(d.dose)) assert.ok(out.includes(t), `${id} ${d.name}: ${t} lost`);
    }
  }
  assert.match(cleanRef("1,5–3 g mỗi 6 giờ (Phụ lục 1; Clcr 10–30: mỗi 8–12 giờ)"), /Clcr 10–30: mỗi 8–12 giờ/);
});
