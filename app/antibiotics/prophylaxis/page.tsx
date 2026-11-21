"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, Pill, BookOpen, ClipboardCheck,
  ChevronRight, ExternalLink, Info, AlertTriangle,
  CheckCircle2, RotateCcw, Printer,
  Clock3, Syringe, ShieldCheck, ListChecks, Globe2
} from "lucide-react";
import {
  KSDP_DOSES, KSDP_OPERATIONS, KSDP_FOOTNOTES, PROSTATE_BIOPSY,
  KSDP_PRINCIPLES, KSDP_OBSTETRIC, CESAREAN_CEFAZOLIN, BYT708_URL,
  type KsdpOperation
} from "@/data/antibiotics/prophylaxis-byt708";
import KsdpIntl from "@/components/antibiotics/prophylaxis/KsdpIntl";
import ColonText from "@/components/antibiotics/prophylaxis/ColonText";
import { ASHP_URL } from "@/data/antibiotics/prophylaxis-ashp2013";
import { WOUND_CLASSES, KSDP_3671 } from "@/data/antibiotics/prophylaxis-byt3671";
import { DTQG_SOURCE } from "@/data/ent/dtqg-doses";

type SourceReference = { label: string; title: string; href?: string };

const SOURCE_708: SourceReference = {
  label: "QĐ 708/QĐ-BYT · 2015",
  title: "Hướng dẫn sử dụng kháng sinh",
  href: BYT708_URL,
};
const SOURCE_3671: SourceReference = {
  label: "QĐ 3671/QĐ-BYT · 2012",
  title: "Hướng dẫn phòng ngừa nhiễm khuẩn vết mổ",
};
const SOURCE_DTQG: SourceReference = {
  label: "2023",
  title: "Dược thư quốc gia Việt Nam",
};
const SOURCE_ASHP: SourceReference = {
  label: "ASHP/IDSA/SIS/SHEA · 2013",
  title: "Clinical Practice Guidelines for Antimicrobial Prophylaxis in Surgery",
  href: ASHP_URL,
};

/* Ceftriaxone: bảng liều KSDP của QĐ 708 không có dòng ceftriaxone -> liều theo Dược thư quốc gia 2023,
   chuyên luận Ceftriaxon, mục "Dự phòng nhiễm khuẩn trong các phẫu thuật" (nguyên văn). */
const CRO_DTQG = {
  adult: "Dùng liều đơn 2 g trước phẫu thuật 30 - 90 phút.",
  child: "Dùng liều đơn 50 - 80 mg/kg trước phẫu thuật.",
  neonate: "Dùng liều đơn 20 - 50 mg/kg trước phẫu thuật.",
};

const groups = [
  "Tất cả",
  ...Array.from(new Set(KSDP_OPERATIONS.map(x => x.group)))
];

