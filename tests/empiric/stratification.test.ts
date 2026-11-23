import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { load } from "cheerio";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createSourceFile, isImportDeclaration, isStringLiteral, ScriptKind, ScriptTarget } from "typescript";
import { CAP_SCENARIOS } from "../../components/antibiotics/CapByt2026";
import { HAPVAP_SCENARIOS } from "../../components/antibiotics/HapVap2023";
import { DiseaseMonitoring, DiseaseOverviewSummary } from "../../components/antibiotics/empiric/DiseaseOverview";
import PneumoniaIntl from "../../components/antibiotics/empiric/PneumoniaIntl";
import StratificationPanel from "../../components/antibiotics/empiric/StratificationPanel";
import { PATHOGENS, hvPlan, type HvIn } from "../../components/antibiotics/empiric/pneumonia-intl";
import tables from "../../data/antibiotics/antibiogram-bv199-tables.json";
import { ALL_REGIMENS, getRegimensForDisease } from "../../data/antibiotics/empiric/regimens";
import { safetyAlertsFor } from "../../data/antibiotics/empiric/safety-alerts";
import { STRATIFICATIONS, cleanRef, stratificationFor } from "../../data/antibiotics/empiric/stratification";
import { SPECIALIZED_MODULE_LINKS } from "../../lib/antibiotics/empiric-ui-rules";

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

const waveOneIds = ["v8-11", "v8-12", "v8-1", "v8-4", "v8-5"] as const;
type SourceDrug = { name: string; dose: string; caution?: string };
type SourceRegimen = { id: string; drugs: readonly SourceDrug[]; indication?: string; caution?: string; notes?: readonly string[] };
type SourceScenario = { id: string; regimens: readonly SourceRegimen[] };
const moduleScenarios: Partial<Record<typeof waveOneIds[number], readonly SourceScenario[]>> = {
  "v8-1": CAP_SCENARIOS,
  "v8-4": HAPVAP_SCENARIOS.hap,
  "v8-5": HAPVAP_SCENARIOS.vap,
};

function doseTokens(text: string): string[] {
  const amounts = /(?<![\p{L}\d])\d+(?:[.,]\d+)?(?:\s*[–/-]\s*\d+(?:[.,]\d+)?)*\s*(?:mg\/kg|mg|g)(?!\p{L})/giu;
  return [...text.matchAll(amounts)].map(([value]) => value.replace(/\s+/gu, "").toLowerCase());
}

function checkedData(diseaseId: string) {
  const data = stratificationFor(diseaseId);
  assert.ok(data, 'Thiếu khung phân tầng ' + diseaseId);
  return data;
}

for (const diseaseId of waveOneIds) {
  test(diseaseId + " giữ mọi phác đồ BYT và phác đồ module Việt Nam", () => {
    const data = checkedData(diseaseId);
    const active = getRegimensForDisease(diseaseId);
    const byt = [...data.columns.flatMap((column) => column.byt), ...(data.focus ?? []).flatMap((group) => group.byt)];
    assert.deepEqual([...byt].sort(), active.map(({ id }) => id).sort());

    const scenarios = moduleScenarios[diseaseId] ?? [];
    assert.deepEqual(
      data.columns.flatMap((column) => column.vnScenarioIds ?? []).sort(),
      scenarios.map(({ id }) => id).sort(),
    );
    const moduleRows = data.columns.flatMap((column) => column.vn ?? []).flatMap((block) => block.items);
    assert.deepEqual(moduleRows.map(({ ref }) => ref).sort(), scenarios.flatMap(({ regimens }) => regimens.map(({ id }) => id)).sort());

    for (const { id, drugs } of active) {
      for (const drug of drugs) {
        const cleaned = cleanRef(drug.dose);
        assert.deepEqual(doseTokens(cleaned), doseTokens(drug.dose), id + " · " + drug.name);
        if (drug.dose.includes("nghi sai, không dùng")) assert.match(cleaned, /nghi sai, không dùng/u);
      }
    }
    for (const scenario of scenarios) {
      const column = data.columns.find((entry) => entry.vnScenarioIds?.includes(scenario.id));
      assert.ok(column, scenario.id);
      const rows = new Map((column.vn ?? []).flatMap((block) => block.items).map((row) => [row.ref, row]));
      for (const { id, drugs, indication, caution, notes } of scenario.regimens) {
        const row = rows.get(id);
        assert.ok(row, id);
        for (const drug of drugs) {
          assert.deepEqual(doseTokens(cleanRef(drug.dose)), doseTokens(drug.dose), id + " · " + drug.name);
        }
        assert.deepEqual(doseTokens(row.text), drugs.flatMap((drug) => doseTokens(drug.dose)), id);
        const originalNotes = [indication, caution, ...(notes ?? []), ...drugs.map((drug) => drug.caution)];
        const cleanedNotes = originalNotes.flatMap((note) => {
          if (!note) return [];
          const cleaned = cleanRef(note);
          assert.deepEqual(doseTokens(cleaned), doseTokens(note), id + " · Chú thích");
          return [cleaned];
        });
        assert.deepEqual(doseTokens(row.preparation ?? ""), [...new Set(cleanedNotes)].flatMap(doseTokens), id + " · Chú thích bảng");
      }
    }
  });
}

