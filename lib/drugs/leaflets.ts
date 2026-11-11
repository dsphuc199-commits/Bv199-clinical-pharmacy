/*
  Noi dung trich tu To huong dan su dung (HDSD) cong bo tren Cong Cuc Quan ly Duoc.
  Tao boi scripts/extract-leaflets.mjs -> data/leaflets/<davId>.json. Chi dung phia may chu.
*/

export type LeafletSectionKey =
  | "thanhPhan" | "dangBaoChe" | "chiDinh" | "lieuDung" | "chongChiDinh" | "canhBao" | "thaiKy" | "laiXe"
  | "tuongTac" | "tuongKy" | "tacDungPhu" | "quaLieu" | "duocLuc" | "duocDong" | "dongGoi" | "baoQuan" | "hanDung";

export type Leaflet = {
  davId?: number;
  productId?: string;
  notFound?: boolean;
  soDangKy: string | null;
  tenThuoc: string | null;
  failed?: boolean;
  error?: string;
  source?: { title: string; url: string; site?: string };
  method?: "text" | "ocr" | "mixed" | "web";
  confidence?: number | null;
  pages?: number;
  totalPages?: number;
  extractedAt: string;
  reviewed?: boolean;
  /* Nguon web: "sdk" = trang ghi trung so dang ky; "ten-nha-san-xuat" = trung ten thuoc va nha san xuat. */
  matchedBy?: "sdk" | "ten-nha-san-xuat";
  sections?: Partial<Record<LeafletSectionKey, string>>;
  rawText?: string;
};

/* Thu tu va nhom hien thi theo trinh tu lam sang: dung thuoc -> an toan -> tuong tac -> duoc ly -> bao che. */
export const LEAFLET_GROUPS = {
  dung: "Sử dụng thuốc",
  antoan: "An toàn",
  tuongtac: "Tương tác",
  duocly: "Dược lý",
  baoche: "Bào chế – Bảo quản",
} as const;

export const LEAFLET_SECTIONS: { key: LeafletSectionKey; title: string; group: keyof typeof LEAFLET_GROUPS; open?: boolean }[] = [
  { key: "chiDinh", title: "Chỉ định", group: "dung", open: true },
  { key: "lieuDung", title: "Liều dùng và cách dùng", group: "dung", open: true },
  { key: "chongChiDinh", title: "Chống chỉ định", group: "dung", open: true },
  { key: "canhBao", title: "Cảnh báo và thận trọng", group: "antoan" },
  { key: "tacDungPhu", title: "Tác dụng không mong muốn", group: "antoan" },
  { key: "thaiKy", title: "Phụ nữ có thai và cho con bú", group: "antoan" },
  { key: "laiXe", title: "Lái xe, vận hành máy móc", group: "antoan" },
  { key: "quaLieu", title: "Quá liều và xử trí", group: "antoan" },
  { key: "tuongTac", title: "Tương tác thuốc", group: "tuongtac" },
  { key: "tuongKy", title: "Tương kỵ", group: "tuongtac" },
  { key: "duocLuc", title: "Dược lực học", group: "duocly" },
  { key: "duocDong", title: "Dược động học", group: "duocly" },
  { key: "thanhPhan", title: "Thành phần", group: "baoche" },
  { key: "dangBaoChe", title: "Dạng bào chế", group: "baoche" },
  { key: "dongGoi", title: "Quy cách đóng gói", group: "baoche" },
  { key: "baoQuan", title: "Bảo quản", group: "baoche" },
  { key: "hanDung", title: "Hạn dùng", group: "baoche" },
];

export async function getLeaflet(davId: number | undefined | null): Promise<Leaflet | null> {
  if (!davId || !Number.isInteger(davId)) return null;
  try {
    const mod = await import(`@/data/leaflets/${davId}.json`);
    return (mod.default ?? mod) as Leaflet;
  } catch {
    return null;
  }
}

import leafletFiles from "@/data/leaflet-files.json";
import intlRefs from "@/data/intl-references.json";

export type IntlReference = { agency: string; title: string; url: string };

/* Tai lieu thong tin san pham chinh thuc cua co quan quan ly nuoc ngoai (tieng Anh) cho thuoc nhap khau. */
export function getIntlReferences(productId: string): IntlReference[] {
  return (intlRefs.items as Record<string, IntlReference[]>)[productId] ?? [];
}

export type StoredLeafletFile = { path?: string; bytes?: number; pages?: number | null; compressed?: boolean; title?: string; error?: string };

/* Ban sao HDSD (PDF) da luu trong kho rieng cua web app; xem qua /api/hdsd/<davId>/<i>. */
export function getStoredFiles(davId: number | undefined | null): (StoredLeafletFile & { href: string })[] {
  if (!davId) return [];
  const list = (leafletFiles as Record<string, StoredLeafletFile[]>)[String(davId)] ?? [];
  return list.flatMap((f, i) => (f.path ? [{ ...f, href: `/api/hdsd/${davId}/${i}` }] : []));
}

/* Thong tin HDSD tu trang web cong khai (khop so dang ky), dung khi khong co HDSD Cuc QLD. */
export async function getWebLeaflet(productId: string): Promise<Leaflet | null> {
  if (!/^[\w.-]+$/.test(productId)) return null;
  try {
    const mod = await import(`@/data/web-leaflets/${productId}.json`);
    const x = (mod.default ?? mod) as Leaflet;
    return x.notFound ? null : x;
  } catch {
    return null;
  }
}
