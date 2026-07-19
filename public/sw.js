const CACHE_NAME = "synapse-cache-v2";
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/",
  "/dashboard",
  "/dashboard/courses",
  "/dashboard/decks",
  "/dashboard/study",
  "/dashboard/settings",
  "/offline.html",
  "/manifest.json",
  "/globe.svg"
];

// Install Event: Cache Core Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Smart Offline Caching for Next.js & NextAuth
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Ignore webpack HMR dev sockets
  if (url.pathname.startsWith("/_next/webpack-hmr")) {
    return;
  }

  // Handle NextAuth session endpoint when offline
  if (url.pathname.includes("/api/auth/session")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            user: {
              name: "Offline User",
              email: "esewiosarugue@gmail.com",
            },
            expires: new Date(Date.now() + 86400000).toISOString(),
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful GET responses for static files and pages
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === "basic" || networkResponse.type === "cors")
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Store clean URL without _rsc query params for easy matching
            const cacheKey = url.searchParams.has("_rsc") ? url.pathname : event.request;
            cache.put(cacheKey, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network failed (offline mode active):

        // 1. Try exact request match in cache
        let cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        // 2. Try URL pathname match (ignoring ?_rsc=... query params)
        cachedResponse = await caches.match(url.pathname);
        if (cachedResponse) return cachedResponse;

        // 3. Fallback for client navigation or RSC requests
        if (event.request.mode === "navigate" || url.searchParams.has("_rsc")) {
          const dashboardPage = await caches.match("/dashboard");
          if (dashboardPage) return dashboardPage;

          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) return offlinePage;
        }

        // 4. Default fallback offline HTML
        const fallback = await caches.match(OFFLINE_URL);
        if (fallback) return fallback;

        return new Response("Offline mode active. Connection lost.", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      })
  );
});