function norm(s: string) {
  return (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function Fn({ n }: { n?: number[] }) {
  if (!n?.length) return null;
  return null; // không hiển thị ký hiệu chú thích
}

function opFootnotes(op: KsdpOperation) {
  return Array.from(new Set([
    ...(op.nameFn || []), ...(op.extraFn || []),
    ...(op.primaryFn || []), ...(op.altFn || [])
  ])).sort((a, b) => a - b);
}

const WOUND_TEXT: Record<string, string> = {
  "Sạch": "QĐ 708/QĐ-BYT: Trong phẫu thuật sạch, liệu pháp kháng sinh dự phòng nên áp dụng với một số can thiệp ngoại khoa nặng, có thể ảnh hưởng tới sự sống còn và/hoặc chức năng sống (phẫu thuật chỉnh hình, phẫu thuật tim và mạch máu, phẫu thuật thần kinh, phẫu thuật nhãn khoa). QĐ 3671/QĐ-BYT: Sử dụng KSDP với các phẫu thuật sạch và sạch – nhiễm.",
  "Sạch - nhiễm": "QĐ 708/QĐ-BYT: KSDP được chỉ định cho tất cả các can thiệp phẫu thuật thuộc phẫu thuật sạch - nhiễm. QĐ 3671/QĐ-BYT: Sử dụng KSDP với các phẫu thuật sạch và sạch – nhiễm.",
  "Nhiễm": "Phẫu thuật nhiễm và phẫu thuật bẩn: kháng sinh đóng vai trò trị liệu. KSDP không ngăn ngừa nhiễm khuẩn mà ngăn ngừa nhiễm khuẩn đã xảy ra không phát triển.",
  "Bẩn": "Phẫu thuật nhiễm và phẫu thuật bẩn: kháng sinh đóng vai trò trị liệu. KSDP không ngăn ngừa nhiễm khuẩn mà ngăn ngừa nhiễm khuẩn đã xảy ra không phát triển.",
};

// Thời điểm dùng theo QĐ 708/QĐ-BYT
const TIMING: Record<string, string> = {
  Cefazolin: "Cephalosporins tiêm tĩnh mạch trong 3 - 5 phút ngay trước thủ thuật.",
  Cefotetan: "Cephalosporins tiêm tĩnh mạch trong 3 - 5 phút ngay trước thủ thuật.",
  Ceftriaxone: "Cephalosporins tiêm tĩnh mạch trong 3 - 5 phút ngay trước thủ thuật.",
  Vancomycin: "Dùng trước MỘT GIỜ và HOÀN THÀNH việc truyền trước khi bắt đầu rạch da.",
  Ciprofloxacin: "Dùng trước MỘT GIỜ và HOÀN THÀNH việc truyền trước khi bắt đầu rạch da.",
  Clindamycin: "Truyền xong trước 10 - 20 phút.",
  Gentamycin: "Một liều duy nhất 5 mg/kg. Nếu người bệnh lọc máu hoặc ClCr < 20 ml/phút: 2 mg/kg.",
};

const checklistLabels = [
  "Xác định đúng loại phẫu thuật (sạch, sạch - nhiễm, nhiễm, bẩn) và chỉ định KSDP",
  "Phân biệt dự phòng với điều trị nhiễm khuẩn đã xác lập (phẫu thuật nhiễm, bẩn)",
  "Đánh giá tiền sử dị ứng penicillin để chọn cột kháng sinh thay thế",
  "Kiểm tra cân nặng và liều KSDP theo bảng liều của QĐ 708/QĐ-BYT",
  "Dùng trong vòng 60 phút trước phẫu thuật, gần thời điểm rạch da (vancomycin, ciprofloxacin: truyền xong trước rạch da; clindamycin: truyền xong trước 10 - 20 phút)",
  "Đánh giá nhắc liều: theo khoảng nhắc trong bảng liều; phẫu thuật tim > 4 giờ; mất máu > 1500 ml (người lớn) hoặc > 25 ml/kg (trẻ em)",
  "Gentamycin: liều duy nhất, chỉnh 2 mg/kg nếu lọc máu hoặc ClCr < 20 ml/phút; không kê thêm liều sau phẫu thuật",
  "Không dùng kháng sinh dự phòng cho nhiễm khuẩn liên quan chăm sóc sau mổ",
  "Dùng KSDP đường tĩnh mạch, trong vòng 30 phút trước rạch da, không sớm hơn 1 giờ (QĐ 3671/QĐ-BYT)",
  "Không dùng KSDP quá 24 giờ sau phẫu thuật; mổ tim hở có thể tới 48 giờ (QĐ 3671/QĐ-BYT)",
  "Kiểm tra tính sẵn có và phê duyệt thuốc tại BV199"
];

export default function ProphylaxisPage() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("Tất cả");
  const [chosenId, setChosenId] = useState("");
  const [allergy, setAllergy] = useState("none");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [bloodLoss, setBloodLoss] = useState("");
  const [ageGroup, setAgeGroup] = useState<"adult" | "child">("adult");
  const [wound, setWound] = useState("");
  const [lowRenal, setLowRenal] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(
    Array(checklistLabels.length).fill(false)
  );
  const [tab, setTab] = useState<"guide" | "class" | "principles" | "dose" | "audit" | "intl">("guide");

  const filtered = useMemo(() =>
    KSDP_OPERATIONS.filter(x =>
      (group === "Tất cả" || x.group === group) &&
      norm(x.name + " " + x.group).includes(norm(search))
    ), [search, group]);

  const chosen = KSDP_OPERATIONS.find(x => x.id === chosenId);
  const completed = checks.filter(Boolean).length;
  const wt = Number(weight) > 0 ? Number(weight) : null;
  const hours = Number(duration) > 0 ? Number(duration) : null;
  const ebl = Number(bloodLoss) > 0 ? Number(bloodLoss) : null;

  function reset() {
    setSearch("");
    setGroup("Tất cả");
    setChosenId("");
    setAllergy("none");
    setWeight("");
    setDuration("");
    setBloodLoss("");
    setAgeGroup("adult");
    setWound("");
    setLowRenal(false);
    setChecks(Array(checklistLabels.length).fill(false));
  }

  function drugsIn(text: string) {
    const t = norm(text);
    return KSDP_DOSES.filter(d => t.includes(norm(d.drug)));
  }

  const isCardiac = chosen?.group === "Phẫu thuật tim";

  // Liều theo cân nặng: chỉ áp ngưỡng ghi trong bảng liều QĐ 708
  function weightDose(drug: string): string | null {
    if (!wt) return null;
    if (drug === "Cefazolin" || drug === "Cefotetan") return wt < 120 ? "2 g" : "3 g";
    if (drug === "Gentamycin") return `5 mg/kg × ${wt} kg = ${Math.round(wt * 5)} mg`;
    if (drug === "Vancomycin") {
      if (wt < 70) return "1 g";
      if (wt >= 71 && wt <= 99) return "1,25 g";
      if (wt > 100) return "1,5 g";
      return null; // 70–71 kg và 99–100 kg: văn bản không ghi
    }
    return null;
  }

  function redoseHours(drug: string): number | null {
    if (drug === "Cefazolin") return isCardiac ? 2 : 4;
    if (drug === "Cefotetan" || drug === "Clindamycin") return 6;
    if (drug === "Ciprofloxacin") return 8;
    if (drug === "Metronidazol" || drug === "Vancomycin") return 12;
    return null;
  }

  const bloodThreshold = ageGroup === "adult" ? 1500 : (wt ? wt * 25 : null);
  const bloodRedose = ebl !== null && bloodThreshold !== null && ebl > bloodThreshold;

  const opFns = chosen ? opFootnotes(chosen) : [];
  const notesIdx = opFns;
  const cardiacDue = isCardiac && hours !== null && hours > 4;
  const usesCeftriaxone = (op: KsdpOperation) => norm(op.primary + " " + op.alternative).includes("ceftriaxone");

  /** Phác đồ viết theo dạng kê đơn: VÀ -> +, HOẶC -> hoặc. */
  const rxText = (t: string) => t.replace(/\s+VÀ\s+/g, " + ").replace(/\s+HOẶC\s+/g, " hoặc ").replace(/\[/g, "(").replace(/\]/g, ")");

  const TIME_SHORT: Record<string, string> = {
    Cefazolin: "Tiêm TM 3–5 phút, ngay trước thủ thuật",
    Cefotetan: "Tiêm TM 3–5 phút, ngay trước thủ thuật",
    Ceftriaxone: "Tiêm TM 3–5 phút, ngay trước thủ thuật",
    Vancomycin: "Dùng trước 1 giờ, truyền xong trước khi rạch da",
    Ciprofloxacin: "Dùng trước 1 giờ, truyền xong trước khi rạch da",
    Clindamycin: "Truyền xong trước 10–20 phút",
    Gentamycin: "Liều duy nhất",
    Moxifloxacin: "Truyền trong 60 phút",
  };

  type DrugRow = { drug: string; dose: string; doseSrc?: string; timing: string; redose: string; due: boolean };
  function drugRows(text: string): DrugRow[] {
    const rows: DrugRow[] = drugsIn(text).map(d => {
      let dose = d.dose.join("; ");
      if (d.drug === "Gentamycin") dose = lowRenal ? `2 mg/kg (lọc máu / ClCr < 20)${wt ? ` = ${Math.round(wt * 2)} mg` : ""}` : `5 mg/kg${wt ? ` = ${Math.round(wt * 5)} mg` : ""}`;
      else { const w = weightDose(d.drug); if (w) dose = `${w} (${wt} kg)`; }
      let timing = TIME_SHORT[d.drug] ?? "";
      let doseSrc: string | undefined;
      // Mổ lấy thai: liều và thời điểm cefazolin theo phần dự phòng sản khoa của QĐ 708; kèm liều bảng chung để đối chiếu.
      if (chosen?.id === "ob1" && d.drug === "Cefazolin") {
        dose = `1 g; ≥ 80 kg: 2 g${wt ? ` → ${wt >= 80 ? "2 g" : "1 g"} (${wt} kg)` : ""}`;
        timing = "Tiêm TM trước rạch da 15–30 phút";
      }
      const rh = redoseHours(d.drug);
      const base = d.drug === "Gentamycin" ? "Không nhắc" : d.drug === "Cefazolin" ? (isCardiac ? "Mỗi 2 giờ (phẫu thuật tim)" : "Mỗi 4 giờ") : d.redose;
      const due = rh !== null && hours !== null && hours > rh;
      return { drug: d.drug, dose, doseSrc, timing, redose: due ? `${base} – mổ ${hours} giờ: nhắc liều` : base, due };
    });
    const t = norm(text);
    if (t.includes("ceftriaxone")) rows.push({
      drug: "Ceftriaxone",
      dose: ageGroup === "adult" ? "2 g, liều đơn trước phẫu thuật 30–90 phút" : `50–80 mg/kg, liều đơn${wt ? ` = ${Math.round(wt * 50)}–${Math.round(wt * 80)} mg` : ""}; sơ sinh 0–14 ngày: 20–50 mg/kg`,
      doseSrc: "Dược thư", timing: TIME_SHORT.Ceftriaxone, redose: "Liều đơn", due: false });
    if (t.includes("moxifloxacin")) rows.push({ drug: "Moxifloxacin", dose: "400 mg", timing: TIME_SHORT.Moxifloxacin, redose: "—", due: false });
    return rows;
  }

  const notes = opFns.filter(n => n !== 1 && n !== 3 && n !== 7 && n !== 8).map(n => KSDP_FOOTNOTES[n]);
  const sources = tab === "intl" ? [SOURCE_ASHP] : [
    SOURCE_708,
    ...(tab !== "dose" ? [SOURCE_3671] : []),
    ...(tab === "guide" && chosen && usesCeftriaxone(chosen) ? [SOURCE_DTQG] : []),
  ];
  const special: string[] = [];
  if (chosen?.id === "ob1") {
    special.push("Phát hiện và điều trị nhiễm khuẩn âm đạo (bacterial vaginosis, Chlamydia) trước mổ.");
    special.push("BMI > 35: dùng liều kháng sinh gấp đôi.");
  }
  if (chosen?.id === "g8") special.push("Đại trực tràng: rửa ruột và uống kháng sinh không hấp thụ qua đường ruột (nhóm metronidazol) vào ngày trước phẫu thuật và ngày phẫu thuật, ngoài liều tiêm tĩnh mạch.");
  if (chosen && ageGroup === "child" && !chosen.noProphylaxis) special.push("Trẻ em: liều theo cân nặng của cefazolin, cefotetan, clindamycin, vancomycin, ciprofloxacin, metronidazol – xem tab Quốc tế.");

  return (
    <main className="ksdp-page">
      <div className="ksdp-inner">
        <nav className="ksdp-breadcrumb">
          <Link href="/">Trang chủ</Link>
          <ChevronRight size={14}/>
          <Link href="/antibiotics">Kháng sinh & AMS</Link>
          <ChevronRight size={14}/>
          <b>Kháng sinh dự phòng</b>
        </nav>

        <header className="ksdp-heading">
          <div className="ksdp-symbol" aria-hidden="true">
            <ShieldCheck size={27}/>
          </div>
          <h1>Kháng sinh dự phòng phẫu thuật</h1>
          <button type="button" className="ksdp-secondary ksdp-reset" onClick={reset}>
            <RotateCcw size={15} aria-hidden="true" /> Đặt lại
          </button>
        </header>

        <div className="ksdp-tabs">
          <button className={tab === "guide" ? "active" : ""} onClick={() => setTab("guide")}>
            <Search size={16}/> Lựa chọn KSDP
          </button>
          <button className={tab === "class" ? "active" : ""} onClick={() => setTab("class")}>
            <ShieldCheck size={16}/> Phân loại phẫu thuật
          </button>
          <button className={tab === "principles" ? "active" : ""} onClick={() => setTab("principles")}>
            <ListChecks size={16}/> Nguyên tắc sử dụng
          </button>
          <button className={tab === "dose" ? "active" : ""} onClick={() => setTab("dose")}>
            <Syringe size={16}/> Liều & bảng đầy đủ
          </button>
          <button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")}>
            <ClipboardCheck size={16}/> Bảng kiểm KSDP
          </button>
          <button className={tab === "intl" ? "active" : ""} onClick={() => setTab("intl")}>
            <Globe2 size={16}/> Quốc tế (ASHP/IDSA 2013)
          </button>
        </div>

        {tab === "intl" && <KsdpIntl/>}

        {tab === "guide" && (
          <>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span>01</span>
                <h2>Chọn nhóm và loại phẫu thuật</h2>
              </div>

              <div className="ksdp-grid two">
                <label>
                  <span>Nhóm phẫu thuật</span>
                  <select value={group}
                    onChange={e => { setGroup(e.target.value); setChosenId(""); }}>
                    {groups.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label>
                  <span>Tìm tên phẫu thuật</span>
                  <div className="ksdp-search">
                    <Search size={17}/>
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Ví dụ: mổ đẻ, ruột thừa, thay khớp..."
                    />
                  </div>
                </label>
              </div>

              <label className="ksdp-select-op">
                <span>Loại phẫu thuật / thủ thuật</span>
                <select value={chosenId} onChange={e => setChosenId(e.target.value)}>
                  <option value="">-- Chọn loại phẫu thuật ({filtered.length} mục) --</option>
                  {filtered.map(x =>
                    <option key={x.id} value={x.id}>{x.group} – {x.name}</option>
                  )}
                </select>
              </label>
            </section>

            {chosen ? (
              <section className="ksdp-panel ksdp-plan">
                <div className="ksdp-surgery">
                  <b>{chosen.name}</b>
                  <small>{chosen.group}</small>
                </div>

                {chosen.noProphylaxis ? (
                  <div className="ksdp-none-box">
                    <b>Không khuyến cáo kháng sinh dự phòng</b>
                    {notes.length > 0 && <ul className="ksdp-notes">{notes.map((t, i) => <li key={i}><ColonText text={t}/></li>)}</ul>}
                  </div>
                ) : (
                  <>
                    <div className="ksdp-grid four">
                      <label>
                        <span>Cân nặng (kg)</span>
                        <input type="number" min="1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg"/>
                      </label>
                      <label>
                        <span>Đối tượng</span>
                        <select value={ageGroup} onChange={e => setAgeGroup(e.target.value as "adult" | "child")}>
                          <option value="adult">Người lớn</option>
                          <option value="child">Trẻ em</option>
                        </select>
                      </label>
                      <label>
                        <span>Thời gian mổ dự kiến (giờ)</span>
                        <input type="number" min="0" step=".5" value={duration} onChange={e => setDuration(e.target.value)} placeholder="giờ"/>
                      </label>
                      <label>
                        <span>Máu mất (ml)</span>
                        <input type="number" min="0" value={bloodLoss} onChange={e => setBloodLoss(e.target.value)} placeholder="ml"/>
                      </label>
                    </div>
                    <label className="ksdp-inline-check">
                      <input type="checkbox" checked={lowRenal} onChange={e => setLowRenal(e.target.checked)}/>
                      Lọc máu hoặc ClCr {"<"} 20 ml/phút
                    </label>

                    {([["first", "Lựa chọn đầu tay", chosen.primary], ["alt", "Dị ứng penicillin – thay thế", chosen.alternative]] as const).map(([k, title, text]) => (
                      <div key={k} className={`ksdp-rx ksdp-rx-${k}`}>
                        <div className="ksdp-rx-h">
                          <span>{title}</span>
                          <b>{rxText(text)}</b>
                        </div>
                        <div className="ksdp-table-wrap">
                          <table className="ksdp-table ksdp-rx-table">
                            <thead><tr><th>Thuốc</th><th>Liều</th><th>Thời điểm dùng</th><th>Nhắc liều trong mổ</th></tr></thead>
                            <tbody>
                              {drugRows(text).map(r => (
                                <tr key={r.drug}>
                                  <td data-label="Thuốc"><b>{r.drug}</b></td>
                                  <td data-label="Liều">{r.dose.split("; ").map(l => <div key={l}>{l}</div>)}{r.doseSrc && <span className="ksdp-tag">{r.doseSrc}</span>}</td>
                                  <td data-label="Thời điểm dùng">{r.timing}</td>
                                  <td data-label="Nhắc liều trong mổ" className={r.due ? "ksdp-due" : ""}>{r.redose}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}

                    <div className="ksdp-step">
                      <div className="ksdp-step-h">Thời điểm và thời gian dùng</div>
                      <div className="ksdp-lined">
                        <b>{chosen.id === "ob1" ? "Mổ lấy thai:" : "Liều đầu:"}</b>
                        <ul>
                          {chosen.id === "ob1" ? <>
                            <li>Trước khi rạch da hoặc sau khi kẹp dây rốn <span className="ksdp-tag">QĐ 708</span></li>
                            <li>Tiêm ngay sau khi kẹp dây rốn <span className="ksdp-tag">QĐ 3671</span></li>
                          </> : <>
                            <li>Trong vòng 60 phút trước phẫu thuật, gần thời điểm rạch da <span className="ksdp-tag">QĐ 708</span></li>
                            <li>Trong vòng 30 phút trước rạch da, không sớm hơn 1 giờ <span className="ksdp-tag">QĐ 3671</span></li>
                          </>}
                        </ul>
                      </div>
                      <div className="ksdp-lined">
                        <b>Nhắc liều:</b>
                        <ul>
                          <li>Theo cột nhắc liều</li>
                          <li>Phẫu thuật tim {">"} 4 giờ bổ sung 1 liều</li>
                          <li>Mất máu {">"} 1500 ml (người lớn) hoặc {">"} 25 ml/kg (trẻ em) bổ sung 1 liều sau khi bù dịch</li>
                          {cardiacDue && <li><b className="ksdp-due">Mổ tim {hours} giờ: bổ sung 1 liều</b></li>}
                          {bloodRedose && <li><b className="ksdp-due">Máu mất {ebl} ml: bổ sung 1 liều</b></li>}
                          {ageGroup === "child" && ebl !== null && !wt && <li><b>Nhập cân nặng để tính ngưỡng 25 ml/kg</b></li>}
                        </ul>
                      </div>
                      <div className="ksdp-lined">
                        <b>Ngừng:</b>
                        <ul>
                          <li>Không quá 24 giờ sau mổ</li>
                          {isCardiac && <li>Mổ tim hở có thể tới 48 giờ</li>}
                          {(chosen.id === "c7" || notesIdx.includes(3)) && <li>Phẫu thuật ngực hở dùng đến khi đóng ngực</li>}
                        </ul>
                      </div>
                    </div>

                    {(notes.length > 0 || special.length > 0) && (
                      <div className="ksdp-step">
                        <div className="ksdp-step-h">Lưu ý</div>
                        <ul className="ksdp-notes">
                          {special.map((t, i) => <li key={"s" + i}><ColonText text={t}/></li>)}
                          {notes.map((t, i) => <li key={i}><ColonText text={t}/></li>)}
                        </ul>
                      </div>
                    )}

                    {chosen.id === "u1" && (
                      <div className="ksdp-step">
                        <div className="ksdp-step-h">Sinh thiết qua trực tràng có kết quả soi trực tràng</div>
                        <div className="ksdp-table-wrap">
                          <table className="ksdp-table">
                            <thead><tr><th>Kết quả</th><th>Trước thủ thuật</th><th>Sau thủ thuật (uống)</th></tr></thead>
                            <tbody>{PROSTATE_BIOPSY.rows.map(r => <tr key={r.case}><td><b>{r.case}</b></td><td>{r.pre}</td><td>{r.post}</td></tr>)}</tbody>
                          </table>
                        </div>
                        <p className="ksdp-muted">Liều trước thủ thuật dùng cho mọi chức năng thận.</p>
                      </div>
                    )}
                  </>
                )}

              </section>
            ) : (
              <div className="ksdp-empty">
                <Pill size={44}/>
                <h3>Chọn phẫu thuật để xem phác đồ</h3>
                <p>Lựa chọn đầu tay, thay thế khi dị ứng penicillin, liều, thời điểm dùng và nhắc liều.</p>
              </div>
            )}
          </>
        )}

        {tab === "class" && (
          <>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><ShieldCheck size={16}/></span>
                <h2>Phân loại phẫu thuật</h2>
              </div>
              <div className="ksdp-table-wrap">
                <table className="ksdp-table">
                  <thead><tr><th>Loại</th><th>Định nghĩa</th><th>Nguy cơ NKVM</th></tr></thead>
                  <tbody>
                    {WOUND_CLASSES.map(w => <tr key={w.id}><td><b>{w.name}</b></td><td>{w.definition}</td><td>{w.risk}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><Info size={16}/></span>
                <h2>Phân loại một số phẫu thuật</h2>
              </div>
              <ul className="ksdp-notes">
                <li><ColonText text="Sạch – nhiễm: các phẫu thuật đường mật, ruột thừa, âm đạo và hầu họng được xếp vào loại vết mổ sạch nhiễm nếu không thấy có bằng chứng nhiễm khuẩn/không phạm phải lỗi vô khuẩn trong khi mổ."/></li>
                <li><ColonText text="Sạch: các phẫu thuật sau chấn thương kín."/></li>
                <li><ColonText text="Nhiễm: những phẫu thuật mở vào đường sinh dục tiết niệu, đường mật có nhiễm khuẩn; phẫu thuật tại những vị trí có nhiễm khuẩn cấp tính nhưng chưa hoá mủ."/></li>
              </ul>
            </section>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><ListChecks size={16}/></span>
                <h2>Chỉ định kháng sinh dự phòng theo loại phẫu thuật</h2>
              </div>
              <ul className="ksdp-notes">
                <li>Sử dụng KSDP với các phẫu thuật sạch và sạch – nhiễm. <span className="ksdp-tag">QĐ 3671</span></li>
                <li>KSDP được chỉ định cho tất cả các can thiệp phẫu thuật thuộc phẫu thuật sạch - nhiễm. <span className="ksdp-tag">QĐ 708</span></li>
                <li>Trong phẫu thuật sạch, liệu pháp kháng sinh dự phòng nên áp dụng với một số can thiệp ngoại khoa nặng, có thể ảnh hưởng tới sự sống còn và/hoặc chức năng sống (phẫu thuật chỉnh hình, phẫu thuật tim và mạch máu, phẫu thuật thần kinh, phẫu thuật nhãn khoa). <span className="ksdp-tag">QĐ 708</span></li>
                <li><ColonText text="Phẫu thuật nhiễm và phẫu thuật bẩn: kháng sinh đóng vai trò trị liệu. KSDP không ngăn ngừa nhiễm khuẩn mà ngăn ngừa nhiễm khuẩn đã xảy ra không phát triển."/> <span className="ksdp-tag">QĐ 708</span></li>
              </ul>
            </section>
          </>
        )}

        {tab === "principles" && (
          <>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><ListChecks size={16}/></span>
                <h2>Sử dụng kháng sinh dự phòng trong phẫu thuật – QĐ 3671/QĐ-BYT</h2>
              </div>
              {KSDP_3671.map(s => (
                <div key={s.title} className="ksdp-principle">
                  <h3>{s.title}</h3>
                  <ul>{s.items.map((t, i) => <li key={i}><ColonText text={t}/></li>)}</ul>
                </div>
              ))}
            </section>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><ListChecks size={16}/></span>
                <h2>Sử dụng kháng sinh dự phòng – QĐ 708/QĐ-BYT</h2>
              </div>
              {KSDP_PRINCIPLES.map(s => (
                <div key={s.title} className="ksdp-principle">
                  <h3>{s.title}</h3>
                  <ul>{s.items.map((t, i) => <li key={i}><ColonText text={t}/></li>)}</ul>
                </div>
              ))}
            </section>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><ListChecks size={16}/></span>
                <h2>Sử dụng kháng sinh trong dự phòng sản khoa – QĐ 708/QĐ-BYT</h2>
              </div>
              {KSDP_OBSTETRIC.map(s => (
                <div key={s.title} className="ksdp-principle">
                  <h3>{s.title}</h3>
                  <ul>{s.items.map((t, i) => <li key={i}><ColonText text={t}/></li>)}</ul>
                </div>
              ))}
            </section>
          </>
        )}

        {tab === "audit" && (
          <section className="ksdp-panel">
            <div className="ksdp-section-title">
              <span><ClipboardCheck size={16}/></span>
              <h2>Bảng kiểm sử dụng KSDP</h2>
            </div>

            <p className="ksdp-muted">
              Phục vụ rà soát đơn thuốc của bác sĩ và dược sĩ lâm sàng, theo QĐ 708/QĐ-BYT và QĐ 3671/QĐ-BYT. Bảng kiểm không tự kết luận hợp lý/không hợp lý.
            </p>

            {chosen && (
              <div className="ksdp-surgery">
                <b>{chosen.name}</b>
                <small>{chosen.group}</small>
              </div>
            )}

            <div className="ksdp-progress">
              <span>Đã đánh giá: {completed}/{checks.length}</span>
              <div><i style={{ width: `${completed / checks.length * 100}%` }}/></div>
            </div>

            <div className="ksdp-checks">
              {checklistLabels.map((label, i) =>
                <label key={i}>
                  <input type="checkbox" checked={checks[i]}
                    onChange={e => setChecks(old => old.map((v, j) => j === i ? e.target.checked : v))}/>
                  <span><ColonText text={label}/></span>
                  {checks[i] && <CheckCircle2 size={17}/>}
                </label>
              )}
            </div>

            <div className="ksdp-actions">
              <button className="ksdp-secondary" onClick={() => window.print()}>
                <Printer size={16}/> In bảng kiểm
              </button>
              <button className="ksdp-secondary"
                onClick={() => setChecks(Array(checklistLabels.length).fill(false))}>
                <RotateCcw size={16}/> Xóa đánh dấu
              </button>
            </div>
          </section>
        )}

        {tab === "dose" && (
          <>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><Syringe size={17}/></span>
                <h2>Liều kháng sinh trong dự phòng phẫu thuật</h2>
              </div>
              <div className="ksdp-table-wrap">
                <table className="ksdp-table">
                  <thead>
                    <tr><th>Thuốc</th><th>Liều thường dùng</th><th>Điều chỉnh liều trong thủ thuật</th></tr>
                  </thead>
                  <tbody>
                    {KSDP_DOSES.map(d =>
                      <tr key={d.drug}>
                        <td><b>{d.drug}</b></td>
                        <td>{d.dose.map(x => <div key={x}>{x}</div>)}</td>
                        <td>{d.redose}<Fn n={d.fn}/></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><BookOpen size={16}/></span>
                <h2>Lựa chọn kháng sinh dự phòng phẫu thuật</h2>
              </div>
              <div className="ksdp-table-wrap">
                <table className="ksdp-table">
                  <thead>
                    <tr>
                      <th>Các loại phẫu thuật – thủ thuật</th>
                      <th>Khuyến cáo dự phòng</th>
                      <th>Kháng sinh thay thế nếu dị ứng penicillin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.slice(1).map(g => (
                      <Fragment key={g}>
                        <tr className="ksdp-group-row"><td colSpan={3}>{g}</td></tr>
                        {KSDP_OPERATIONS.filter(o => o.group === g).map(o => (
                          <tr key={o.id}>
                            <td>{o.name}{opFootnotes(o).filter(n => n !== 2).map(n => <div key={n} className="ksdp-row-note"><ColonText text={KSDP_FOOTNOTES[n]}/></div>)}</td>
                            {o.noProphylaxis
                              ? <td colSpan={2} className="ksdp-none">{o.primary}</td>
                              : <>
                                  <td>{rxText(o.primary)}</td>
                                  <td>{rxText(o.alternative)}</td>
                                </>}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><BookOpen size={16}/></span>
                <h2>Dự phòng trong sinh thiết tuyến tiền liệt dựa vào kết quả soi trực tràng</h2>
              </div>
              <div className="ksdp-table-wrap">
                <table className="ksdp-table">
                  <thead>
                    <tr>
                      <th>{PROSTATE_BIOPSY.headers.case}</th>
                      <th>{PROSTATE_BIOPSY.headers.pre}<Fn n={PROSTATE_BIOPSY.headerFn.pre}/></th>
                      <th>{PROSTATE_BIOPSY.headers.post}<Fn n={PROSTATE_BIOPSY.headerFn.post}/></th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROSTATE_BIOPSY.rows.map(r =>
                      <tr key={r.case}><td><b>{r.case}</b></td><td>{r.pre}</td><td>{r.post}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <ul className="ksdp-notes">
                <li><ColonText text={`Liều trước thủ thuật: ${KSDP_FOOTNOTES[7].toLowerCase()}`}/></li>
                <li><ColonText text={KSDP_FOOTNOTES[8]}/></li>
              </ul>
            </section>

            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><Info size={16}/></span>
                <h2>Lưu ý chung</h2>
              </div>
              <ul className="ksdp-notes">
                <li><ColonText text={KSDP_FOOTNOTES[2]}/></li>
                <li><ColonText text={KSDP_FOOTNOTES[4]}/></li>
              </ul>
            </section>
          </>
        )}

        <section className="ksdp-sources" aria-labelledby="ksdp-sources-title">
          <h2 id="ksdp-sources-title"><BookOpen size={16} aria-hidden="true" /> Nguồn tham khảo</h2>
          <ul className="ksdp-source-list">
            {sources.map(({ label, title, href }) => {
              const citation = (
                <span className="ksdp-source-copy">
                  <span className="ksdp-source-label">{label}</span>
                  <strong>{title}</strong>
                </span>
              );
              return (
                <li key={title}>
                  {href ? (
                    <a className="ksdp-source-item" href={href} target="_blank" rel="noreferrer">
                      {citation}
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ) : <div className="ksdp-source-item">{citation}</div>}
                </li>
              );
            })}
          </ul>
          <p>Áp dụng cùng quy trình KSDP đã phê duyệt của bệnh viện.</p>
        </section>
      </div>

      <style>{`
        .ksdp-page {
          background:var(--background);
          color:var(--text);
          padding:20px 24px 14px;
        }
        .ksdp-inner {max-width:1320px;margin:auto}
        .ksdp-breadcrumb {
          display:flex;align-items:center;flex-wrap:wrap;
          gap:9px;font-size:12px;color:var(--text-muted);
          margin-bottom:14px;
        }
        .ksdp-breadcrumb a {
          color:var(--primary-dark);text-decoration:none;
        }
        .ksdp-breadcrumb b {color:var(--text)}
        .ksdp-heading {
          display:flex;gap:12px;align-items:center;
          margin-bottom:16px;
        }
        .ksdp-symbol {
          display:grid;place-items:center;
          width:44px;height:44px;flex:none;
          background:var(--primary-soft);color:var(--primary-dark);
          border-radius:12px;
        }
        .ksdp-heading h1 {
          flex:1;min-width:0;font-size:27px;line-height:1.25;
          margin:0;font-weight:800;
        }
        .ksdp-tabs {
          display:flex;gap:8px;flex-wrap:wrap;
          margin-bottom:16px;
        }
        .ksdp-tabs button,.ksdp-secondary {
          border:1px solid var(--border);background:white;
          color:var(--text-secondary);padding:9px 13px;
          border-radius:9px;font-weight:700;
          font-size:13px;cursor:pointer;
          display:inline-flex;align-items:center;gap:8px;
        }
        .ksdp-tabs .active {
          background:var(--primary-dark);color:white;
          border-color:var(--primary-dark);
        }
        .ksdp-reset {flex:none;white-space:nowrap}
        .ksdp-reset:hover {color:var(--primary-dark);background:var(--primary-soft)}
        .ksdp-panel {
          border:1px solid var(--border);
          background:white;border-radius:14px;
          padding:22px;margin-bottom:16px;
          box-shadow:0 2px 8px #102d4406;
        }
        .ksdp-section-title {
          display:flex;align-items:center;gap:10px;
          margin-bottom:18px;
        }
        .ksdp-section-title>span {
          background:var(--primary-soft);color:var(--primary-dark);
          border-radius:8px;padding:8px;
          font-size:12px;font-weight:800;
        }
        .ksdp-section-title h2 {
          margin:0;font-size:17px;
        }
        .ksdp-grid {display:grid;gap:14px}
        .ksdp-grid.two {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
        .ksdp-grid.three {
          grid-template-columns:repeat(3,minmax(0,1fr));
        }
        .ksdp-page label>span:first-child {
          display:block;font-weight:700;
          font-size:12px;margin-bottom:8px;
        }
        .ksdp-page input:not([type=checkbox]),
        .ksdp-page select {
          width:100%;min-height:45px;
          box-sizing:border-box;
          border:1px solid var(--border-dark);
          border-radius:9px;background:white;
          color:var(--text);padding:0 12px;
          font-size:13px;
        }
        .ksdp-search {
          border:1px solid var(--border-dark);
          border-radius:9px;display:flex;
          align-items:center;padding-left:12px;
          color:var(--text-muted);
        }
        .ksdp-search input {
          border:0!important;outline:0;
        }
        .ksdp-select-op {
          display:block;margin-top:16px;
        }
        .ksdp-surgery {
          padding:14px;background:var(--surface-soft);
          border-radius:10px;margin-bottom:15px;
        }
        .ksdp-surgery b {
          display:block;font-size:15px;
        }
        .ksdp-surgery small {
          color:var(--text-muted);display:block;margin-top:6px;
        }
        .ksdp-choice {
          border:1px solid var(--border);
          border-radius:11px;padding:17px;
          background:var(--surface-soft);line-height:1.65;
        }
        .ksdp-choice-label {
          font-size:12px;color:var(--text-muted);
          margin-bottom:9px;
        }
        .ksdp-choice strong {
          font-size:17px;color:var(--primary-dark);
        }
        .ksdp-note,.ksdp-warning {
          display:flex;align-items:flex-start;gap:10px;
          margin-top:15px;padding:13px 14px;
          background:var(--primary-soft-2);border:1px solid var(--border);
          border-radius:9px;font-size:12px;
          line-height:1.75;color:var(--text-secondary);
        }
        .ksdp-warning {
          background:#fff8ed;border-color:#f6dfb4;
          color:#82501d;
        }
        .ksdp-note svg,.ksdp-warning svg {flex:none}
        .ksdp-link {
          display:inline-flex;align-items:center;gap:8px;
          margin-top:16px;color:var(--primary-dark);font-size:13px;
          text-decoration:none;font-weight:700;
        }
        .ksdp-subheading {
          font-size:15px;margin:21px 0 12px;
        }
        .ksdp-dose-list {
          display:grid;gap:10px;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        }
        .ksdp-dose-card {
          border:1px solid var(--border);
          border-radius:9px;padding:13px;font-size:12px;
          line-height:1.75;
        }
        .ksdp-dose-card b {
          color:var(--primary-dark);display:block;
          font-size:15px;margin-bottom:7px;
        }
        .ksdp-muted {
          color:var(--text-muted);font-size:13px;line-height:1.75;
        }
        .ksdp-empty {
          border:1px solid var(--border);
          border-radius:13px;background:var(--primary-soft-2);
          display:grid;grid-template-columns:auto minmax(0,1fr);
          column-gap:12px;row-gap:2px;align-items:center;
          padding:14px 16px;color:var(--primary-dark);
        }
        .ksdp-empty > svg {grid-row:span 2;width:26px;height:26px}
        .ksdp-empty h3 {
          color:var(--text);margin:0;font-size:14px;font-weight:700;
        }
        .ksdp-empty p {
          margin:0;font-size:13px;line-height:1.5;color:var(--text-muted);
        }
        .ksdp-progress {
          font-size:13px;font-weight:700;margin:19px 0;
        }
        .ksdp-progress>div {
          height:8px;border-radius:10px;
          background:var(--surface-muted);margin-top:9px;overflow:hidden;
        }
        .ksdp-progress i {
          display:block;height:100%;
          background:var(--primary-dark);
        }
        .ksdp-checks {display:grid;gap:10px}
        .ksdp-checks label {
          display:flex;align-items:center;gap:12px;
          border:1px solid var(--border);border-radius:9px;
          padding:12px;font-size:13px;
          cursor:pointer;
        }
        .ksdp-checks label>span {
          flex:1;margin:0!important;
          font-weight:500!important;
        }
        .ksdp-checks input {width:17px;height:17px}
        .ksdp-checks svg {color:var(--primary-dark)}
        .ksdp-actions {
          display:flex;gap:10px;flex-wrap:wrap;
          margin-top:18px;
        }
        .ksdp-table-wrap {overflow-x:auto}
        .ksdp-table {
          width:100%;border-collapse:collapse;
          font-size:13px;line-height:1.7;
        }
        .ksdp-table th {
          background:var(--surface-muted);text-align:left;
          padding:12px;
        }
        .ksdp-table td {
          padding:12px;border-bottom:1px solid var(--border);
          vertical-align:top;
        }
        .ksdp-fn {font-size:10px;margin-left:1px;color:var(--primary-dark);font-weight:700}
        .ksdp-fn-text {display:block;color:var(--text-secondary);margin-top:4px}
        .ksdp-choice.on {border-color:var(--primary-dark);box-shadow:0 0 0 2px var(--primary-soft)}
        .ksdp-calc {background:var(--primary-soft-2);border-radius:6px;padding:4px 8px;margin:3px 0}
        .ksdp-calc.warn {background:#fff4e5;color:#8a4b00;font-weight:700}
        .ksdp-principle {margin-bottom:16px}
        .ksdp-principle h3 {font-size:14px;margin:0 0 6px;color:var(--navy-dark)}
        .ksdp-principle h3 a {font-size:11px;font-weight:400;color:var(--primary-dark);margin-left:6px}
        .ksdp-principle ul {margin:0;padding-left:20px;line-height:1.6;font-size:13.5px}
        .ksdp-group-row td {background:var(--surface-muted);font-weight:800;color:var(--navy-dark)}
        .ksdp-none {color:#8a4b00;font-style:italic}
        .ksdp-footnotes {margin:0;padding-left:22px;line-height:1.6;font-size:13.5px}
        .ksdp-table a {color:var(--primary-dark)}
        .ksdp-step {border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:12px;display:grid;gap:8px}
        .ksdp-step-h {font-weight:800;font-size:14.5px;color:var(--navy-dark);display:flex;align-items:center;gap:8px}
        .ksdp-step-h span {display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--primary-dark);color:#fff;font-size:12.5px}
        .ksdp-src {font-size:12px;color:var(--text-secondary);margin:0}
        .ksdp-due {color:#b45309}
        .ksdp-grid.four {grid-template-columns:repeat(4,minmax(0,1fr))}
        .ksdp-rx {border:1px solid var(--border);border-radius:12px;margin:12px 0;overflow:hidden}
        .ksdp-rx-h {display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;padding:10px 14px;background:var(--primary-soft)}
        .ksdp-rx-alt .ksdp-rx-h {background:#fff6ea}
        .ksdp-rx-h span {font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.02em;color:var(--primary-dark)}
        .ksdp-rx-alt .ksdp-rx-h span {color:#9a3412}
        .ksdp-rx-h b {font-size:15.5px;color:var(--text)}
        .ksdp-rx .ksdp-table-wrap {margin:0}
        .ksdp-rx-table td, .ksdp-rx-table th {font-size:13.5px}
        .ksdp-tag {display:inline-block;margin-left:6px;font-size:11px;font-weight:700;color:var(--text-secondary);border:1px solid var(--border);border-radius:6px;padding:0 5px}
        .ksdp-none-box {border:1px solid #f1c48b;background:#fff8ee;border-radius:12px;padding:12px 14px;margin:12px 0}
        .ksdp-none-box b {color:#9a3412;font-size:15px}
        @media(max-width:850px){ .ksdp-grid.four {grid-template-columns:repeat(2,minmax(0,1fr))} }
        .ksdp-sources {
          margin-top:12px;padding:12px 14px;
          background:var(--surface);border:1px solid var(--border);
          border-radius:var(--radius-md);
        }
        .ksdp-sources h2 {
          display:flex;align-items:center;gap:7px;
          margin:0 0 8px;color:var(--text);font-size:14px;font-weight:700;
        }
        .ksdp-sources h2 svg,.ksdp-source-item svg {flex:none;color:var(--primary-dark)}
        .ksdp-source-list {
          display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));
          gap:6px;margin:0;padding:0;list-style:none;
        }
        .ksdp-source-item {
          display:flex;align-items:center;justify-content:space-between;gap:8px;
          height:100%;padding:7px 9px;border:1px solid var(--border);
          border-radius:var(--radius-sm);background:var(--surface-soft);color:var(--text);
          font-size:13px;line-height:1.4;text-decoration:none;
        }
        .ksdp-source-copy {display:grid;min-width:0;gap:2px;overflow-wrap:anywhere}
        .ksdp-source-label {color:var(--primary-dark);font-size:11px;font-weight:700}
        .ksdp-sources a:hover {background:var(--primary-soft);border-color:var(--primary-dark)}
        .ksdp-sources a:focus-visible,.ksdp-reset:focus-visible {
          outline:2px solid var(--primary-dark);outline-offset:2px;
        }
        .ksdp-sources p {margin:8px 0 0;color:var(--text-secondary);font-size:12px;line-height:1.45}
        .ksdp-colon {display:grid;gap:2px}
        .ksdp-colon > span {display:block}
        .ksdp-lined {display:grid;gap:3px;font-size:13.5px;line-height:1.6}
        .ksdp-lined ul {margin:0;padding-left:18px}
        .ksdp-dose-card strong {display:block}
        .ksdp-row-note {font-size:12px;color:var(--text-secondary);margin-top:3px}
        .ksdp-subtabs {display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
        .ksdp-subtabs button {border:1px solid var(--border);background:#fff;color:var(--text-secondary);padding:8px 12px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer}
        .ksdp-subtabs .active {background:var(--primary-soft);border-color:var(--primary-dark);color:var(--primary-dark)}
        .ksdp-inline-check {display:flex;align-items:center;gap:8px;margin:12px 0;font-size:13.5px;font-weight:600}
        .ksdp-notes {margin:0;padding-left:18px;line-height:1.6;font-size:13.5px}
        .ksdp-notes a {color:var(--primary-dark);font-size:11.5px}
        @media(max-width:850px) {
          .ksdp-grid.two,.ksdp-grid.three {
            grid-template-columns:1fr;
          }
        }
        @media(max-width:600px) {
          .ksdp-rx-table, .ksdp-rx-table tbody, .ksdp-rx-table tr, .ksdp-rx-table td {display:block;width:auto}
          .ksdp-rx-table thead {display:none}
          .ksdp-rx-table tr {padding:8px 12px;border-bottom:1px solid var(--border)}
          .ksdp-rx-table tr:last-child {border-bottom:0}
          .ksdp-rx-table td {display:grid;grid-template-columns:104px minmax(0,1fr);gap:8px;padding:3px 0;border:0}
          .ksdp-rx-table td::before {content:attr(data-label);font-size:12px;font-weight:700;color:var(--text-secondary)}
          .ksdp-page {padding:12px}
          .ksdp-heading {gap:8px}
          .ksdp-heading h1 {font-size:20px}
          .ksdp-symbol {width:36px;height:36px}
          .ksdp-symbol svg {width:22px;height:22px}
          .ksdp-reset {padding:8px}
          .ksdp-panel {padding:14px}
        }
        @media print {
          .ksdp-tabs,.ksdp-breadcrumb,
          .ksdp-actions,.ksdp-reset {
            display:none!important;
          }
          .ksdp-page {background:white;padding:0}
          .ksdp-panel {box-shadow:none}
        }
      `}</style>
    </main>
  );
}
