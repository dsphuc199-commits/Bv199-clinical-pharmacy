/*
  Chi muc nho cho trang danh sach thuoc: data/leaflet-index.json
    ok     : davId co HDSD Cuc QLD trich duoc
    failed : davId co file HDSD nhung Cong Cuc QLD bao loi
    web    : productId co thong tin HDSD tu trang web (khop so dang ky)
  Chay sau scripts/extract-leaflets.mjs va scripts/fetch-web-leaflets.mjs:  node scripts/build-leaflet-index.mjs
*/
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (dir) =>
  existsSync(join(ROOT, "data", dir))
    ? readdirSync(join(ROOT, "data", dir)).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(ROOT, "data", dir, f), "utf8")))
    : [];

const dav = read("leaflets");
const web = read("web-leaflets");
const index = {
  ok: dav.filter((x) => !x.failed).map((x) => x.davId).sort((a, b) => a - b),
  failed: dav.filter((x) => x.failed).map((x) => x.davId).sort((a, b) => a - b),
  web: web.filter((x) => !x.notFound).map((x) => x.productId).sort(),
};
writeFileSync(join(ROOT, "data", "leaflet-index.json"), JSON.stringify(index));
console.log(`HDSD Cuc QLD: ${index.ok.length} | file loi: ${index.failed.length} | tu web: ${index.web.length} | web khong thay: ${web.length - index.web.length}`);