test("khung gọn không import các component phác đồ cũ", () => {
  const pathname = new URL("../../components/antibiotics/empiric/StratificationPanel.tsx", import.meta.url);
  const content = readFileSync(pathname, "utf8");
  const source = createSourceFile(pathname.pathname, content, ScriptTarget.Latest, true, ScriptKind.TSX);
  for (const node of source.statements) {
    if (!isImportDeclaration(node) || !isStringLiteral(node.moduleSpecifier)) continue;
    const name = node.moduleSpecifier.text.split("/").at(-1);
    assert.ok(name !== "BytRegimenView" && name !== "TreatmentPanel", node.getText(source));
    if (name === "CapByt2026" || name === "HapVap2023") {
      assert.ok(!node.importClause?.name, node.getText(source));
    }
  }
});

function viewOf(diseaseId: string, scenario?: string) {
  const markup = renderToStaticMarkup(createElement(StratificationPanel, {
    data: checkedData(diseaseId),
    family: "vn",
    overview: createElement(DiseaseOverviewSummary, { diseaseId }),
    monitoring: createElement(DiseaseMonitoring, { diseaseId }),
    scenario,
  }));
  const $ = load(markup);
  $("script, style").remove();
  return $;
}

const forbiddenVn = /không nêu|cần xác minh|theo nguồn|nguyên văn|văn bản|\btrang\b|\btr\.\s*\d|\b(?:Bảng|Table)\s+(?:\d|[IVX]+\.\d)|Phụ lục|DTQG|CHƯA XÁC MINH|\b(?:SWAB|IDSA|SSC|ESC|EAU)\b/giu;

for (const diseaseId of waveOneIds) {
  test(diseaseId + " hiển thị một khung Việt Nam dạng lưới và giữ cảnh báo an toàn", () => {
    const $ = viewOf(diseaseId);
    const frame = $("body > details[data-stratification='vn']");
    assert.equal(frame.length, 1);
    assert.equal(frame.find(".do-cards").length, 1);
    assert.equal(frame.find(".do-cards .do-card").length, 4);
    assert.equal(frame.find(".do-monitor").length, 1);
    assert.equal(frame.find(".clinical-scenario-picker").length, 0);
    assert.equal(frame.find("[role='tab']").filter((_, node) => /^(?:Ngoại trú|Nội trú)$/iu.test($(node).text().trim())).length, 0);
    const columns = frame.find("[data-strat-column]");
    assert.equal(columns.length, checkedData(diseaseId).columns.length);
    assert.ok(columns.first().parent().hasClass("lg:grid-cols-2"));
    assert.equal(columns.first().parent().hasClass("2xl:grid-cols-3"), columns.length === 3);
    const references = frame.find("[data-strat-references]");
    assert.equal(references.length, 1);
    assert.equal(references.find("h3").text(), "Tài liệu tham khảo");
    assert.equal(references.prev().hasClass("do-monitor"), true);
    assert.equal(references.next().length, 0);
    const vietnameseSources = checkedData(diseaseId).sources.filter((source) => /^(Bộ Y tế|Hội)/u.test(source));
    assert.deepEqual(references.find("li").map((_, node) => $(node).text()).get(), vietnameseSources);

    const overview = load(renderToStaticMarkup(createElement(DiseaseOverviewSummary, { diseaseId })));
    overview("script, style").remove();
    assert.equal(frame.find(".do-cards").text(), overview(".do-cards").text());
    assert.equal(frame.find(".do-control").text(), overview(".do-control").text());
    // Dòng tham chiếu này nằm trong tổng quan dùng chung từ bản nền, giữ nguyên theo yêu cầu.
    const overviewCards = frame.find(".do-cards").clone();
    overviewCards.find("li").filter((_, node) => $(node).text().trim() === "Đã biết vi khuẩn: theo Bảng II.10.").remove();
    const content = frame.clone();
    content.find(".do-cards").replaceWith(overviewCards);
    const text = content.text().replace(/\s+/gu, " ").trim();
    assert.match(text, /Kháng sinh gợi ý/iu);
    assert.match(text, /Thời gian/iu);
    assert.match(text, /Theo dõi, đánh giá lại và an toàn/iu);
    assert.equal(text.includes("Chọn nhóm người bệnh"), false);
    const numberedHeadings = frame.find("h1, h2, h3, h4, h5, h6, summary, .tp-regimen-title")
      .filter((_, node) => /^Phác đồ\s+\d+\b/iu.test($(node).text().trim()));
    assert.equal(numberedHeadings.length, 0);
    const samples = Array.from(text.matchAll(forbiddenVn), (m) => text.slice(Math.max(0, m.index - 20), m.index + m[0].length + 20));
    assert.deepEqual([...new Set(samples)], [], "Khung Việt Nam còn cụm cấm hoặc lẫn nguồn");

    for (const { id } of getRegimensForDisease(diseaseId)) {
      const regimen = frame.find('[data-regimen="' + id + '"]');
      assert.equal(regimen.length, 1, id);
      assert.equal(regimen.find('a[href="' + SPECIALIZED_MODULE_LINKS.doseAdjustment.href + '"]').length, 1, id);
      if (id === "r-sepsis-c-device") {
        assert.match(regimen.text(), /600\s*mg\s*mỗi\s*12\s*giờ/iu);
        assert.match(regimen.text(), /600\s*mg\s*x\s*1\s*lần\/ngày[^;.]*nghi sai,\s*không dùng/iu);
      }
      const warnings = safetyAlertsFor(id);
      for (const { title } of warnings) assert.ok(regimen.find(".strat-safety").text().includes(title), id + " · " + title);
      if (warnings.some(({ autoRecommend }) => autoRecommend === "block")) assert.match(regimen.text(), /Khóa đề xuất tự động/u);
      if (warnings.some(({ blockFor }) => blockFor?.includes("child"))) assert.match(regimen.text(), /Liều người lớn/u);
    }
  });
}

