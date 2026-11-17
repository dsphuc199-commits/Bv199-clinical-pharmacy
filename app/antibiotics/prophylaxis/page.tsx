"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, Pill, BookOpen, ClipboardCheck,
  ChevronRight, Info, AlertTriangle,
  CheckCircle2, RotateCcw, Printer,
  Clock3, Syringe, ShieldCheck, ListChecks, Globe2
} from "lucide-react";
import {
  KSDP_DOSES, KSDP_OPERATIONS, KSDP_FOOTNOTES, PROSTATE_BIOPSY,
  KSDP_PRINCIPLES, KSDP_OBSTETRIC, CESAREAN_CEFAZOLIN, BYT708_URL,
  type KsdpOperation
} from "@/data/antibiotics/prophylaxis-byt708";
import KsdpIntl from "@/components/antibiotics/prophylaxis/KsdpIntl";
import { BYT3671, WOUND_CLASSES, KSDP_3671, WOUND_CLASS_BY_OP } from "@/data/antibiotics/prophylaxis-byt3671";

const SRC708 = "QĐ 708/QĐ-BYT – Hướng dẫn sử dụng kháng sinh (2015)";
const CLS_TO_WOUND: Record<string, string> = { "sach": "Sạch", "sach-nhiem": "Sạch - nhiễm" };

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
  return <sup className="ksdp-fn">{n.join(",")}</sup>;
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
    setChecks(Array(checklistLabels.length).fill(false));
  }

  function drugsIn(text: string) {
    const t = norm(text);
    return KSDP_DOSES.filter(d => t.includes(norm(d.drug)));
  }

  const regimen = chosen
    ? (allergy === "none" ? chosen.primary : chosen.alternative)
    : "";
  const selectedDoses = drugsIn(regimen);
  const extraTiming = ["Ceftriaxone"].filter(n => norm(regimen).includes(norm(n)));
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
  const opClass = chosen ? WOUND_CLASS_BY_OP[chosen.id] : undefined;

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

        <div className="ksdp-heading">
          <div className="ksdp-symbol">
            <ShieldCheck size={27}/>
          </div>
          <div>
            <h1>Kháng sinh dự phòng phẫu thuật</h1>
            <p>Bộ Y tế: QĐ 708/QĐ-BYT (2015), QĐ 3671/QĐ-BYT (2012) · Quốc tế: ASHP/IDSA/SIS/SHEA (2013)</p>
          </div>
        </div>

        <div className="ksdp-tabs">
          <button className={tab === "guide" ? "active" : ""} onClick={() => setTab("guide")}>
            <Search size={16}/> Lựa chọn KSDP
          </button>
          <button className={tab === "class" ? "active" : ""} onClick={() => setTab("class")}>
            <ShieldCheck size={16}/> Phẫu thuật sạch / sạch – nhiễm
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
                <select value={chosenId} onChange={e => { const id = e.target.value; setChosenId(id); setWound(CLS_TO_WOUND[WOUND_CLASS_BY_OP[id]?.cls ?? ""] ?? ""); }}>
                  <option value="">-- Chọn loại phẫu thuật ({filtered.length} mục) --</option>
                  {filtered.map(x =>
                    <option key={x.id} value={x.id}>{x.group} – {x.name} [{WOUND_CLASS_BY_OP[x.id]?.label}]</option>
                  )}
                </select>
              </label>
            </section>

            {chosen ? (
              <>
                <section className="ksdp-panel">
                  <div className="ksdp-section-title">
                    <span>02</span>
                    <h2>Lựa chọn kháng sinh dự phòng</h2>
                  </div>
                  <div className="ksdp-surgery">
                    <b>{chosen.name}<Fn n={chosen.nameFn}/></b>
                    <small>{chosen.group}</small>
                  </div>

                  {opClass && (
                    <div className={`ksdp-class ksdp-class-${opClass.cls}`}>
                      <div><span className="ksdp-class-badge">{opClass.label}</span></div>
                      <div className="ksdp-class-why">{opClass.reason}</div>
                      <div className="ksdp-class-src">Phân loại theo định nghĩa của QĐ 3671/QĐ-BYT – Hướng dẫn phòng ngừa nhiễm khuẩn vết mổ.</div>
                      {chosen.noProphylaxis && opClass.cls !== "sach" && (
                        <div className="ksdp-class-why"><b>Lưu ý:</b> bảng lựa chọn KSDP của QĐ 708/QĐ-BYT ghi "Không khuyến cáo dự phòng" cho dòng này.</div>
                      )}
                    </div>
                  )}

                  <div className="ksdp-grid two">
                    <div className={`ksdp-choice${allergy === "none" ? " on" : ""}`}>
                      <div className="ksdp-choice-label">Khuyến cáo dự phòng</div>
                      <strong>{chosen.primary}<Fn n={chosen.primaryFn}/></strong>
                    </div>
                    <div className={`ksdp-choice${allergy !== "none" ? " on" : ""}`}>
                      <div className="ksdp-choice-label">Kháng sinh thay thế nếu dị ứng penicillin</div>
                      <strong>{chosen.alternative}<Fn n={chosen.altFn}/></strong>
                    </div>
                  </div>

                  {opFns.length > 0 && (
                    <div className="ksdp-note">
                      <Info size={17}/>
                      <div>
                        {opFns.map(n =>
                          <div key={n}><sup>{n}</sup> {KSDP_FOOTNOTES[n]}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {chosen.id === "u1" && (
                    <button className="ksdp-secondary" onClick={() => setTab("dose")}>
                      Xem bảng dự phòng sinh thiết tuyến tiền liệt theo kết quả soi trực tràng
                      <ChevronRight size={16}/>
                    </button>
                  )}

                  {chosen.id === "ob1" && (
                    <div className="ksdp-note">
                      <Info size={17}/>
                      <div>
                        <b>QĐ 708/QĐ-BYT – Dự phòng sản khoa:</b>{" "}
                        {CESAREAN_CEFAZOLIN.text} Cần phát hiện và điều trị các nhiễm khuẩn âm đạo như
                        bacterial vaginosis, Chlamydia trước. Bảng liều KSDP của QĐ 708 ghi cefazolin {"< 120 kg: 2 g; ≥ 120 kg: 3 g"}.
                        <br/><b>Thời điểm:</b> QĐ 708/QĐ-BYT – KSDP có thể dùng trước khi rạch da hoặc sau khi kẹp dây rốn;
                        QĐ 3671/QĐ-BYT – liều KSDP cần được tiêm ngay sau khi kẹp dây rốn.
                      </div>
                    </div>
                  )}

                  <a className="ksdp-link" href={BYT708_URL} target="_blank" rel="noreferrer">
                    <BookOpen size={16}/>
                    Nguồn: {SRC708}
                  </a>
                </section>

                {!chosen.noProphylaxis && (
                  <section className="ksdp-panel">
                    <div className="ksdp-section-title">
                      <span>03</span>
                      <h2>Liều, thời điểm dùng và nhắc liều</h2>
                    </div>

                    <div className="ksdp-grid three">
                      <label>
                        <span>Dị ứng penicillin</span>
                        <select value={allergy} onChange={e => setAllergy(e.target.value)}>
                          <option value="none">Không</option>
                          <option value="pen">Có</option>
                        </select>
                      </label>
                      <label>
                        <span>Đối tượng</span>
                        <select value={ageGroup} onChange={e => setAgeGroup(e.target.value as "adult" | "child")}>
                          <option value="adult">Người lớn</option>
                          <option value="child">Trẻ em</option>
                        </select>
                      </label>
                      <label>
                        <span>Cân nặng (kg)</span>
                        <input type="number" min="1" value={weight}
                          onChange={e => setWeight(e.target.value)} placeholder="Ví dụ: 70"/>
                      </label>
                      <label>
                        <span>Phân loại phẫu thuật</span>
                        <select value={wound} onChange={e => setWound(e.target.value)}>
                          <option value="">Chưa chọn</option>
                          <option value="Sạch">Sạch</option>
                          <option value="Sạch - nhiễm">Sạch - nhiễm</option>
                          <option value="Nhiễm">Nhiễm</option>
                          <option value="Bẩn">Bẩn</option>
                        </select>
                      </label>
                      <label>
                        <span>Thời gian mổ dự kiến (giờ)</span>
                        <input type="number" min="0" step=".5" value={duration}
                          onChange={e => setDuration(e.target.value)} placeholder="Ví dụ: 3.5"/>
                      </label>
                      <label>
                        <span>Lượng máu mất (ml)</span>
                        <input type="number" min="0" value={bloodLoss}
                          onChange={e => setBloodLoss(e.target.value)} placeholder="Nếu có"/>
                      </label>
                    </div>

                    {wound && (
                      <div className={wound === "Nhiễm" || wound === "Bẩn" ? "ksdp-warning" : "ksdp-note"}>
                        {wound === "Nhiễm" || wound === "Bẩn" ? <AlertTriangle size={18}/> : <Info size={17}/>}
                        <span>{WOUND_TEXT[wound]}</span>
                      </div>
                    )}

                    <h3 className="ksdp-subheading">
                      {allergy === "none" ? "Khuyến cáo dự phòng" : "Kháng sinh thay thế nếu dị ứng penicillin"}: {regimen}
                    </h3>

                    {selectedDoses.length || extraTiming.length ? (
                      <div className="ksdp-dose-list">
                        {selectedDoses.map(d => {
                          const wd = weightDose(d.drug);
                          const rh = redoseHours(d.drug);
                          const due = rh !== null && hours !== null && hours > rh;
                          return (
                            <div key={d.drug} className="ksdp-dose-card">
                              <b>{d.drug}</b>
                              <div><strong>Liều (QĐ 708):</strong> {d.dose.join("; ")}</div>
                              {wd && <div className="ksdp-calc"><strong>Theo cân nặng {wt} kg:</strong> {wd}</div>}
                              {d.drug === "Gentamycin" && (
                                <div><strong>Lọc máu hoặc ClCr {"<"} 20 ml/phút:</strong> 2 mg/kg{wt ? ` = ${Math.round(wt * 2)} mg` : ""}</div>
                              )}
                              <div><strong>Điều chỉnh liều trong thủ thuật:</strong> {d.redose}<Fn n={d.fn}/></div>
                              {TIMING[d.drug] && <div><strong>Thời điểm:</strong> {TIMING[d.drug]}</div>}
                              {due && (
                                <div className="ksdp-calc warn">
                                  Thời gian mổ {hours} giờ {">"} khoảng nhắc {rh} giờ{d.drug === "Cefazolin" && isCardiac ? " (phẫu thuật tim)" : ""}: cần nhắc liều.
                                </div>
                              )}
                              {d.fn?.map(n => <small key={n} className="ksdp-fn-text"><sup>{n}</sup> {KSDP_FOOTNOTES[n]}</small>)}
                            </div>
                          );
                        })}
                        {extraTiming.map(n => (
                          <div key={n} className="ksdp-dose-card">
                            <b>{n}</b>
                            <div><strong>Thời điểm:</strong> {TIMING[n]}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}


                    <div className="ksdp-warning">
                      <Clock3 size={18}/>
                      <div>
                        Dùng trong vòng 60 phút trước khi tiến hành phẫu thuật và gần thời điểm rạch da.
                        {isCardiac && " Phẫu thuật tim kéo dài hơn 4 giờ: bổ sung thêm một liều kháng sinh."}
                        {isCardiac && hours !== null && hours > 4 && <b> Thời gian mổ dự kiến {hours} giờ: cần bổ sung một liều.</b>}
                        {" "}Mất máu trên 1500 ml ở người lớn, trên 25 ml/kg ở trẻ em: bổ sung liều KSDP sau khi bổ sung dịch thay thế.
                        {bloodRedose && <b> Lượng máu mất {ebl} ml vượt ngưỡng: cần bổ sung liều.</b>}
                        {ageGroup === "child" && ebl !== null && !wt && <b> Nhập cân nặng để tính ngưỡng 25 ml/kg.</b>}
                        <i> (QĐ 708/QĐ-BYT)</i>
                        <br/>QĐ 3671/QĐ-BYT: tiêm KSDP trong vòng 30 phút trước rạch da, không sớm hơn 1 giờ; với hầu hết các phẫu thuật chỉ nên sử dụng 1 liều; có thể cân nhắc thêm 1 liều khi phẫu thuật kéo dài {">"} 4 giờ, mất máu nhiều hoặc người bệnh béo phì; không dùng KSDP kéo dài quá 24 giờ sau phẫu thuật (mổ tim hở có thể tới 48 giờ).
                      </div>
                    </div>

                    <button className="ksdp-secondary" onClick={() => setTab("audit")}>
                      Mở bảng kiểm sử dụng KSDP
                      <ChevronRight size={16}/>
                    </button>
                  </section>
                )}
              </>
            ) : (
              <div className="ksdp-empty">
                <Pill size={44}/>
                <h3>Chọn phẫu thuật để xem khuyến cáo</h3>
                <p>
                  {KSDP_OPERATIONS.length} loại phẫu thuật, thủ thuật theo QĐ 708/QĐ-BYT, có phân loại sạch / sạch – nhiễm
                  theo QĐ 3671/QĐ-BYT, kèm liều và nguyên tắc sử dụng.
                </p>
              </div>
            )}
          </>
        )}

        {tab === "class" && (
          <>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><ShieldCheck size={16}/></span>
                <h2>Phân loại phẫu thuật – QĐ 3671/QĐ-BYT</h2>
              </div>
              <div className="ksdp-table-wrap">
                <table className="ksdp-table">
                  <thead><tr><th>Loại</th><th>Định nghĩa</th><th>Nguy cơ NKVM</th></tr></thead>
                  <tbody>
                    {WOUND_CLASSES.map(w => <tr key={w.id}><td><b>{w.name}</b></td><td>{w.definition}</td><td>{w.risk}</td></tr>)}
                  </tbody>
                </table>
              </div>
              <div className="ksdp-note" style={{ marginTop: 12 }}>
                <Info size={17}/>
                <div>
                  <b>Chỉ định KSDP theo loại phẫu thuật.</b> QĐ 3671/QĐ-BYT: sử dụng KSDP với các phẫu thuật sạch và sạch – nhiễm.
                  QĐ 708/QĐ-BYT: KSDP được chỉ định cho tất cả các can thiệp phẫu thuật thuộc phẫu thuật sạch - nhiễm; trong phẫu thuật sạch,
                  nên áp dụng với một số can thiệp ngoại khoa nặng (phẫu thuật chỉnh hình, tim và mạch máu, thần kinh, nhãn khoa).
                  Phẫu thuật nhiễm và bẩn: kháng sinh đóng vai trò trị liệu.
                </div>
              </div>
            </section>
            {(["sach-nhiem", "sach", "tuy"] as const).map(c => {
              const list = KSDP_OPERATIONS.filter(o => WOUND_CLASS_BY_OP[o.id]?.cls === c);
              const title = c === "sach" ? "Phẫu thuật sạch" : c === "sach-nhiem" ? "Phẫu thuật sạch – nhiễm" : "Phụ thuộc diễn biến phẫu thuật";
              return (
                <section key={c} className="ksdp-panel">
                  <div className="ksdp-section-title">
                    <span className={`ksdp-class-dot ksdp-class-${c}`}>{list.length}</span>
                    <h2>{title}</h2>
                  </div>
                  <div className="ksdp-table-wrap">
                    <table className="ksdp-table">
                      <thead><tr><th>Phẫu thuật / thủ thuật</th><th>Phân loại và lý do</th><th>KSDP (QĐ 708/QĐ-BYT)</th></tr></thead>
                      <tbody>
                        {list.map(o => (
                          <tr key={o.id}>
                            <td><b>{o.name}</b><div className="ksdp-muted">{o.group}</div></td>
                            <td>{c === "tuy" && <b>{WOUND_CLASS_BY_OP[o.id].label}. </b>}{WOUND_CLASS_BY_OP[o.id].reason}</td>
                            <td className={o.noProphylaxis ? "ksdp-none" : ""}>{o.noProphylaxis ? o.primary : <>{o.primary}<div className="ksdp-muted">Dị ứng penicillin: {o.alternative}</div></>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
            <p className="ksdp-muted">
              Phân loại từng phẫu thuật được xác định theo định nghĩa sạch / sạch – nhiễm của QĐ 3671/QĐ-BYT
              (mở hay không mở vào đường hô hấp, tiêu hóa, sinh dục, tiết niệu; phẫu thuật đường mật, ruột thừa, âm đạo, hầu họng
              xếp sạch – nhiễm). Lựa chọn kháng sinh theo QĐ 708/QĐ-BYT.
            </p>
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
                  <ul>{s.items.map((t, i) => <li key={i}>{t}</li>)}</ul>
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
                  <ul>{s.items.map((t, i) => <li key={i}>{t}</li>)}</ul>
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
                  <ul>{s.items.map((t, i) => <li key={i}>{t}</li>)}</ul>
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
                  <span>{label}</span>
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
              <a className="ksdp-link" href={BYT708_URL} target="_blank" rel="noreferrer">
                <BookOpen size={16}/> Nguồn: {SRC708}
              </a>
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
                      <th>Phân loại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.slice(1).map(g => (
                      <Fragment key={g}>
                        <tr className="ksdp-group-row"><td colSpan={4}>{g}</td></tr>
                        {KSDP_OPERATIONS.filter(o => o.group === g).map(o => (
                          <tr key={o.id}>
                            <td>{o.name}<Fn n={o.nameFn}/></td>
                            {o.noProphylaxis
                              ? <td colSpan={2} className="ksdp-none">{o.primary}</td>
                              : <>
                                  <td>{o.primary}<Fn n={o.primaryFn}/></td>
                                  <td>{o.alternative}<Fn n={o.altFn}/></td>
                                </>}
                            <td>{WOUND_CLASS_BY_OP[o.id]?.label}</td>
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
              <a className="ksdp-link" href={BYT708_URL} target="_blank" rel="noreferrer">
                <BookOpen size={16}/> Nguồn: {SRC708}
              </a>
            </section>

            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span><Info size={16}/></span>
                <h2>Chú thích bảng lựa chọn kháng sinh dự phòng</h2>
              </div>
              <ol className="ksdp-footnotes">
                {Object.entries(KSDP_FOOTNOTES).map(([n, t]) => <li key={n} value={Number(n)}>{t}</li>)}
              </ol>
            </section>
          </>
        )}

        <div className="ksdp-footer-note">
          <Info size={17}/>
          <span>
            Nguồn: QĐ 708/QĐ-BYT – Hướng dẫn sử dụng kháng sinh (2015); QĐ 3671/QĐ-BYT – Hướng dẫn phòng ngừa nhiễm khuẩn vết mổ (2012).
            Quốc tế: ASHP/IDSA/SIS/SHEA 2013 (Am J Health-Syst Pharm. 2013;70:195–283).
            Áp dụng cùng quy trình KSDP đã phê duyệt của bệnh viện.
          </span>
          <button onClick={reset}>Đặt lại</button>
        </div>
      </div>

      <style>{`
        .ksdp-page {
          min-height:100vh;
          background:#f7f9fc;
          color:#10223d;
          padding:24px;
          font-family:Arial,sans-serif;
        }
        .ksdp-inner {max-width:1320px;margin:auto}
        .ksdp-breadcrumb {
          display:flex;align-items:center;flex-wrap:wrap;
          gap:9px;font-size:12px;color:#7285a0;
          margin-bottom:25px;
        }
        .ksdp-breadcrumb a {
          color:#28658e;text-decoration:none;
        }
        .ksdp-breadcrumb b {color:#10223d}
        .ksdp-heading {
          display:flex;gap:15px;align-items:center;
          margin-bottom:24px;
        }
        .ksdp-symbol {
          display:grid;place-items:center;
          width:51px;height:51px;flex:none;
          background:#dceeff;color:#075985;
          border-radius:12px;
        }
        .ksdp-heading h1 {
          font-size:27px;line-height:1.3;
          margin:0 0 7px;font-weight:800;
        }
        .ksdp-heading p {
          margin:0;color:#69809e;font-size:13px;
        }
        .ksdp-tabs {
          display:flex;gap:8px;flex-wrap:wrap;
          margin-bottom:16px;
        }
        .ksdp-tabs button,.ksdp-secondary {
          border:1px solid #d6e2ee;background:white;
          color:#183758;padding:12px 16px;
          border-radius:9px;font-weight:700;
          font-size:13px;cursor:pointer;
          display:inline-flex;align-items:center;gap:8px;
        }
        .ksdp-tabs .active {
          background:#075985;color:white;
          border-color:#075985;
        }
        .ksdp-panel {
          border:1px solid #e0e8f2;
          background:white;border-radius:14px;
          padding:22px;margin-bottom:16px;
          box-shadow:0 2px 8px #102d4406;
        }
        .ksdp-section-title {
          display:flex;align-items:center;gap:10px;
          margin-bottom:18px;
        }
        .ksdp-section-title>span {
          background:#e2f1ff;color:#075985;
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
          border:1px solid #cfdaea;
          border-radius:9px;background:white;
          color:#10223d;padding:0 12px;
          font-size:13px;
        }
        .ksdp-search {
          border:1px solid #cfdaea;
          border-radius:9px;display:flex;
          align-items:center;padding-left:12px;
          color:#7291b1;
        }
        .ksdp-search input {
          border:0!important;outline:0;
        }
        .ksdp-select-op {
          display:block;margin-top:16px;
        }
        .ksdp-surgery {
          padding:14px;background:#f3f8fc;
          border-radius:10px;margin-bottom:15px;
        }
        .ksdp-surgery b {
          display:block;font-size:15px;
        }
        .ksdp-surgery small {
          color:#68829c;display:block;margin-top:6px;
        }
        .ksdp-choice {
          border:1px solid #d9e8f5;
          border-radius:11px;padding:17px;
          background:#fcfeff;line-height:1.65;
        }
        .ksdp-choice-label {
          font-size:12px;color:#7188a1;
          margin-bottom:9px;
        }
        .ksdp-choice strong {
          font-size:17px;color:#075985;
        }
        .ksdp-note,.ksdp-warning {
          display:flex;align-items:flex-start;gap:10px;
          margin-top:15px;padding:13px 14px;
          background:#eef7ff;border:1px solid #cce5fa;
          border-radius:9px;font-size:12px;
          line-height:1.75;color:#315b7d;
        }
        .ksdp-warning {
          background:#fff8ed;border-color:#f6dfb4;
          color:#82501d;
        }
        .ksdp-note svg,.ksdp-warning svg {flex:none}
        .ksdp-link {
          display:inline-flex;align-items:center;gap:8px;
          margin-top:16px;color:#075985;font-size:13px;
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
          border:1px solid #dbe7f0;
          border-radius:9px;padding:13px;font-size:12px;
          line-height:1.75;
        }
        .ksdp-dose-card b {
          color:#075985;display:block;
          font-size:15px;margin-bottom:7px;
        }
        .ksdp-muted {
          color:#6b8099;font-size:13px;line-height:1.75;
        }
        .ksdp-empty {
          min-height:245px;border:1px solid #dbe8f5;
          border-radius:13px;background:#f1f8fe;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          text-align:center;padding:25px;color:#075985;
        }
        .ksdp-empty h3 {
          color:#10223d;margin:13px 0 8px;
        }
        .ksdp-empty p {
          max-width:430px;font-size:13px;
          line-height:1.7;color:#6b8099;
        }
        .ksdp-progress {
          font-size:13px;font-weight:700;margin:19px 0;
        }
        .ksdp-progress>div {
          height:8px;border-radius:10px;
          background:#e7edf4;margin-top:9px;overflow:hidden;
        }
        .ksdp-progress i {
          display:block;height:100%;
          background:#0d9488;
        }
        .ksdp-checks {display:grid;gap:10px}
        .ksdp-checks label {
          display:flex;align-items:center;gap:12px;
          border:1px solid #e1e9f2;border-radius:9px;
          padding:12px;font-size:13px;
          cursor:pointer;
        }
        .ksdp-checks label>span {
          flex:1;margin:0!important;
          font-weight:500!important;
        }
        .ksdp-checks input {width:17px;height:17px}
        .ksdp-checks svg {color:#0d9488}
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
          background:#edf5fc;text-align:left;
          padding:12px;
        }
        .ksdp-table td {
          padding:12px;border-bottom:1px solid #e2eaf2;
          vertical-align:top;
        }
        .ksdp-footer-note {
          display:flex;align-items:center;gap:10px;
          font-size:11px;color:#6c819b;
          line-height:1.7;margin-top:18px;
          border-top:1px solid #e2eaf2;padding-top:15px;
        }
        .ksdp-footer-note span {flex:1}
        .ksdp-footer-note button {
          background:white;border:1px solid #d5e2ee;
          border-radius:8px;padding:9px 12px;
          color:#075985;cursor:pointer;
        }
        .ksdp-fn {font-size:10px;margin-left:1px;color:#075985;font-weight:700}
        .ksdp-fn-text {display:block;color:#5b6f8a;margin-top:4px}
        .ksdp-choice.on {border-color:#075985;box-shadow:0 0 0 2px #07598522}
        .ksdp-calc {background:#eef7ff;border-radius:6px;padding:4px 8px;margin:3px 0}
        .ksdp-calc.warn {background:#fff4e5;color:#8a4b00;font-weight:700}
        .ksdp-principle {margin-bottom:16px}
        .ksdp-principle h3 {font-size:14px;margin:0 0 6px;color:#0b3a5c}
        .ksdp-principle h3 a {font-size:11px;font-weight:400;color:#28658e;margin-left:6px}
        .ksdp-principle ul {margin:0;padding-left:20px;line-height:1.6;font-size:13.5px}
        .ksdp-group-row td {background:#eef4fa;font-weight:800;color:#0b3a5c}
        .ksdp-none {color:#8a4b00;font-style:italic}
        .ksdp-footnotes {margin:0;padding-left:22px;line-height:1.6;font-size:13.5px}
        .ksdp-table a {color:#28658e}
        .ksdp-class {border-radius:10px;padding:10px 12px;margin-bottom:14px;display:grid;gap:4px;font-size:13.5px;border:1px solid #d6e2ee}
        .ksdp-class-badge {display:inline-block;font-weight:800;font-size:13px;padding:3px 10px;border-radius:999px;color:#fff;background:#475569}
        .ksdp-class-sach .ksdp-class-badge, .ksdp-class-dot.ksdp-class-sach {background:#0f766e;color:#fff}
        .ksdp-class-sach-nhiem .ksdp-class-badge, .ksdp-class-dot.ksdp-class-sach-nhiem {background:#b45309;color:#fff}
        .ksdp-class-tuy .ksdp-class-badge, .ksdp-class-dot.ksdp-class-tuy {background:#475569;color:#fff}
        .ksdp-class-why {color:#10223d}
        .ksdp-class-src {font-size:12px;color:#5b6f8a}
        .ksdp-subtabs {display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
        .ksdp-subtabs button {border:1px solid #d6e2ee;background:#fff;color:#183758;padding:8px 12px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer}
        .ksdp-subtabs .active {background:#e2f1ff;border-color:#075985;color:#075985}
        .ksdp-inline-check {display:flex;align-items:center;gap:8px;margin:12px 0;font-size:13.5px;font-weight:600}
        .ksdp-notes {margin:0;padding-left:18px;line-height:1.6;font-size:13.5px}
        .ksdp-notes a {color:#28658e;font-size:11.5px}
        @media(max-width:850px) {
          .ksdp-grid.two,.ksdp-grid.three {
            grid-template-columns:1fr;
          }
        }
        @media(max-width:600px) {
          .ksdp-page {padding:14px}
          .ksdp-heading h1 {font-size:22px}
          .ksdp-panel {padding:14px}
        }
        @media print {
          .ksdp-tabs,.ksdp-breadcrumb,
          .ksdp-actions,.ksdp-footer-note button {
            display:none!important;
          }
          .ksdp-page {background:white;padding:0}
          .ksdp-panel {box-shadow:none}
        }
      `}</style>
    </main>
  );
}
