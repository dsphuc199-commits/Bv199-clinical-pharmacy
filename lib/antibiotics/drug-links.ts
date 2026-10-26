/*
  FILE: lib/antibiotics/drug-links.ts

  Lien ket giua cac module Khang sinh: Kinh nghiem, Theo tac nhan,
  Hieu chinh lieu (data/renal-dosing.ts) va Antibiogram BV199.

  - Nhan dien hoat chat trong van ban phac do dua tren keywords da co trong
    data/renal-dosing.ts, cong them mot so cach viet trong van ban BYT/CMDT.
    Chi tao lien ket dieu huong; KHONG doi, KHONG them lieu.
  - Phoi hop thuoc moi (vd. imipenem-relebactam, ceftazidim-avibactam) bi CHAN
    de khong lien ket nham sang hoat chat don le.
  - Chi dinh (profile) chi duoc chon san khi DUNG MOT profile khop nguyen van
    (muc lieu, ten benh trong nhan chi dinh, hoac duong dung).
*/

import { renalDosingDatabase } from "@/data/renal-dosing";

export type DrugMatch = {
  ingredientId: string;
  name: string;
  /* Doan van ban (phan cach boi ";") chua ten thuoc, nguyen van nguon. */
  segment: string;
};

export type LinkContext = {
  /* Duong dan quay lai (noi bo, bat dau bang "/"). */
  from?: string;
  fromLabel?: string;
  /* Mat benh trong module Kinh nghiem (v8-N), dung de chon san chi dinh. */
  diseaseId?: string;
  /* Mo ta ngan: mat benh · tinh huong. */
  context?: string;
  /* CrCl (mL/phut) tu Bo loc lam sang, dien san o trang Hieu chinh lieu. */
  crcl?: string;
};