test("liên kết scenario đánh dấu duy nhất tầng hoặc nhóm ổ nhiễm khuẩn", () => {
  const columns = [
    ["v8-11", "r-sepsis-b-mdr", "hospital"],
    ["v8-1", "icu", "icu"],
    ["v8-4", "hap-mrsa", "mdr"],
    ["v8-5", "vap-low", "low"],
  ];
  for (const [diseaseId, scenario, columnId] of columns) {
    const $ = viewOf(diseaseId, scenario);
    const target = $('[data-selected-scenario="true"]');
    assert.equal(target.length, 1, scenario);
    assert.equal(target.attr("data-strat-column"), columnId);
    assert.ok(target.hasClass("ring-2") && target.hasClass("ring-teal-700"), scenario);
  }
  const $ = viewOf("v8-12", "r-sepsis-c-biliary");
  const focus = $('[data-selected-scenario="true"]');
  assert.equal(focus.length, 1);
  const regimen = '[data-regimen="r-sepsis-c-biliary"]';
  assert.equal(focus.filter(regimen).add(focus.find(regimen)).length, 1);
  assert.ok(focus.closest("details").is("[open]"));
});

test("mỗi mặt bệnh HAP/VAP giữ đủ bốn tổ hợp từ công cụ Quốc tế", () => {
  for (const [diseaseId, kind] of [["v8-4", "hap"], ["v8-5", "vap"]] as const) {
    const base: HvIn = {
      kind, ivAbx: false, shock: false, ards: false, hosp5: false, rrt: false, mrsaUnit: false,
      mrsaColon: false, gnUnit: false, structural: false, gram: false,
    };
    const variants = [{}, { mrsaUnit: true }, { structural: true }, { ivAbx: true }];
    const blocks = checkedData(diseaseId).columns.flatMap(({ intl }) => intl);
    assert.equal(blocks.length, variants.length, diseaseId);
    variants.forEach((variant, index) => {
      const source = hvPlan({ ...base, ...variant });
      const actual = blocks[index];
      assert.ok(actual.lead?.startsWith(source.headline), actual.source);
      assert.deepEqual(actual.items, source.plan.blocks.flatMap(({ title, items }) =>
        items.map((item) => ({ ...item, group: title || undefined })),
      ));
    });
  }
});

test("HAP/VAP bỏ bộ chọn kinh nghiệm lặp và giữ điều trị đích, theo dõi, tài liệu", () => {
  for (const kind of ["hap", "vap"] as const) {
    const $ = load(renderToStaticMarkup(createElement(PneumoniaIntl, { kind })));
    $("script, style").remove();
    assert.equal($(".sa24-flow, .sa24-eyebrow, input[type='checkbox']").length, 0, kind);
    assert.doesNotMatch($("body").text(), /Kinh nghiệm – chưa có kết quả cấy/u);
    const directed = $(".sa24 > details").first();
    assert.equal(directed.children("summary").text(), "Điều trị đích khi đã có tác nhân");
    assert.equal(directed.attr("open"), undefined);
    assert.deepEqual(directed.find("select option").map((_, node) => $(node).attr("value")).get(), PATHOGENS.map(({ id }) => id));
    assert.equal(directed.find("[role='group'][aria-label='Dị ứng beta-lactam']").length, 1);
    const course = $(".sa24 > details").eq(1);
    assert.equal(course.children("summary").text(), "Liều, xuống thang, thời gian điều trị");
    assert.equal($(".sa24-src").prev().children("summary").text(), "Xét nghiệm vi sinh và chỉ điểm sinh học");
    assert.equal($(".sa24-src a[href^='https']").length, 2);
  }
});
