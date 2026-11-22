/*
  Phần tham chiếu cho module viêm đường mật cấp (TG18):
  - Ngưỡng ra quyết định của TG18 đặt cạnh kháng sinh đồ tích lũy BV199 (tính trực tiếp từ
    data/antibiotics/antibiogram-bv199-tables.json, không ghi cứng số liệu).
  - Viêm túi mật cấp theo TG18 (Gomi 2018, Q1, Q4, thời gian điều trị).
  - Điểm chung và khác biệt giữa TG18 và QĐ 708/QĐ-BYT.
*/
import Link from "next/link";
import tablesData from "@/data/antibiotics/antibiogram-bv199-tables.json";

type Cell = { t: string; s?: number; n?: number };
type Panel = { columns: { code: string }[]; rows: { group: string; n: number; cells: Cell[] }[] };
type TablesFile = { period: string; minN: number; tables: { id: string; gramNegative: Panel }[] };

const data = tablesData as TablesFile;
const hospital = data.tables.find(({ id }) => id === "toan-vien")?.gramNegative;

// Làm tròn kiểu Excel (nửa lên), khớp bảng kháng sinh đồ
const pct = (part: number, whole: number) => Math.round((part / whole) * 1000 + 1e-9) / 10;
const fmt = (value: number) => value.toLocaleString("vi-VN", { maximumFractionDigits: 1 });

function lookup(group: string, code: string) {
  if (!hospital) return null;
  const row = hospital.rows.find((r) => r.group === group);
  const index = hospital.columns.findIndex((c) => c.code === code);
  const cell = row && index >= 0 ? row.cells[index] : undefined;
  if (!row || !cell?.n || cell.s === undefined) return null;
  return { s: cell.s, n: cell.n, isolates: row.n };
}

type Verdict = "pass" | "border" | "fail" | "info";
const verdictStyle: Record<Verdict, string> = {
  pass: "bg-emerald-100 text-emerald-950",
  border: "bg-amber-100 text-amber-950",
  fail: "bg-rose-100 text-rose-950",
  info: "bg-slate-100 text-slate-800",
};

type ThresholdRow = {
  topic: string;
  rule: string;
  organism: string;
  code: string;
  drug: string;
  measure: "susceptible" | "nonsusceptible";
  judge?: (value: number) => { verdict: Verdict; text: string };
};

const thresholds: ThresholdRow[] = [
  {
    topic: "Ampicillin/sulbactam kinh nghiệm",
    rule: "Chỉ dùng kinh nghiệm khi độ nhạy tại chỗ ≥80%.",
    organism: "Escherichia coli", code: "SAM", drug: "Ampicillin/sulbactam", measure: "susceptible",
    judge: (v) => v >= 80 ? { verdict: "pass", text: "Đạt ngưỡng" } : { verdict: "fail", text: "Không đạt, không dùng kinh nghiệm" },
  },
  {
    topic: "Bao phủ ESBL theo kinh nghiệm",
    rule: "Bao phủ ESBL khi trên 10–20% E. coli cộng đồng kháng cephalosporin thế hệ 3.",
    organism: "Escherichia coli", code: "CTX", drug: "Cefotaxim", measure: "nonsusceptible",
    judge: (v) => v > 20 ? { verdict: "fail", text: "Vượt ngưỡng, cephalosporin thế hệ 3 không đáng tin cho điều trị kinh nghiệm" }
      : v > 10 ? { verdict: "border", text: "Trong vùng 10–20%, cân nhắc theo nguy cơ từng ca" }
        : { verdict: "pass", text: "Dưới ngưỡng" },
  },
  {
    topic: "P. aeruginosa kháng ceftazidim",
    rule: "Khi trên 20% kháng ceftazidim: dùng carbapenem, piperacillin/tazobactam hoặc aminoglycosid đến khi có kết quả cấy.",
    organism: "Pseudomonas aeruginosa", code: "CAZ", drug: "Ceftazidim", measure: "nonsusceptible",
    judge: (v) => v > 20 ? { verdict: "fail", text: "Vượt ngưỡng, không chọn ceftazidim hoặc cefepim làm thuốc nền kinh nghiệm" }
      : { verdict: "pass", text: "Dưới ngưỡng" },
  },
  { topic: "Tham khảo thêm", rule: "Thuốc nền TG18 cho Độ II–III.", organism: "Escherichia coli", code: "TZP", drug: "Piperacillin/tazobactam", measure: "susceptible" },
  { topic: "", rule: "", organism: "Klebsiella pneumoniae", code: "TZP", drug: "Piperacillin/tazobactam", measure: "susceptible" },
  { topic: "", rule: "", organism: "Pseudomonas aeruginosa", code: "TZP", drug: "Piperacillin/tazobactam", measure: "susceptible" },
  { topic: "", rule: "Carbapenem cho Độ III và nhiễm khuẩn liên quan chăm sóc y tế.", organism: "Escherichia coli", code: "MEM", drug: "Meropenem", measure: "susceptible" },
  { topic: "", rule: "", organism: "Klebsiella pneumoniae", code: "MEM", drug: "Meropenem", measure: "susceptible" },
];

