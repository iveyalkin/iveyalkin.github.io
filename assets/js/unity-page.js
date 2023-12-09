var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "fixed";

    document.body.style.textAlign = "left";
}

var playgroundUrl = "/playground"
var buildUrl = playgroundUrl + "/landscape"; // {{ page.buildUrl }}
var loaderUrl = buildUrl + "/WebGL.loader.js";
var config = {
    dataUrl: buildUrl + "/WebGL.data.unityweb",
    frameworkUrl: buildUrl + "/WebGL.framework.js.unityweb",
    codeUrl: buildUrl + "/WebGL.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "iv.conduct",
    productName: "Landscape WebGL demo", // {{ page.buildTitle }}
    productVersion: "0.0.2",
    // matchWebGLToCanvasSize: false, // Uncomment this to separately control WebGL canvas render size and DOM element size.
    // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
};

loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    })
    .then((unityInstance) => {
            loadingBar.style.display = "none";

            fullscreenButton.onclick = () => {
                unityInstance.SetFullscreen(1);
            };
        })
    .catch((message) => {
        alert(message);
    });
}

document.body.appendChild(script);

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }

    var div = document.createElement('div');
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