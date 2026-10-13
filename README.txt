BV199 AMS v3: Sua lech mobile va trung lap card.
CHI THAY MOT FILE: app/antibiotics/page.tsx
Khong thay: layout, mobile.css, globals.css, data, phac do.

PowerShell tai thu muc du an:
1. tar -xf "$env:USERPROFILE\Downloads\BV199-AMS-Layout-V3.zip" -C .
2. npm.cmd run build
3. Neu build thanh cong:
   git add app/antibiotics/page.tsx
   git commit -m "Fix AMS responsive layout v3"
   git push origin main

Kiem tra Vercel Ready / Current, sau do mo link /antibiotics.
