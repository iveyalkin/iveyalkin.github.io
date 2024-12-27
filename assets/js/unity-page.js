// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
function unityShowBanner(msg, type) {
    const warningBanner = document.querySelector("#unity-warning")

    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }

    const div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    
    if (type == 'error') {
        div.style = 'background: red; padding: 10px;';
    } else {
        if (type == 'warning') {
            div.style = 'background: yellow; padding: 10px;';
        }
        setTimeout(function() {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }

    updateBannerVisibility();
}

// ServiceWorker: cache the WebGL build files
// {
//     // todo: dynamically resolve the cache name
//     const cacheName = "WebGL-urp-take1-0.1.0";
//     const contentToCache = [
//         "Build/builds.loader.js",
//         "Build/builds.framework.js.unityweb",
//         "Build/builds.data.unityweb",
//         "Build/builds.wasm.unityweb"
//     ];

//     self.addEventListener('install', function (e) {
//         console.log('[Service Worker] Install');
        
//         e.waitUntil((async function () {
//         const cache = await caches.open(cacheName);
//         console.log('[Service Worker] Caching all: app shell and content');
//         await cache.addAll(contentToCache);
//         })());
//     });

//     self.addEventListener('fetch', function (e) {
//         e.respondWith((async function () {
//         let response = await caches.match(e.request);
//         console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
//         if (response) { return response; }

//         response = await fetch(e.request);
//         const cache = await caches.open(cacheName);
//         console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
//         cache.put(e.request, response.clone());
//         return response;
//         })());
//     });
// }