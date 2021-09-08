RnDer.js
=

Preface: 
This library is NOT intended to be used for developing applications!
It is meant to be an aiding tool for learning and teaching the fundamentals of computer graphics.
It may also be used to prototype rendering techniques that would otherwise be difficult or impossible to achieve with hardware acceleration.

This is a graphics API written entirely in TypeScript (no hardware acceleration).
It is designed to be trivially portable to static languages.
At it's core it intentionally avoids dynamic language features.
It targets the optimizing compilers that come with modern javascript engines.
It minimizes memory allocations to be 'friendly' to garbage collection.
It uses a data oriented design all throughout for maximum performance.

Features include:
1. A low level math library
2. A high level mesh library
3. A programmable rendering pipeline

The math library has linear algebra constructs (vectors, matrices, etc.).
The mesh library has facilities for loading and manipulating attributes of vertices and faces.
The render pipeline has a modern design consisting of Mesh and Pixel shaders.
Shaders can be written in TypeScript or JavaScript using the math and mesh libraries.

Higher level features are also included for prototyping applications:
1. A render engine
2. A scene graph
3. Scene nodes
4. Input controllers

The render engine supports muliple viewports within the same canvas.
The scene graph has a node hierarchy with transforms.
Scene nodes include meshes, cameras lights, etc.
Nodes can be defined as dynamic or static for efficient updating of transforms.
Input controllers bind to cameras for different navigation styles (FPS, Orbit, etc.)

Shaders:
=
Mesh shaders produce triangles with vertex attributes. 
Custom culling algorithms can easily be implemented.
Included as an example, is one that first culls bounding boxes before culling actual meshes.
The built-in rasterizer takes care of culling and clipping the triangles produced by the mesh shaders.
It also interpolates their attributes using 'perspective corrected' barycentric coordinates, 
which are subsequently available in the Pixel shaders (for interpolating any dditional values).

Pixel shaders produce final pixel colors, and are only executed for the closest pixels.
The rasterizer applies a full depth-pass on all geometry before executing pixel shaders.
This ensures that per-pixel computation only occurs on visible pixels so there is no overdraw.
(Note: Transparency is not supported)