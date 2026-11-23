import { test } from "node:test";
import assert from "node:assert/strict";
import tables from "../../data/antibiotics/antibiogram-bv199-tables.json";
import { ALL_REGIMENS, getRegimensForDisease } from "../../data/antibiotics/empiric/regimens";
import { STRATIFICATIONS } from "../../data/antibiotics/empiric/stratification";

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
