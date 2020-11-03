const CACHE_NAME = "footballinfo-v1.0.24";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/bundle.js",
  "/main.css",
  "/src/component/nav-club.html",
  "/src/component/nav.html",
  "/src/pages/club.html",
  "/src/pages/favorites.html",
  "/src/pages/matches.html",
  "/src/pages/standings.html",
  "/src/img/background.jpg",
  "/src/img/icon.png",
  "/src/img/icons.woff2",
  "/src/img/jumbotron-back.jpg",
  "/src/img/side-back.jpg",
  "/src/img/side-back.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then( cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  var baseUrl = "https://api.football-data.org/v2/";

  if (event.request.url.indexOf(baseUrl) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then( cache => {
        return fetch(event.request).then( response => {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then( response => {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus.");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
