/* =========================================================
   ADMIN MODULES
   BV199 CLINICAL PHARMACY
========================================================= */

export type AdminModule = {
  id: string;

  title: string;

  shortTitle: string;

  description: string;

  icon: string;

  href: string;

  features: string[];

  status:
    | "ready"
    | "developing"
    | "planned";
};

export const adminModules:
  AdminModule[] = [
    {
      id:
        "users",

      title:
        "Người dùng & phân quyền",

      shortTitle:
        "Người dùng",

      description:
        "Quản lý tài khoản người dùng, đơn vị công tác, trạng thái và quyền truy cập hệ thống.",

      icon:
        "ND",

      href:
        "/admin/users",

      status:
        "developing",

      features: [
        "Tài khoản",
        "Họ tên",
        "Khoa/phòng",
        "Vai trò",
        "Trạng thái",
        "Phân quyền truy cập",
      ],
    },

    {
      id:
        "roles",

      title:
        "Vai trò hệ thống",

      shortTitle:
        "Vai trò",

      description:
        "Thiết lập role-based access control (RBAC) cho bác sĩ, dược sĩ, điều dưỡng, vi sinh và quản trị.",

      icon:
        "VT",

      href:
        "/admin/roles",

      status:
        "developing",

      features: [
        "Super Admin",
        "Quản trị Khoa Dược",
        "Dược sĩ lâm sàng",
        "Bác sĩ",
        "Điều dưỡng",
        "Vi sinh",
        "Viewer",
      ],
    },

    {
      id:
        "drugs",

      title:
        "Danh mục thuốc",

      shortTitle:
        "Thuốc",

      description:
        "Quản lý toàn bộ biệt dược, hàm lượng, dạng bào chế, đường dùng và trạng thái sử dụng tại BV199.",

      icon:
        "TH",

      href:
        "/admin/drugs",

      status:
        "developing",

      features: [
        "Biệt dược",
        "Hoạt chất",
        "Hàm lượng",
        "Dạng bào chế",
        "Đường dùng",
        "Nhà sản xuất",
        "TDM",
        "LASA",
        "High-alert",
        "Hiệu chỉnh thận",
      ],
    },

    {
      id:
        "ingredients",

      title:
        "Danh mục hoạt chất",

      shortTitle:
        "Hoạt chất",

      description:
        "Chuẩn hóa hoạt chất dùng chung giữa Drug Master, PK/PD, TDM và AMS.",

      icon:
        "HC",

      href:
        "/admin/ingredients",

      status:
        "developing",

      features: [
        "Tên hoạt chất",
        "ATC",
        "Nhóm dược lý",
        "PK/PD",
        "TDM",
        "AWaRe",
      ],
    },

    {
      id:
        "departments",

      title:
        "Danh mục khoa/phòng",

      shortTitle:
        "Khoa/phòng",

      description:
        "Danh sách khoa, phòng và đơn vị sử dụng chung cho Antibiogram, TDM, AMS và báo cáo.",

      icon:
        "KP",

      href:
        "/admin/departments",

      status:
        "developing",

      features: [
        "Tên đơn vị",
        "Mã khoa",
        "Khối",
        "Lâm sàng",
        "Trạng thái",
      ],
    },

    {
      id:
        "organisms",

      title:
        "Danh mục vi khuẩn",

      shortTitle:
        "Vi khuẩn",

      description:
        "Chuẩn hóa tên vi sinh vật phục vụ AST, antibiogram và lựa chọn kháng sinh theo vi khuẩn.",

      icon:
        "VK",

      href:
        "/admin/organisms",

      status:
        "developing",

      features: [
        "Tên khoa học",
        "Tên hiển thị",
        "Gram",
        "Mã chuẩn",
        "AST",
      ],
    },

    {
      id:
        "antibiotics",

      title:
        "Danh mục kháng sinh",

      shortTitle:
        "Kháng sinh",

      description:
        "Quản lý danh mục kháng sinh và mapping giữa tên thuốc, mã AST và dữ liệu antibiogram.",

      icon:
        "KS",

      href:
        "/admin/antibiotics",

      status:
        "developing",

      features: [
        "Tên kháng sinh",
        "Mã AST",
        "Nhóm",
        "AWaRe",
        "PK/PD",
        "TDM",
      ],
    },

    {
      id:
        "references",

      title:
        "Nguồn tài liệu",

      shortTitle:
        "Tài liệu",

      description:
        "Quản lý nguồn bằng chứng cho các module lâm sàng.",

      icon:
        "TL",

      href:
        "/admin/references",

      status:
        "developing",

      features: [
        "Tên tài liệu",
        "Tổ chức",
        "Năm",
        "URL",
        "Module áp dụng",
      ],
    },

    {
      id:
        "guidelines",

      title:
        "Phiên bản guideline",

      shortTitle:
        "Guideline",

      description:
        "Theo dõi phiên bản CLSI, guideline Bộ Y tế, IDSA và quy trình nội bộ.",

      icon:
        "GL",

      href:
        "/admin/guidelines",

      status:
        "developing",

      features: [
        "Tên guideline",
        "Phiên bản",
        "Ngày hiệu lực",
        "Trạng thái",
        "Module liên quan",
      ],
    },

    {
      id:
        "audit-log",

      title:
        "Nhật ký thay đổi",

      shortTitle:
        "Audit log",

      description:
        "Theo dõi lịch sử thay đổi dữ liệu và cấu hình quan trọng.",

      icon:
        "NK",

      href:
        "/admin/audit-log",

      status:
        "planned",

      features: [
        "Người thay đổi",
        "Thời gian",
        "Dữ liệu cũ",
        "Dữ liệu mới",
        "Module",
      ],
    },

    {
      id:
        "settings",

      title:
        "Cấu hình hệ thống",

      shortTitle:
        "Cấu hình",

      description:
        "Thiết lập cấu hình chung cho app BV199 Clinical Pharmacy.",

      icon:
        "CH",

      href:
        "/admin/settings",

      status:
        "planned",

      features: [
        "Tên hệ thống",
        "SmartDose",
        "CLSI",
        "Đường dẫn dữ liệu",
        "Cấu hình hiển thị",
      ],
    },
  ];

export function getAdminModule(
  id: string
) {
  return (
    adminModules.find(
      (
        module
      ) =>
        module.id ===
        id
    ) ?? null
  );
}