export function CholangitisLocalThresholds() {
  const rows = thresholds.map((row) => {
    const hit = lookup(row.organism, row.code);
    if (!hit) return { row, hit: null, value: null, verdict: null };
    const count = row.measure === "susceptible" ? hit.s : hit.n - hit.s;
    const value = pct(count, hit.n);
    return { row, hit, count, value, verdict: row.judge ? row.judge(value) : { verdict: "info" as Verdict, text: "Tham khảo" } };
  });
  if (rows.every(({ hit }) => !hit)) return null;

  return (
    <details className="my-3 min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-3" open>
      <summary className="cursor-pointer font-bold text-slate-900">Ngưỡng TG18 áp vào kháng sinh đồ BV199</summary>
      <p className="m-0 mt-2 text-xs leading-relaxed text-slate-700">
        Toàn viện, {data.period}, phân lập đầu tiên mỗi loài trên mỗi người bệnh (CLSI M39). Không nhạy gồm I và R.
      </p>
      <div className="mt-2 max-w-full overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[44rem] border-collapse text-xs leading-relaxed">
          <thead className="bg-slate-100 text-left text-slate-900">
            <tr>
              <th scope="col" className="px-2 py-2 font-bold">Ngưỡng TG18</th>
              <th scope="col" className="px-2 py-2 font-bold">Vi khuẩn · kháng sinh</th>
              <th scope="col" className="px-2 py-2 font-bold">BV199</th>
              <th scope="col" className="px-2 py-2 font-bold">Nhận định</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ row, hit, count, value, verdict }) => (
              <tr key={row.organism + row.code} className="border-t border-slate-200 align-top">
                <td className="px-2 py-2 text-slate-800">{row.topic && <strong className="block text-slate-900">{row.topic}</strong>}{row.rule}</td>
                <td className="px-2 py-2"><em>{row.organism}</em> · {row.drug}</td>
                <td className="whitespace-nowrap px-2 py-2 font-semibold text-slate-900">
                  {hit && value !== null ? (
                    <>
                      {row.measure === "susceptible" ? "Nhạy" : "Không nhạy"} {fmt(value)}%
                      <span className="block font-normal text-slate-600">{count}/{hit.n} chủng có xét nghiệm</span>
                      {hit.isolates < data.minN && <span className="block font-normal text-amber-900">n &lt;{data.minN}</span>}
                    </>
                  ) : "Không có dữ liệu"}
                </td>
                <td className="px-2 py-2">{verdict && <span className={`inline-block rounded-md px-2 py-1 font-semibold ${verdictStyle[verdict.verdict]}`}>{verdict.text}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate-700">
        <li>Số liệu gộp mọi bệnh phẩm và mọi khoa, chưa có nhóm bệnh phẩm mật hoặc dịch ổ bụng mà TG18 khuyến cáo. Tỷ lệ kháng ở viêm đường mật mắc phải cộng đồng có thể thấp hơn.</li>
        <li>Đây là kết quả áp ngưỡng của TG18, chưa phải phác đồ của bệnh viện. Phác đồ kinh nghiệm do Hội đồng Thuốc và điều trị quyết định.</li>
        <li>Aminoglycosid cho P. aeruginosa theo CLSI M100 hiện hành: không còn điểm gãy gentamicin; amikacin chỉ áp dụng cho chủng từ nước tiểu; tobramycin vẫn có điểm gãy (khoanh 10 µg: S ≥19, I 13–18, R ≤12 mm).</li>
        <li>Kháng sinh đồ BV199 làm bằng khoanh giấy khuếch tán. Piperacillin/tazobactam với Enterobacterales gần ngưỡng nên xác nhận bằng MIC.</li>
        <li>Yếu tố nguy cơ vi khuẩn kháng thuốc (IDSA 2024): dùng kháng sinh trong 90 ngày, đã nhiễm hoặc định cư vi khuẩn kháng thuốc, nhiễm khuẩn liên quan chăm sóc y tế, suy giảm miễn dịch, tuổi cao, bệnh nền nặng.</li>
      </ul>
      <Link href="/antibiotics/antibiogram" className="mt-2 inline-block text-xs font-semibold text-teal-800 underline underline-offset-2">Mở bảng kháng sinh đồ BV199</Link>
    </details>
  );
}

