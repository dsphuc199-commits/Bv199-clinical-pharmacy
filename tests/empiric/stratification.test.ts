import { test } from "node:test";
import assert from "node:assert/strict";
import tables from "../../data/antibiotics/antibiogram-bv199-tables.json";
import { ALL_REGIMENS, getRegimensForDisease } from "../../data/antibiotics/empiric/regimens";
import { STRATIFICATIONS, cleanRef, hasIntlStratification } from "../../data/antibiotics/empiric/stratification";
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
    if (s.columns.some((c) => c.intl.length > 0)) assert.ok(s.principles.items.length > 0);
    for (const c of s.columns) for (const b of c.vn ?? []) assert.ok(b.items.length > 0, `${c.id} ${b.source}`);
  }
});

test("sepsis international principles keep the SWAB penicillin-allergy advice", () => {
  const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-11"))!;
  assert.ok(s.principles.items.some((i) => i.role === "Dị ứng penicilin" && /cephalosporin hoặc carbapenem/.test(i.text)));
  const cap = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-1"))!;
  assert.ok(cap.columns.some((c) => c.intl.some((b) => /Dị ứng beta-lactam/.test(b.source))));
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
    /* Bố cục ĐHYD: VPBV có bảng không hồi sức và hồi sức (QĐ 1493); VPLQTM chỉ ở hồi sức. */
    assert.deepEqual(s.columns.map((c) => c.setting), id === "v8-4" ? ["ward", "ward", "icu", "icu"] : ["icu", "icu"]);
    for (const c of s.columns) for (const blk of c.vn ?? []) assert.match(blk.source, /Hội Hô hấp VN/);
  }
  assert.deepEqual(cap.columns.map((c) => c.setting), ["ward", "ward", "ward", "icu"]);
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

test("module regimens marked 'chọn một thuốc' are shown as alternatives, not combinations", () => {
  const items = STRATIFICATIONS.flatMap((s) => s.columns.flatMap((c) => (c.vn ?? []).flatMap((b) => b.items)));
  for (const id of ["cap-quinolone-allergy", "ward-levo"]) {
    const it = items.find((i) => i.ref === id)!;
    assert.ok(it, `${id} missing`);
    assert.match(it.text, /Levofloxacin: .* hoặc Moxifloxacin: /u);
    assert.doesNotMatch(it.text, / \+ Moxifloxacin/u);
  }
  assert.match(items.find((i) => i.ref === "icu-ctx-levo")!.text, / \+ Levofloxacin: /u);
});

/* ===== Nhiễm khuẩn tiết niệu ===== */
import { EAU_UROLOGY_FORMS } from "../../components/antibiotics/empiric/urology-eau2026";
import { compactText, compactDose, DOSE_PAIRS } from "../../data/antibiotics/empiric/strat-compact";
const nums = (x: string) => (x.match(/[0-9]+(?:[.,][0-9]+)?/g) ?? []).sort().join(" ");

test("compact cards: shortened doses keep every number", () => {
  for (const [a, b] of DOSE_PAIRS) assert.equal(nums(b), nums(a), a);
});

test("urology: every EAU 2026 form is shown (column or special group) with every drug and dose", () => {
  for (const d of ["v8-16", "v8-17", "v8-2"]) {
    const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes(d))!;
    assert.ok(s, `${d} missing stratification`);
    const blocks = [...s.columns.flatMap((c) => c.intl), ...(s.extras ?? []).flatMap((x) => x.blocks)];
    const shown = blocks.flatMap((b) => b.items).map((i) => `${i.role}|${i.text}|${i.dose ?? ""}`);
    for (const f of EAU_UROLOGY_FORMS[d]) {
      for (const it of [...f.blocks.flatMap((b) => b.items), ...f.avoid]) assert.ok(shown.includes(`${it.role}|${compactText(it.text)}|${it.dose ? compactDose(it.dose) : ""}`), `${d} ${f.id}: ${it.text} missing`);
      for (const n of f.notes) assert.ok(shown.some((x) => x.includes(compactText(n))) || s.principles.items.some((i) => i.text === n) || s.sampling.some((c) => c.text === n), `${d} ${f.id}: note missing`);
      /* Tiêu đề nhóm thuốc (vd. "Chỉ khi tỷ lệ E. coli kháng tại chỗ < 20%") phải còn. */
      for (const b of f.blocks.filter((x) => x.items.length && x.title)) assert.ok(blocks.some((x) => x.source.includes(b.title)), `${d} ${f.id}: block "${b.title}" lost`);
    }
  }
});

