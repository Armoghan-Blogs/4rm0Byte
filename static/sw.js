importScripts("/lib/workbox/workbox-sw.js");
workbox.setConfig({ debug: false });

const { registerRoute, setCatchHandler } = workbox.routing;
const { cleanupOutdatedCaches, precacheAndRoute, matchPrecache } = workbox.precaching;
const { skipWaiting, clientsClaim } = workbox.core;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

// ---- CSS rollover plugin: remove older hashed CSS files with same logical name ----
const cssVersionCleanupPlugin = {
  cacheDidUpdate: async ({ cacheName, request, oldResponse, newResponse }) => {
    try {
      if (!request.url || !request.url.endsWith(".css")) return;
      const cache = await caches.open(cacheName);
      const entries = await cache.keys();

      const normalize = url => {
        const fname = new URL(url).pathname.split("/").pop() || "";
        // Remove common hash patterns like .abcd1234 or -abcd1234 (6+ hex chars)
        return fname.replace(/([.-])[0-9a-f]{6,}([.-]?)/gi, "$1");
      };

      const current = normalize(request.url);
      await Promise.all(entries.map(async r => {
        if (r.url === request.url) return;
        if (!r.url.endsWith(".css")) return;
        if (normalize(r.url) === current) {
          await cache.delete(r);
        }
      }));
    } catch (e) {
      // non-fatal: don't break caching on plugin error
    }
  }
};

// Network-first strategy for navigation requests (HTML pages)
const navigationStrategy = new NetworkFirst({
  cacheName: "html-pages-v1",
  networkTimeoutSeconds: 3,
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({
      maxEntries: 30,
      maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
  ],
});

// Precache the app shell
const APP_SHELL = [
  { url: "/404.html", revision: "4e0d67" },
  { url: "/index.html", revision: "4e0d67" },
  { url: "/offline.html", revision: "4e0d67" },
  { url: "/site.webmanifest", revision: "4e0d67" },
  { url: "/favicons/favicon.ico", revision: "4e0d67" },
  { url: "/favicons/favicon.svg", revision: "4e0d67" },
  { url: "/favicons/favicon-96x96.png", revision: "4e0d67" },
  { url: "/favicons/apple-touch-icon.png", revision: "4e0d67" },
  { url: "/favicons/web-app-manifest-192x192.png", revision: "4e0d67" },
  { url: "/favicons/web-app-manifest-512x512.png", revision: "4e0d67" }
];

precacheAndRoute(APP_SHELL);

// Cache strategies for different types of requests
registerRoute(
  ({ request }) => request.mode === "navigate",
  async ({ event, request }) => {
    const preloadResponse = await event.preloadResponse;
    if (preloadResponse) {
      return preloadResponse;
    }
    return navigationStrategy.handle({ event, request });
  },
);

// Cache strategies for CSS files
registerRoute(
  ({ request }) => request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "assets-css-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 }),
      cssVersionCleanupPlugin,
    ],
  }),
);

// Cache strategies for JavaScript files
registerRoute(
  ({ request }) => request.destination === "script",
  new StaleWhileRevalidate({
    cacheName: "assets-js-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  }),
);

// Cache strategies for images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

// Cache strategies for fonts
registerRoute(
  ({ request }) => request.destination === "font",
  new CacheFirst({
    cacheName: "fonts-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  }),
);

// Cache strategies for JSON data
registerRoute(
  ({ request }) => request.url.endsWith(".json"),
  new NetworkFirst({
    cacheName: "json-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
);

// Cache strategies for XML data
registerRoute(
  ({ request }) => request.url.endsWith(".xml"),
  new NetworkFirst({
    cacheName: "xml-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
);

// Enable navigation preload for faster responses when offline
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    if ("navigationPreload" in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());
});

// Handle offline fallback for navigation requests
setCatchHandler(async ({ event }) => {
  if (event.request.mode === "navigate") {
    return matchPrecache("/offline.html");
  }
  return Response.error();
});

