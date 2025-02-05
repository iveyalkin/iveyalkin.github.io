---
layout: webgl-simple-post
title: WebGL GLSL Demo. Constructing shapes with SDF
date: 2024-12-05 11:49:00 +0300
categories: shaders
canvasWidth: 960
canvasHeight: 600
canvasBackground: transparent
fsPath: "/assets/shaders/rising-sun/fragment.glsl"
---

A tiny WebGL GLSL shader demo called "Rising Sun." [Shader code](https://github.com/iveyalkin/iveyalkin.github.io/blob/master/assets/shaders/rising-sun/fragment.glsl)

Its story begins with the intention to optimize the build size to meet Google Play's APK size requirements. My team didn't want our users to wait longer than necessary or ask them to download more data when the first session begins—it's bad for the metrics, you know.
Anyway, apart from stripping unused content, changing compression methods, and eliminating duplicates, there was one interesting case: a bitmap with alpha depicting a specific radial gradient. It was being used as a background for a UI popup during gameplay. The use case was neither dynamic nor frequently used in the project, and the asset took up 4MB in our build. It seemed like a good exercise to refresh some GLSL knowledge!