export function normalizeForMatch(value: string): string {
  return value
    // Giu nghia khoang lieu ("1–2 g" -> "1 den 2 g") va so thap phan ("1,5" -> "1p5")
    // de "2 g" khong khop nham vao "1–2 g" hay "1,5 g".
    .replace(/(\d)\s*[–-]\s*(\d)/g, "$1 den $2")
    .replace(/(\d)[,.](\d)/g, "$1p$2")
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/* ---------- Danh muc hoat chat (tu data/renal-dosing.ts) ---------- */

type Ingredient = { id: string; name: string; keywords: string[] };

const INGREDIENTS: Ingredient[] = (() => {
  const map = new Map<string, Ingredient>();
  for (const profile of renalDosingDatabase) {
    const item = map.get(profile.ingredientId) ?? {
      id: profile.ingredientId,
      name: profile.ingredientName,
      keywords: [],
    };
    for (const keyword of [...profile.keywords, profile.ingredientId]) {
      if (!item.keywords.includes(keyword)) item.keywords.push(keyword);
    }
    map.set(profile.ingredientId, item);
  }
  return Array.from(map.values());
})();

const INGREDIENT_BY_ID = new Map(INGREDIENTS.map((item) => [item.id, item]));

/* Tu khoa don le de nham (thanh phan cua phoi hop khac). */
const AMBIGUOUS_KEYWORDS = new Set(
  [
    "sulbactam",
    "tazobactam",
    "clavulanat",
    "clavulanic",
    "cilastatin",
    "trimethoprim",
    "sulfamethoxazol",
    "sulfamethoxazole",
  ].map(normalizeForMatch)
);

/* Cach viet bo sung trong van ban nguon (BYT, CMDT). id = null: chan. */
const EXTRA_ALIASES: { phrase: string; id: string | null }[] = [
  { phrase: "amoxicilin clavulanat", id: "amoxicillin-clavulanate" },
  { phrase: "amoxicilin acid clavulanic", id: "amoxicillin-clavulanate" },
  { phrase: "amoxicillin clavulanate", id: "amoxicillin-clavulanate" },
  { phrase: "amoxicillin clavulanic acid", id: "amoxicillin-clavulanate" },
  { phrase: "ampicillin sulbactam", id: "ampicillin-sulbactam" },
  { phrase: "piperacillin tazobactam", id: "piperacillin-tazobactam" },
  { phrase: "imipenem cilastatin", id: "imipenem-cilastatin" },
  { phrase: "trimethoprim sulfamethoxazol", id: "sulfamethoxazole-trimethoprim" },
  { phrase: "trimethoprim sulfamethoxazole", id: "sulfamethoxazole-trimethoprim" },
  { phrase: "tmp smx", id: "sulfamethoxazole-trimethoprim" },
  { phrase: "gentamycin", id: "gentamicin" },
  { phrase: "cefazoline", id: "cefazolin" },
  { phrase: "tobramicin", id: "tobramycin" },
  { phrase: "neltimicin", id: "netilmicin" },
  { phrase: "cefoperazol", id: "cefoperazone" },
  { phrase: "rifampin", id: "rifampicin" },
  { phrase: "benzyl penicillin", id: "benzylpenicillin" },
  // Phoi hop moi / dang bao che khac: khong co du lieu hieu chinh lieu -> chan.
  { phrase: "imipenem relebactam", id: null },
  { phrase: "imipenem cilastatin relebactam", id: null },
  { phrase: "ceftazidim avibactam", id: null },
  { phrase: "ceftazidime avibactam", id: null },
  { phrase: "ceftolozan tazobactam", id: null },
  { phrase: "ceftolozane tazobactam", id: null },
  { phrase: "cefoperazon sulbactam", id: null },
  { phrase: "cefoperazone sulbactam", id: null },
  { phrase: "amoxicilin sulbactam", id: null },
  { phrase: "aztreonam avibactam", id: null },
  { phrase: "meropenem vaborbactam", id: null },
  { phrase: "cefepim enmetazobactam", id: null },
  { phrase: "cefepime enmetazobactam", id: null },
  { phrase: "sulbactam durlobactam", id: null },
  { phrase: "amphotericin b liposom", id: null },
];

type Pattern = { phrase: string; id: string | null };

const PATTERNS: Pattern[] = (() => {
  const list: Pattern[] = [];
  const seen = new Set<string>();
  const push = (phrase: string, id: string | null) => {
    const p = normalizeForMatch(phrase);
    if (!p || seen.has(p)) return;
    seen.add(p);
    list.push({ phrase: p, id });
  };
  EXTRA_ALIASES.forEach((alias) => push(alias.phrase, alias.id));
  for (const item of INGREDIENTS) {
    for (const keyword of item.keywords) {
      const p = normalizeForMatch(keyword);
      if (AMBIGUOUS_KEYWORDS.has(p)) continue;
      push(p, item.id);
    }
  }
  // Cum dai truoc de phoi hop/chan duoc uu tien.
  return list.sort((a, b) => b.phrase.length - a.phrase.length);
})();

/* Tim moi vi tri xuat hien cua phrase (co ranh gioi tu) trong chuoi da chuan hoa. */
function findAll(haystack: string, phrase: string): number[] {
  const out: number[] = [];
  let from = 0;
  for (;;) {
    const at = haystack.indexOf(phrase, from);
    if (at < 0) break;
    const before = at === 0 ? " " : haystack[at - 1];
    const after = haystack[at + phrase.length] ?? " ";
    if (before === " " && after === " ") out.push(at);
    from = at + 1;
  }
  return out;
}

/*
  Nhan dien hoat chat trong van ban. Tra ve theo thu tu xuat hien, khong trung.
  Moi ket qua kem doan van ban nguon chua ten thuoc (de hien "Lieu trong phac do").
*/
export function findDrugs(texts: string[]): DrugMatch[] {
  const result: DrugMatch[] = [];
  const seen = new Set<string>();

  for (const text of texts) {
    const segments = text
      .split(/;|\s\+\s|\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const segment of segments) {
      const norm = normalizeForMatch(segment);
      const taken: [number, number][] = [];
      const hits: { at: number; id: string }[] = [];

      for (const pattern of PATTERNS) {
        for (const at of findAll(norm, pattern.phrase)) {
          const end = at + pattern.phrase.length;
          if (taken.some(([s, e]) => at < e && end > s)) continue;
          taken.push([at, end]);
          if (pattern.id) hits.push({ at, id: pattern.id });
        }
      }

      for (const hit of hits.sort((a, b) => a.at - b.at)) {
        if (seen.has(hit.id)) continue;
        const item = INGREDIENT_BY_ID.get(hit.id);
        if (!item) continue;
        seen.add(hit.id);
        result.push({ ingredientId: hit.id, name: item.name, segment });
      }
    }
  }

  return result;
}

/* ---------- Chon san chi dinh (profile) ---------- */

/*
  Cum tu ten benh -> doi chieu NGUYEN VAN voi indicationLabel cua data/renal-dosing.ts.
  Chi la goi y dieu huong; nguoi dung van chon lai duoc.
*/
const DISEASE_LABEL_HINTS: Record<string, string[]> = {
  "v8-1": ["viem phoi cong dong"],
  "v8-101": ["viem phoi cong dong"],
  "v8-4": ["viem phoi benh vien", "viem phoi mac phai tai benh vien"],
  "v8-5": ["viem phoi benh vien", "viem phoi mac phai tai benh vien"],
  "v8-6": ["copd"],
  "v8-113": ["sot giam bach cau"],
  "v8-116": ["sot giam bach cau"],
  "v8-39": ["viem noi tam mac"],
  "v8-36": ["viem mang nao"],
  "v8-104": ["viem mang nao"],
  "v8-2": ["nktn co bien chung"],
  "v8-17": ["nktn co bien chung"],
  "v8-21": ["o bung"],
  "v8-27": ["da mo mem"],
  "v8-28": ["da mo mem"],
  "v8-32": ["xuong khop"],
  "v8-33": ["xuong khop"],
};

export type ProfilePick = { indicationId: string; reason: string };

function uniquePick(
  profiles: { indicationId: string; indicationLabel: string }[],
  test: (labelNorm: string) => boolean,
  reason: string
): ProfilePick | undefined {
  // Bo cum "(trừ …)" trong nhan: vd. "các chỉ định (trừ viêm phổi bệnh viện)".
  const hits = profiles.filter((p) =>
    test(normalizeForMatch(p.indicationLabel.replace(/\(\s*trừ[^)]*\)/gi, "")))
  );
  return hits.length === 1 ? { indicationId: hits[0].indicationId, reason } : undefined;
}

