const CACHE = "pwabuilder-precache";
const precacheFiles = [
  "/index.html",
  "/iggys/index.html",
  "/jointpains/index.html",
  "/send/index.html",
  "/styles.css",
  "/index.js",
  "/pushless-index.js",
  "/main.js",
  "/static/wallpaper.jpg",
  "/static/50x50.png"
];

self.addEventListener("install", function(event) {
  //console.log("[PWA] Install Event processing");

  //console.log("[PWA] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      //console.log("[PWA] Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

self.addEventListener("activate", function(event) {
  //console.log("[PWA] Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fromCache(event.request).then(
      function(response) {
        event.waitUntil(
          fetch(event.request).then(function(response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function() {
        return fetch(event.request)
          .then(function(response) {
            event.waitUntil(updateCache(event.request, response.clone()));
            return response;
          })
          .catch(function(error) {
            console.log("[PWA] Network request failed and no cache." + error);
          });
      }
    )
  );
});

function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function(cache) {
    return cache.put(request, response);
  });
}
