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
  sections?: Partial<Record<LeafletSectionKey, string>>;
  rawText?: string;
};

/* Thu tu hien thi: noi dung lam sang truoc, thong tin bao che/bao quan sau. */
export const LEAFLET_SECTIONS: { key: LeafletSectionKey; title: string; open?: boolean }[] = [
  { key: "chiDinh", title: "Chỉ định", open: true },
  { key: "lieuDung", title: "Liều dùng và cách dùng", open: true },
  { key: "chongChiDinh", title: "Chống chỉ định", open: true },
  { key: "canhBao", title: "Cảnh báo và thận trọng" },
  { key: "thaiKy", title: "Phụ nữ có thai và cho con bú" },
  { key: "tuongTac", title: "Tương tác thuốc" },
  { key: "tuongKy", title: "Tương kỵ" },
  { key: "tacDungPhu", title: "Tác dụng không mong muốn" },
  { key: "quaLieu", title: "Quá liều và cách xử trí" },
  { key: "laiXe", title: "Ảnh hưởng lên khả năng lái xe, vận hành máy" },
  { key: "duocLuc", title: "Dược lực học" },
  { key: "duocDong", title: "Dược động học" },
  { key: "thanhPhan", title: "Thành phần" },
  { key: "dangBaoChe", title: "Dạng bào chế" },
  { key: "dongGoi", title: "Quy cách đóng gói" },
  { key: "baoQuan", title: "Bảo quản" },
  { key: "hanDung", title: "Hạn dùng" },
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