const cholecystitisRows = [
  { topic: "Vai trò kháng sinh", text: "Độ I: vai trò của vi khuẩn chưa rõ, kháng sinh chủ yếu mang tính dự phòng tiến triển nhiễm khuẩn. Độ II–III có đáp ứng viêm toàn thân: kháng sinh là điều trị, có thể cần đến khi cắt túi mật." },
  { topic: "Chọn thuốc", text: "Dùng chung danh sách kháng sinh của TG18 cho viêm đường mật theo độ nặng và bối cảnh mắc bệnh ở bảng phía trên." },
  { topic: "Cấy mật", text: "Gửi cấy mật túi mật ở mọi ca, trừ Độ I (khuyến cáo 1, mức C). Cấy mật và mô khi phát hiện thủng, khí phế túi mật hoặc hoại tử trong mổ (khuyến cáo 2, mức D)." },
  { topic: "Cấy máu", text: "Không làm thường quy ở viêm túi mật Độ I mắc phải cộng đồng (khuyến cáo 2, mức D)." },
  { topic: "Thời gian · Độ I–II", text: "Chỉ dùng kháng sinh trước và trong mổ (khuyến cáo 1, mức B). Có thể ngừng trong vòng 24 giờ sau cắt túi mật." },
  { topic: "Thời gian · Độ III", text: "4–7 ngày sau khi kiểm soát ổ nhiễm (khuyến cáo 2, mức D). Hội đồng đồng thuận TG18 ghi nhận dữ liệu cho mốc này còn hạn chế." },
  { topic: "Kéo dài", text: "Thủng, khí phế túi mật hoặc hoại tử phát hiện khi mổ: 4–7 ngày. Áp-xe quanh túi mật hoặc thủng túi mật: tiếp tục đến khi hết sốt, bạch cầu về bình thường và hết dấu hiệu bụng (khuyến cáo 1, mức D)." },
  { topic: "Cầu khuẩn Gram dương trong máu", text: "Enterococcus hoặc Streptococcus: tối thiểu 2 tuần để giảm nguy cơ viêm nội tâm mạc. Áp dụng cả cho nhiễm khuẩn liên quan chăm sóc y tế." },
];

export function CholecystitisTG18() {
  return (
    <details className="my-3 min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-3">
      <summary className="cursor-pointer font-bold text-slate-900">Viêm túi mật cấp theo TG18</summary>
      <dl className="m-0 mt-2 grid gap-2 text-sm leading-relaxed sm:grid-cols-[12rem_1fr]">
        {cholecystitisRows.map(({ topic, text }) => (
          <div key={topic} className="contents">
            <dt className="font-semibold text-slate-900">{topic}</dt>
            <dd className="m-0 text-slate-700">{text}</dd>
          </div>
        ))}
      </dl>
      <p className="m-0 mt-2 text-xs text-slate-600">
        Phân độ viêm túi mật dùng tiêu chí riêng của TG18 (Yokoe và cộng sự, J Hepatobiliary Pancreat Sci 2018;25:41–54), khác tiêu chí viêm đường mật ở phần trên.
      </p>
    </details>
  );
}