test("urology: Vietnamese columns use QĐ 708 only and keep the pharmacist dose checks visible", () => {
  for (const d of ["v8-16", "v8-17", "v8-2"]) {
    const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes(d))!;
    for (const c of s.columns.filter((x) => x.byt.length)) {
      assert.equal(c.intl.length, 0, `${c.id} mixes sources`);
      for (const cr of c.criteria) assert.match(cr.source, /^QĐ 708/);
    }
  }
  /* Liều lệch nguồn được gắn qua dose-conflicts.ts (ĐỐI CHIẾU LIỀU), không sửa ghi chú gốc của phác đồ BYT. */
  const notes = (id: string) => (ALL_REGIMENS.find((r) => r.id === id)!.notes ?? []).join(" ");
  for (const id of ["r-cy-tmp", "r-cy-male-tmp"]) assert.match(notes(id), /ĐỐI CHIẾU LIỀU – Viêm bàng quang – liều trimethoprim-sulfamethoxazol/);
  assert.match(notes("r-py-iv-bl"), /875\/125 mg là hàm lượng dạng uống/);
});

test("module regimens keep one part per drug, so 'hoặc' inside a dose never splits the line", () => {
  const items = STRATIFICATIONS.flatMap((s) => s.columns.flatMap((c) => (c.vn ?? []).flatMap((b) => b.items)));
  for (const it of items) {
    assert.ok(it.parts && it.parts.length > 0, `${it.ref} has no parts`);
    assert.equal(it.text, it.parts!.join(it.join === "or" ? " hoặc " : " + "), `${it.ref} text and parts differ`);
  }
  const levo = items.find((i) => i.ref === "ward-levo")!;
  assert.equal(levo.parts!.length, 2);
  assert.match(levo.parts![0], /^Levofloxacin: 750 mg mỗi 24 giờ hoặc 500 mg mỗi 12 giờ/);
});

test("only regimens whose source says 'chọn một thuốc' are alternatives; cefotaxim + azithromycin stays a combination", () => {
  const items = STRATIFICATIONS.flatMap((s) => s.columns.flatMap((c) => (c.vn ?? []).flatMap((b) => b.items)));
  const or = Array.from(new Set(items.filter((i) => i.join === "or").map((i) => i.ref))).sort();
  assert.deepEqual(or, ["cap-quinolone-allergy", "ward-levo"]);
  assert.equal(items.find((i) => i.ref === "ward-ctax-azi")!.join, "and");
});

test("peritonitis: QĐ 708 columns stay Vietnamese-only; SIS 2024 / WSES 2021 columns carry no BYT regimen", () => {
  const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-21"))!;
  assert.deepEqual(s.columns.filter((c) => c.byt.length).map((c) => c.byt), [["r-peri-sec-1"], ["r-peri-sec-2"]]);
  const intl = s.columns.filter((c) => c.intl.length);
  assert.deepEqual(intl.map((c) => c.id), ["iai-low", "iai-high", "iai-postop"]);
  assert.ok(intl.every((c) => c.byt.length === 0 && c.intl.every((b) => /^(SIS 2024|WSES 2021) – /.test(b.source))));
  /* Liều chỉ từ WSES 2021: khối SIS không có liều. */
  assert.ok(intl.every((c) => c.intl.filter((b) => b.source.startsWith("SIS")).every((b) => b.items.every((i) => !i.dose))));
  assert.equal(hasIntlStratification("v8-21"), true);
  for (const d of ["v8-11", "v8-1", "v8-4", "v8-5", "v8-16", "v8-17", "v8-2"]) assert.equal(hasIntlStratification(d), true, d);
});

