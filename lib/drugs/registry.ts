/*
  Thong tin dang ky luu hanh tu Cong tra cuu thuoc - Cuc Quan ly Duoc,
  dong bo bang scripts/sync-dav-registry.cjs -> data/drug-registry.json.
  Trang thai duoc tinh theo NGAY DONG BO (khong theo ngay xem) de ket qua co dinh va kiem chung duoc.
*/
import registryData from "@/data/drug-registry.json";

export type RegistryFile = { title: string; url: string };

export type RegistryRecord = {
  davId: number;
  matchedBy: string;
  tenThuoc: string | null;
  soDangKy: string | null;
  soDangKyCu: string | null;
  hoatChat: string | null;
  hamLuong: string | null;
  dangBaoChe: string | null;
  dongGoi: string | null;
  tieuChuan: string | null;
  tuoiTho: string | null;
  coSoSanXuat: string | null;
  nuocSanXuat: string | null;
  coSoDangKy: string | null;
  ngayCap: string | null;
  ngayHetHan: string | null;
  soQuyetDinh: string | null;
  hetHan: boolean;
  daRutSoDangKy: boolean;
  hoSoGiaHan?: string | null;
  ngayNopGiaHan?: string | null;
  ngayGiaHan?: string | null;
  /* SDK trong danh muc benh vien da het han va duoc thay bang SDK moi (ban ghi nay). */
  thayTheSdk?: string;
  hdsd: RegistryFile[];
  mauNhan: RegistryFile[];
};

type NotFound = { notFound: true; tried: string[] };
type Registry = { syncedAt: string; source: string; items: Record<string, RegistryRecord | NotFound> };

const registry = registryData as unknown as Registry;

export const REGISTRY_SYNCED_AT = registry.syncedAt;
export const REGISTRY_SOURCE = registry.source;
export const DAV_LOOKUP_URL = "https://dichvucong.dav.gov.vn/congbothuoc/index";
const EXPIRING_DAYS = 180;

export type RegistryStatus = "con-hieu-luc" | "sap-het-han" | "cho-gia-han" | "het-han" | "da-rut" | "khong-tim-thay" | "chua-dong-bo";

export const STATUS_LABEL: Record<RegistryStatus, string> = {
  "con-hieu-luc": "SĐK còn hiệu lực",
  "sap-het-han": "SĐK sắp hết hạn",
  "cho-gia-han": "SĐK hết hạn – đã nộp hồ sơ gia hạn",
  "het-han": "SĐK hết hiệu lực",
  "da-rut": "Đã rút số đăng ký",
  "khong-tim-thay": "Không tìm thấy SĐK",
  "chua-dong-bo": "Chưa đối chiếu",
};

export function getRegistry(productId: string): RegistryRecord | null {
  const rec = registry.items[productId];
  return rec && !("notFound" in rec) ? rec : null;
}

export function registryStatus(productId: string): RegistryStatus {
  const rec = registry.items[productId];
  if (!rec) return "chua-dong-bo";
  if ("notFound" in rec) return "khong-tim-thay";
  if (rec.daRutSoDangKy) return "da-rut";
  const ref = Date.parse(registry.syncedAt);
  const exp = rec.ngayHetHan ? Date.parse(rec.ngayHetHan) : NaN;
  if (rec.hetHan || (!Number.isNaN(exp) && exp < ref)) return rec.hoSoGiaHan || rec.ngayNopGiaHan ? "cho-gia-han" : "het-han";
  if (!Number.isNaN(exp) && exp - ref <= EXPIRING_DAYS * 86400000) return "sap-het-han";
  return "con-hieu-luc";
}

/* Ban rut gon cho trang danh sach (client): trang thai + co HDSD hay khong. */
export function registrySummary(): Record<string, { s: RegistryStatus; h: boolean }> {
  const out: Record<string, { s: RegistryStatus; h: boolean }> = {};
  for (const id of Object.keys(registry.items)) {
    out[id] = { s: registryStatus(id), h: (getRegistry(id)?.hdsd.length ?? 0) > 0 };
  }
  return out;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
