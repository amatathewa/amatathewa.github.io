// สมุดบัญชี: ให้เปิดลิงก์ได้ตอนไม่มีเน็ต (22 พ.ย. 2569 ณัทกรขอ)
// มีเน็ต = โหลดหน้าใหม่จากเว็บทุกครั้ง (ได้รุ่นล่าสุดเสมอ) แล้วจำไว้ · ไม่มีเน็ต = ใช้หน้าที่จำไว้
// จำเฉพาะตัวหน้าเว็บ ไอคอน · ไม่เคยจำข้อมูลสมุด (ข้อมูลอยู่ใน localStorage แบบเข้ารหัสเหมือนเดิม)
const CACHE = "samut-shell-v1";
const SHELL = ["./", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;   // หลังบ้าน (worker) ไม่ผ่านตรงนี้
  const page = req.mode === "navigate";
  e.respondWith((async () => {
    try {
      const res = await fetch(req, {cache: "no-store"});
      if (res.ok) { const c = await caches.open(CACHE); c.put(page ? "./" : req, res.clone()); }
      return res;
    } catch (err) {
      const hit = await caches.match(page ? "./" : req, {ignoreSearch: true});
      return hit || Response.error();
    }
  })());
});
