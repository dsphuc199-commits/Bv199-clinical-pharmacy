
"use client";

import { useState } from "react";

import DrugActionLinks from "./links/DrugActionLinks";

/*
  BV199 - KHOA DUOC
  DIEU TRI KHANG SINH KINH NGHIEM - TAI MUI HONG

  File:
  components/antibiotics/EntEmpiricGuidelines.tsx

  16 ten benh trong danh muc BV199.
  14 nhom benh doc lap, 2 cap ten trung.

  Nguon (doi chieu 13/10/2026):
  - BYT 5643/QD-BYT 31/12/2015 (HD chan doan va dieu tri mot so benh
    ve tai mui hong): da xac nhan ton tai; CHUA doc duoc noi dung tung
    bai nen cac nhanh dung nguon nay chua co lieu. Tinh trang hieu luc
    chua xac minh duoc (trang tra cuu can dang nhap).
  - CDC: Group A Streptococcal Pharyngitis (xem lai 05/08/2025, cap nhat
    18/11/2025): lieu da doi chieu voi trang goc.
  - NICE NG91 Acute Otitis Media (2018, sua 2022): lieu amoxicillin va
    co-amoxiclav, tieu chi ke don ngay/du phong da doi chieu.
  - AAO-HNSF Adult Sinusitis Update (cong bo 07/2025): chi xac nhan duoc
    huong "theo doi truoc"; thoi gian va lieu chua doi chieu van ban goc.

  Nhung nhanh khong du thong tin ve lieu, duong dung,
  thoi gian hoac phoi hop duoc danh dau can tham dinh.
*/

type Regimen = {
  title: string;
  indication: string;
  drugs: string[];
  duration?: string;
  note?: string;
  source: string;
  verified?: boolean;
};

type ClinicalScenario = {
  id: string;
  title: string;
  criteria: string;
  urgency: string;
  regimens: Regimen[];
  warnings: string[];
};

type EntDisease = {
  name: string;
  aliases?: string[];
  scenarios: ClinicalScenario[];
};

const SOURCES = {
  byt: "Bộ Y tế, QĐ 5643/QĐ-BYT ngày 31/12/2015, Hướng dẫn chẩn đoán và điều trị một số bệnh về tai mũi họng (chưa xác minh hiệu lực hiện hành)",
  sinus: "AAO-HNSF, Adult Sinusitis Guideline Update (công bố 07/2025)",
  strep: "CDC, Clinical Guidance for Group A Streptococcal Pharyngitis (cập nhật 18/11/2025)",
  ear: "NICE NG91, Acute Otitis Media (2018, sửa đổi 2022)",
  review:
    "Định hướng chuyên môn, cần đối chiếu hướng dẫn chuyên sâu cập nhật và thẩm định BV199",
};

