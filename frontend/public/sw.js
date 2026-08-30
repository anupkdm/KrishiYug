const CACHE_NAME = "krishiyug-pwa-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/images/krishiyug-logo.png"
];

// 1. Install: Precache App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[KrishiYug ServiceWorker] Pre-caching app shell");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[KrishiYug ServiceWorker] Pre-cache partial fail:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate: Clean up old caches and take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[KrishiYug ServiceWorker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch: Cache-First for static assets, Network-First with Cache fallback for navigations
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol.startsWith("chrome-extension")) {
    return;
  }

  // Handle SPA navigation requests (e.g. user refreshes page while offline)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          console.log("[KrishiYug ServiceWorker] Offline navigation: serving cached index.html");
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match("/index.html") || await caches.match("/");
          return fallback || new Response("Offline mode active. Please reconnect to load new pages.", {
            headers: { "Content-Type": "text/html" }
          });
        })
    );
    return;
  }

  // Handle static assets (JS, CSS, images, fonts)
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/images/") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-While-Revalidate in background
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        }).catch(() => {
          // If offline and not in cache, fallback
          return new Response("", { status: 408, statusText: "Offline" });
        });
      })
    );
    return;
  }

  // Default Network-First strategy with Cache Fallback for other GET requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