/* ===== Đường mật quốc tế: TG18, cột theo độ nặng cộng đồng + liên quan chăm sóc y tế; dữ liệu từ JSON TG18 ===== */
import tg18 from "../../data/guidelines/intl/viem-duong-mat-cap.json";
test("biliary intl: TG18 columns reuse the TG18 JSON drug lists and doses, carry no BYT regimen", () => {
  const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-24"))!;
  assert.equal(hasIntlStratification("v8-24"), true);
  const intl = s.columns.filter((c) => c.intl.length);
  assert.deepEqual(intl.map((c) => c.id), ["tg-c1", "tg-c2", "tg-c3", "tg-hc"]);
  assert.ok(intl.every((c) => c.byt.length === 0 && c.criteria.every((x) => x.source === "TG18") && c.intl.every((b) => b.source.startsWith("TG18 – "))));
  const rules = (tg18 as unknown as { rules: { id: string; blocks?: { items: { role: string; dose?: string }[] }[] }[] }).rules;
  /* Liều TG18 viết gọn ("truyền tĩnh mạch" → "TM"): so tên thuốc và số liệu liều. */
  const key = (i: { role: string; dose?: string }) => i.role + "|" + nums(i.dose ?? "");
  for (const [col, ruleId] of [["tg-c1", "community-i"], ["tg-c2", "community-ii"], ["tg-c3", "community-iii"], ["tg-hc", "healthcare"]]) {
    const want = rules.find((r) => r.id === ruleId)!.blocks!.flatMap((b) => b.items.map(key));
    const got = intl.find((c) => c.id === col)!.intl.flatMap((b) => b.items.map(key));
    assert.deepEqual(got, want, col);
  }
  /* Độ III cộng đồng và liên quan chăm sóc y tế có vancomycin; Độ I–II không. */
  const has = (id: string, drug: string) => intl.find((c) => c.id === id)!.intl.some((b) => b.items.some((i) => i.role === drug));
  assert.ok(has("tg-c3", "Vancomycin") && has("tg-hc", "Vancomycin") && !has("tg-c1", "Vancomycin") && !has("tg-c2", "Vancomycin"));
  assert.ok(s.principles.items.some((i) => i.role.startsWith("Thời gian") && /4–7 ngày/.test(i.text)));
  assert.ok((s.extras ?? []).some((x) => /miệng nối/.test(x.title)) && (s.extras ?? []).some((x) => /VRE/.test(x.title)));
});

/* ===== Đường mật: liều HĐT&ĐT đã công bố phải áp vào khung phân tầng ===== */
import { structureOf } from "../../lib/antibiotics/regimen-structure";
import { resolvedDrugs } from "../../data/antibiotics/empiric/dose-references";
import { BILIARY_BASE_CONTENT, BILIARY_EDIT_GROUPS, biliaryPublishedGroups } from "../../lib/antibiotics/biliary-protocol";

test("biliary: panel drug names match the admin dose keys, so published doses replace every source dose", () => {
  const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-24"))!;
  const ids = Array.from(new Set(s.columns.flatMap((c) => c.byt)));
  assert.deepEqual([...ids].sort(), BILIARY_EDIT_GROUPS.map((g) => g.id).sort());
  const doses: Record<string, string> = {};
  for (const g of BILIARY_EDIT_GROUPS) for (const row of g.rows) doses[row.id] = `DUYỆT ${row.drug}`;
  for (const id of ids) {
    const r = ALL_REGIMENS.find((x) => x.id === id)!;
    const drugs = resolvedDrugs(r).map((d) => ({ ...d, dose: cleanRef(d.dose) }));
    const groups = biliaryPublishedGroups(r.id, structureOf({ ...r, id: `${r.id}#panel`, drugs }).groups, { ...BILIARY_BASE_CONTENT, doses });
    for (const o of groups.flatMap((g) => g.options)) assert.equal(o.raw, `DUYỆT ${o.name}`, `${id} ${o.name}: published dose not applied`);
  }
  assert.ok(s.columns[1].note && /carbapenem không phối hợp/.test(s.columns[1].note));
});

