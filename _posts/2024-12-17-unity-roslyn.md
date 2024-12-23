---
layout: page
title: Implementing Roslyn APIs in Unity
date: 2024-12-17 22:56:00 +0300
categories: development
---

Code generators are awesome! Human write about 200 lines of generator's logic that produces about 10 lines of production useful code, but there is a catch. It's per file. Imagine a project has hundreds of such files, now we're talking! There is one more string attached. You might spend hours implementing and debugging that 200 lines of generator's logic, but that's a story for another day.

## Code Generation in Unity

There are 2 main ways one can achieve code generation in C# (Unity):
- Make it dirty - create .cs source files in your project then the compiler kicks in. Simple approach, explicit result anyone could then pick up artifacts and continue to expand with custom logic. Writing code after a machine just wrote it seems like missing the whole point, though.
- Make it fancy - .NET Compiler Platform SDK (aka the Roslyn APIs) for analyzers and source generators. It looks like magic when something processes the data without really existing in the project sources, but in fact it's kinda straightforward. One can even inspect the artifacts without the ability to modify them, though.

I am going to showcase the latter. It's no secret and Unity has [documented](https://docs.unity3d.com/6000.0/Documentation/Manual/roslyn-analyzers.html) the setup process.

## TL;DR
[GitHub project](https://github.com/iveyalkin/roslyn-generators/tree/upm/component-binder) that can be used via UPM in Unity's project.

In the `./Packages/manifest.json`
> "iv.unity-component-binder": "https://github.com/iveyalkin/roslyn-generators.git#v0.0.1"

[README](https://github.com/iveyalkin/roslyn-generators/blob/upm/component-binder/README.md) for more details on how to use.

## How-to make one yourself

### Prepare UPM package
[UPM project structure](https://docs.unity3d.com/Manual/cus-layout.html) I would suggest to start with embedded package and then move it somewhere when it becomes stable. Just for the ease of development.
Important barebone:
```html
<package-root>
├── package.json
├── Plugins
├── Runtime
    └── Dummy.cs
├── <C# Project>~
└── <company-name>.<package-name>.asmdef
```

Key points:
- `<C# Project>` - is a place where generator's logic will be implemented. It's a pure C# project, and Unity has nothing to do with it. The tilde `~` at the end is important to let Unity know that this directory is not a part of Unity's business (no `.meta` files and other overhead).
- `./Runtime/Dummy.cs` can be whatever, the package should have at least one source file so its assembly will be created.  

### Prepare .NET Class Library project
Class library (i.e. DLL) project requires a few components:
```html
<C# Project>~
├── <project-name>.csproj
└── <SourceGeneratorClass>.cs
```
`<project-name>.csproj` is a [C# Project file](https://learn.microsoft.com/en-us/aspnet/web-forms/overview/deployment/web-deployment-in-the-enterprise/understanding-the-project-file#msbuild-and-the-project-file). There will go a couple lines that make life easier:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <!-- Unity supported version (as of Unity 6) -->
    <TargetFramework>netstandard2.0</TargetFramework>

    <!-- Will be used as artifact's name. Feel free to adjust -->
    <AssemblyName>SourceGenerator</AssemblyName>

    <!-- Don't generate intermediate folder 'netstandard2.0' -->
    <AppendTargetFrameworkToOutputPath>false</AppendTargetFrameworkToOutputPath>
  </PropertyGroup>

  <ItemGroup>
    <!-- Unity supported up to version 4.3 -->
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.3.1" />
  </ItemGroup>

  <!-- Copy an artifact (DLL) to the UPM package -->
  <Target Name="PostBuild" AfterTargets="PostBuildEvent" Condition=" '$(Configuration)' == 'Release' ">
    <Exec Command="xcopy /Y /I bin\$(Configuration)\$(AssemblyName).dll ..\Plugins\" />
  </Target>
</Project>
```

With `.NET SDK` installed on the system there is a compiler `dotnet.exe`. To compile the source generator project and build a release DLL execute from the root of the source generator's project root directory:
> dotnet build -c Release 

### Setup UPM package in Unity
According to [documentation](https://docs.unity3d.com/6000.0/Documentation/Manual/create-source-generator.html) it's important to add an asset label
> RoslynAnalyzer

to the source generator's DLL. It can be done in the Unity Editor, or simply in the `.meta` file like so
```yaml
labels:
- RoslynAnalyzer
```
Exclude all platforms in DLL's import settings. Include all platforms (i.e. check `Any Platform`) in package's assembly definition settings.

### Implement generator's logic
There are two types of Roslyn generators:
#### (Old) Source Generator
It's the original solution from the .NET Compiler Platform SDK. To implement this approach add attribute `[Generator]` to the generator's class and implement `ISourceGenerator` interface.

#### Incremental Source Generator (ISG)
Add `[Generator]` attribute to the generator's class and implement `IIncrementalGenerator` interface. It's a preferred approach that potentially has better performance and less overhead.

[ISG Cookbook](https://github.com/dotnet/roslyn/blob/main/docs/features/incremental-generators.cookbook.md) provides information as well as user scenarios and explains some SyntaxTree aspects.