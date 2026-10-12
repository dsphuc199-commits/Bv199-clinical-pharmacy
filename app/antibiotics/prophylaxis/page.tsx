
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, Pill, BookOpen, ClipboardCheck,
  ChevronRight, Info, AlertTriangle,
  CheckCircle2, RotateCcw, Printer,
  Clock3, Syringe, ShieldCheck
} from "lucide-react";

type Operation = {
  id: string;
  specialty: string;
  name: string;
  primary: string;
  alternative: string;
  page: number;
  note?: string;
  noProphylaxis?: boolean;
};

type Dose = {
  drug: string;
  dose: string;
  repeat: string;
};

// Nguồn: QĐ 708/QĐ-BYT, Phụ lục 2,
// trang PDF 317 (trang in 316).
// Đây là dữ liệu lịch sử trong văn bản,
// KHÔNG tự động thay thế quy trình BV hiện hành.
const doses: Dose[] = [
  {
    drug: "Cefazolin",
    dose: "Dưới 120 kg: 2 g; từ 120 kg: 3 g",
    repeat: "Mỗi 4 giờ; riêng phẫu thuật tim: 2 giờ"
  },
  {
    drug: "Cefotetan",
    dose: "Dưới 120 kg: 2 g; từ 120 kg: 3 g",
    repeat: "Mỗi 6 giờ"
  },
  {
    drug: "Clindamycin",
    dose: "600 mg",
    repeat: "Mỗi 6 giờ"
  },
  {
    drug: "Ciprofloxacin",
    dose: "400 mg",
    repeat: "Mỗi 8 giờ"
  },
  {
    drug: "Gentamicin",
    dose: "5 mg/kg",
    repeat: "Không nhắc liều dự phòng"
  },
  {
    drug: "Metronidazol",
    dose: "500 mg",
    repeat: "Mỗi 12 giờ"
  },
  {
    drug: "Vancomycin",
    dose: "Dưới 70 kg: 1 g; 71–99 kg: 1,25 g; trên 100 kg: 1,5 g",
    repeat: "Mỗi 12 giờ theo Phụ lục 2; không tự động chỉ định nhắc"
  }
];