const ENT_DISEASES: EntDisease[] = [
  // 1-2. VIEM XOANG CAP
  {
    name: "Viêm xoang cấp do vi khuẩn",
    aliases: ["Viêm xoang cấp do vi khuẩn ở người lớn"],
    scenarios: [
      {
        id: "sinus-watch",
        title: "Không biến chứng – có thể theo dõi",
        criteria:
          "Người lớn, chưa có biến chứng hốc mắt/nội sọ, có thể tái khám và theo dõi.",
        urgency: "Không tự động chỉ định kháng sinh.",
        regimens: [
          {
            title: "Theo dõi không dùng kháng sinh ngay",
            indication:
              "Người lớn không biến chứng, có khả năng theo dõi đáng tin cậy.",
            drugs: [
              "Giảm đau nếu cần.",
              "Rửa mũi bằng nước muối.",
              "Corticosteroid xịt mũi khi có chỉ định.",
            ],
            note:
              "Đánh giá lại nếu triệu chứng tiến triển hoặc không cải thiện.",
            source: SOURCES.sinus,
            verified: true,
          },
        ],
        warnings: [
          "Đánh giá triệu chứng kéo dài ít nhất 10 ngày không cải thiện hoặc nặng trở lại sau giai đoạn cải thiện.",
          "Phù quanh mắt, nhìn đôi, giảm thị lực, đau đầu dữ dội là dấu hiệu cần đánh giá cấp cứu.",
        ],
      },
      {
        id: "sinus-antibiotic",
        title: "Có chỉ định kháng sinh",
        criteria:
          "Đã đánh giá phù hợp viêm mũi xoang cấp do vi khuẩn và quyết định điều trị.",
        urgency: "Điều trị ngoại trú nếu không biến chứng.",
        regimens: [
          {
            title: "Amoxicillin đơn trị",
            indication:
              "Một trong các lựa chọn đầu tay ở người lớn phù hợp.",
            drugs: [
              "Amoxicillin uống; xác minh liều theo mức độ bệnh, chức năng thận và chế phẩm.",
            ],
            duration: "Thường 5–7 ngày ở người lớn.",
            note:
              "Thời gian và liều chưa được đối chiếu trực tiếp với văn bản AAO-HNSF 2025; cần kiểm tra bản gốc.",
            source: SOURCES.sinus,
          },
          {
            title: "Amoxicillin/clavulanat đơn trị",
            indication:
              "Lựa chọn đầu tay khác, cân nhắc nguy cơ tác nhân sinh beta-lactamase.",
            drugs: [
              "Amoxicillin/acid clavulanic uống; lựa chọn đúng hàm lượng và chế độ liều.",
            ],
            duration: "Thường 5–7 ngày ở người lớn.",
            note:
              "Thời gian và liều chưa được đối chiếu trực tiếp với văn bản AAO-HNSF 2025; cần kiểm tra bản gốc.",
            source: SOURCES.sinus,
          },
          {
            title: "Doxycyclin – thay thế có điều kiện",
            indication:
              "Người lớn dị ứng penicillin hoặc có lý do phù hợp khác.",
            drugs: [
              "Doxycyclin uống; xác minh liều theo hướng dẫn và tình trạng người bệnh.",
            ],
            note:
              "Đánh giá thai kỳ, chống chỉ định và tương tác thuốc.",
            source: SOURCES.sinus,
          },
        ],
        warnings: [
          "Không phối hợp amoxicillin với amoxicillin/clavulanat.",
          "Không mặc định sử dụng macrolid hoặc fluoroquinolon khi còn lựa chọn phù hợp hơn.",
          "Đánh giá lại khi điều trị thất bại hoặc nghi biến chứng.",
        ],
      },
    ],
  },

  // 3-4. VIEM HONG LIEN CAU
  {
    name: "Viêm họng liên cầu",
    aliases: ["Viêm họng do liên cầu nhóm A"],
    scenarios: [
      {
        id: "strep-test",
        title: "Chưa xác nhận liên cầu nhóm A",
        criteria:
          "Cần phân biệt viêm họng virus với viêm họng do Streptococcus pyogenes.",
        urgency: "Xác định chỉ định xét nghiệm trước khi kê kháng sinh.",
        regimens: [
          {
            title: "Đánh giá và xét nghiệm khi có chỉ định",
            indication:
              "Chưa xác nhận liên cầu nhóm A.",
            drugs: [
              "Đánh giá triệu chứng virus và nguy cơ GAS.",
              "Xét nghiệm nhanh hoặc cấy họng phù hợp.",
              "Điều trị triệu chứng khi chưa có chỉ định kháng sinh.",
            ],
            source: SOURCES.strep,
            verified: true,
          },
        ],
        warnings: [
          "Đau họng hoặc amidan có mủ không tự chứng minh nhiễm liên cầu nhóm A.",
          "Khó thở, nuốt nghẹn, khít hàm cần loại trừ biến chứng.",
        ],
      },
      {
        id: "strep-confirmed",
        title: "GAS đã xác nhận – không dị ứng penicillin",
        criteria:
          "Xét nghiệm phù hợp xác nhận liên cầu nhóm A.",
        urgency: "Ưu tiên kháng sinh phổ hẹp.",
        regimens: [
          {
            title: "Amoxicillin đơn trị",
            indication: "Lựa chọn đầu tay.",
            drugs: [
              "Amoxicillin uống: 50 mg/kg mỗi 24 giờ, tối đa 1.000 mg/ngày.",
              "HOẶC 25 mg/kg/lần mỗi 12 giờ, tối đa 500 mg/lần.",
            ],
            duration: "10 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
          {
            title: "Penicillin V đơn trị",
            indication: "Lựa chọn đầu tay khác.",
            drugs: [
              "Thanh thiếu niên/người lớn: penicillin V 500 mg uống mỗi 12 giờ HOẶC 250 mg uống mỗi 6 giờ.",
              "Trẻ em: 250 mg uống mỗi 12 giờ hoặc mỗi 8 giờ.",
            ],
            duration: "10 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
          {
            title: "Benzathine penicillin G – tiêm một liều",
            indication:
              "Cân nhắc khi cần bảo đảm tuân thủ điều trị.",
            drugs: [
              "Cân nặng dưới 27 kg: 600.000 đơn vị IM một lần.",
              "Cân nặng từ 27 kg: 1.200.000 đơn vị IM một lần.",
            ],
            duration: "Một liều.",
            source: SOURCES.strep,
            verified: true,
          },
        ],
        warnings: [
          "Chọn một phác đồ, không sử dụng đồng thời cả ba.",
          "Kiểm tra tiền sử phản vệ hoặc dị ứng penicillin trước khi dùng.",
        ],
      },
      {
        id: "strep-allergy",
        title: "Có tiền sử dị ứng penicillin",
        criteria:
          "Phân loại phản ứng dị ứng tức thì hay không tức thì trước lựa chọn.",
        urgency: "Đánh giá dị ứng và đề kháng địa phương.",
        regimens: [
          {
            title: "Cephalexin – không dị ứng tức thì",
            indication:
              "Chỉ khi không có phản ứng quá mẫn penicillin kiểu tức thì.",
            drugs: [
              "Cephalexin 20 mg/kg/lần uống mỗi 12 giờ, tối đa 500 mg/lần.",
            ],
            duration: "10 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
          {
            title: "Clindamycin – có điều kiện",
            indication:
              "Dị ứng cần tránh beta-lactam và dữ liệu nhạy cảm phù hợp.",
            drugs: [
              "Clindamycin 7 mg/kg/lần uống mỗi 8 giờ, tối đa 300 mg/lần.",
            ],
            duration: "10 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
          {
            title: "Azithromycin – có điều kiện",
            indication:
              "Khi lựa chọn macrolid phù hợp với nguy cơ đề kháng.",
            drugs: [
              "Ngày 1: 12 mg/kg, tối đa 500 mg.",
              "Ngày 2–5: 6 mg/kg/ngày, tối đa 250 mg/ngày.",
            ],
            duration: "5 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
          {
            title: "Cefadroxil – không dị ứng tức thì",
            indication:
              "Chỉ khi không có phản ứng quá mẫn penicillin kiểu tức thì.",
            drugs: [
              "Cefadroxil 30 mg/kg uống mỗi 24 giờ, tối đa 1 g/ngày.",
            ],
            duration: "10 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
          {
            title: "Clarithromycin – có điều kiện",
            indication:
              "Khi lựa chọn macrolid phù hợp với nguy cơ đề kháng.",
            drugs: [
              "Clarithromycin 7,5 mg/kg/lần uống mỗi 12 giờ, tối đa 250 mg/lần.",
            ],
            duration: "10 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
        ],
        warnings: [
          "Tránh cephalexin và cefadroxil nếu có dị ứng penicillin kiểu tức thì.",
          "Đề kháng macrolid và clindamycin thay đổi theo địa phương.",
        ],
      },
    ],
  },

  // 5. VIEM AMIDAN
  {
    name: "Viêm amidan cấp do vi khuẩn",
    scenarios: [
      {
        id: "tonsil",
        title: "Viêm amidan cấp không biến chứng",
        criteria:
          "Đánh giá căn nguyên virus, liên cầu nhóm A và biến chứng quanh amidan.",
        urgency: "Không mặc định sử dụng kháng sinh.",
        regimens: [
          {
            title: "Nếu xác nhận GAS: amoxicillin đơn trị",
            indication:
              "Viêm amidan do liên cầu nhóm A đã xác nhận.",
            drugs: [
              "Sử dụng liều amoxicillin tại mục Viêm họng liên cầu.",
            ],
            duration: "10 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
          {
            title: "Penicillin V đơn trị",
            indication:
              "Phương án khác khi xác nhận GAS.",
            drugs: [
              "Sử dụng liều theo mục Viêm họng liên cầu.",
            ],
            duration: "10 ngày.",
            source: SOURCES.strep,
            verified: true,
          },
          {
            title: "Không sử dụng kháng sinh khi nghi virus",
            indication:
              "Triệu chứng lâm sàng phù hợp căn nguyên virus.",
            drugs: [
              "Giảm đau, hạ sốt, bù dịch và theo dõi.",
            ],
            source: SOURCES.strep,
            verified: true,
          },
        ],
        warnings: [
          "Khít hàm, giọng ngậm hột thị, lệch lưỡi gà: đánh giá áp xe quanh amidan.",
        ],
      },
    ],
  },

  // 6. AP XE QUANH AMIDAN
  {
    name: "Áp xe quanh amidan",
    scenarios: [
      {
        id: "pta",
        title: "Áp xe quanh amidan đã xác định",
        criteria:
          "Đánh giá đường thở, mức độ mất nước, khả năng uống và chỉ định dẫn lưu.",
        urgency: "Hội chẩn Tai Mũi Họng sớm.",
        regimens: [
          {
            title: "Dẫn lưu + ampicillin/sulbactam IV",
            indication:
              "Người bệnh cần điều trị nội trú và có chỉ định kháng sinh IV.",
            drugs: [
              "Chọc hút hoặc dẫn lưu ổ áp xe khi có chỉ định.",
              "Ampicillin/sulbactam IV; liều theo chức năng thận và phác đồ đã thẩm định.",
            ],
            note:
              "Chưa xác minh đầy đủ liều và thời gian cho bệnh cảnh cụ thể.",
            source: SOURCES.review,
          },
          {
            title: "Dẫn lưu + amoxicillin/clavulanat uống",
            indication:
              "Người bệnh ổn định, dùng được đường uống và đủ điều kiện điều trị ngoại trú.",
            drugs: [
              "Kiểm soát ổ nhiễm.",
              "Amoxicillin/clavulanat uống; liều theo phác đồ chuyên khoa.",
            ],
            source: SOURCES.review,
          },
          {
            title: "Clindamycin – lựa chọn thay thế có điều kiện",
            indication:
              "Khi cần tránh beta-lactam và tình hình đề kháng phù hợp.",
            drugs: [
              "Clindamycin; xác minh liều, đường dùng và thời gian.",
            ],
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Không chỉ định hai phương án ampicillin/sulbactam và amoxicillin/clavulanat cùng lúc.",
          "Khó thở, nuốt nghẹn, nhiễm khuẩn lan rộng cần xử trí cấp cứu.",
        ],
      },
    ],
  },

  // 7. AP XE SAU HONG
  {
    name: "Áp xe sau họng",
    scenarios: [
      {
        id: "retropharyngeal",
        title: "Áp xe sau họng – điều trị nội trú",
        criteria:
          "Đánh giá đường thở, ổ áp xe, nhiễm khuẩn huyết và nguy cơ lan trung thất.",
        urgency: "Cấp cứu Tai Mũi Họng và gây mê khi cần.",
        regimens: [
          {
            title: "Ampicillin/sulbactam IV + đánh giá dẫn lưu",
            indication:
              "Một phương án nền khi chưa có nguy cơ đặc biệt; cần thẩm định trước dùng.",
            drugs: [
              "Ampicillin/sulbactam IV.",
              "Kiểm soát ổ nhiễm và quyết định dẫn lưu.",
            ],
            note:
              "Liều, thời gian và chỉ định phối hợp cần đối chiếu nguồn chuyên sâu.",
            source: SOURCES.review,
          },
          {
            title: "Bổ sung chống MRSA khi có nguy cơ",
            indication:
              "Tiền sử MRSA, nhiễm khuẩn nặng hoặc nguy cơ địa phương phù hợp.",
            drugs: [
              "Phác đồ nền Gram dương, Gram âm, kỵ khí phù hợp.",
              "Cân nhắc vancomycin theo AUC và chức năng thận khi có chỉ định.",
            ],
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Bảo vệ đường thở quan trọng hơn việc chọn thuốc trên ứng dụng.",
          "Không điều trị ngoại trú nếu có dấu hiệu đe dọa đường thở.",
        ],
      },
    ],
  },

  // 8. VIEM XOANG MAN
  {
    name: "Viêm xoang mạn đợt cấp nghi nhiễm khuẩn",
    scenarios: [
      {
        id: "chronic-sinus",
        title: "Đợt tăng triệu chứng viêm xoang mạn",
        criteria:
          "Đánh giá bằng chứng nhiễm khuẩn, polyp, tắc nghẽn và tiền sử sử dụng kháng sinh.",
        urgency: "Không tự động kê kháng sinh.",
        regimens: [
          {
            title: "Điều trị nền và đánh giá chuyên khoa",
            indication:
              "Không có bằng chứng rõ nhiễm khuẩn cần kháng sinh.",
            drugs: [
              "Rửa mũi nước muối.",
              "Corticosteroid tại chỗ khi có chỉ định.",
              "Đánh giá nội soi và bệnh nền.",
            ],
            source: SOURCES.review,
          },
          {
            title: "Kháng sinh khi đã xác định chỉ định",
            indication:
              "Có bằng chứng lâm sàng hoặc vi sinh phù hợp.",
            drugs: [
              "Lựa chọn theo đánh giá chuyên khoa, kết quả vi sinh và tiền sử điều trị.",
            ],
            note:
              "Không sao chép máy móc phác đồ viêm xoang cấp.",
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Đau mắt, giảm thị lực hoặc dấu thần kinh cần loại trừ biến chứng.",
        ],
      },
    ],
  },

  // 9. VIEM TAI GIUA CAP
  {
    name: "Viêm tai giữa cấp",
    scenarios: [
      {
        id: "aom-watch",
        title: "Không biến chứng – có thể theo dõi",
        criteria:
          "Đã xác nhận viêm tai giữa cấp; đánh giá tuổi, mức độ đau, sốt, chảy tai và hai bên.",
        urgency: "Không phải mọi trường hợp đều cần kháng sinh ngay.",
        regimens: [
          {
            title: "Giảm đau và theo dõi",
            indication:
              "Trường hợp đủ điều kiện theo dõi theo tuổi và mức độ.",
            drugs: [
              "Paracetamol hoặc ibuprofen khi phù hợp.",
              "Hẹn đánh giá lại và hướng dẫn dấu hiệu trở nặng.",
              "Đơn kháng sinh dự phòng (back-up): dùng nếu không cải thiện sau 3 ngày hoặc nặng lên nhanh.",
            ],
            note:
              "NICE NG91: kê kháng sinh ngay khi có chảy tai; cân nhắc ở trẻ < 2 tuổi viêm cả hai tai; kê ngay cho trẻ toàn thân rất không khỏe, có dấu hiệu bệnh nặng hơn hoặc nguy cơ biến chứng cao.",
            source: SOURCES.ear,
            verified: true,
          },
        ],
        warnings: [
          "Sưng đỏ sau tai, vành tai vểnh, liệt mặt hoặc dấu màng não cần đánh giá ngay.",
        ],
      },
      {
        id: "aom-treatment",
        title: "Trẻ em có chỉ định dùng kháng sinh",
        criteria:
          "Viêm tai giữa cấp đã xác định và có chỉ định điều trị.",
        urgency: "Phân tầng theo tuổi và tình trạng lâm sàng.",
        regimens: [
          {
            title: "Amoxicillin đơn trị",
            indication: "Lựa chọn đầu tay theo NICE NG91.",
            drugs: [
              "1–11 tháng: 125 mg uống 3 lần/ngày.",
              "1–4 tuổi: 250 mg uống 3 lần/ngày.",
              "5–17 tuổi: 500 mg uống 3 lần/ngày.",
            ],
            duration: "5–7 ngày.",
            note:
              "Liều theo nhóm tuổi trong NICE; cần kiểm tra trường hợp cân nặng bất thường và các điều kiện riêng.",
            source: SOURCES.ear,
            verified: true,
          },
          {
            title: "Amoxicillin/clavulanat – lựa chọn hàng hai",
            indication:
              "Khi không cải thiện với thuốc đầu tay sau đánh giá lại.",
            drugs: [
              "Amoxicillin/clavulanat uống, liều theo tuổi, cân nặng và chế phẩm.",
            ],
            duration: "5–7 ngày.",
            note:
              "NICE: dùng 3 lần/ngày nếu triệu chứng nặng lên sau ít nhất 2–3 ngày với thuốc đầu tay.",
            source: SOURCES.ear,
            verified: true,
          },
          {
            title: "Clarithromycin – dị ứng hoặc không dung nạp penicillin",
            indication:
              "Trẻ em dị ứng/không dung nạp penicillin (không dùng khi mang thai).",
            drugs: [
              "Clarithromycin uống 2 lần/ngày; 12–17 tuổi: 250–500 mg/lần.",
              "1 tháng–11 tuổi: liều theo nhóm cân nặng trong bảng NICE NG91; cần tra bảng gốc.",
            ],
            duration: "5–7 ngày.",
            note:
              "Liều trẻ nhỏ chưa nhập đầy đủ vì cần bảng cân nặng của NICE.",
            source: SOURCES.ear,
          },
        ],
        warnings: [
          "Không áp dụng máy móc phác đồ trẻ em cho người lớn.",
          "Đánh giá tình trạng màng nhĩ và biến chứng.",
        ],
      },
    ],
  },

  // 10. VIEM TAI NGOAI CAP
  {
    name: "Viêm tai ngoài cấp",
    scenarios: [
      {
        id: "otitis-externa",
        title: "Viêm tai ngoài cấp không biến chứng",
        criteria:
          "Viêm khu trú ống tai ngoài, chưa có lan rộng và không có biến chứng.",
        urgency: "Ưu tiên điều trị tại chỗ.",
        regimens: [
          {
            title: "Làm sạch tai + kháng sinh nhỏ tai phù hợp",
            indication:
              "Viêm tai ngoài không biến chứng.",
            drugs: [
              "Làm sạch tai theo chỉ định chuyên khoa.",
              "Thuốc nhỏ tai có hoạt tính kháng khuẩn phù hợp.",
              "Nếu nghi thủng màng nhĩ, ưu tiên chế phẩm không độc tai.",
            ],
            source: SOURCES.review,
          },
          {
            title: "Kháng sinh toàn thân – có điều kiện",
            indication:
              "Nhiễm khuẩn lan ra ngoài ống tai hoặc có nguy cơ biến chứng.",
            drugs: [
              "Lựa chọn theo tác nhân nghi ngờ, mức độ và antibiogram.",
            ],
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Không mặc định dùng kháng sinh uống cho viêm tai ngoài đơn thuần.",
          "Tránh thuốc nhỏ tai có nguy cơ độc tai khi màng nhĩ không nguyên vẹn.",
        ],
      },
    ],
  },

  // 11. VIEM TAI NGOAI AC TINH
  {
    name: "Viêm tai ngoài ác tính",
    scenarios: [
      {
        id: "necrotizing-oe",
        title: "Viêm tai ngoài hoại tử",
        criteria:
          "Đau tai dữ dội, kéo dài; thường có đái tháo đường hoặc suy giảm miễn dịch.",
        urgency: "Khám chuyên khoa khẩn, đánh giá viêm xương nền sọ.",
        regimens: [
          {
            title: "Điều trị hướng Pseudomonas theo vi sinh",
            indication:
              "Nghi ngờ hoặc xác định nhiễm khuẩn xâm lấn.",
            drugs: [
              "Cân nhắc ciprofloxacin khi phù hợp với AST và bệnh cảnh.",
              "Trường hợp cần IV: xem xét cefepim, ceftazidim hoặc piperacillin/tazobactam theo phác đồ chuyên khoa.",
            ],
            note:
              "Các thuốc được liệt kê là lựa chọn thay thế, không phối hợp tất cả.",
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Cần lấy mẫu vi sinh và đánh giá chẩn đoán hình ảnh.",
          "Tổn thương dây thần kinh sọ hoặc đau tăng phải đánh giá cấp cứu.",
        ],
      },
    ],
  },

  // 12. VIEM XUONG CHUM
  {
    name: "Viêm xương chũm",
    scenarios: [
      {
        id: "mastoid",
        title: "Viêm xương chũm cấp",
        criteria:
          "Sưng đau sau tai, vành tai vểnh, sốt, có thể có biến chứng.",
        urgency: "Nhập viện và hội chẩn Tai Mũi Họng.",
        regimens: [
          {
            title: "Kháng sinh IV + kiểm soát ổ nhiễm",
            indication:
              "Viêm xương chũm cần điều trị nội trú.",
            drugs: [
              "Lựa chọn beta-lactam hoặc cephalosporin thích hợp theo căn nguyên và dữ liệu địa phương.",
              "Đánh giá chỉ định dẫn lưu, chích rạch màng nhĩ hoặc phẫu thuật.",
            ],
            note:
              "Liều và phối hợp chưa được xác minh đủ để trình bày thành y lệnh.",
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Cần loại trừ áp xe dưới màng xương và biến chứng nội sọ.",
        ],
      },
    ],
  },

  // 13. VIEM THANH THIET CAP
  {
    name: "Viêm thanh thiệt cấp",
    scenarios: [
      {
        id: "epiglottitis",
        title: "Viêm thanh thiệt cấp nghi do vi khuẩn",
        criteria:
          "Đau họng dữ dội, nuốt đau, giọng thay đổi, chảy nước dãi hoặc thở rít.",
        urgency: "CẤP CỨU ĐƯỜNG THỞ.",
        regimens: [
          {
            title: "Bảo vệ đường thở + kháng sinh IV",
            indication:
              "Nghi ngờ viêm thanh thiệt do vi khuẩn.",
            drugs: [
              "Ưu tiên đánh giá và bảo vệ đường thở.",
              "Ceftriaxon IV là một thuốc thường được cân nhắc; liều cần đối chiếu theo tuổi và bệnh cảnh.",
              "Bổ sung thuốc chống MRSA nếu có chỉ định.",
            ],
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Không trì hoãn xử trí đường thở để lựa chọn kháng sinh.",
          "Tránh thao tác kích thích họng khi đường thở chưa an toàn.",
        ],
      },
    ],
  },

  // 14. VIEM TUYEN NUOC BOT
  {
    name: "Viêm tuyến nước bọt cấp sinh mủ",
    scenarios: [
      {
        id: "sialadenitis",
        title: "Viêm tuyến nước bọt do vi khuẩn",
        criteria:
          "Sưng đau tuyến, có thể có mủ tại miệng ống tuyến.",
        urgency: "Đánh giá tắc nghẽn và ổ áp xe.",
        regimens: [
          {
            title: "Amoxicillin/clavulanat uống – có điều kiện",
            indication:
              "Người bệnh ổn định, phù hợp điều trị đường uống.",
            drugs: [
              "Bù dịch và chăm sóc miệng.",
              "Amoxicillin/clavulanat uống; xác minh liều theo tình trạng và chức năng thận.",
            ],
            source: SOURCES.review,
          },
          {
            title: "Ampicillin/sulbactam IV – có điều kiện",
            indication:
              "Người bệnh cần điều trị nội trú.",
            drugs: [
              "Ampicillin/sulbactam IV.",
              "Dẫn lưu khi có ổ áp xe hoặc chỉ định ngoại khoa.",
            ],
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Không phối hợp hai beta-lactam nêu trên.",
          "Đánh giá nguy cơ MRSA và nhiễm khuẩn huyết.",
        ],
      },
    ],
  },

  // 15. NHIEM KHUAN KHOANG CO SAU
  {
    name: "Nhiễm khuẩn khoang cổ sâu",
    scenarios: [
      {
        id: "deep-neck",
        title: "Nhiễm khuẩn sâu vùng cổ",
        criteria:
          "Đánh giá nguồn răng/TMH, mức độ tắc nghẽn đường thở và ổ áp xe.",
        urgency: "ƯU TIÊN ĐƯỜNG THỞ VÀ KIỂM SOÁT Ổ NHIỄM.",
        regimens: [
          {
            title: "Ampicillin/sulbactam IV + kiểm soát ổ nhiễm",
            indication:
              "Một phương án nền cần đánh giá theo bệnh cảnh và dữ liệu địa phương.",
            drugs: [
              "Ampicillin/sulbactam IV; cần xác minh liều.",
              "Dẫn lưu ổ mủ khi có chỉ định.",
            ],
            source: SOURCES.review,
          },
          {
            title: "Phác đồ mở rộng – chỉ khi có chỉ định",
            indication:
              "Nhiễm khuẩn nặng, nguy cơ tác nhân kháng thuốc hoặc MRSA.",
            drugs: [
              "Chọn beta-lactam phù hợp phổ tác dụng và nguồn nhiễm.",
              "Bổ sung chống MRSA khi có nguy cơ thực sự.",
              "Điều chỉnh theo vi sinh và kiểm soát ổ nhiễm.",
            ],
            source: SOURCES.review,
          },
        ],
        warnings: [
          "Nguy cơ lan trung thất và sốc nhiễm khuẩn.",
          "Không điều trị chỉ bằng kháng sinh nếu có chỉ định dẫn lưu.",
        ],
      },
    ],
  },

  // 16. VIEM TAI GIUA MAN CHAY MU
  {
    name: "Viêm tai giữa mạn chảy mủ",
    scenarios: [
      {
        id: "csom",
        title: "Viêm tai giữa mạn chảy mủ không biến chứng",
        criteria:
          "Đánh giá lỗ thủng màng nhĩ, cholesteatoma và nhiễm khuẩn lan rộng.",
        urgency: "Ưu tiên kiểm soát tại chỗ và đánh giá chuyên khoa.",
        regimens: [
          {
            title: "Làm sạch tai + thuốc nhỏ tai không độc tai",
            indication:
              "Bệnh chưa có biến chứng xâm lấn.",
            drugs: [
              "Làm sạch tai theo hướng dẫn chuyên khoa.",
              "Cân nhắc fluoroquinolon nhỏ tai phù hợp với tình trạng màng nhĩ.",
            ],
            note:
              "Không dùng kháng sinh toàn thân thường quy khi chưa có chỉ định.",
            source: SOURCES.review,
          },
          {
            title: "Nhiễm khuẩn phức tạp hoặc cholesteatoma",
            indication:
              "Có biến chứng hoặc cần can thiệp chuyên khoa.",
            drugs: [
              "Cấy dịch tai khi phù hợp.",
              "Đánh giá chẩn đoán hình ảnh.",
              "Kháng sinh toàn thân theo căn nguyên và ổ nhiễm khi có chỉ định.",
              "Hội chẩn phẫu thuật nếu có cholesteatoma.",
            ],
            source: SOURCES.byt,
          },
        ],
        warnings: [
          "Không dùng thuốc nhỏ tai có nguy cơ độc tai khi thủng màng nhĩ.",
          "Liệt mặt, chóng mặt, đau đầu hoặc viêm xương chũm là dấu hiệu nguy hiểm.",
        ],
      },
    ],
  },
];

// CHUAN HOA TEN BENH, BAO GOM TEN TRUNG
function normalize(value: string) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const DISEASE_MAP = new Map<string, EntDisease>();

for (const disease of ENT_DISEASES) {
  DISEASE_MAP.set(normalize(disease.name), disease);

  for (const alias of disease.aliases ?? []) {
    DISEASE_MAP.set(normalize(alias), disease);
  }
}

export const ENT_DISEASE_TITLES = ENT_DISEASES.flatMap(
  (disease) => [disease.name, ...(disease.aliases ?? [])]
);

export function isEntDisease(name: string) {
  return DISEASE_MAP.has(normalize(name));
}

export default function EntEmpiricGuidelines({
  diseaseName,
  initialScenarioId,
}: {
  diseaseName: string;
  initialScenarioId?: string;
}) {
  const [scenarioId, setScenarioId] = useState(
    initialScenarioId ?? ""
  );
  const [openedPlan, setOpenedPlan] = useState("");

  const disease = DISEASE_MAP.get(normalize(diseaseName));
  const scenarios = disease?.scenarios ?? [];

  const scenario =
    scenarios.find((item) => item.id === scenarioId) ??
    scenarios[0];

  if (!disease || !scenario) {
    return (
      <div style={{ padding: 16 }}>
        Chưa tìm thấy dữ liệu cho mặt bệnh: {diseaseName}
      </div>
    );
  }

  return (
    <div className="ent199">
      <style>{`
        .ent199 {
          display: grid;
          gap: 12px;
          min-width: 0;
          color: #17364b;
          font-family: inherit;
        }

        .ent199 * {
          box-sizing: border-box;
        }

        .ent199-card {
          padding: 15px;
          background: #ffffff;
          border: 1px solid #dce6ed;
          border-radius: 12px;
          min-width: 0;
        }

        .ent199-label {
          font-size: 11px;
          font-weight: 700;
          color: #087f89;
          letter-spacing: 0.3px;
        }

        .ent199 h2 {
          font-size: 19px;
          margin: 8px 0;
        }

        .ent199 h3 {
          font-size: 16px;
          margin: 0 0 12px;
        }

        .ent199-small {
          font-size: 12px;
          color: #61798b;
          line-height: 1.75;
        }

        .ent199-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .ent199-option {
          padding: 11px 12px;
          border: 1px solid #dce6ed;
          border-radius: 9px;
          background: #ffffff;
          cursor: pointer;
          text-align: left;
          color: #17364b;
          font-size: 12px;
          line-height: 1.6;
        }

        .ent199-option.active {
          background: #e4f6f2;
          border-color: #069b9a;
          font-weight: 700;
        }

        .ent199-alert {
          padding: 11px;
          background: #fff7e9;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.8;
          margin-top: 10px;
        }

        .ent199-plan {
          border: 1px solid #dce6ed;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 9px;
        }

        .ent199-plan-button {
          width: 100%;
          padding: 13px;
          border: none;
          background: white;
          color: #17364b;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }

        .ent199-plan-button.open {
          background: #e9f8f5;
        }

        .ent199-plan-details {
          padding: 13px;
          border-top: 1px solid #dce6ed;
          font-size: 13px;
          line-height: 1.8;
        }

        .ent199-drug {
          padding: 10px 11px;
          background: #f4f9fb;
          border-radius: 8px;
          margin: 7px 0;
        }

        .ent199 ul {
          padding-left: 20px;
          margin: 8px 0;
        }

        .ent199 li {
          margin-bottom: 6px;
          line-height: 1.75;
          font-size: 13px;
        }

        .ent199 summary {
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        .ent199 a {
          color: #087f89;
          overflow-wrap: anywhere;
        }

        @media (max-width: 700px) {
          .ent199-card {
            padding: 12px;
          }

          .ent199-option {
            width: 100%;
          }
        }
      `}</style>

      <section className="ent199-card">
        <div className="ent199-label">
          TAI MŨI HỌNG · ĐIỀU TRỊ THEO BỆNH CẢNH
        </div>

        <h2>{disease.name}</h2>

        <div className="ent199-small">
          Dữ liệu Bộ Y tế và hướng dẫn quốc tế được
          phân biệt theo từng lựa chọn. Những nhánh
          chưa đủ bằng chứng hoặc liều cần thẩm định
          trước khi áp dụng lâm sàng.
        </div>
      </section>

      <section className="ent199-card">
        <h3>Chọn tình huống lâm sàng</h3>

        <div className="ent199-options">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                "ent199-option" +
                (scenario.id === item.id ? " active" : "")
              }
              aria-pressed={scenario.id === item.id}
              onClick={() => {
                setScenarioId(item.id);
                setOpenedPlan("");
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        <p className="ent199-small">
          {scenario.criteria}
        </p>

        <div className="ent199-alert">
          <strong>Mức độ ưu tiên: </strong>
          {scenario.urgency}
        </div>
      </section>

      <section className="ent199-card">
        <h3>
          Lựa chọn điều trị ({scenario.regimens.length})
        </h3>

        <p className="ent199-small">
          Mỗi thẻ là một phương án. Không tự ghép thuốc
          giữa các thẻ và không coi những lựa chọn
          chưa thẩm định là y lệnh điều trị.
        </p>

        {scenario.regimens.map((plan, index) => {
          const planKey = `${scenario.id}-${index}`;
          const isOpen = openedPlan === planKey;

          return (
            <article
              key={planKey}
              className="ent199-plan"
            >
              <button
                type="button"
                className={
                  "ent199-plan-button" +
                  (isOpen ? " open" : "")
                }
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenedPlan(
                    isOpen ? "" : planKey
                  )
                }
              >
                <strong>{plan.title}</strong>

                <span style={{
                  fontSize: 20,
                  color: "#087f89",
                }}>
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="ent199-plan-details">
                  <div>
                    <strong>Điều kiện áp dụng:</strong>
                    <div>{plan.indication}</div>
                  </div>

                  <div style={{ marginTop: 11 }}>
                    <strong>Điều trị/thuốc:</strong>

                    {plan.drugs.map((drug, drugIndex) => (
                      <div
                        key={`${planKey}-${drugIndex}`}
                        className="ent199-drug"
                      >
                        {drug}
                      </div>
                    ))}

                    <DrugActionLinks
                      compact
                      texts={plan.drugs}
                      scenario={plan.title}
                    />
                  </div>

                  {plan.duration && (
                    <p>
                      <strong>Thời gian: </strong>
                      {plan.duration}
                    </p>
                  )}

                  {plan.note && (
                    <p>
                      <strong>Lưu ý: </strong>
                      {plan.note}
                    </p>
                  )}

                  <p className="ent199-small">
                    <strong>Nguồn: </strong>
                    {plan.source}
                  </p>

                  {!plan.verified && (
                    <div className="ent199-alert">
                      <strong>Cần thẩm định:</strong>{" "}
                      Chưa xác minh đầy đủ tất cả điều
                      kiện, liều, đường dùng hoặc thời
                      gian cho phương án này. Không
                      chuyển trực tiếp thành đơn thuốc.
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="ent199-card">
        <details>
          <summary>
            Dấu hiệu nguy hiểm và kiểm tra trước điều trị
          </summary>

          <ul>
            {scenario.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}

            <li>
              Kiểm tra tuổi, cân nặng, thai kỳ,
              dị ứng, chức năng thận và tương tác thuốc.
            </li>

            <li>
              Đối chiếu danh mục thuốc, antibiogram,
              AST/MIC và dữ liệu BV199 khi phù hợp.
            </li>

            <li>
              Đánh giá lại đáp ứng và chỉ định
              xuống thang khi có kết quả vi sinh.
            </li>
          </ul>
        </details>
      </section>

      <section className="ent199-card">
        <details>
          <summary>
            Tài liệu tham khảo và tình trạng thẩm định
          </summary>

          <div className="ent199-small">
            <p>{SOURCES.byt}</p>
            <p>{SOURCES.sinus}</p>
            <p>{SOURCES.strep}</p>
            <p>{SOURCES.ear}</p>

            <p>
              <a
                href="https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                CDC – Liên cầu nhóm A
              </a>
            </p>

            <p>
              <a
                href="https://www.nice.org.uk/guidance/ng91/chapter/Recommendations"
                target="_blank"
                rel="noopener noreferrer"
              >
                NICE – Viêm tai giữa cấp
              </a>
            </p>

            <p>
              Dữ liệu chưa được Hội đồng chuyên môn
              BV199 phê duyệt thành phác đồ nội viện.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
