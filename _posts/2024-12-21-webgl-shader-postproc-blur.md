---
layout: webgl-postprocessing-post
title: Fullscreen blur. A image postprocessing shader effect
date: 2024-12-21 13:11:00 +0300
categories: shaders
canvasWidth: 512
canvasHeight: 512
canvasBackground: transparent
fsPath: "/assets/shaders/blur/fragment.glsl"
backgroundTexturePath: "/assets/images/front-page/splash.webp"
---

Simple post processing effect to blur image. [Shader code](https://github.com/iveyalkin/iveyalkin.github.io/blob/master/assets/shaders/blur/fragment.glsl)

It leverages a common digital image transformation called "filtering" with 3x3 kernel (or mask). Below is an image with a simple bluring using kernel:
```javascript
new [
    1, 1, 1,
    1, 1, 1,
    1, 1, 1
]
```