// Trích cấu trúc lựa chọn từ QĐ 708, Phụ lục 3,
// trang PDF 318–321.
// VÀ = phối hợp; HOẶC = lựa chọn một phương án.
// Không tự chuyển các thuốc HOẶC thành phối hợp.
const operations: Operation[] = [
  // NGOẠI TIẾT NIỆU
  {
    id:"u1", specialty:"Tiết niệu",
    name:"Sinh thiết tuyến tiền liệt qua trực tràng",
    primary:"Cefazolin",
    alternative:"Ciprofloxacin HOẶC gentamicin",
    page:318,
    note:"Có bảng dự phòng riêng theo kết quả soi trực tràng ở trang PDF 321–322. Cần đối chiếu trước khi áp dụng."
  },
  {
    id:"u2", specialty:"Tiết niệu",
    name:"Phẫu thuật qua niệu đạo: TURP, TURBT, nội soi niệu quản",
    primary:"Cefazolin",
    alternative:"Gentamicin",
    page:318
  },
  {
    id:"u3", specialty:"Tiết niệu",
    name:"Tán sỏi",
    primary:"Cefazolin",
    alternative:"Gentamicin",
    page:318
  },
  {
    id:"u4", specialty:"Tiết niệu",
    name:"Cắt thận hoặc cắt tuyến tiền liệt triệt căn",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:318
  },
  {
    id:"u5", specialty:"Tiết niệu",
    name:"Cắt bàng quang triệt căn, phẫu thuật hồi tràng",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ gentamicin",
    page:318
  },
  {
    id:"u6", specialty:"Tiết niệu",
    name:"Phẫu thuật liên quan dương vật hoặc đặt bộ phận giả",
    primary:"(Cefazolin HOẶC vancomycin) VÀ gentamicin",
    alternative:"(Clindamycin HOẶC vancomycin) VÀ gentamicin",
    page:318
  },

  // TIM - MẠCH
  {
    id:"c1", specialty:"Tim mạch",
    name:"Mở xương ức đường giữa, ghép tim",
    primary:"Cefazolin",
    alternative:"Vancomycin",
    page:318
  },
  {
    id:"c2", specialty:"Tim mạch",
    name:"Phẫu thuật tim có tiền sử VAD hoặc có MRSA",
    primary:"Cefazolin VÀ vancomycin",
    alternative:"Vancomycin",
    page:318,
    note:"Khuyến cáo trong nguồn liên quan yếu tố VAD/MRSA, không áp dụng đại trà."
  },
  {
    id:"c3", specialty:"Tim mạch",
    name:"Đặt máy tạo nhịp hoặc máy khử rung tim",
    primary:"Cefazolin",
    alternative:"Clindamycin HOẶC vancomycin",
    page:318
  },
  {
    id:"c4", specialty:"Tim mạch",
    name:"Đặt máy tạo nhịp/ICD có MRSA",
    primary:"Cefazolin VÀ vancomycin",
    alternative:"Vancomycin",
    page:318
  },

  // MẠCH MÁU
  {
    id:"v1", specialty:"Mạch máu",
    name:"Thủ thuật mạch cảnh, mạch cánh tay đầu không đặt graft",
    primary:"Không khuyến cáo dự phòng",
    alternative:"Không khuyến cáo dự phòng",
    page:319,
    noProphylaxis:true
  },
  {
    id:"v2", specialty:"Mạch máu",
    name:"Mạch chi trên có graft hoặc thủ thuật mạch chi dưới",
    primary:"Cefazolin",
    alternative:"Clindamycin HOẶC vancomycin",
    page:319
  },
  {
    id:"v3", specialty:"Mạch máu",
    name:"Thủ thuật động mạch chủ bụng hoặc rạch da vùng bẹn",
    primary:"Cefotetan",
    alternative:"Vancomycin VÀ gentamicin",
    page:319
  },

  // LỒNG NGỰC
  {
    id:"t1", specialty:"Lồng ngực",
    name:"Cắt thùy phổi, cắt phổi, mở ngực, VATS",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:319
  },
  {
    id:"t2", specialty:"Lồng ngực",
    name:"Phẫu thuật thực quản",
    primary:"Cefotetan",
    alternative:"Clindamycin",
    page:319
  },

  // NGOẠI THẦN KINH
  {
    id:"n1", specialty:"Thần kinh - Cột sống",
    name:"Mở hộp sọ, đặt dẫn lưu dịch não tủy, cấy bơm dưới màng tủy",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:319
  },
  {
    id:"n2", specialty:"Thần kinh - Cột sống",
    name:"Mở cung sau đốt sống",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:319
  },
  {
    id:"n3", specialty:"Thần kinh - Cột sống",
    name:"Gắn đốt sống",
    primary:"Cefazolin",
    alternative:"Clindamycin HOẶC vancomycin",
    page:319
  },
  {
    id:"n4", specialty:"Thần kinh - Cột sống",
    name:"Gắn đốt sống có MRSA",
    primary:"Cefazolin VÀ vancomycin",
    alternative:"Vancomycin",
    page:319
  },
  {
    id:"n5", specialty:"Thần kinh - Cột sống",
    name:"Thủ thuật qua xương bướm",
    primary:"Ceftriaxon",
    alternative:"Moxifloxacin 400 mg trong 60 phút",
    page:319
  },

  // CHỈNH HÌNH
  {
    id:"o1", specialty:"Chấn thương - Chỉnh hình",
    name:"Phẫu thuật sạch bàn tay, gối, bàn chân hoặc nội soi khớp",
    primary:"Không khuyến cáo dự phòng",
    alternative:"Không khuyến cáo dự phòng",
    page:319,
    noProphylaxis:true
  },
  {
    id:"o2", specialty:"Chấn thương - Chỉnh hình",
    name:"Thay khớp toàn bộ",
    primary:"Cefazolin",
    alternative:"Vancomycin",
    page:319
  },
  {
    id:"o3", specialty:"Chấn thương - Chỉnh hình",
    name:"Thay khớp toàn bộ có MRSA",
    primary:"Cefazolin VÀ vancomycin",
    alternative:"Vancomycin",
    page:319
  },
  {
    id:"o4", specialty:"Chấn thương - Chỉnh hình",
    name:"Nắn xương gãy hoặc cố định xương bên trong",
    primary:"Cefazolin",
    alternative:"Clindamycin HOẶC vancomycin",
    page:319
  },
  {
    id:"o5", specialty:"Chấn thương - Chỉnh hình",
    name:"Cắt cụt chi dưới",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ gentamicin",
    page:319
  },

  // NGOẠI TIÊU HÓA
  {
    id:"g1", specialty:"Ngoại tiêu hóa",
    name:"Phẫu thuật đường tiêu hóa trên, cầu nối dạ dày",
    primary:"Cefotetan",
    alternative:"Clindamycin ± gentamicin",
    page:320
  },
  {
    id:"g2", specialty:"Ngoại tiêu hóa",
    name:"Phẫu thuật đường mật hoặc cắt túi mật",
    primary:"Cefotetan",
    alternative:"Clindamycin ± gentamicin",
    page:320,
    note:"Đây là lựa chọn trong Phụ lục 3 năm 2015; cần phân tầng nguy cơ và cập nhật hướng dẫn cắt túi mật hiện hành."
  },
  {
    id:"g3", specialty:"Ngoại tiêu hóa",
    name:"Cắt gan",
    primary:"Cefotetan",
    alternative:"Clindamycin ± gentamicin",
    page:320
  },
  {
    id:"g4", specialty:"Ngoại tiêu hóa",
    name:"Whipple hoặc cắt tụy",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ ciprofloxacin",
    page:320
  },
  {
    id:"g5", specialty:"Ngoại tiêu hóa",
    name:"Phẫu thuật ruột non",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ gentamicin",
    page:320
  },
  {
    id:"g6", specialty:"Ngoại tiêu hóa",
    name:"Mở dạ dày ra da qua nội soi (PEG)",
    primary:"Cefazolin HOẶC cefotetan",
    alternative:"Clindamycin ± gentamicin",
    page:320
  },
  {
    id:"g7", specialty:"Ngoại tiêu hóa",
    name:"Cắt ruột thừa không biến chứng",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ gentamicin",
    page:320,
    note:"Ruột thừa biến chứng, hoại tử hoặc viêm phúc mạc cần phác đồ điều trị nhiễm khuẩn, không chỉ KSDP."
  },
  {
    id:"g8", specialty:"Ngoại tiêu hóa",
    name:"Phẫu thuật đại trực tràng hoặc chấn thương bụng hở",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ gentamicin",
    page:320,
    note:"Chấn thương có nhiễm khuẩn xác lập phải chuyển sang đánh giá điều trị nhiễm khuẩn."
  },
  {
    id:"g9", specialty:"Ngoại tiêu hóa",
    name:"Mổ thoát vị bẹn",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:320
  },
  {
    id:"g10", specialty:"Ngoại tiêu hóa",
    name:"Thoát vị bẹn biến chứng, mổ cấp cứu hoặc tái phát",
    primary:"Cefotetan",
    alternative:"Clindamycin ± gentamicin",
    page:320
  },

  // NGOẠI VÚ
  {
    id:"b1", specialty:"Ngoại vú",
    name:"Cắt tuyến vú không nạo vét hạch",
    primary:"Không khuyến cáo dự phòng",
    alternative:"Không khuyến cáo dự phòng",
    page:320,
    noProphylaxis:true
  },
  {
    id:"b2", specialty:"Ngoại vú",
    name:"Cắt tuyến vú có nạo vét hạch",
    primary:"Cefazolin",
    alternative:"Clindamycin VÀ gentamicin",
    page:320
  },

  // SẢN PHỤ KHOA
  {
    id:"ob1", specialty:"Sản phụ khoa",
    name:"Mổ lấy thai",
    primary:"Cefazolin",
    alternative:"Clindamycin VÀ gentamicin",
    page:320
  },
  {
    id:"ob2", specialty:"Sản phụ khoa",
    name:"Cắt tử cung đường âm đạo hoặc đường bụng",
    primary:"Cefazolin HOẶC cefotetan",
    alternative:"Clindamycin VÀ gentamicin",
    page:320
  },
  {
    id:"ob3", specialty:"Sản phụ khoa",
    name:"Phẫu thuật ung thư phụ khoa",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ gentamicin",
    page:320
  },
  {
    id:"ob4", specialty:"Sản phụ khoa",
    name:"Phẫu thuật sa bàng quang hoặc sa trực tràng",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:320
  },

  // TAI MŨI HỌNG
  {
    id:"ent1", specialty:"Tai Mũi Họng - Đầu mặt cổ",
    name:"Cắt tuyến mang tai, tuyến giáp hoặc amydal",
    primary:"Không khuyến cáo dự phòng",
    alternative:"Không khuyến cáo dự phòng",
    page:321,
    noProphylaxis:true
  },
  {
    id:"ent2", specialty:"Tai Mũi Họng - Đầu mặt cổ",
    name:"Phẫu thuật tạo hình có thay thế bộ phận",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:321
  },
  {
    id:"ent3", specialty:"Tai Mũi Họng - Đầu mặt cổ",
    name:"Cắt VA, tạo hình mũi, giảm thể tích u hoặc gãy xương hàm dưới",
    primary:"Cefotetan HOẶC clindamycin",
    alternative:"Clindamycin",
    page:321
  },
  {
    id:"ent4", specialty:"Tai Mũi Họng - Đầu mặt cổ",
    name:"Đại phẫu vùng cổ",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:321
  },

  // TẠO HÌNH
  {
    id:"p1", specialty:"Phẫu thuật tạo hình",
    name:"Phẫu thuật sạch có nguy cơ hoặc sạch - nhiễm",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:321
  },
  {
    id:"p2", specialty:"Phẫu thuật tạo hình",
    name:"Đặt hoặc ghép vạt mô",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:321
  },
  {
    id:"p3", specialty:"Phẫu thuật tạo hình",
    name:"Tạo hình mũi",
    primary:"Không dự phòng HOẶC cefazolin",
    alternative:"Không dự phòng HOẶC clindamycin",
    page:321,
    note:"Khuyến cáo có điều kiện lựa chọn; cần đánh giá nguy cơ NKVM."
  },

  // GHÉP TẠNG
  {
    id:"tr1", specialty:"Ghép tạng",
    name:"Ghép tụy hoặc tụy - thận",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ ciprofloxacin",
    page:321
  },
  {
    id:"tr2", specialty:"Ghép tạng",
    name:"Ghép thận / người cho sống",
    primary:"Cefazolin",
    alternative:"Clindamycin",
    page:321
  },
  {
    id:"tr3", specialty:"Ghép tạng",
    name:"Ghép gan",
    primary:"Cefotetan",
    alternative:"Clindamycin VÀ ciprofloxacin",
    page:321
  }
];