/* ===== Da – mô mềm: cột Việt Nam đủ phác đồ gốc; cột quốc tế lấy từ sstiPlan, không lặp khối khuyến cáo chung ===== */
test("SSTI: every BYT regimen of v8-27/v8-28 appears exactly once; intl columns come from IDSA 2014 / ACE 2026 only", () => {
  for (const [d, intlIds] of [["v8-27", ["cel-mild", "cel-mod", "cel-severe"]], ["v8-28", ["pur-mild", "pur-mod", "pur-severe"]]] as const) {
    const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes(d))!;
    const ids = s.columns.flatMap((c) => c.byt);
    /* So với phác đồ còn hiệu lực ở tab Việt Nam (QĐ 708 Nhọt đã được QĐ 4416 thay thế). */
    assert.deepEqual([...ids].sort(), getRegimensForDisease(d).map((r) => r.id).sort(), d);
    assert.equal(new Set(ids).size, ids.length);
    const intl = s.columns.filter((c) => c.intl.length);
    assert.deepEqual(intl.map((c) => c.id), [...intlIds]);
    for (const c of intl) {
      assert.ok(c.byt.length === 0 && c.intl.every((b) => /^(IDSA 2014|ACE 2026) – /.test(b.source)), c.id);
      assert.ok(c.intl.every((b) => b.source !== "IDSA 2014 – khuyến cáo"), `${c.id}: general IDSA block repeated`);
    }
    assert.ok(s.principles.items.length > 5);
  }
  /* Dị ứng penicilin có trong cột viêm mô tế bào nhẹ (clindamycin uống theo ACE). */
  const mild = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-27"))!.columns.find((c) => c.id === "cel-mild")!;
  assert.ok(mild.intl.flatMap((b) => b.items).some((i) => /Dị ứng penicilin/.test(i.role) && /Clindamycin/.test(i.text)));
});

/* ===== Thần kinh trung ương: cột Việt Nam đủ phác đồ QĐ 708 + QĐ 5642; WHO đúng liều đã trích; IDSA 2017 không ghi liều ===== */
import { getIntlEntry } from "../../data/antibiotics/empiric/international";
import { WHO_DOSE } from "../../components/antibiotics/empiric/cns-intl";
test("CNS: every BYT regimen of v8-36/v8-38 appears exactly once; WHO doses come from the extracted WHO data; IDSA 2017 carries no dose", () => {
  for (const d of ["v8-36", "v8-38"]) {
    const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes(d))!;
    const ids = s.columns.flatMap((c) => c.byt);
    assert.deepEqual([...ids].sort(), getRegimensForDisease(d).map((r) => r.id).sort(), d);
    assert.equal(hasIntlStratification(d), true, d);
  }
  const who = JSON.stringify(getIntlEntry("v8-36")!.regimens);
  for (const [k, v] of Object.entries(WHO_DOSE)) {
    if (k.endsWith("Max")) continue;
    assert.ok(who.includes(v), `${k}: ${v}`);
  }
  const vent = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-38"))!;
  assert.ok(vent.columns.filter((c) => c.intl.length).every((c) => c.intl.every((b) => b.source.startsWith("IDSA 2017") && b.items.every((i) => !i.dose))));
  const men = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-36"))!;
  assert.ok(men.columns.find((c) => c.id === "cns-trauma")!.links!.some((l) => l.diseaseId === "v8-38"));
});

