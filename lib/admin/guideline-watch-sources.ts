import { createHash } from "node:crypto";
import { load } from "cheerio";
import { extractText, getDocumentProxy } from "unpdf";

const capUrl = "https://kcb.vn/tin-tuc/huong-dan-chan-doan-va-dieu-tri-viem-phoi-mac-phai-cong-dong-o-nguoi-lon.html?categoryId=101819452";

export const WATCH_SOURCES = [
  { id: "byt-index", label: "Bộ Y tế · Danh mục hướng dẫn", region: "Việt Nam", url: "https://kcb.vn/tai-lieu/huong-dan-chan-doan-dieu-tri" },
  { id: "byt-decisions", label: "Bộ Y tế · Thư viện hướng dẫn", region: "Việt Nam", url: "https://kcb.vn/phac-do" },
  { id: "byt-cap", label: "Bộ Y tế · QĐ 2147/QĐ-BYT", region: "Việt Nam", url: capUrl },
  { id: "idsa-iai", label: "IDSA · Nhiễm khuẩn ổ bụng", region: "Quốc tế", url: "https://www.idsociety.org/practice-guideline/intra-abdominal-infections/" },
  { id: "tokyo-index", label: "JSHBPS · Danh mục Tokyo Guidelines", region: "Quốc tế", url: "https://www.jshbps.jp/modules/en/index.php?cat_id=4" },
  {
    id: "tokyo-antibiotics",
    label: "Tokyo Guidelines 2018 · Toàn văn lưu tại Amsterdam UMC",
    region: "Quốc tế",
    url: "https://pure.amsterdamumc.nl/en/publications/tokyo-guidelines-2018-antimicrobial-therapy-for-acute-cholangitis/",
    pdfUrl: "https://pure.amsterdamumc.nl/ws/files/158545466/Tokyo-guidelines-2018-antimicrobial-therapy-for-acute-cholangitis-and-cholecystitis.pdf",
  },
] as const;

export type WatchSource = (typeof WATCH_SOURCES)[number];
export type Topic = "biliary" | "cap";
export type DetectedDocument = {
  id: string;
  sourceId: WatchSource["id"];
  topic: Topic;
  title: string;
  url: string;
  fullText: "idsa-html" | "pdf" | "manual";
  pdfUrl?: string;
  fingerprint: string;
  replacement?: string;
  notice?: "correction" | "withdrawal";
};
export type EvidencePassage = { id: string; locator: string; text: string };

const permittedHosts = new Set(["kcb.vn", "www.kcb.vn", "www.idsociety.org", "www.jshbps.jp", "onlinelibrary.wiley.com", "pure.amsterdamumc.nl"]);
const maxBytes = 8 * 1024 * 1024;

export class SourceError extends Error {}

export function officialUrl(value: string, base?: string): URL {
  const url = new URL(value, base);
  if (url.protocol !== "https:" || !permittedHosts.has(url.hostname) || url.port || url.username || url.password) {
    throw new SourceError("Địa chỉ nằm ngoài danh sách nguồn chính thức của đợt thí điểm.");
  }
  return url;
}

export async function fetchOfficial(value: string, request = fetch) {
  let url = officialUrl(value);
  const signal = AbortSignal.timeout(14_000);
  for (let hop = 0; hop < 4; hop++) {
    const response = await request(url, { cache: "no-store", redirect: "manual", signal });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new SourceError("Trang nguồn chuyển hướng thiếu đích.");
      url = officialUrl(location, url.href);
      continue;
    }
    if (!response.ok || !response.body) throw new SourceError(`Không đọc được trang nguồn (HTTP ${response.status}).`);
    if (Number(response.headers.get("content-length")) > maxBytes) throw new SourceError("Tệp nguồn vượt giới hạn xử lý.");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > maxBytes) throw new SourceError("Tệp nguồn vượt giới hạn xử lý.");
        chunks.push(value);
      }
    } finally {
      await reader.cancel().catch(() => undefined);
    }
    return { bytes: Buffer.concat(chunks, length), type: response.headers.get("content-type") ?? "", url: url.href };
  }
  throw new SourceError("Trang nguồn chuyển hướng quá nhiều lần.");
}

export const digest = (data: string | Uint8Array) => createHash("sha256").update(data).digest("hex");
export const tidy = (value: string) => value.normalize("NFC").replace(/\s+/g, " ").trim();
const accentless = (value: string) => tidy(value).toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");

function topicFor(title: string): Topic | undefined {
  const value = accentless(title);
  if (/(viem|nhiem khuan) (cap )?duong mat|cholangitis/.test(value)) return "biliary";
  if (/viem phoi (mac phai )?cong dong/.test(value) && /nguoi lon/.test(value)) return "cap";
}

function detection(source: WatchSource, data: Omit<DetectedDocument, "id" | "sourceId">): DetectedDocument {
  return { ...data, id: digest(`${data.url}\n${data.fingerprint}`).slice(0, 24), sourceId: source.id };
}

