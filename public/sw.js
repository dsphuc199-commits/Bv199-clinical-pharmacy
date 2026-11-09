/*
  Service worker toi thieu cho ung dung cai dat (PWA).
  KHONG luu dem va KHONG chen vao yeu cau nao (khong respondWith): trinh duyet tai thang tu may chu,
  nen luon thay phac do moi nhat va khong anh huong dang nhap/chuyen huong.
*/
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
