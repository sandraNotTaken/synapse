const CACHE_NAME = "synapse-cache-v6";
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/offline.html",
  "/manifest.json",
  "/globe.svg"
];

// Install Event: Safe Pre-caching
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (url) => {
          try {
            const res = await fetch(url);
            if (res.ok) {
              await cache.put(url, res);
            }
          } catch (e) {
            console.warn("Pre-cache item skipped:", url, e);
          }
        })
      );
    })
  );
});

// Activate Event: Claim clients & purge old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      }),
    ])
  );
});

// Fetch Event: Smart Offline Caching for Next.js & NextAuth Session Preservation
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Ignore Webpack and Turbopack HMR dev sockets
  if (
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.pathname.startsWith("/_next/hmr")
  ) {
    return;
  }

  // Intercept NextAuth Session Endpoint when network is lost so user stays logged in offline!
  if (url.pathname.includes("/api/auth/session")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            user: {
              name: "Synapse Learner",
              email: "esewiosarugue@gmail.com",
            },
            expires: new Date(Date.now() + 86400000).toISOString(),
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // Other /api/ routes bypass SW when online, but return 503 JSON when offline
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Offline mode active", offline: true }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache valid 200 responses for static assets, HTML pages, and Next.js RSC streams
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === "basic" || networkResponse.type === "cors")
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Differentiate key between Next.js React Server Component (RSC) payload and HTML page
            const cacheKey = url.searchParams.has("_rsc")
              ? url.pathname + "__rsc"
              : event.request;
            cache.put(cacheKey, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network Offline Fallback Mode:
        const cacheKey = url.searchParams.has("_rsc")
          ? url.pathname + "__rsc"
          : event.request;

        // 1. Try matching the specific cache key (exact HTML request or normalized RSC key)
        let cachedResponse = await caches.match(cacheKey);
        if (cachedResponse) return cachedResponse;

        // 2. Try matching the exact event request
        cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        // 3. Try fallback URL pathname match
        cachedResponse = await caches.match(url.pathname);
        if (cachedResponse) return cachedResponse;

        // 4. Fallback for client navigation or RSC requests
        if (event.request.mode === "navigate" || url.searchParams.has("_rsc")) {
          const dashboardPage = await caches.match("/dashboard");
          if (dashboardPage) return dashboardPage;

          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) return offlinePage;
        }

        // 5. Default fallback offline HTML
        const fallback = await caches.match(OFFLINE_URL);
        if (fallback) return fallback;

        return new Response("Offline mode active.", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      })
  );
});