export function readIdsaPassages(html: string): EvidencePassage[] {
  const $ = load(html);
  $("script, style, nav, header, footer, aside, noscript").remove();
  const main = $("main").first();
  const content = main.length ? main : $("body");
  let locator = "Nội dung hướng dẫn";
  const passages: EvidencePassage[] = [];
  content.find("h1,h2,h3,h4,p,li").each((_, element) => {
    const text = tidy($(element).text());
    if (/^h[1-4]$/.test(element.tagName)) locator = text.slice(0, 140) || locator;
    else if (text.length >= 35 && $(element).find("p,li").length === 0) {
      passages.push({ id: `p${passages.length + 1}`, locator, text });
    }
  });
  return passages;
}

export function parseWatchHtml(source: WatchSource, html: string): DetectedDocument[] {
  const $ = load(html);
  const text = tidy($("body").text());
  if (source.id === "byt-cap") {
    const normalized = accentless(text);
    if (!/2147\s*[/]\s*qd-byt/.test(normalized) || !/thay the.{0,150}2020/.test(normalized) || !topicFor(text)) {
      throw new SourceError("Chưa xác nhận được số hiệu và quan hệ thay thế trên trang Bộ Y tế.");
    }
    const title = "QĐ 2147/QĐ-BYT (15/07/2026) · Viêm phổi cộng đồng người lớn";
    return [detection(source, {
      topic: "cap", title, url: capUrl, fullText: "manual",
      fingerprint: digest(title), replacement: "Thay thế QĐ 4815/QĐ-BYT năm 2020. BV199 đã có bản QĐ 2147.",
    })];
  }

  if (source.id === "idsa-iai") {
    const passages = readIdsaPassages(html);
    const relevant = passages.filter(({ locator, text }) => /cholangitis|biliary|intra.abdominal|antimicrobial/i.test(`${locator} ${text}`));
    if (!relevant.some(({ text }) => /cholangitis/i.test(text))) throw new SourceError("Trang IDSA chưa trả về nội dung hướng dẫn cần theo dõi.");
    const title = tidy($("h1").first().text()).slice(0, 250) || source.label;
    return [detection(source, {
      topic: "biliary", title, url: source.url, fullText: "idsa-html",
      fingerprint: digest(relevant.map(({ locator, text }) => `${locator}\n${text}`).join("\n")),
    })];
  }

  if ($("a[href]").length < 10) throw new SourceError("Danh mục nguồn chưa trả về danh sách văn bản hợp lệ.");
  const documents = new Map<string, DetectedDocument>();
  $("a[href]").each((_, element) => {
    const title = tidy($(element).text());
    const href = $(element).attr("href");
    if (!href || title.length < 24 || title.length > 250) return;
    let url: URL;
    try { url = officialUrl(href, source.url); } catch { return; }
    const topic = source.id === "tokyo-index" && /Tokyo Guidelines\s+(?:20\d{2})/.test(title) ? "biliary" : topicFor(title);
    if (!topic || url.href === source.url || url.hash || url.pathname === new URL(capUrl).pathname) return;
    const normalized = accentless(title);
    if (source.id !== "tokyo-index" && (!/\.html$|\.pdf$/i.test(url.pathname) || !/huong dan|quyet dinh|dinh chinh|thu hoi|thay the/.test(normalized))) return;
    if (source.id === "tokyo-index" && /Tokyo Guidelines 20(?:13|18)\b/.test(title)) return;
    url.searchParams.delete("categoryId");
    const notice = /dinh chinh|corrigendum|erratum/i.test(normalized) ? "correction" : /thu hoi|withdrawal|retraction/i.test(normalized) ? "withdrawal" : undefined;
    const entry = detection(source, {
      topic, title, url: url.href, fullText: "manual", notice,
      fingerprint: digest(title),
    });
    documents.set(url.href, entry);
  });
  return [...documents.values()].slice(0, 25);
}