export function pickProfile(
  ingredientId: string,
  segment: string,
  diseaseId?: string
): ProfilePick | undefined {
  const profiles = renalDosingDatabase.filter((p) => p.ingredientId === ingredientId);
  if (profiles.length < 2) return undefined;
  const seg = ` ${normalizeForMatch(segment)} `;

  // 1. Muc lieu ghi trong nhan ("lieu binh thuong 750 mg moi 24 gio") co trong phac do.
  const byDose = uniquePick(
    profiles,
    (label) => {
      const m = label.match(/lieu binh thuong (.+?) (?:uong|duoc thu|$)/);
      if (!m) return false;
      const level = m[1].trim();
      return seg.includes(` ${level} `) && !seg.includes(`den ${level} `);
    },
    "mức liều trong phác đồ trùng mức liều của chỉ định"
  );
  if (byDose) return byDose;

  // 2. Ten benh trong nhan chi dinh.
  const hints = diseaseId ? DISEASE_LABEL_HINTS[diseaseId] ?? [] : [];
  if (hints.length > 0) {
    const byDisease = uniquePick(
      profiles,
      (label) => hints.some((h) => label.includes(h)),
      "tên bệnh khớp nhãn chỉ định"
    );
    if (byDisease) return byDisease;
  }

  // 3. Duong dung ghi trong phac do.
  const oral = /\buong\b/.test(seg);
  const iv = /\b(tm|tinh mach|truyen|tiem)\b/.test(seg);
  if (oral !== iv) {
    const byRoute = uniquePick(
      profiles,
      (label) =>
        oral
          ? /^uong\b/.test(label)
          : /^(tiem|truyen)/.test(label) && !/^uong/.test(label),
      oral ? "đường uống ghi trong phác đồ" : "đường tiêm/truyền ghi trong phác đồ"
    );
    if (byRoute) return byRoute;
  }

  return undefined;
}

/* ---------- Antibiogram BV199 ---------- */

/*
  Ma khang sinh co trong data/antibiotics/antibiogram-bv199.json (ky 04/2025–03/2026).
  Danh sach nay duoc kiem tra lai bang script khi cap nhat du lieu.
*/
const ANTIBIOGRAM_ANTIBIOTICS = new Set([
  "amikacin", "amoxicillin-clavulanate", "ampicillin", "ampicillin-sulbactam",
  "cefazolin", "cefepime", "cefotaxime", "cefoxitin", "ceftazidime",
  "ceftriaxone", "cefuroxime", "ciprofloxacin", "clindamycin", "doxycycline",
  "erythromycin", "gentamicin", "imipenem", "levofloxacin", "linezolid",
  "meropenem", "penicillin", "piperacillin-tazobactam", "tetracycline",
  "tobramycin", "trimethoprim-sulfamethoxazole", "vancomycin",
]);

