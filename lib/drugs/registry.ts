/*
  Thong tin dang ky luu hanh tu Cong tra cuu thuoc - Cuc Quan ly Duoc,
  dong bo bang scripts/sync-dav-registry.cjs -> data/drug-registry.json.
  Trang thai duoc tinh theo NGAY DONG BO (khong theo ngay xem) de ket qua co dinh va kiem chung duoc.
*/
import registryData from "@/data/drug-registry.json";
import leafletIndex from "@/data/leaflet-index.json";
import intlRefs from "@/data/intl-references.json";

const INTL = intlRefs.items as Record<string, unknown[]>;

const LEAFLET_OK = new Set<number>(leafletIndex.ok);
const LEAFLET_FAILED = new Set<number>(leafletIndex.failed);
const WEB_LEAFLET = new Set<string>(leafletIndex.web ?? []);

/* Thuoc chua co HDSD rieng -> thuoc khac trong danh muc cung hoat chat + duong dung co HDSD (de tham khao). */
export type LeafletSibling = { id: string; brand: string; strength: string; form: string; src: "dav" | "web" };
const SIBLINGS = (leafletIndex as { siblings?: Record<string, LeafletSibling> }).siblings ?? {};
export function getLeafletSibling(productId: string): LeafletSibling | null {
  return SIBLINGS[productId] ?? null;
}

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

/* Nguon thong tin HDSD cua thuoc: "dav" = To HDSD tren Cong Cuc QLD; "web" = trang web khop SDK. */
export type LeafletSource = "dav" | "web" | "ref" | "intl" | null;

/* Ban rut gon cho trang danh sach (client): trang thai SDK + nguon HDSD. */
export function registrySummary(): Record<string, { s: RegistryStatus; h: LeafletSource }> {
  const out: Record<string, { s: RegistryStatus; h: LeafletSource }> = {};
  for (const id of new Set([...Object.keys(registry.items), ...WEB_LEAFLET, ...Object.keys(SIBLINGS)])) {
    const rec = getRegistry(id);
    // HDSD Cuc QLD: co file va khong bi Cong bao loi (file chua trich van mo duoc bang link goc).
    const dav = !!rec && rec.hdsd.length > 0 && (LEAFLET_OK.has(rec.davId) || !LEAFLET_FAILED.has(rec.davId));
    out[id] = { s: registryStatus(id), h: dav ? "dav" : WEB_LEAFLET.has(id) ? "web" : SIBLINGS[id] ? "ref" : INTL[id] ? "intl" : null };
  }
  return out;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
