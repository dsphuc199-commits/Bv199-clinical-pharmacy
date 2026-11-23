import { test } from "node:test";
import assert from "node:assert/strict";
import tables from "../../data/antibiotics/antibiogram-bv199-tables.json";
import { ALL_REGIMENS, getRegimensForDisease } from "../../data/antibiotics/empiric/regimens";
import { STRATIFICATIONS, cleanRef, stratificationFor } from "../../data/antibiotics/empiric/stratification";
import { load } from "cheerio";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import IntegratedVnStratification from "../../components/antibiotics/empiric/IntegratedVnStratification";
import { overviewPointText } from "../../components/antibiotics/empiric/DiseaseOverview";
import { CAP_SCENARIOS } from "../../components/antibiotics/CapByt2026";
import { HAPVAP_SCENARIOS } from "../../components/antibiotics/HapVap2023";
import { safetyAlertsFor } from "../../data/antibiotics/empiric/safety-alerts";
import { getDiseaseOverview } from "../../data/antibiotics/empiric/overviews";

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

const doseTokens = (text: string): string[] =>
  (text.match(/\d+(?:[.,]\d+)?\s*(?:mg\/kg|mg|g)\b/giu) ?? []).map((item) => item.replace(/\s+/g, "").toLowerCase());
const waveOne = ["v8-11", "v8-12", "v8-1", "v8-4", "v8-5"] as const;
const forbidden = /không nêu|cần xác minh|theo nguồn|nguyên văn|văn bản|\btrang\b|\btr\.\s*\d|\b(?:Bảng|Table)\s+(?:\d|[IVX]+\.\d)|Phụ lục|DTQG|CHƯA XÁC MINH|SWAB|IDSA|SSC\s+2026|ESC\s+20\d\d|EAU\s+20\d\d/iu;
const doseSources = { "v8-1": CAP_SCENARIOS, "v8-4": HAPVAP_SCENARIOS.hap, "v8-5": HAPVAP_SCENARIOS.vap };
const normalized = (text: string) => text.replace(/\s+/gu, " ").trim();

for (const diseaseId of waveOne) {
  test(diseaseId + " giữ phác đồ, liều và điểm tổng quan trong một khung Việt Nam", () => {
    const data = stratificationFor(diseaseId);
    assert.ok(data, diseaseId);
    const overview = getDiseaseOverview(diseaseId);
    assert.ok(overview, diseaseId);
    const moduleScenarios = diseaseId in doseSources ? doseSources[diseaseId as keyof typeof doseSources] : [];
    const moduleRegimens = moduleScenarios.flatMap((scenario) => scenario.regimens);
    const regimens = [...getRegimensForDisease(diseaseId), ...moduleRegimens];
    const view = load(renderToStaticMarkup(createElement(IntegratedVnStratification, { data, diseaseId })));
    const frame = view("body > details[data-stratification='vn']");
    const visible = frame.clone();
    visible.find("style, script").remove();
    const display = normalized(visible.text());

    assert.equal(frame.length, 1);
    assert.equal(frame.find(".do-cards").length, 1);
    assert.equal(frame.find(".do-monitor").length, 1);
    assert.equal(frame.find(".clinical-scenario-picker").length, 0);
    assert.match(display, /Kháng sinh gợi ý/);
    assert.match(display, /Thời gian/);
    const found = [...display.matchAll(new RegExp(forbidden.source, "giu"))];
    const samples = [...new Set(found.map((match) => display.slice(Math.max(0, match.index - 23), match.index + match[0].length + 23)))];
    assert.deepEqual(samples, [], "Chữ hiển thị còn chú thích hoặc nguồn khác");
    assert.ok(frame.find("a[href='/antibiotics/dosing']").length > 0);
    assert.ok(frame.find("a[href='/tuong-tac-thuoc']").length > 0);
    const netilmicin = frame.find("tr.tx-row").filter((_, row) => /Neltimicin|Netilmicin/iu.test(view(row).find(".tx-drug").text()));
    assert.doesNotMatch(netilmicin.find("[data-route]").text(), /Uống/u);

    for (const regimen of regimens) {
      const card = frame.find(`[data-regimen="${regimen.id}"]`);
      assert.equal(card.length, 1, regimen.id);
      const alerts = safetyAlertsFor(regimen.id);
      assert.equal(card.find(".tp-alert").length, alerts.length, regimen.id + " cảnh báo");
      if (alerts.some((alert) => alert.autoRecommend === "block")) assert.match(card.text(), /Khóa đề xuất tự động/);
      if (alerts.some((alert) => alert.blockFor?.includes("child"))) assert.match(card.text(), /Liều người lớn|Khóa đề xuất tự động/);
      const renderedDoses = doseTokens(card.text());
      for (const drug of regimen.drugs) {
        const original = doseTokens(drug.dose);
        assert.deepEqual(doseTokens(cleanRef(drug.dose)), original, regimen.id + " " + drug.name);
        for (const dose of original) assert.ok(renderedDoses.includes(dose), regimen.id + " " + drug.name + " " + dose);
      }
    }
    const points = [
      ...overview.cards.flatMap((card) => card.points),
      ...overview.sourceControl,
      ...(overview.prevention ?? []),
      ...Object.values(overview.monitoring).flat(),
    ];
    for (const point of points) {
      const expected = normalized(overviewPointText(point.text));
      assert.ok(display.includes(expected), expected);
    }
  });
}

test("chú thích tra cứu không làm mất liều khi chung ngoặc hoặc chung câu", () => {
  for (const value of [
    "1 g mỗi 8 giờ (Phụ lục 1; tối đa 2 g mỗi 8 giờ)",
    "875/125 mg mỗi 8–12 giờ (Bảng 4.4); Phụ lục 1: 875 mg mỗi 12 giờ",
    "1 g mỗi 8 giờ (QĐ 708, Bảng II.11, 2 g nếu có chỉ định)",
  ]) {
    assert.deepEqual(doseTokens(cleanRef(value)), doseTokens(value), value);
  }
  assert.match(cleanRef("1 g mỗi 8 giờ (QĐ 708; chỉ dùng khi có chỉ định)"), /chỉ dùng khi có chỉ định/u);
});