const specialties = [
  "Tất cả",
  ...Array.from(new Set(operations.map(x => x.specialty)))
];

function norm(s: string) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

const checklistLabels = [
  "Xác định đúng loại phẫu thuật và nguy cơ nhiễm khuẩn vết mổ",
  "Phân biệt dự phòng với điều trị nhiễm khuẩn đã xác lập",
  "Đánh giá tiền sử dị ứng beta-lactam và phản ứng cụ thể",
  "Kiểm tra cân nặng và liều KSDP",
  "Xác nhận thời điểm dùng kháng sinh trước rạch da",
  "Đánh giá thời gian mổ, mất máu và nhu cầu nhắc liều",
  "Đánh giá chức năng thận, độc tính và các yếu tố cá thể",
  "Xác định thời điểm ngừng KSDP theo phác đồ hiện hành",
  "Kiểm tra tính sẵn có và phê duyệt thuốc tại BV199"
];

export default function ProphylaxisPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("Tất cả");
  const [chosenId, setChosenId] = useState("");
  const [allergy, setAllergy] = useState("none");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [bloodLoss, setBloodLoss] = useState("");
  const [wound, setWound] = useState("");
  const [checks, setChecks] = useState<boolean[]>(
    Array(checklistLabels.length).fill(false)
  );
  const [tab, setTab] = useState<"guide"|"audit"|"dose">("guide");

  const filtered = useMemo(() =>
    operations.filter(x =>
      (specialty === "Tất cả" || x.specialty === specialty) &&
      norm(x.name + " " + x.specialty).includes(norm(search))
    ), [search, specialty]);

  const chosen = operations.find(x => x.id === chosenId);
  const completed = checks.filter(Boolean).length;

  function reset() {
    setSearch("");
    setSpecialty("Tất cả");
    setChosenId("");
    setAllergy("none");
    setWeight("");
    setDuration("");
    setBloodLoss("");
    setWound("");
    setChecks(Array(checklistLabels.length).fill(false));
  }

  function getDoseInfo(text: string) {
    const tokens = text
      .split(/\s+VÀ\s+|\s+HOẶC\s+|[()]/i)
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    return doses.filter(d =>
      tokens.some(t =>
        norm(t) === norm(d.drug)
      )
    );
  }

  const selectedDoses = chosen
    ? getDoseInfo(
        allergy === "none"
        ? chosen.primary
        : chosen.alternative
      )
    : [];

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
            <p>Tra cứu lựa chọn kháng sinh theo loại phẫu thuật · Bộ Y tế</p>
          </div>
        </div>

        <div className="ksdp-tabs">
          <button
            className={tab==="guide"?"active":""}
            onClick={()=>setTab("guide")}
          >
            <Search size={16}/> Lựa chọn KSDP
          </button>
          <button
            className={tab==="audit"?"active":""}
            onClick={()=>setTab("audit")}
          >
            <ClipboardCheck size={16}/> Bảng kiểm KSDP
          </button>
          <button
            className={tab==="dose"?"active":""}
            onClick={()=>setTab("dose")}
          >
            <Syringe size={16}/> Liều & nhắc liều
          </button>
        </div>

        {tab === "guide" && (
          <>
            <section className="ksdp-panel">
              <div className="ksdp-section-title">
                <span>01</span>
                <h2>Chọn chuyên khoa và phẫu thuật</h2>
              </div>

              <div className="ksdp-grid two">
                <label>
                  <span>Chuyên khoa</span>
                  <select value={specialty}
                    onChange={e=>{
                      setSpecialty(e.target.value);
                      setChosenId("");
                    }}>
                    {specialties.map(s=>
                      <option key={s} value={s}>{s}</option>
                    )}
                  </select>
                </label>
                <label>
                  <span>Tìm tên phẫu thuật</span>
                  <div className="ksdp-search">
                    <Search size={17}/>
                    <input
                      value={search}
                      onChange={e=>setSearch(e.target.value)}
                      placeholder="Ví dụ: mổ lấy thai, ruột thừa, thay khớp..."
                    />
                  </div>
                </label>
              </div>

              <label className="ksdp-select-op">
                <span>Loại phẫu thuật / thủ thuật</span>
                <select value={chosenId}
                  onChange={e=>setChosenId(e.target.value)}>
                  <option value="">
                    -- Chọn loại phẫu thuật ({filtered.length} mục) --
                  </option>
                  {filtered.map(x=>
                    <option key={x.id} value={x.id}>
                      {x.specialty} – {x.name}
                    </option>
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
                    <b>{chosen.name}</b>
                    <small>{chosen.specialty}</small>
                  </div>

                  <div className="ksdp-grid two">
                    <div className="ksdp-choice">
                      <div className="ksdp-choice-label">
                        Kháng sinh theo Phụ lục 3
                      </div>
                      <strong>{chosen.primary}</strong>
                    </div>
                    <div className="ksdp-choice">
                      <div className="ksdp-choice-label">
                        Lựa chọn thay thế theo tài liệu
                      </div>
                      <strong>{chosen.alternative}</strong>
                    </div>
                  </div>

                  {chosen.note && (
                    <div className="ksdp-note">
                      <Info size={17}/>
                      {chosen.note}
                    </div>
                  )}

                  {chosen.noProphylaxis && (
                    <div className="ksdp-note">
                      Tài liệu không khuyến cáo dự phòng
                      thường quy cho loại thủ thuật này.
                      Cần đánh giá ngoại lệ theo người bệnh.
                    </div>
                  )}

                  <a className="ksdp-link"
                    href={`/docs/ksdp-byt-708.pdf#page=${chosen.page}`}
                    target="_blank" rel="noreferrer">
                    <BookOpen size={16}/>
                    Xem Phụ lục 3 – Trang PDF {chosen.page}
                  </a>
                </section>

                {!chosen.noProphylaxis && (
                  <section className="ksdp-panel">
                    <div className="ksdp-section-title">
                      <span>03</span>
                      <h2>Kiểm tra điều kiện sử dụng</h2>
                    </div>

                    <div className="ksdp-grid three">
                      <label>
                        <span>Tiền sử dị ứng</span>
                        <select value={allergy}
                          onChange={e=>setAllergy(e.target.value)}>
                          <option value="none">Chưa ghi nhận dị ứng</option>
                          <option value="reported">Có tiền sử dị ứng cần xác minh</option>
                        </select>
                      </label>
                      <label>
                        <span>Cân nặng (kg)</span>
                        <input type="number" min="1"
                          value={weight}
                          onChange={e=>setWeight(e.target.value)}
                          placeholder="Ví dụ: 70"
                        />
                      </label>
                      <label>
                        <span>Phân loại vết mổ</span>
                        <select value={wound}
                          onChange={e=>setWound(e.target.value)}>
                          <option value="">Chưa xác định</option>
                          <option value="Sạch">Sạch</option>
                          <option value="Sạch - nhiễm">Sạch - nhiễm</option>
                          <option value="Nhiễm">Nhiễm</option>
                          <option value="Bẩn">Bẩn</option>
                        </select>
                      </label>
                      <label>
                        <span>Thời gian mổ dự kiến (giờ)</span>
                        <input type="number" min="0" step=".5"
                          value={duration}
                          onChange={e=>setDuration(e.target.value)}
                          placeholder="Ví dụ: 3.5"
                        />
                      </label>
                      <label>
                        <span>Lượng máu mất dự kiến (mL)</span>
                        <input type="number" min="0"
                          value={bloodLoss}
                          onChange={e=>setBloodLoss(e.target.value)}
                          placeholder="Nếu có dữ liệu"
                        />
                      </label>
                    </div>

                    {allergy === "reported" && (
                      <div className="ksdp-warning">
                        <AlertTriangle size={18}/>
                        Cần xác minh tác nhân, biểu hiện,
                        mức độ nặng và thời điểm dị ứng.
                        Lựa chọn thay thế trong bảng
                        không được tự động áp dụng cho
                        mọi loại phản ứng dị ứng.
                      </div>
                    )}

                    <h3 className="ksdp-subheading">
                      Liều và nhắc liều trong QĐ 708
                    </h3>

                    {selectedDoses.length ? (
                      <div className="ksdp-dose-list">
                        {selectedDoses.map(d=>
                          <div key={d.drug} className="ksdp-dose-card">
                            <b>{d.drug}</b>
                            <div><strong>Liều:</strong> {d.dose}</div>
                            <div><strong>Nhắc liều:</strong> {d.repeat}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="ksdp-muted">
                        Không có thông tin liều tương ứng
                        trong Phụ lục 2 cho lựa chọn này.
                        Không tự suy diễn liều.
                      </p>
                    )}

                    <div className="ksdp-warning">
                      <Clock3 size={18}/>
                      Thời điểm dùng trước rạch da,
                      tốc độ truyền, nhắc liều và ngừng
                      KSDP phải đối chiếu phác đồ BV
                      hiện hành, dược động học, chức
                      năng thận, thời gian mổ và mất máu.
                      Chưa tự động ra y lệnh.
                    </div>

                    <button className="ksdp-secondary"
                      onClick={()=>setTab("audit")}>
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
                  Hệ thống hiển thị kháng sinh ưu tiên,
                  phương án thay thế và dữ liệu liều
                  tương ứng với tài liệu Bộ Y tế.
                </p>
              </div>
            )}
          </>
        )}

        {tab === "audit" && (
          <section className="ksdp-panel">
            <div className="ksdp-section-title">
              <span><ClipboardCheck size={16}/></span>
              <h2>Bảng kiểm sử dụng KSDP</h2>
            </div>

            <p className="ksdp-muted">
              Phục vụ rà soát đơn thuốc của bác sĩ
              và dược sĩ lâm sàng. Bảng kiểm chưa
              phải kết luận hợp lý/không hợp lý tự động.
            </p>

            {chosen && (
              <div className="ksdp-surgery">
                <b>{chosen.name}</b>
                <small>{chosen.specialty}</small>
              </div>
            )}

            <div className="ksdp-progress">
              <span>Đã đánh giá: {completed}/{checks.length}</span>
              <div>
                <i style={{
                  width:`${completed/checks.length*100}%`
                }}/>
              </div>
            </div>

            <div className="ksdp-checks">
              {checklistLabels.map((label,i)=>
                <label key={i}>
                  <input type="checkbox"
                    checked={checks[i]}
                    onChange={e=>setChecks(old=>
                      old.map((v,j)=>j===i?e.target.checked:v)
                    )}
                  />
                  <span>{label}</span>
                  {checks[i] && <CheckCircle2 size={17}/>}
                </label>
              )}
            </div>

            <div className="ksdp-actions">
              <button className="ksdp-secondary"
                onClick={()=>window.print()}>
                <Printer size={16}/> In bảng kiểm
              </button>
              <button className="ksdp-secondary"
                onClick={()=>setChecks(
                  Array(checklistLabels.length).fill(false)
                )}>
                <RotateCcw size={16}/> Xóa đánh dấu
              </button>
            </div>
          </section>
        )}

        {tab === "dose" && (
          <section className="ksdp-panel">
            <div className="ksdp-section-title">
              <span><Syringe size={17}/></span>
              <h2>Liều và nhắc liều kháng sinh dự phòng</h2>
            </div>

            <p className="ksdp-muted">
              Phụ lục 2 – QĐ 708/QĐ-BYT (2015).
              Dùng để tham khảo và đối chiếu, không tự
              động thay thế hướng dẫn hiện hành của BV.
            </p>

            <div className="ksdp-table-wrap">
              <table className="ksdp-table">
                <thead>
                  <tr>
                    <th>Kháng sinh</th>
                    <th>Liều trong tài liệu</th>
                    <th>Khoảng nhắc liều</th>
                  </tr>
                </thead>
                <tbody>
                  {doses.map(d=>
                    <tr key={d.drug}>
                      <td><b>{d.drug}</b></td>
                      <td>{d.dose}</td>
                      <td>{d.repeat}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <a className="ksdp-link"
              href="/docs/ksdp-byt-708.pdf#page=317"
              target="_blank" rel="noreferrer">
              <BookOpen size={16}/>
              Đọc Phụ lục 2 – Trang PDF 317
            </a>
          </section>
        )}

        <div className="ksdp-footer-note">
          <Info size={17}/>
          <span>
            Nguồn: QĐ 708/QĐ-BYT (Phụ lục 2–3);
            QĐ 5631/QĐ-BYT; QĐ 2115/QĐ-BYT.
            Nội dung đang ở chế độ tham khảo,
            cần cập nhật và phê duyệt quy trình
            KSDP nội bộ trước khi áp dụng điều trị.
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
