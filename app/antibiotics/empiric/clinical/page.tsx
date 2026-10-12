"use client";

import React, { useMemo, useState } from "react";
import styles from "./clinical.module.css";

type Source = { id: string; name: string; year: string; issuer: string; region: "VN" | "QT"; url?: string; scope: string[]; description: string; state: "local-index" | "reference" };
type Syndrome = { id: string; name: string; group: string; aliases: string[]; workup: string[]; sourceIds: string[] };

/** Registry of references, NOT a database of verified prescriptions. */
const sources: Source[] = [
  { id: "umc", name: "Hướng dẫn sử dụng kháng sinh – BV Đại học Y Dược TP.HCM", year: "2023", issuer: "BV Đại học Y Dược TP.HCM", region: "VN", scope: ["cap", "hap", "sepsis", "uti", "abd", "skin", "cns"], description: "Nguồn nội bộ đã có lớp văn bản. Các bảng liều cần được đối chiếu thủ công trước khi chuẩn hóa.", state: "local-index" },
  { id: "bachmai", name: "Hướng dẫn sử dụng kháng sinh – Bệnh viện Bạch Mai", year: "2023", issuer: "Bệnh viện Bạch Mai", region: "VN", scope: ["cap", "hap", "sepsis", "uti", "abd", "skin", "cns"], description: "Tài liệu PDF scan của đơn vị; chưa chuyển nội dung scan thành phác đồ đã xác minh.", state: "local-index" },
  { id: "xanhpon", name: "Hướng dẫn sử dụng kháng sinh – Bệnh viện Xanh Pôn", year: "2025", issuer: "Bệnh viện Xanh Pôn", region: "VN", scope: ["cap", "hap", "sepsis", "uti", "abd", "skin", "cns"], description: "Tài liệu PDF scan của đơn vị; cần xác nhận nội dung trước khi đưa vào hướng dẫn kê đơn.", state: "local-index" },
  { id: "byt", name: "Hướng dẫn sử dụng kháng sinh – Quyết định 708/QĐ-BYT", year: "2015", issuer: "Bộ Y tế", region: "VN", url: "https://kcb.vn/van-ban/tai-lieu-huong-dan-su-dung-khang-sinh.html", scope: ["cap", "hap", "sepsis", "uti", "abd", "skin", "cns"], description: "Tài liệu nền của Bộ Y tế; cần so sánh với hướng dẫn chuyên khoa mới hơn.", state: "reference" },
  { id: "who", name: "WHO AWaRe Antibiotic Book", year: "2022", issuer: "World Health Organization", region: "QT", url: "https://www.who.int/publications/i/item/9789240062382", scope: ["cap", "uti", "abd", "skin"], description: "Khung lựa chọn kháng sinh, liều, đường dùng và thời gian cho các nhiễm khuẩn thường gặp; lưu ý các cập nhật sau 2022.", state: "reference" },
  { id: "atscap", name: "ATS/IDSA – Community-Acquired Pneumonia", year: "2019", issuer: "ATS / IDSA", region: "QT", url: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults", scope: ["cap"], description: "Hướng dẫn chuyên biệt CAP người lớn.", state: "reference" },
  { id: "atshap", name: "ATS/IDSA – HAP/VAP", year: "2016", issuer: "ATS / IDSA", region: "QT", url: "https://www.idsociety.org/practice-guideline/hap_vap/", scope: ["hap"], description: "Hướng dẫn viêm phổi bệnh viện và viêm phổi liên quan thở máy; cần kiểm tra cập nhật bổ sung.", state: "reference" },
  { id: "nice", name: "NICE NG250 – Pneumonia: diagnosis and management", year: "2025", issuer: "NICE", region: "QT", url: "https://www.nice.org.uk/guidance/NG250/chapter/recommendations", scope: ["cap", "hap"], description: "Khuyến cáo đánh giá và xử trí viêm phổi, trong đó có lựa chọn kháng sinh.", state: "reference" },
  { id: "idsauti", name: "IDSA – Complicated Urinary Tract Infections", year: "2025", issuer: "IDSA", region: "QT", url: "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/", scope: ["uti"], description: "Hướng dẫn nhiễm khuẩn tiết niệu phức tạp, phân tầng và chuyển IV–PO.", state: "reference" },
  { id: "idsamdr", name: "IDSA – Antimicrobial-Resistant Gram-Negative Infections", year: "2024", issuer: "IDSA", region: "QT", url: "https://www.idsociety.org/practice-guideline/amr-guidance/", scope: ["hap", "sepsis", "uti", "abd", "skin"], description: "Hướng dẫn điều trị tác nhân Gram âm kháng thuốc; dùng theo bằng chứng vi sinh và tình huống lâm sàng.", state: "reference" },
  { id: "ssc", name: "Surviving Sepsis Campaign – Sepsis and Septic Shock", year: "2026", issuer: "SCCM / ESICM", region: "QT", url: "https://sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026", scope: ["sepsis"], description: "Hướng dẫn điều trị sepsis/sốc nhiễm khuẩn, thời điểm điều trị và kiểm soát nguồn.", state: "reference" },
];
const syndromes: Syndrome[] = [
  { id: "cap", name: "Viêm phổi cộng đồng (CAP)", group: "Hô hấp", aliases: ["viem phoi", "pneumonia", "cap"], workup: ["Xác định ngoại trú / nội trú / ICU và mức độ nặng", "Đánh giá nguy cơ MRSA hoặc Pseudomonas theo yếu tố đã được xác thực", "Kiểm tra dị ứng, chức năng thận, tương tác thuốc và bệnh kèm", "Lấy mẫu vi sinh khi có chỉ định; đánh giá lại sau 48–72 giờ"], sourceIds: ["umc", "bachmai", "xanhpon", "byt", "who", "atscap", "nice"] },
  { id: "hap", name: "Viêm phổi bệnh viện / thở máy (HAP/VAP)", group: "Hô hấp", aliases: ["hap", "vap", "benh vien", "tho may"], workup: ["Xác định HAP hay VAP và mức độ nặng", "Xem antibiogram khoa/ICU và sử dụng kháng sinh 90 ngày", "Kiểm tra nguy cơ MDR và kết quả cấy trước đây", "Rà soát PK/PD và xuống thang theo kháng sinh đồ"], sourceIds: ["umc", "bachmai", "xanhpon", "atshap", "nice", "idsamdr"] },
  { id: "sepsis", name: "Nhiễm khuẩn huyết / sốc nhiễm khuẩn", group: "Nhiễm khuẩn nặng", aliases: ["sepsis", "soc nhiem khuan", "nhiem khuan huyet"], workup: ["Đánh giá sốc, suy tạng và mức độ khẩn cấp", "Xác định ổ nhiễm và khả năng kiểm soát nguồn", "Lấy cấy phù hợp nếu không trì hoãn điều trị", "Tối ưu liều tải, PK/PD, chức năng thận và đánh giá lại thường xuyên"], sourceIds: ["umc", "bachmai", "xanhpon", "ssc", "idsamdr"] },
  { id: "uti", name: "Nhiễm khuẩn tiết niệu phức tạp", group: "Tiết niệu", aliases: ["uti", "c uti", "tiet nieu", "viem than be than"], workup: ["Phân biệt nhiễm khuẩn khu trú và nhiễm khuẩn toàn thân", "Xem tình trạng tắc nghẽn, ống thông hoặc bất thường giải phẫu", "Đối chiếu nước tiểu và kháng sinh đồ cũ", "Đánh giá chuyển IV–PO, thời gian điều trị và CrCl"], sourceIds: ["umc", "bachmai", "xanhpon", "byt", "who", "idsauti", "idsamdr"] },
  { id: "abd", name: "Nhiễm khuẩn ổ bụng / đường mật", group: "Tiêu hóa", aliases: ["o bung", "duong mat", "abdomen", "intra abdominal"], workup: ["Xác định ổ nhiễm và chỉ định dẫn lưu/phẫu thuật", "Phân biệt nhiễm khuẩn cộng đồng và liên quan chăm sóc y tế", "Đánh giá mức độ nặng, nguy cơ MDR", "Kiểm tra chức năng gan, thận và đáp ứng sau kiểm soát nguồn"], sourceIds: ["umc", "bachmai", "xanhpon", "byt", "who", "idsamdr"] },
  { id: "skin", name: "Nhiễm khuẩn da – mô mềm", group: "Da – mô mềm", aliases: ["da mo mem", "cellulitis", "ssti"], workup: ["Phân biệt mủ/không mủ và mức độ nặng", "Loại trừ nhiễm khuẩn hoại tử cần phẫu thuật cấp cứu", "Đánh giá nguy cơ MRSA và ổ áp xe cần dẫn lưu", "Kiểm tra dị ứng, chức năng thận và nguồn vi sinh"], sourceIds: ["umc", "bachmai", "xanhpon", "byt", "who", "idsamdr"] },
  { id: "cns", name: "Nhiễm khuẩn hệ thần kinh trung ương", group: "Thần kinh", aliases: ["viem mang nao", "cns", "than kinh"], workup: ["Nhận diện tình huống khẩn cấp", "Phân tầng tuổi, suy giảm miễn dịch và bệnh kèm", "Đánh giá chỉ định cấy máu, chọc dò dịch não tủy và hình ảnh", "Kiểm tra khả năng thấm CNS và liều điều trị theo nguồn chuyên khoa"], sourceIds: ["umc", "bachmai", "xanhpon", "byt"] },
];
const normalize = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

export default function ClinicalGuidelinePage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("cap");
  const [region, setRegion] = useState<"ALL" | "VN" | "QT">("ALL");
  const [sourceSearch, setSourceSearch] = useState("");
  const [tab, setTab] = useState<"guides" | "checklist">("guides");
  const current = syndromes.find((s) => s.id === selected) || syndromes[0];
  const filteredSyndromes = useMemo(() => syndromes.filter(s => normalize([s.name, s.group, ...s.aliases].join(" ")).includes(normalize(search))), [search]);
  const matches = useMemo(() => sources.filter(s => current.sourceIds.includes(s.id) && (region === "ALL" || region === s.region) && normalize(`${s.name} ${s.issuer} ${s.year}`).includes(normalize(sourceSearch))), [current, region, sourceSearch]);
  return (
    <main className={styles.shell}>
      <div className={styles.breadcrumb}><a href="/antibiotics/empiric">Điều trị kinh nghiệm</a><span>›</span>Trung tâm hướng dẫn điều trị</div>
      <header className={styles.hero}>
        <div><span className={styles.eyebrow}>BV199 · CLINICAL GUIDELINE CENTER</span><h1>Hướng dẫn lựa chọn kháng sinh</h1><p>Chọn hội chứng nhiễm khuẩn, rà soát yếu tố lâm sàng và đối chiếu hướng dẫn Việt Nam – quốc tế.</p></div>
        <a className={styles.backButton} href="/antibiotics/empiric">← Điều trị kinh nghiệm</a>
      </header>
      <div className={styles.notice}><strong>Trạng thái dữ liệu:</strong> Thư viện hướng dẫn có nguồn tham khảo chính thức; chưa có bảng thuốc–liều đã được hội đồng BV199 phê duyệt trong giao diện này. Không tự suy diễn phác đồ từ đoạn PDF trích xuất.</div>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sectionHead}><h2>01 · Hội chứng nhiễm khuẩn</h2><span>{syndromes.length} nhóm</span></div>
          <input className={styles.input} value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm bệnh hoặc hội chứng..." aria-label="Tìm hội chứng" />
          <div className={styles.syndromeList}>{filteredSyndromes.map(s => <button key={s.id} onClick={() => { setSelected(s.id); setTab("guides"); }} className={`${styles.syndrome} ${s.id === selected ? styles.active : ""}`}><span>{s.name}</span><small>{s.group}</small></button>)}{filteredSyndromes.length === 0 && <p className={styles.muted}>Không có hội chứng phù hợp.</p>}</div>
        </aside>
        <section className={styles.content}>
          <div className={styles.sectionHead}><div><span className={styles.eyebrow}>02 · HỒ SƠ HỘI CHỨNG</span><h2>{current.name}</h2><p className={styles.muted}>Các yếu tố cần đánh giá trước khi lựa chọn điều trị</p></div></div>
          <div className={styles.checkGrid}>{current.workup.map((x,i) => <div className={styles.checkItem} key={x}><span className={styles.counter}>{String(i+1).padStart(2,"0")}</span><span>{x}</span></div>)}</div>
          <div className={styles.tabBar}><button className={tab === "guides" ? styles.tabActive : ""} onClick={() => setTab("guides")}>Thư viện guideline</button><button className={tab === "checklist" ? styles.tabActive : ""} onClick={() => setTab("checklist")}>Quy trình trước kê đơn</button></div>
          {tab === "guides" ? <>
            <div className={styles.libraryHead}><div><h3>03 · Nguồn hướng dẫn liên quan</h3><p className={styles.muted}>Chỉ hiển thị tên tài liệu, đơn vị ban hành, năm và trạng thái nguồn. Không hiển thị số trang.</p></div><span className={styles.count}>{matches.length} tài liệu</span></div>
            <div className={styles.filters}><div className={styles.filterButtons}><button className={region === "ALL" ? styles.picked : ""} onClick={() => setRegion("ALL")}>Tất cả</button><button className={region === "VN" ? styles.picked : ""} onClick={() => setRegion("VN")}>Việt Nam</button><button className={region === "QT" ? styles.picked : ""} onClick={() => setRegion("QT")}>Quốc tế</button></div><input className={styles.input} value={sourceSearch} onChange={e => setSourceSearch(e.target.value)} placeholder="Lọc tên guideline..." aria-label="Lọc tài liệu" /></div>
            <div className={styles.sourceList}>{matches.map(s => <article key={s.id} className={styles.sourceCard}><div className={styles.sourceMain}><div className={styles.pills}><span className={styles.pill}>{s.region === "VN" ? "Việt Nam" : "Quốc tế"}</span><span className={styles.year}>{s.year}</span><span className={s.state === "local-index" ? styles.local : styles.ref}>{s.state === "local-index" ? "Có chỉ mục nguồn" : "Tài liệu tham khảo"}</span></div><h4>{s.name}</h4><p className={styles.issuer}>{s.issuer}</p><p className={styles.description}>{s.description}</p></div><div className={styles.actions}>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">Mở guideline ↗</a> : <a href="/antibiotics/empiric/sources">Xem nguồn nội bộ ↗</a>}</div></article>)}{matches.length === 0 && <p className={styles.muted}>Không tìm thấy tài liệu theo bộ lọc.</p>}</div>
          </> : <div className={styles.workflow}><h3>Kiểm tra trước khi dùng phác đồ</h3><ol><li>Chẩn đoán và mức độ nặng, xác định có chỉ định kháng sinh.</li><li>Ổ nhiễm, kiểm soát nguồn và xét nghiệm vi sinh phù hợp.</li><li>Nguy cơ tác nhân kháng thuốc, antibiogram đơn vị và kháng sinh đồ trước đây.</li><li>Dị ứng, thai kỳ, cân nặng, CrCl, chức năng gan, tương tác và ADR.</li><li>Liều tải/duy trì, PK/PD, đường dùng, thời gian truyền và TDM (khi thích hợp).</li><li>Đánh giá lại sau 48–72 giờ, xuống thang và thời gian điều trị.</li></ol></div>}
          <div className={styles.bottomNote}><strong>Nguyên tắc an toàn:</strong> Đường dẫn guideline chỉ là tra cứu tài liệu. Tình trạng “có chỉ mục nguồn” không đồng nghĩa phác đồ đã được xác minh hay phê duyệt. Chỉ đưa bảng liều vào chế độ hỗ trợ kê đơn sau khi kiểm định theo từng hội chứng và phiên bản tài liệu.</div>
        </section>
      </div>
    </main>
  );
}
