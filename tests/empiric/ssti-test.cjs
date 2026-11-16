// Cong cu Nhiem khuan da – mo mem (IDSA 2014 + dinh chinh 2015, ACE Singapore 2026 + Supplement 2).
// Dap an doi chieu tung bang trong van ban goc.
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const M = load("components/antibiotics/empiric/ssti-idsa2014-ace2026.ts");
let pass = 0, fail = 0;
function check(n, ok) { if (ok) pass++; else fail++; console.log(`${ok ? "PASS" : "FAIL"} ${n}`); }
const base = { form: "cellulitis", age: "adult", sev: "mild", aceSevere: false, highRisk: false, pcnAllergy: false, impSub: "impetigo", mrsa: false, culture: "none", recurrent: false, site: "clean", pathogen: "empiric", bite: "animal", infected: true, immuno: false };
const plan = (x) => M.sstiPlan({ ...base, ...x });
const items = (o) => (o.blocks ? o.blocks.flatMap((b) => b.items) : o.items);
const find = (o, drug) => items(o).find((x) => x.text.startsWith(drug));
const blk = (o, t) => o.blocks.find((b) => b.title.startsWith(t));
const combo = (o) => items(o).find((x) => x.role === "Phối hợp");

// ACE Supplement 2
let o = plan({});
check("ACE: viêm mô tế bào nhẹ người lớn – cefalexin 500 mg uống 4 lần/ngày", find(blk(o, "Theo ACE 2026: kháng sinh uống"), "Cefalexin").dose.startsWith("500 mg uống 4 lần/ngày"));
check("ACE: clindamycin chỉ hiện khi dị ứng penicilin", !blk(o, "Theo ACE 2026").items.some((x) => x.text === "Clindamycin"));
o = plan({ pcnAllergy: true });
check("ACE: dị ứng penicilin – chỉ còn clindamycin 450–600 mg uống 3 lần/ngày", blk(o, "Theo ACE 2026").items.length === 1 && blk(o, "Theo ACE 2026").items[0].dose === "450–600 mg uống 3 lần/ngày (viên nang)");
o = plan({ sev: "severe", age: "child" });
const iv = blk(o, "Theo ACE 2026: kháng sinh tĩnh mạch").items;
check("ACE: cefazolin, ceftriaxon, amoxicilin-acid clavulanic tĩnh mạch đều là đơn trị đầu tay", iv.filter((x) => x.role === "Đơn trị – đầu tay").length === 3);
check("ACE: ceftriaxon trẻ em 50–80 mg/kg tĩnh mạch 1 lần/ngày, tối đa 2000 mg/ngày", iv.find((x) => x.text === "Ceftriaxon").dose.includes("50–80 mg/kg tĩnh mạch 1 lần/ngày (tối đa 2000 mg/ngày)"));
check("ACE: nhẹ nhưng nguy cơ biến chứng cao – xử trí như nặng (tĩnh mạch)", !!blk(plan({ highRisk: true }), "Theo ACE 2026: kháng sinh tĩnh mạch"));
o = plan({ form: "impetigo", age: "child" });
check("ACE: chốc khu trú – thuốc bôi; mupirocin chưa được nghiên cứu ở trẻ < 1 tuổi", find(blk(o, "Theo ACE 2026: kháng sinh bôi"), "Mupirocin").dose.includes("trẻ < 1 tuổi"));
check("ACE: chốc loét luôn dùng kháng sinh uống", !!blk(plan({ form: "impetigo", impSub: "ecthyma" }), "Theo ACE 2026: kháng sinh uống"));
check("Viêm nang lông: không có khối IDSA", !plan({ form: "impetigo", impSub: "folliculitis" }).blocks.some((b) => b.title.startsWith("Theo IDSA")));
o = plan({ form: "purulent" });
check("ACE: nhọt, áp xe nhẹ – không dùng kháng sinh", items(o).some((x) => x.text.startsWith("Không dùng kháng sinh")) && !blk(o, "Theo ACE 2026: kháng sinh uống"));
check("ACE: không khuyến cáo kháng sinh bôi cho nhọt, áp xe", o.avoid.some((x) => x.text.startsWith("Kháng sinh bôi")));

