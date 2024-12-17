---
layout: page
title: Implementing Unity Roslyn
date: 2024-12-17 22:56:00 +0300
categories: attic
---

This will be a good ol' post about a particular use case. JSON parsing, to be precise.

### Code Generation in Unity

There are 2 main ways how one can achieve code generation in C# (Unity):
- Make it dirty - create .cs source files in your project then compiler kicks in. Simple approach, explicit result anyone could then pick up artifacts and continue to expand with custom logic. Writing code after a machine just wrote it seems like missing the whole point, though. 
- Make it fancy - .NET Compiler Platform SDK (aka the Roslyn APIs) for analyzers and source generators. It looks like magic when something processes the data without really existing in the project sources, but in fact it's kinda straightforward. One can even inspect the artifacts without the ability to modify it, though.

I am going to showcase the latter. It's no secret and Unity has [documented](https://docs.unity3d.com/6000.0/Documentation/Manual/roslyn-analyzers.html) the setup process.

### TBD