import suzanne_obj from "./assets/monkey.js";
import teapot_obj from "./assets/teapot.js";
import spaceship_obj from "./assets/spaceship.js";
import mountains_obj from "./assets/mountains.js";
import RasterEngine from "./engine/render/raster/software/engine.js";
import SoftwareRasterViewport from "./engine/render/raster/software/viewport.js";
import SoftwareRasterMaterial from "./engine/render/raster/software/materials/base.js";
import Geometry from "./engine/nodes/geometry.js";
import { shadePixelDepth, shadePixelNormal, shadePixelPosition, shadePixelUV, shadePixelBarycentric, shadePixelClassic } from "./engine/render/raster/software/materials/shaders/pixel.js";
import Cube from "./engine/geometry/cube.js";
import { loadMeshFromObj } from "./engine/geometry/loaders.js";
import shadeMesh, { shadeMeshByCullingBBox } from "./engine/render/raster/software/materials/shaders/mesh.js";
const objs = {
    suzanne: suzanne_obj,
    teapot: teapot_obj,
    spaceship: spaceship_obj,
    mountains: mountains_obj
};
const pixel_shaders = {
    depth: shadePixelDepth,
    normal: shadePixelNormal,
    position: shadePixelPosition,
    uv: shadePixelUV,
    barycentric: shadePixelBarycentric,
    checkerboard: shadePixelBarycentric,
    classic: shadePixelClassic
};
const mesh_shaders = {
    base: shadeMesh,
    bbox_cull: shadeMeshByCullingBBox
};
export { RasterEngine, SoftwareRasterViewport, SoftwareRasterMaterial, Geometry, pixel_shaders, mesh_shaders, Cube, objs, loadMeshFromObj };
//# sourceMappingURL=rasterizer.js.map