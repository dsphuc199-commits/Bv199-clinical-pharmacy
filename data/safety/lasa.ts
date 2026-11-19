/*
  Danh muc thuoc LASA Benh vien 199, nam 2025-2026 (Khoa Duoc).
  Hinh anh tach tu ban danh muc, luu tai public/lasa/2026.
  "detail" chi ghi thong tin doc duoc tren danh muc hoac tren bao bi trong anh.
*/

export type LasaDiff = "strength" | "active" | "form" | "same" | "package";

export type LasaDrug = {
  id: string;
  name: string;
  active?: string;
  detail?: string;
  /* Doan chu to do trong danh muc doc giong nhau. */
  marks?: string[];
};

export type LasaGroup = {
  id: string;
  kind: "look" | "sound";
  drugs: LasaDrug[];
  diffs: LasaDiff[];
  difference: string;
  warning?: string;
};

export const LASA_SOURCE = "Khoa Dược Bệnh viện 199 – Danh mục thuốc LASA năm 2025–2026";

export const LASA_CHECK: Record<LasaDiff, string> = {
  strength: "Đọc đủ tên thuốc và hàm lượng trước khi cấp phát.",
  active: "Đối chiếu hoạt chất trên y lệnh và trên nhãn thuốc.",
  form: "Đối chiếu dạng bào chế và đường dùng.",
  same: "Đối chiếu đúng tên biệt dược theo y lệnh.",
  package: "Đọc nhãn thuốc, không nhận diện theo màu sắc bao bì.",
};

