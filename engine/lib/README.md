RnDer.js

This is a 'programmable' low-level graphics API (a-la: WebGL) written entirely in TypeScript.
It is NOT intended to be used for application development(!).
It is meant to be an aiding tool for learning/teaching the fundamentals of computer graphics.
It may also be used to rapidly-prototype rendering algorithms that would otherwise 
be difficult/impossible to achieve with today's hardware-accelerated graphics APIs.

The render pipeline uses the more 'modern' design consisting of Mesh and Pixel shaders.
All shaders are written in TypeScript/JavaScript using a highly-optimized math library.

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