export function findOfficialPdf(html: string, articleUrl: string): string | undefined {
  const $ = load(html);
  const files = new Set<string>();
  $("a[href]").each((_, element) => {
    try {
      const url = officialUrl($(element).attr("href") ?? "", articleUrl);
      if (["kcb.vn", "www.kcb.vn"].includes(url.hostname) && /^\/upload\//i.test(url.pathname) && /\.pdf$/i.test(url.pathname)) files.add(url.href);
    } catch { /* Ignore links to other sites. */ }
  });
  return files.size === 1 ? [...files][0] : undefined;
}

const pdfHeader = Buffer.from("%PDF-");
const isPdf = (bytes: Buffer) => bytes.subarray(0, pdfHeader.length).equals(pdfHeader);

async function verifyDomesticAttachment(entry: DetectedDocument, source: WatchSource): Promise<DetectedDocument> {
  if (entry.topic !== "biliary" || entry.notice || !/quyet dinh|huong dan/.test(accentless(entry.title))) return entry;
  try {
    const original = await fetchOfficial(entry.url);
    const pdfUrl = original.type.includes("pdf") ? original.url : findOfficialPdf(original.bytes.toString("utf8"), original.url);
    if (!pdfUrl) return entry;
    const pdf = original.type.includes("pdf") ? original : await fetchOfficial(pdfUrl);
    if (!isPdf(pdf.bytes)) return entry;
    return detection(source, { ...entry, pdfUrl, fullText: "pdf", fingerprint: digest(pdf.bytes) });
  } catch { return entry; }
}

export async function scanWatchSource(source: WatchSource): Promise<DetectedDocument[]> {
  if (source.id === "tokyo-antibiotics") {
    const pdf = await fetchOfficial(source.pdfUrl);
    if (!isPdf(pdf.bytes)) throw new SourceError("Bản lưu TG18 không trả về tệp PDF.");
    const passages = await readPdfEvidence(pdf.bytes);
    verifyTokyoArticle(passages[0]?.text ?? "", passages.length);
    return [detection(source, {
      topic: "biliary", title: "Tokyo Guidelines 2018 · Antimicrobial therapy for acute cholangitis and cholecystitis",
      url: source.url, pdfUrl: pdf.url, fullText: "pdf", fingerprint: digest(pdf.bytes),
    })];
  }
  const response = await fetchOfficial(source.url);
  if (!response.type.includes("html")) throw new SourceError("Nguồn chưa trả về trang HTML đọc được.");
  const documents = parseWatchHtml(source, response.bytes.toString("utf8"));
  if (source.id !== "byt-index" && source.id !== "byt-decisions") return documents;
  const candidates = documents.filter(({ topic, notice }) => topic === "biliary" && !notice).slice(0, 2);
  const verified = await Promise.all(candidates.map((entry) => verifyDomesticAttachment(entry, source)));
  return documents.map((entry) => verified.find(({ url }) => entry.url === url) ?? entry);
}

export function verifyTokyoArticle(firstPage: string, pageCount: number): void {
  const text = tidy(firstPage);
  const title = /Tokyo Guidelines\s+2018\s*:\s*antimicrobial therapy for acute cholangitis and cholecystitis/i;
  if (!title.test(text) || !/\b10\.1002\/jhbp\.518\b/i.test(text)) {
    throw new SourceError("Tiêu đề hoặc DOI của PDF chưa khớp bài TG18 về kháng sinh.");
  }
  if (pageCount < 14) throw new SourceError("Bản lưu PDF thiếu trang so với bài TG18 đã xuất bản.");
}

async function readPdfEvidence(bytes: Buffer): Promise<EvidencePassage[]> {
  const pdf = await getDocumentProxy(Uint8Array.from(bytes));
  try {
    if (pdf.numPages > 65) throw new SourceError("Tài liệu vượt giới hạn số trang của đợt thí điểm.");
    const { text } = await extractText(pdf, { mergePages: false });
    const passages = text.map((page, i) => ({ id: `p${i + 1}`, locator: `Trang PDF ${i + 1}`, text: tidy(page) }));
    if (passages.filter(({ text }) => text.length > 150).length < Math.ceil(pdf.numPages / 2)) throw new SourceError("Tệp thiếu lớp văn bản đọc được. Cần đối chiếu thủ công.");
    return passages;
  } finally {
    await pdf.loadingTask.destroy();
  }
}

export async function loadEvidence(document: DetectedDocument): Promise<EvidencePassage[]> {
  if (document.fullText === "manual") throw new SourceError("Chưa xác minh được toàn văn. Mở tài liệu gốc để đối chiếu thủ công.");
  const response = await fetchOfficial(document.pdfUrl ?? document.url);
  if (document.fullText === "idsa-html") {
    const source = WATCH_SOURCES.find(({ id }) => id === document.sourceId);
    const html = response.bytes.toString("utf8");
    if (!source || parseWatchHtml(source, html)[0]?.fingerprint !== document.fingerprint) throw new SourceError("Nguồn đã thay đổi. Rà soát lại trước khi soạn.");
    return readIdsaPassages(html);
  }
  if (!isPdf(response.bytes)) throw new SourceError("Chưa tải được tệp PDF toàn văn từ nguồn chính thức.");
  if (digest(response.bytes) !== document.fingerprint) throw new SourceError("Tệp nguồn đã thay đổi. Rà soát lại trước khi soạn.");
  const passages = await readPdfEvidence(response.bytes);
  if (!passages.some(({ text }) => topicFor(text) === document.topic)) throw new SourceError("Toàn văn chưa khớp bệnh cảnh đang rà soát.");
  if (document.sourceId === "tokyo-antibiotics") verifyTokyoArticle(passages[0]?.text ?? "", passages.length);
  return passages;
}
