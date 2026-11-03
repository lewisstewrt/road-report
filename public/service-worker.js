const CACHE_NAME = "road-report-v1";

const FILES_TO_CACHE =[
    "/",
    "/index.html",
    "/manifest.json",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

//Install runs once a new version of this file is installed
self.addEventListener("install", (event) =>{
    console.log("Service worker installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    )
});

//Activate runs when this version takes over old one
self.addEventListener("activate", (event) =>{
    console.log("Service worker activated");
});

//Fetch runs for every request made by app
self.addEventListener("fetch", (event) =>{
    if (event.request.method !== "GET") return;
    if (!event.request.url.startsWith("http")) return;  // ignores chrome extension

    event.respondWith(
        caches.match(event.request).then((cached) => {
            //if in cache use that
            if(cached) return cached;

            //if not cached then get from internet
            return fetch(event.request).then((response) => {
                // save copy in cache for next time
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                return response
            }).catch(() => caches.match("/index.html")); // Plan b if theres no internet
        })
    )
});