const INGREDIENT_TO_ANTIBIOGRAM: Record<string, string> = {
  "imipenem-cilastatin": "imipenem",
  "sulfamethoxazole-trimethoprim": "trimethoprim-sulfamethoxazole",
  benzylpenicillin: "penicillin",
};

export function antibiogramIdFor(ingredientId: string): string | undefined {
  const id = INGREDIENT_TO_ANTIBIOGRAM[ingredientId] ?? ingredientId;
  return ANTIBIOGRAM_ANTIBIOTICS.has(id) ? id : undefined;
}

/* Ten tac nhan (CMDT / mat benh) -> ma vi khuan trong antibiogram BV199. */
const ORGANISM_PATTERNS: { id: string; label: string; pattern: RegExp }[] = [
  { id: "pseudomonas-aeruginosa", label: "P. aeruginosa", pattern: /pseudomonas aeruginosa/ },
  { id: "acinetobacter-baumannii", label: "A. baumannii", pattern: /acinetobacter/ },
  { id: "escherichia-coli", label: "E. coli", pattern: /escherichia coli/ },
  { id: "klebsiella-pneumoniae", label: "K. pneumoniae", pattern: /klebsiella/ },
  { id: "staphylococcus-aureus", label: "S. aureus", pattern: /staphylococcus aureus|^staphylococcus methicillin|s aureus/ },
  { id: "enterococcus-spp", label: "Enterococcus spp.", pattern: /enterococcus/ },
  { id: "s-pneumoniae", label: "S. pneumoniae", pattern: /streptococcus pneumoniae/ },
  { id: "stenotrophomonas-maltophilia", label: "S. maltophilia", pattern: /stenotrophomonas/ },
  { id: "proteus-mirabilis", label: "P. mirabilis", pattern: /proteus/ },
  { id: "citrobacter", label: "Citrobacter", pattern: /citrobacter/ },
];

export function antibiogramOrganismFor(
  name: string
): { id: string; label: string } | undefined {
  const norm = normalizeForMatch(name);
  const hit = ORGANISM_PATTERNS.find((item) => item.pattern.test(norm));
  return hit ? { id: hit.id, label: hit.label } : undefined;
}

/* Mat benh theo tac nhan trong module Kinh nghiem -> tac nhan. */
export const DISEASE_ORGANISM: Record<string, { organismQuery: string; antibiogramId: string; label: string }> = {
  "v8-13": { organismQuery: "Staphylococcus", antibiogramId: "staphylococcus-aureus", label: "S. aureus" },
  "v8-46": { organismQuery: "Pseudomonas", antibiogramId: "pseudomonas-aeruginosa", label: "P. aeruginosa" },
};

/* ---------- Tao duong dan ---------- */

export function safeInternalPath(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return undefined;
  }
  return value;
}

function withParams(path: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

const clip = (value: string | undefined, max: number) =>
  value && value.length > max ? `${value.slice(0, max - 1)}…` : value;

export function dosingHref(match: DrugMatch, ctx: LinkContext = {}): string {
  const pick = pickProfile(match.ingredientId, match.segment, ctx.diseaseId);
  return withParams("/antibiotics/dosing", {
    drug: match.ingredientId,
    indication: pick?.indicationId,
    why: pick?.reason,
    regimen: clip(match.segment, 400),
    context: clip(ctx.context, 200),
    crcl: ctx.crcl,
    from: safeInternalPath(ctx.from),
    fromLabel: clip(ctx.fromLabel, 80),
  });
}

export function antibiogramHref(
  opts: { antibioticId?: string; organismId?: string },
  ctx: LinkContext = {}
): string {
  return withParams("/antibiotics/antibiogram", {
    antibiotic: opts.antibioticId,
    organism: opts.organismId,
    from: safeInternalPath(ctx.from),
    fromLabel: clip(ctx.fromLabel, 80),
  });
}

export function organismHref(query: string | undefined, ctx: LinkContext = {}): string {
  return withParams("/antibiotics/organism", {
    q: query,
    from: safeInternalPath(ctx.from),
    fromLabel: clip(ctx.fromLabel, 80),
  });
}

export function empiricHref(diseaseId?: string): string {
  return withParams("/antibiotics/empiric/guideline-v9", { disease: diseaseId });
}
