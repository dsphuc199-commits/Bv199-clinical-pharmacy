#!/usr/bin/env node
/*
  Tao bieu tuong ung dung (PWA) tu logo Khoa Duoc.
  Chay: node scripts/make-app-icons.cjs  -> public/app-icons/*
*/
// eslint-disable-next-line @typescript-eslint/no-require-imports -- script CommonJS chay truc tiep bang node
const sharp = require("sharp");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("node:path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("node:fs");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "public/bv199-khoa-duoc-logo.png");
const out = path.join(root, "public/app-icons");
fs.mkdirSync(out, { recursive: true });

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

/* Logo dat giua nen trang, chiem `ratio` canh (vung dem cho icon "maskable" va iPhone). */
async function padded(size, ratio, file) {
  const inner = Math.round(size * ratio);
  const logo = await sharp(src).resize(inner, inner, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: logo, gravity: "center" }])
    .flatten({ background: WHITE })
    .png({ compressionLevel: 9 })
    .toFile(path.join(out, file));
}

(async () => {
  await padded(192, 0.9, "icon-192.png");
  await padded(512, 0.9, "icon-512.png");
  await padded(512, 0.72, "icon-maskable-512.png"); // vung an toan 80% cho Android
  await padded(180, 0.86, "apple-touch-icon.png"); // iPhone: nen trang, khong trong suot
  for (const f of fs.readdirSync(out)) console.log(f, fs.statSync(path.join(out, f)).size, "bytes");
})();
