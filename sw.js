/* 資料傳輸 — Service Worker
   只快取 App 外殼(離線可開、可安裝);檔案資料一律走即時 GitHub API,不快取。 */
const CACHE = 'cft-shell-v13';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // 永不快取 GitHub API / 資料請求
  if (url.hostname.endsWith('github.com') || url.hostname.endsWith('githubusercontent.com')) return;
  if (e.request.method !== 'GET') return;

  // App 外殼:cache-first,背景更新
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res && res.status === 200 && url.origin === location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