/* ===== Viêm nội tâm mạc: cột Việt Nam đủ phác đồ QĐ 708; ESC 2023 đúng liều đã trích ===== */
import { ESC_DOSE } from "../../components/antibiotics/empiric/ie-intl";
test("endocarditis: every BYT regimen of v8-39 appears exactly once; ESC 2023 doses come from the extracted ESC data", () => {
  const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-39"))!;
  assert.deepEqual(s.columns.flatMap((c) => c.byt).sort(), getRegimensForDisease("v8-39").map((r) => r.id).sort());
  assert.equal(hasIntlStratification("v8-39"), true);
  const esc = JSON.stringify(getIntlEntry("v8-39")!.regimens);
  for (const [k, v] of Object.entries(ESC_DOSE)) assert.ok(esc.includes(v), `${k}: ${v}`);
  const intl = s.columns.filter((c) => c.intl.length);
  assert.ok(intl.every((c) => c.byt.length === 0 && c.intl.every((b) => b.source.startsWith("ESC 2023") && b.items.every((i) => i.dose && /^ESC:/.test(i.grade ?? "")))));
});

/* ===== Tai mũi họng: cột Việt Nam đủ phác đồ; cột quốc tế lấy đúng dòng liều của luật module ENT ===== */
import { getDisease } from "../../data/ent";
test("ENT: every BYT regimen appears exactly once; intl rows are the ENT rule doses (no reference sources); deep neck intl = SFORL 2024", () => {
  for (const d of ["v8-7", "v8-58", "v8-8", "v8-54", "v8-60", "v8-99", "v8-56", "v8-57", "v8-66"]) {
    const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes(d))!;
    assert.ok(s, d);
    assert.deepEqual(s.columns.flatMap((c) => c.byt).sort(), getRegimensForDisease(d).map((r) => r.id).sort(), d);
    assert.equal(hasIntlStratification(d), true, d);
  }
  const gas = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-8"))!;
  const rule = getDisease("gas-pharyngitis")!.rules.find((r) => r.id === "gas-r-positive")!;
  const doses = getDisease("gas-pharyngitis")!.doses.filter((x) => rule.doseIds!.includes(x.id) && x.role === "primary" && x.population !== "child");
  const adult = gas.columns.find((c) => c.id === "g-adult")!.intl.flatMap((b) => b.items);
  assert.equal(adult.length, doses.length);
  for (const x of doses) assert.ok(adult.some((i) => i.dose?.startsWith(x.dose)), x.id);
  const all = STRATIFICATIONS.filter((x) => x.diseaseIds.some((d) => d.startsWith("v8-") && ["v8-7", "v8-58", "v8-8", "v8-60", "v8-99"].includes(d)));
  assert.ok(all.every((x) => x.columns.every((c) => c.intl.every((b) => !/UCSF|tham khảo/u.test(b.source)))));
  const neck = STRATIFICATIONS.find((x) => x.diseaseIds.includes("v8-56"))!;
  assert.deepEqual(neck.columns.filter((c) => c.intl.length).map((c) => c.id), ["sf-abscess", "sf-cellulitis", "sf-child"]);
  assert.ok(neck.columns.every((c) => c.intl.every((b) => b.source.startsWith("SFORL 2024") && b.items.every((i) => i.ref === "SFORL 2024"))));
});

/* ===== Viêm phổi bệnh viện / thở máy: điều trị đích theo tác nhân (IDSA/ATS 2016, IDSA 2026) ===== */
import { PATHOGENS } from "../../components/antibiotics/empiric/pneumonia-intl";
test("HAP/VAP: every PATHOGENS drug and dose (IDSA/ATS 2016, IDSA 2026) appears in the targeted-therapy sections", () => {
  for (const d of ["v8-4", "v8-5"]) {
    const s = STRATIFICATIONS.find((x) => x.diseaseIds.includes(d))!;
    const blocks = (s.extras ?? []).filter((e) => e.title.startsWith("Điều trị đích")).flatMap((e) => e.blocks);
    assert.equal(blocks.length, PATHOGENS.length, d);
    const shown = blocks.flatMap((b) => b.items);
    for (const pt of PATHOGENS) for (const it of pt.items)
      assert.ok(shown.some((i) => i.role === it.role && i.text === compactText(it.text) && nums(i.dose ?? "") === nums(it.dose ?? "")), `${d} ${pt.id}: ${it.text} missing`);
  }
});