export const lookAlikeGroups: LasaGroup[] = [
  { id: "levothyrox", kind: "look", diffs: ["strength"], difference: "Cùng hoạt chất, khác hàm lượng: 50 µg và 100 µg.", drugs: [
    { id: "levothyrox-50", name: "Levothyrox 50µg", active: "Levothyroxin" },
    { id: "levothyrox-100", name: "Levothyrox 100µg", active: "Levothyroxin" },
  ] },
  { id: "pracetam-partamol", kind: "look", diffs: ["active", "package"], difference: "Khác hoạt chất: piracetam và paracetamol; cùng kiểu bao bì.", drugs: [
    { id: "pracetam-800", name: "Pracetam 800", active: "Piracetam", detail: "800 mg" },
    { id: "partamol-tab", name: "Partamol Tab", active: "Paracetamol", detail: "500 mg" },
  ] },
  { id: "curam", kind: "look", diffs: ["strength"], difference: "Cùng hoạt chất, khác hàm lượng: 1000 mg và 625 mg.", drugs: [
    { id: "curam-1000", name: "Curam 1000mg", active: "Amoxicillin/ Clavulanic acid" },
    { id: "curam-625", name: "Curam 625mg", active: "Amoxicillin/ Clavulanic acid", detail: "Amoxicillin 500 mg, clavulanic acid 125 mg" },
  ] },
  { id: "oflovid", kind: "look", diffs: ["form"], difference: "Cùng hoạt chất và nồng độ, khác dạng bào chế: thuốc nhỏ mắt và thuốc mỡ tra mắt.", drugs: [
    { id: "oflovid-nho-mat", name: "Oflovid 0.3% (nhỏ mắt)", active: "Ofloxacin" },
    { id: "oflovid-tra-mat", name: "Oflovid 0.3% (tra mắt)", active: "Ofloxacin", detail: "Thuốc mỡ tra mắt, tuýp 3,5 g" },
  ] },
  { id: "tobradex-tobrex", kind: "look", diffs: ["active"], difference: "TobraDex có thêm dexamethasone; Tobrex chỉ có tobramycin.", drugs: [
    { id: "tobradex", name: "TobraDex", active: "Tobramycin, dexamethasone" },
    { id: "tobrex", name: "Tobrex", active: "Tobramycin" },
  ] },
  { id: "sadapron", kind: "look", diffs: ["strength"], difference: "Cùng hoạt chất, khác hàm lượng: 100 mg và 300 mg.", drugs: [
    { id: "sadapron-100", name: "Sadapron 100", active: "Allopurinol 100mg" },
    { id: "sadapron-300", name: "Sadapron 300", active: "Allopurinol 300mg" },
  ] },
  { id: "sartan", kind: "look", diffs: ["active", "package"], difference: "Ba hoạt chất khác nhau cùng nhóm sartan, cùng kiểu bao bì và vỉ thuốc.", drugs: [
    { id: "nerazzu-50", name: "Nerazzu-50", active: "Losartan", detail: "Losartan kali 50 mg" },
    { id: "zhekof", name: "Zhekof", active: "Telmisartan", detail: "Telmisartan 40 mg" },
    { id: "tabarex", name: "Tabarex", active: "Valsartan", detail: "Valsartan 80 mg" },
  ] },
  { id: "diosmin", kind: "look", diffs: ["active", "package"], difference: "Vỉ và viên giống nhau; Pelethrocin chỉ có diosmin, hai thuốc còn lại có diosmin và hesperidin.", drugs: [
    { id: "vein-plus", name: "Vein Plus", active: "Diosmin+hesperidin" },
    { id: "pelethrocin", name: "Pelethrocin", active: "Diosmin" },
    { id: "traflon-500", name: "Traflon-500", active: "Diosmin+hesperidin" },
  ] },
  { id: "fucicort-fucidin", kind: "look", diffs: ["active"], difference: "Fucicort có thêm betamethasone; Fucidin chỉ có acid fusidic.", drugs: [
    { id: "fucicort", name: "Fucicort", active: "Betamethasone, Acid fusidic", detail: "Kem 15 g" },
    { id: "fucidin", name: "Fucidin", active: "Acid fusidic 2%", detail: "Kem 15 g" },
  ] },
  { id: "stada", kind: "look", diffs: ["active", "package"], difference: "Khác hoạt chất và chỉ định, cùng nhà sản xuất và kiểu bao bì.", drugs: [
    { id: "irbesartan-stada-150", name: "Irbesartan Stada 150 mg", active: "Irbesartan" },
    { id: "esomeprazole-stada-20", name: "Esomeprazole Stada 20 mg", active: "Esomeprazole" },
  ] },
  { id: "natri-clorid", kind: "look", diffs: ["strength"], difference: "Khác nồng độ (0,9% và 10%) và thể tích (100 ml và 250 ml).", drugs: [
    { id: "natri-clorid-09-100", name: "Natri Clorid 0,9%", active: "Natri clorid", detail: "100 ml" },
    { id: "natri-clorid-09-250", name: "Natri Clorid 0,9%", active: "Natri clorid", detail: "250 ml" },
    { id: "natri-clorid-10-250", name: "Natri Clorid 10%", active: "Natri clorid", detail: "250 ml" },
  ] },
  { id: "tenafathin", kind: "look", diffs: ["strength", "active"], difference: "Tên và bao bì gần giống nhau, cùng nhà sản xuất.",
    warning: "Danh mục ghi Tenafathin 1000 (Cefalothin 1000mg), nhưng hộp thuốc trong ảnh là Tenafotin 1000 (Cefoxitin 1000 mg). Đọc kỹ nhãn thuốc thực tế.", drugs: [
    { id: "tenafathin-500", name: "Tenafathin 500", active: "Cefalothin 500mg" },
    { id: "tenafathin-1000", name: "Tenafathin 1000", active: "Cefalothin 1000mg", detail: "Hộp trong ảnh: Tenafotin 1000, Cefoxitin 1000 mg" },
  ] },
  { id: "cefoxitin", kind: "look", diffs: ["strength"], difference: "Cùng hoạt chất, khác hàm lượng: 2 g và 1 g.", drugs: [
    { id: "cefoxitin-2g", name: "Cefoxitin 2g", active: "Cefoxitin" },
    { id: "cefoxitin-1g", name: "Cefoxitin 1g", active: "Cefoxitin" },
  ] },
  { id: "dexamethasone", kind: "look", diffs: ["package"], difference: "Cùng tên và nồng độ 4 mg/ml, hai mẫu bao bì khác nhau.", drugs: [
    { id: "dexamethasone-a", name: "Dexamethasone 4mg/ml", active: "Dexamethason phosphat", detail: "Mẫu bao bì 1" },
    { id: "dexamethasone-b", name: "Dexamethasone 4mg/ml", active: "Dexamethason phosphat", detail: "Mẫu bao bì 2, HDPharma" },
  ] },
  { id: "bfs", kind: "look", diffs: ["active", "package"], difference: "Ba thuốc tiêm khác hoạt chất, cùng dạng ống nhựa BFS.", drugs: [
    { id: "levobupi-bfs-50", name: "Levobupi-BFS 50mg", active: "Levobupivacain" },
    { id: "bfs-noradrenaline-10", name: "BFS-Noradrenaline 10mg", active: "Noradrenaline" },
    { id: "bfs-furosemide-40", name: "BFS-Furosemide 40mg/4ml", active: "Furosemide" },
  ] },
  { id: "insunova", kind: "look", diffs: ["form"], difference: "Khác dụng cụ tiêm: lọ tiêm và bút tiêm.", drugs: [
    { id: "insunova-30-70", name: "Insunova 30/70 (Biphasic)", active: "Insulin", detail: "Lọ tiêm 10 ml" },
    { id: "insunova-g-pen", name: "Insunova-G Pen", active: "Insulin", detail: "Bút tiêm" },
  ] },
  { id: "cefazolin-ticarlinat", kind: "look", diffs: ["active", "package"], difference: "Khác hoạt chất, cùng nhà sản xuất và màu tím trên bao bì.", drugs: [
    { id: "cefazolin-2g", name: "Cefazolin 2g", active: "Cefazolin" },
    { id: "ticarlinat-16", name: "Ticarlinat 1,6g", active: "Ticarcillin, acid clavulanic", detail: "Ticarcillin 1,5 g, acid clavulanic 0,1 g" },
  ] },
  { id: "savi", kind: "look", diffs: ["active", "package"], difference: "Khác hoạt chất và chỉ định, cùng nhà sản xuất và kiểu bao bì.", drugs: [
    { id: "savi-enalapril-hct", name: "Savi Enalapril HCT 10/12,5", active: "Enalapril, Hydrochlorothiazide" },
    { id: "savi-tenofovir-300", name: "SaVi Tenofovir 300", active: "Tenofovir" },
  ] },
];

