import { z } from "zod";

export const auditLocationSchema = z.object({
  city: z.string().min(1).max(100).optional(),
  region: z.string().regex(/^[A-Z0-9]{1,3}$/).optional(),
  country: z.string().regex(/^[A-Z]{2}$/).optional(),
}).strict();

export type AuditLocation = z.infer<typeof auditLocationSchema>;

const countryNames = new Intl.DisplayNames(["vi"], { type: "region", fallback: "code" });

function cityName(header: string | null): string | undefined {
  if (!header) return;
  try {
    const city = decodeURIComponent(header).normalize("NFC").trim();
    if (city.length <= 100 && /^[\p{L}\p{M}\p{N} .,'’()–-]+$/u.test(city)) return city;
  } catch {
    return;
  }
}

export function auditLocation(headers: Headers, hosted = process.env.VERCEL === "1" && process.env.NODE_ENV === "production"): AuditLocation | undefined {
  if (!hosted) return;
  const city = cityName(headers.get("x-vercel-ip-city"));
  const region = headers.get("x-vercel-ip-country-region")?.trim().toUpperCase();
  const country = headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  const location = {
    ...(city ? { city } : {}),
    ...(region && /^[A-Z0-9]{1,3}$/.test(region) ? { region } : {}),
    ...(country && /^[A-Z]{2}$/.test(country) && country !== "XX" ? { country } : {}),
  };
  return Object.keys(location).length ? location : undefined;
}

export function formatAuditLocation(location?: AuditLocation): string {
  if (!location) return "Chưa xác định khu vực";
  const region = location.region && (location.country ? `${location.country}-${location.region}` : location.region);
  return [location.city ?? region, location.country && countryNames.of(location.country)].filter(Boolean).join(", ") ||
    "Chưa xác định khu vực";
}