const common = [
  { topic: "Kiểm soát ổ nhiễm", text: "Dẫn lưu đường mật qua nội soi, qua da hoặc phẫu thuật là nền tảng điều trị; kháng sinh hỗ trợ." },
  { topic: "Khởi trị", text: "Điều trị kinh nghiệm ngay khi chẩn đoán, chỉnh theo kháng sinh đồ khi có kết quả cấy." },
  { topic: "Nhóm thuốc", text: "Piperacillin/tazobactam, cephalosporin thế hệ 3–4, cefoperazon/sulbactam, carbapenem, fluoroquinolon, aztreonam." },
  { topic: "Thể nhẹ", text: "Cả hai liệt kê ampicillin/sulbactam và cephalosporin thế hệ 1–2 (cefazolin, cefotiam, cefmetazol, flomoxef)." },
  { topic: "Kỵ khí", text: "Phối hợp metronidazol khi thuốc nền không đủ phổ kỵ khí." },
];

const differences = [
  { topic: "Phân độ", tg18: "Tiêu chí khách quan: Độ III khi có suy cơ quan; Độ II khi có ≥2/5 tiêu chí.", byt: "Theo đáp ứng với điều trị ban đầu.", meaning: "Theo TG18, phân độ được ngay khi nhập viện." },
  { topic: "Bối cảnh mắc bệnh", tg18: "Tách mắc phải cộng đồng và liên quan chăm sóc y tế; nhóm sau dùng phổ kháng Pseudomonas ở mọi độ.", byt: "Không tách phác đồ; chỉ mô tả tác nhân bệnh viện.", meaning: "Hỏi tiền sử nằm viện, thủ thuật, stent đường mật trước khi chọn thuốc." },
  { topic: "Chỉ định kỵ khí", tg18: "Khi có miệng nối mật–ruột.", byt: "Thể nặng hoặc có nhiễm khuẩn kỵ khí.", meaning: "TG18 hẹp hơn, tránh thêm metronidazol không cần thiết." },
  { topic: "Enterococcus", tg18: "Vancomycin cho Độ III cộng đồng và nhiễm khuẩn liên quan chăm sóc y tế; linezolid hoặc daptomycin khi có VRE.", byt: "Không có phác đồ bao phủ Enterococcus.", meaning: "Ca nặng cần đánh giá phối hợp vancomycin." },
  { topic: "Ampicillin/sulbactam", tg18: "Chỉ dùng kinh nghiệm khi độ nhạy tại chỗ ≥80%.", byt: "Lựa chọn thường dùng cho thể nhẹ.", meaning: "Đối chiếu kháng sinh đồ BV199 ở bảng phía trên trước khi chọn." },
  { topic: "Aminoglycosid", tg18: "Không có trong danh sách đơn trị kinh nghiệm; dùng khi P. aeruginosa kháng ceftazidim trên 20% hoặc với ESBL.", byt: "Lựa chọn số 1 dạng đơn trị (gentamicin, amikacin, tobramycin).", meaning: "Không dùng aminoglycosid đơn trị cho nhiễm khuẩn đường mật." },
  { topic: "Fluoroquinolon", tg18: "Độ I–II khi biết chủng nhạy hoặc dị ứng beta-lactam; không có ở Độ III và nhóm liên quan chăm sóc y tế.", byt: "Lựa chọn số 2, không giới hạn theo độ.", meaning: "Tỷ lệ E. coli nhạy ciprofloxacin tại BV199 thấp; chỉ dùng theo kháng sinh đồ." },
  { topic: "Thời gian", tg18: "4–7 ngày sau khi kiểm soát ổ nhiễm; tối thiểu 2 tuần khi có cầu khuẩn Gram dương trong máu.", byt: "Thể nhẹ 5–7 ngày; trung bình và nặng 7–14 ngày.", meaning: "TG18 ngắn hơn và tính mốc từ lúc kiểm soát ổ nhiễm." },
  { topic: "Liều thuốc", tg18: "TG18 không đưa liều; module dùng liều theo UCSF và nhãn: piperacillin/tazobactam 4,5 g mỗi 8 giờ truyền kéo dài; cefepim, ceftazidim, aztreonam 2 g mỗi 8 giờ; metronidazol 500 mg mỗi 12 giờ.", byt: "Piperacillin/tazobactam 4,5 g mỗi 6 giờ; ceftazidim, cefepim 1–2 g mỗi 12 giờ; aztreonam 1–2 g mỗi 12 giờ; metronidazol 500 mg mỗi 8 giờ.", meaning: "Liều cephalosporin và aztreonam mỗi 12 giờ của QĐ 708 thấp hơn liều nhãn cho nhiễm khuẩn nặng; cần Hội đồng Thuốc và điều trị thống nhất." },
  { topic: "Bài tiết qua mật", tg18: "Không cần ưu tiên thuốc bài tiết tốt vào mật vì khi tắc mật kháng sinh gần như ngừng bài tiết vào mật; chọn thuốc thấm tốt vào vị trí nhiễm.", byt: "Chọn kháng sinh bài tiết tốt vào đường mật.", meaning: "Chọn thuốc theo phổ và kháng sinh đồ, không dựa vào nồng độ trong mật." },
  { topic: "Viêm túi mật", tg18: "Hướng dẫn riêng, gồm dùng kháng sinh quanh mổ ở Độ I–II.", byt: "Không tách riêng.", meaning: "Xem mục viêm túi mật cấp ở trên." },
];