// IDSA 2014 + dinh chinh 2015
o = plan({ form: "impetigo" });
check("Đính chính 2015: mupirocin bôi 3 lần/ngày", find(blk(o, "Theo IDSA 2014: phác đồ và liều"), "Mupirocin").dose === "Bôi lên tổn thương 3 lần/ngày");
check("Đính chính 2015: SIRS bạch cầu < 4000/µL", M.SIRS_IDSA.includes("< 4000/µL") && !M.SIRS_IDSA.includes("< 400/"));
check("Đính chính 2015: Vibrio – ceftriaxon 1 g tĩnh mạch 1 lần/ngày", combo(plan({ form: "nec", pathogen: "vibrio" })).dose.includes("ceftriaxon 1 g tĩnh mạch 1 lần/ngày"));
check("Đính chính 2015: Aeromonas – ciprofloxacin 400 mg tĩnh mạch mỗi 12 giờ", combo(plan({ form: "nec", pathogen: "aero" })).dose.includes("ciprofloxacin 400 mg tĩnh mạch mỗi 12 giờ"));
check("Trả lời tác giả 2015: ciprofloxacin uống 500–750 mg mỗi 12 giờ", find(plan({ form: "ssi", site: "gi" }), "Ciprofloxacin + metronidazol").dose.includes("500–750 mg uống mỗi 12 giờ"));
check("Clostridium trẻ em: phối hợp clindamycin + penicilin G 60 000–100 000 đơn vị/kg/lần", combo(plan({ form: "nec", pathogen: "clos", age: "child" })).dose.includes("penicilin G 60 000–100 000 đơn vị/kg/lần tĩnh mạch mỗi 6 giờ"));
o = plan({ form: "purulent", sev: "severe", age: "child" });
check("Trẻ em: không hiện daptomycin", !items(o).some((x) => x.text === "Daptomycin"));
check("Vancomycin trẻ em 40 mg/kg/ngày tĩnh mạch, chia 4 lần", find(o, "Vancomycin").dose === "40 mg/kg/ngày tĩnh mạch, chia 4 lần");
o = plan({ sev: "severe" });
check("Viêm mô tế bào nặng: phối hợp vancomycin + piperacilin-tazobactam đủ liều hai thuốc", find(o, "Vancomycin + piperacilin-tazobactam").dose === "Vancomycin 30 mg/kg/ngày tĩnh mạch, chia 2 lần + piperacilin-tazobactam 3,37 g tĩnh mạch mỗi 6–8 giờ");
check("Corticoid chỉ ở người lớn", !items(plan({ age: "child" })).some((x) => x.role === "Corticoid") && items(plan({})).some((x) => x.role === "Corticoid" && x.grade === "W-M"));
check("Vết cắn trẻ em: không hiện liều người lớn", items(plan({ form: "bite", age: "child" })).every((x) => !x.dose));
o = plan({ form: "nec", pcnAllergy: true });
check("Dị ứng penicilin nặng: ẩn phác đồ beta-lactam, hiện phác đồ thay thế", !find(o, "Vancomycin + piperacilin") && items(o).some((x) => x.role.startsWith("Dị ứng penicilin nặng")));

// Quan tri du lieu va van phong
const src = fs.readFileSync(path.join(__dirname, "../../components/antibiotics/empiric/ssti-idsa2014-ace2026.ts"), "utf8");
check("Không còn chữ “CẦN XÁC MINH”", !src.includes("CẦN XÁC MINH"));
const all = ["impetigo", "purulent", "cellulitis", "ssi", "nec", "pyo", "bite"].flatMap((form) => ["adult", "child"].flatMap((age) => ["mild", "moderate", "severe"].flatMap((sev) => [false, true].flatMap((pcnAllergy) => [false, true].map((mrsa) => plan({ form, age, sev, pcnAllergy, mrsa, immuno: mrsa, recurrent: mrsa }))))));
const extra = ["empiric", "strep", "sa", "clos", "aero", "vibrio"].map((pathogen) => plan({ form: "nec", pathogen })).concat(["clean", "gi", "axilla"].map((site) => plan({ form: "ssi", site, mrsa: true })), plan({ form: "bite", bite: "human" }), plan({ form: "purulent", sev: "moderate", culture: "mssa" }), plan({ form: "purulent", sev: "severe", culture: "mrsa" }));
const outs = all.concat(extra);
const rows = outs.flatMap((x) => items(x));
check("Mức GRADE hợp lệ", rows.every((it) => !it.grade || /^[SW]-(H|M|L)$/.test(it.grade)));
check("Mọi dòng có tham chiếu nguồn", rows.every((it) => it.ref && /IDSA|ACE/.test(it.ref)));
const shown = outs.flatMap((x) => [x.headline, ...x.notes, ...x.avoid.flatMap((it) => [it.role, it.text]), ...x.blocks.flatMap((b) => [b.title, b.lead || "", ...b.items.flatMap((it) => [it.role, it.text, it.dose || ""])])])
  .concat(M.REFERRAL, M.RED_FLAGS, M.SYSTEMIC, M.SIRS_IDSA, M.READ_HINT, Object.values(M.FORM_TIP), Object.values(M.ACE_SEVERE), Object.values(M.SEV_TIP).flatMap((x) => Object.values(x)));
check("Giao diện không nêu số hình, số bảng, chú thích", shown.every((t) => !/(Hình|Bảng) \d|chú thích|Suppl/.test(t)));
check("Dòng có dấu “+” đều ghi “phối hợp” ở vai trò", rows.filter((it) => it.text.includes(" + ")).every((it) => /phối hợp/i.test(it.role)));
check("Dòng kháng sinh có liều đều ghi đơn trị, phối hợp hoặc bôi", rows.filter((it) => it.dose && !it.dose.startsWith("Bôi")).every((it) => /đơn trị|phối hợp/i.test(it.role)));
check("Thống nhất tên thuốc và đường dùng: không dùng “Cephalexin”, “TM”", shown.every((t) => !/Cephalexin|cephalexin|\bTM\b/.test(t)));

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
