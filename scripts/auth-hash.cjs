#!/usr/bin/env node
/*
  Tao ban bam mat khau cho bien moi truong AUTH_USERS (khop lib/auth/session.ts).

  Cach dung:
    node scripts/auth-hash.cjs <ten_dang_nhap> "<mat khau>"   -> in "ten:scrypt.<salt>.<hash>"
    node scripts/auth-hash.cjs --secret                        -> in mot AUTH_SECRET ngau nhien

  Nhieu tai khoan: noi cac dong "ten:scrypt.<salt>.<hash>" bang dau phay trong AUTH_USERS.
*/
// eslint-disable-next-line @typescript-eslint/no-require-imports -- script CommonJS chay truc tiep bang node
const { randomBytes, scryptSync } = require("node:crypto");

const args = process.argv.slice(2);
if (args[0] === "--secret") {
  console.log(randomBytes(48).toString("base64url"));
  process.exit(0);
}
const [user, password] = args;
if (!user || !password || password.length < 10) {
  console.error('Cach dung: node scripts/auth-hash.cjs <ten_dang_nhap> "<mat khau toi thieu 10 ky tu>"');
  process.exit(1);
}
if (/[,:\s]/.test(user)) {
  console.error("Ten dang nhap khong duoc chua dau phay, dau hai cham hoac khoang trang.");
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
console.log(`${user.toLowerCase()}:scrypt.${salt.toString("base64url")}.${hash.toString("base64url")}`);
