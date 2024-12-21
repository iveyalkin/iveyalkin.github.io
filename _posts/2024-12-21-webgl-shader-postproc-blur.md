---
layout: webgl-postprocessing-post
title: Fullscreen blur. A image postprocessing shader effect
date: 2024-12-21 13:11:00 +0300
categories: shaders
canvasWidth: 960
canvasHeight: 600
canvasBackground: transparent
fsPath: "/assets/shaders/blur/fragment.glsl"
backgroundTexturePath: "/assets/images/front-page/splash.webp"
---

Simple post processing effect to blur image. It leverages a common digital image transformation called "filtering" with 3x3 kernel (or mask).