const pair = (id: string, diffs: LasaDiff[], difference: string, a: LasaDrug, b: LasaDrug): LasaGroup => ({ id, kind: "sound", diffs, difference, drugs: [a, b] });

export const soundAlikeGroups: LasaGroup[] = [
  pair("agi", ["active"], "Khác hoạt chất.",
    { id: "agiclovir", name: "AGICLOVIR 5%", active: "Aciclovir", marks: ["AGI"] },
    { id: "agimycob", name: "AGIMYCOB", active: "Metronidazol, neomycin, nystatin", marks: ["AGI"] }),
  pair("amlo", ["same"], "Cùng hoạt chất, khác tên biệt dược.",
    { id: "amlodac-5", name: "AMLODAC 5", active: "Amlodipine", marks: ["AMLO"] },
    { id: "amlodipine-5", name: "Amlodipine 5 mg Cap", active: "Amlodipine", marks: ["Amlo"] }),
  pair("aspirin", ["strength", "form"], "Khác hàm lượng và dạng bào chế: gói 100 mg, viên 81 mg.",
    { id: "aspirin-100", name: "Aspirin 100mg gói", marks: ["Aspirin", "gói"] },
    { id: "aspirin-81", name: "Aspirin 81mg viên", marks: ["Aspirin", "viên"] }),
  pair("betadine", ["strength", "form"], "Khác nồng độ và cách dùng: sát khuẩn 10%, súc họng 1%.",
    { id: "betadine-sat-khuan", name: "Betadine sát khuẩn", active: "Povidon iodin 10%", marks: ["Betadine sát khuẩn"] },
    { id: "betadine-suc-hong", name: "Betadine súc họng", active: "Povidon iodin 1%", marks: ["Betadine súc họng"] }),
  pair("biocemet", ["form"], "Cùng hoạt chất và hàm lượng, khác dạng bào chế: DT và SC.",
    { id: "biocemet-dt", name: "Biocemet DT", active: "Amoxicillin 500mg + clavulanic acid 62,5mg", marks: ["Biocemet DT"] },
    { id: "biocemet-sc", name: "Biocemet SC", active: "Amoxicillin 500mg + clavulanic acid 62,5mg", marks: ["Biocemet SC"] }),
  pair("cefa", ["active"], "Khác hoạt chất: cefadroxil và cefalexin.",
    { id: "cefadroxil-eg", name: "Cefadroxil EG 500mg", active: "Cefadroxil", marks: ["Cefa"] },
    { id: "cefanew", name: "Cefanew", active: "Cefalexin", marks: ["Cefa"] }),
  pair("cipro", ["same"], "Cùng hoạt chất và hàm lượng, khác tên biệt dược.",
    { id: "ciprobay-500", name: "Ciprobay 500 viên", active: "Ciprofloxacin", marks: ["Cipro", "viên"] },
    { id: "ciprofloxacin-eg", name: "Ciprofloxacin EG 500 mg viên", active: "Ciprofloxacin", marks: ["Cipro", "viên"] }),
  pair("dom", ["active"], "Khác hoạt chất: domperidon và Bacillus subtilis.",
    { id: "domreme", name: "Domreme", active: "Domperidon", marks: ["Dom"] },
    { id: "domuvar", name: "DOMUVAR", active: "Bacillus subtilis", marks: ["DOM"] }),
  pair("irbesartan", ["same"], "Cùng hoạt chất và hàm lượng, khác tên biệt dược.",
    { id: "irbesartan-stada", name: "Irbesartan Stada 150 mg", active: "Irbesartan", marks: ["Irbesartan"] },
    { id: "irprestan", name: "Irprestan 150mg", active: "Irbesartan", marks: ["Irprestan"] }),
  pair("lidocain", ["strength"], "Cùng hoạt chất, khác hàm lượng và thể tích: 200 mg/10 ml và 40 mg/2 ml.",
    { id: "lidocain-200", name: "Lidocain hydroclorid 200mg/10ml (tiêm)", marks: ["Lidocain hydroclorid 200mg/10ml"] },
    { id: "lidocain-40", name: "Lidocain hydroclorid 40mg/2ml (tiêm)", marks: ["Lidocain hydroclorid 40mg/2ml"] }),
  pair("paracetamol", ["same"], "Cùng hoạt chất, khác tên biệt dược.",
    { id: "partamol", name: "PARTAMOL TAB.", active: "Paracetamol", marks: ["PAR"] },
    { id: "paracetamol-500", name: "Paracetamol 500", active: "Paracetamol", marks: ["Par"] }),
  pair("phong", ["active"], "Hai thuốc khác nhau, tên gần giống.",
    { id: "phong-te-thap", name: "Phong tê thấp HT", marks: ["Phong tê thấp"] },
    { id: "phong-thap-vuong", name: "Phong thấp vương", marks: ["Phong thấp"] }),
  pair("povidone", ["strength", "form"], "Khác nồng độ và đường dùng: dùng ngoài 10%, nhỏ mắt 5%.",
    { id: "povidone-10", name: "Povidone 10% dùng ngoài", marks: ["Povidone 10%"] },
    { id: "povidine-5", name: "Povidine 5% nhỏ mắt", marks: ["Povidine 5%"] }),
  pair("micort", ["form"], "Khác thuốc và dụng cụ dùng: Turbuhaler và Respules.",
    { id: "symbicort", name: "Symbicort Turbuhaler", marks: ["bicort"] },
    { id: "pulmicort", name: "Pulmicort Respules", marks: ["micort"] }),
  pair("tobradex-tobrex-sound", ["active"], "Tobradex có thêm dexamethason; Tobrex chỉ có tobramycin.",
    { id: "tobradex-s", name: "Tobradex", active: "Tobramycin, dexamethason", marks: ["Tobr", "ex"] },
    { id: "tobrex-s", name: "Tobrex", active: "Tobramycin", marks: ["Tobrex"] }),
  pair("turbe", ["active"], "Turbezid có thêm pyrazinamid.",
    { id: "turbe", name: "Turbe", active: "Rifampicin+isoniazid", marks: ["Turbe"] },
    { id: "turbezid", name: "Turbezid", active: "Rifampicin+isoniazid+Pyrazinamid", marks: ["Turbe"] }),
  pair("vino", ["active"], "Khác hoạt chất: tenoxicam và drotaverin.",
    { id: "vinocam", name: "Vinocam 20mg", active: "Tenoxicam", marks: ["Vino"] },
    { id: "vinopa", name: "Vinopa 40mg/2ml", active: "Drotaverin", marks: ["Vino"] }),
];
