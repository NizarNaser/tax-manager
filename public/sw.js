// Minimal service worker: exists only to satisfy PWA installability
// requirements (the browser's "Add to Home Screen" / install prompt checks
// for a registered service worker with a fetch handler). Deliberately does
// not cache or intercept requests — this app's data (invoices, settings)
// must always come from the network, never a stale cache.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Intentionally not calling event.respondWith() — requests pass through
  // to the network unchanged.
});