export function CholangitisGuidelineComparison({ open = false }: { open?: boolean }) {
  return (
    <details className="my-3 min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-3" open={open || undefined}>
      <summary className="cursor-pointer font-bold text-slate-900">So sánh TG18 và QĐ 708/QĐ-BYT</summary>
      <h5 className="m-0 mt-3 text-sm font-bold text-slate-900">Điểm chung</h5>
      <dl className="m-0 mt-1 grid gap-1.5 text-sm leading-relaxed sm:grid-cols-[10rem_1fr]">
        {common.map(({ topic, text }) => (
          <div key={topic} className="contents">
            <dt className="font-semibold text-slate-900">{topic}</dt>
            <dd className="m-0 text-slate-700">{text}</dd>
          </div>
        ))}
      </dl>
      <h5 className="m-0 mt-3 text-sm font-bold text-slate-900">Điểm khác biệt</h5>
      <div className="mt-1 max-w-full overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[48rem] border-collapse text-xs leading-relaxed">
          <thead className="bg-slate-100 text-left text-slate-900">
            <tr>
              <th scope="col" className="w-[14%] px-2 py-2 font-bold">Nội dung</th>
              <th scope="col" className="w-[30%] px-2 py-2 font-bold">TG18</th>
              <th scope="col" className="w-[28%] px-2 py-2 font-bold">QĐ 708/QĐ-BYT (2015)</th>
              <th scope="col" className="w-[28%] px-2 py-2 font-bold">Ý nghĩa thực hành</th>
            </tr>
          </thead>
          <tbody>
            {differences.map(({ topic, tg18, byt, meaning }) => (
              <tr key={topic} className="border-t border-slate-200 align-top">
                <th scope="row" className="px-2 py-2 text-left font-semibold text-slate-900">{topic}</th>
                <td className="px-2 py-2 text-slate-800">{tg18}</td>
                <td className="px-2 py-2 text-slate-800">{byt}</td>
                <td className="px-2 py-2 text-slate-800">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="m-0 mt-2 text-xs text-slate-600">
        QĐ 708/QĐ-BYT vẫn là hướng dẫn sử dụng kháng sinh quốc gia hiện hành; Kế hoạch phòng chống kháng thuốc 2026–2030 có nhiệm vụ cập nhật hướng dẫn này. TG18 là bản Tokyo Guidelines mới nhất.
        {" "}<Link href="/antibiotics/empiric/guideline-v9" className="font-semibold text-teal-800 underline underline-offset-2">Xem phác đồ BYT</Link>
      </p>
    </details>
  );
}
