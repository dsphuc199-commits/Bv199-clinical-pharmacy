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

// ACE Supplement 2
let o = plan({});
check("ACE Bảng 2: viêm mô bào nhẹ người lớn – cefalexin 500 mg × 4 lần/ngày", find(blk(o, "ACE 2026 – kháng sinh uống"), "Cefalexin").dose.startsWith("500 mg uống 4 lần/ngày"));
check("ACE Bảng 2: clindamycin chỉ hiện khi dị ứng penicilin", !blk(o, "ACE 2026").items.some((x) => x.text === "Clindamycin"));
o = plan({ pcnAllergy: true });
check("ACE Bảng 2: dị ứng penicilin – chỉ còn clindamycin 450–600 mg × 3 lần/ngày", blk(o, "ACE 2026").items.length === 1 && blk(o, "ACE 2026").items[0].dose === "Viên nang 450–600 mg uống 3 lần/ngày");
o = plan({ sev: "severe", age: "child" });
const iv = blk(o, "ACE 2026 – kháng sinh tĩnh mạch").items;
check("ACE Bảng 3: cefazolin, ceftriaxon, amoxicilin-acid clavulanic đều là đầu tay", iv.filter((x) => x.role === "Đầu tay").length === 3);
check("ACE Bảng 3: ceftriaxon trẻ em 50–80 mg/kg × 1 lần/ngày, tối đa 2000 mg/ngày", /50–80 mg\/kg × 1 lần\/ngày \(tối đa 2000 mg\/ngày\)/.test(iv.find((x) => x.text === "Ceftriaxon").dose));
check("ACE: nhẹ nhưng nguy cơ biến chứng cao xử trí như nặng (tĩnh mạch)", !!blk(plan({ highRisk: true }), "ACE 2026 – kháng sinh tĩnh mạch"));
o = plan({ form: "impetigo", age: "child" });
check("ACE Bảng 1: chốc khu trú – thuốc bôi, mupirocin ghi chưa nghiên cứu ở trẻ < 1 tuổi", /chưa nghiên cứu ở trẻ < 1 tuổi/.test(find(blk(o, "ACE 2026 – kháng sinh bôi"), "Mupirocin").dose));
check("ACE: chốc loét luôn dùng kháng sinh uống", !!blk(plan({ form: "impetigo", impSub: "ecthyma" }), "ACE 2026 – kháng sinh uống"));
check("Viêm nang lông: IDSA không đề cập – không có khối IDSA", !plan({ form: "impetigo", impSub: "folliculitis" }).blocks.some((b) => b.title.startsWith("IDSA")));
o = plan({ form: "purulent" });
check("ACE KC 4: nhọt/áp xe nhẹ – không kháng sinh", items(o).some((x) => x.text.startsWith("Không dùng kháng sinh")) && !blk(o, "ACE 2026 – kháng sinh uống"));
check("ACE KC 4: không dùng kháng sinh bôi cho nhọt, áp xe", o.avoid.some((x) => /Kháng sinh bôi/.test(x.text)));

// IDSA 2014 + dinh chinh 2015
o = plan({ form: "impetigo" });
check("Đính chính 2015: mupirocin Bảng 2 bôi 3 lần/ngày", find(blk(o, "IDSA 2014 – liều"), "Mupirocin").dose === "Bôi lên tổn thương 3 lần/ngày");
check("Đính chính 2015: SIRS bạch cầu < 4000/µL", /< 4000\/µL/.test(M.SIRS_IDSA) && !/< 400\//.test(M.SIRS_IDSA));
o = plan({ form: "nec", pathogen: "vibrio" });
check("Đính chính 2015: Vibrio – ceftriaxon 1 g TM mỗi ngày", /ceftriaxon 1 g TM mỗi ngày/.test(items(o).find((x) => x.role === "Phối hợp").dose));
o = plan({ form: "nec", pathogen: "aero" });
check("Đính chính 2015: Aeromonas – ciprofloxacin 400 mg TM mỗi 12 giờ", /ciprofloxacin 400 mg mỗi 12 giờ TM/.test(items(o).find((x) => x.role === "Phối hợp").dose));
o = plan({ form: "ssi", site: "gi" });
check("Trả lời tác giả 2015: ciprofloxacin uống 500–750 mg mỗi 12 giờ", /500–750 mg uống mỗi 12 giờ/.test(find(o, "Ciprofloxacin + metronidazol").dose));
o = plan({ form: "nec", pathogen: "clos", age: "child" });
check("Bảng 4 Clostridium trẻ em: penicilin 60 000–100 000 đơn vị/kg/lần", /60 000–100 000 đơn vị\/kg\/lần mỗi 6 giờ TM/.test(items(o).find((x) => x.role === "Phối hợp").dose));
o = plan({ form: "purulent", sev: "severe", age: "child" });
check("Hình 1: trẻ em không hiện daptomycin", !items(o).some((x) => x.text === "Daptomycin"));
check("Bảng 2: vancomycin trẻ em 40 mg/kg/ngày chia 4 lần", find(o, "Vancomycin").dose === "40 mg/kg/ngày chia 4 lần, TM");
check("Corticoid (KC 19) chỉ ở người lớn", !items(plan({ age: "child" })).some((x) => x.role === "Corticoid") && items(plan({})).some((x) => x.role === "Corticoid" && x.grade === "W-M"));
o = plan({ form: "bite", age: "child" });
check("Bảng 5 chỉ có liều người lớn – trẻ em không hiện liều người lớn", items(o).every((x) => !x.dose));
o = plan({ form: "nec", pcnAllergy: true });
check("Dị ứng penicilin nặng: ẩn piperacilin-tazobactam, hiện phác đồ thay thế Bảng 4", !find(o, "Piperacilin-tazobactam") && items(o).some((x) => x.role === "Dị ứng penicilin nặng"));

// Quan tri du lieu
const src = fs.readFileSync(path.join(__dirname, "../../components/antibiotics/empiric/ssti-idsa2014-ace2026.ts"), "utf8");
check("Không còn chữ “CẦN XÁC MINH”", !/CẦN XÁC MINH/.test(src));
check("Không còn ceftriaxon qid, liều “100 00”", !/qid/.test(src) && !/100 00 /.test(src));
const all = ["impetigo", "purulent", "cellulitis", "ssi", "nec", "pyo", "bite"].flatMap((form) => ["adult", "child"].flatMap((age) => ["mild", "moderate", "severe"].map((sev) => plan({ form, age, sev }))));
check("Mọi khuyến cáo IDSA có mức GRADE hợp lệ", all.every((x) => items(x).every((it) => !it.grade || /^[SW]-(H|M|L)$/.test(it.grade))));
check("Mọi dòng có tham chiếu nguồn", all.every((x) => items(x).every((it) => it.ref && /IDSA|ACE/.test(it.ref))));

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
