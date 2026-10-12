import type { ToolItem } from "@/components/ToolCard";

export type HomeSection = {
  number: string;
  title: string;
  description: string;
  tools: ToolItem[];
};

export const homeSections: HomeSection[] = [
  {
    number: "01",
    title: "Hỗ trợ điều trị",
    description:
      "Các công cụ hỗ trợ bác sĩ và dược sĩ trong thực hành điều trị và tối ưu hóa sử dụng thuốc.",
    tools: [
      {
        title: "Hiệu chỉnh liều theo chức năng thận",
        description:
          "Tính CrCl, đánh giá chức năng thận và hỗ trợ hiệu chỉnh liều thuốc.",
        href: "/renal-dose",
        status: "active",
      },
      {
        title: "PK/PD kháng sinh",
        description:
          "Hỗ trợ đánh giá các chỉ số PK/PD và tối ưu hóa chế độ liều kháng sinh.",
        href: "/PKPD",
        status: "active",
      },
      {
        title: "Kháng sinh dự phòng phẫu thuật",
        description:
          "Lựa chọn kháng sinh, liều, thời điểm sử dụng, nhắc lại liều và thời gian ngừng.",
        href: "/surgical-prophylaxis",
        status: "development",
      },
      {
        title: "TDM",
        description:
          "Theo dõi nồng độ thuốc trong điều trị và hỗ trợ hiệu chỉnh liều.",
        href: "/tdm",
        status: "development",
      },
      {
        title: "Tương tác thuốc",
        description:
          "Phát hiện và đánh giá các tương tác thuốc có ý nghĩa lâm sàng.",
        href: "/drug-interactions",
        status: "development",
      },
      {
        title: "Công cụ tính liều",
        description:
          "Các công cụ tính liều theo cân nặng, tuổi và đặc điểm người bệnh.",
        href: "/dose-calculator",
        status: "development",
      },
    ],
  },

  {
    number: "02",
    title: "Thông tin thuốc",
    description:
      "Tra cứu danh mục thuốc và thông tin sử dụng thuốc phục vụ thực hành Dược lâm sàng tại Bệnh viện 199.",
    tools: [
      {
        title: "Danh mục thuốc BV199",
        description:
          "Tra cứu thuốc theo tên thuốc, hoạt chất, hàm lượng, dạng bào chế và nhà sản xuất.",
        href: "/drugs",
        status: "active",
      },
      {
        title: "Thông tin thuốc",
        description:
          "Tra cứu chỉ định, liều dùng, chống chỉ định, cảnh báo, ADR và thông tin Dược lâm sàng.",
        href: "/drugs",
        status: "active",
      },
      {
        title: "Thuốc LASA",
        description:
          "Quản lý thuốc Look-Alike Sound-Alike và các biện pháp phòng ngừa nhầm lẫn.",
        href: "/lasa",
        status: "development",
      },
      {
        title: "Thuốc nguy cơ cao",
        description:
          "Danh mục và hướng dẫn quản lý các thuốc có nguy cơ cao tại bệnh viện.",
        href: "/high-alert",
        status: "development",
      },
      {
        title: "Cảnh báo thuốc",
        description:
          "Thông tin cảnh báo an toàn thuốc và các vấn đề cần lưu ý khi sử dụng thuốc.",
        href: "/drug-alerts",
        status: "development",
      },
    ],
  },

  {
    number: "03",
    title: "Cảnh giác Dược",
    description:
      "Hỗ trợ phát hiện, đánh giá, báo cáo và theo dõi phản ứng có hại của thuốc.",
    tools: [
      {
        title: "Báo cáo ADR",
        description:
          "Ghi nhận và chuẩn hóa thông tin báo cáo phản ứng có hại của thuốc.",
        href: "/pharmacovigilance/adr-report",
        status: "development",
      },
      {
        title: "Đánh giá ADR",
        description:
          "Đánh giá mức độ nghiêm trọng, khả năng phòng tránh và các yếu tố liên quan.",
        href: "/pharmacovigilance/adr-assessment",
        status: "development",
      },
      {
        title: "Thang Naranjo",
        description:
          "Đánh giá mối liên quan giữa thuốc nghi ngờ và biến cố bất lợi.",
        href: "/pharmacovigilance/naranjo",
        status: "development",
      },
      {
        title: "Thống kê ADR",
        description:
          "Tổng hợp ADR theo thuốc, khoa lâm sàng, mức độ và khoảng thời gian.",
        href: "/pharmacovigilance/statistics",
        status: "development",
      },
    ],
  },

  {
    number: "04",
    title: "Hoạt động Dược lâm sàng",
    description:
      "Ghi nhận, quản lý và đánh giá hoạt động chuyên môn của Dược sĩ lâm sàng.",
    tools: [
      {
        title: "Rà soát bệnh án",
        description:
          "Ghi nhận bệnh án được rà soát và các vấn đề liên quan đến thuốc.",
        href: "/clinical-pharmacy/review",
        status: "development",
      },
      {
        title: "Can thiệp Dược lâm sàng",
        description:
          "Ghi nhận DRP, khuyến cáo của Dược sĩ và mức độ chấp nhận của bác sĩ.",
        href: "/clinical-pharmacy/interventions",
        status: "development",
      },
      {
        title: "Hội chẩn Dược lâm sàng",
        description:
          "Quản lý các trường hợp hội chẩn liên quan đến thuốc và điều trị.",
        href: "/clinical-pharmacy/consultation",
        status: "development",
      },
      {
        title: "Tư vấn thông tin thuốc",
        description:
          "Tiếp nhận, xử lý và lưu trữ câu hỏi thông tin thuốc từ các khoa lâm sàng.",
        href: "/clinical-pharmacy/drug-information",
        status: "development",
      },
      {
        title: "Theo dõi người bệnh",
        description:
          "Theo dõi các trường hợp cần giám sát Dược lâm sàng liên tục.",
        href: "/clinical-pharmacy/patients",
        status: "development",
      },
    ],
  },

  {
    number: "05",
    title: "Quản lý sử dụng kháng sinh",
    description:
      "Hỗ trợ chương trình quản lý sử dụng kháng sinh tại bệnh viện.",
    tools: [
      {
        title: "AMS",
        description:
          "Quản lý và theo dõi chương trình quản lý sử dụng kháng sinh.",
        href: "/ams",
        status: "development",
      },
      {
        title: "Kháng sinh kiểm soát",
        description:
          "Theo dõi chỉ định và phê duyệt kháng sinh thuộc danh mục kiểm soát.",
        href: "/ams/restricted-antibiotics",
        status: "development",
      },
      {
        title: "DDD",
        description:
          "Theo dõi DDD và DDD/100 ngày giường.",
        href: "/ams/ddd",
        status: "development",
      },
      {
        title: "DOT",
        description:
          "Theo dõi Days of Therapy và DOT/100 ngày giường.",
        href: "/ams/dot",
        status: "development",
      },
      {
        title: "Antibiogram",
        description:
          "Theo dõi dữ liệu vi sinh và tỷ lệ nhạy cảm kháng sinh.",
        href: "/ams/antibiogram",
        status: "development",
      },
      {
        title: "Báo cáo AMS",
        description:
          "Tổng hợp các chỉ số sử dụng kháng sinh.",
        href: "/ams/reports",
        status: "development",
      },
    ],
  },

  {
    number: "06",
    title: "Báo cáo & Dashboard",
    description:
      "Tổng hợp các chỉ số hoạt động Dược lâm sàng phục vụ chuyên môn và quản lý.",
    tools: [
      {
        title: "Dashboard Dược lâm sàng",
        description:
          "Theo dõi các KPI Dược lâm sàng.",
        href: "/dashboard",
        status: "development",
      },
      {
        title: "Báo cáo tháng",
        description:
          "Tổng hợp hoạt động Dược lâm sàng theo tháng.",
        href: "/reports/monthly",
        status: "development",
      },
      {
        title: "Báo cáo quý",
        description:
          "Tổng hợp và so sánh các chỉ số theo quý.",
        href: "/reports/quarterly",
        status: "development",
      },
      {
        title: "Báo cáo năm",
        description:
          "Tổng hợp hoạt động Dược lâm sàng toàn năm.",
        href: "/reports/annual",
        status: "development",
      },
      {
        title: "Báo cáo can thiệp",
        description:
          "Phân tích số lượng, loại và tỷ lệ chấp nhận can thiệp Dược lâm sàng.",
        href: "/reports/interventions",
        status: "development",
      },
      {
        title: "Báo cáo ADR",
        description:
          "Thống kê phản ứng có hại của thuốc.",
        href: "/reports/adr",
        status: "development",
      },
    ],
  },

  {
    number: "07",
    title: "Quản trị hệ thống",
    description:
      "Quản lý người dùng, phân quyền, danh mục và lịch sử hoạt động.",
    tools: [
      {
        title: "Người dùng",
        description:
          "Quản lý tài khoản người dùng hệ thống.",
        href: "/admin/users",
        status: "development",
      },
      {
        title: "Phân quyền",
        description:
          "Phân quyền truy cập theo vai trò.",
        href: "/admin/roles",
        status: "development",
      },
      {
        title: "Quản lý danh mục",
        description:
          "Quản lý danh mục thuốc, khoa phòng và dữ liệu dùng chung.",
        href: "/admin/master-data",
        status: "development",
      },
      {
        title: "Nguồn tài liệu",
        description:
          "Quản lý tài liệu tham khảo và ngày cập nhật.",
        href: "/admin/references",
        status: "development",
      },
      {
        title: "Audit log",
        description:
          "Theo dõi lịch sử chỉnh sửa và hoạt động người dùng.",
        href: "/admin/audit-log",
        status: "development",
      },
    ],
  },
];