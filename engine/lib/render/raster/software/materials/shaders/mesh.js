import { Bounds4D } from "../../../../../geometry/bounds.js";
import { CULL, INSIDE } from "../../../../../../constants.js";
import { CUBE_VERTEX_COUNT } from "../../../../../geometry/cube.js";
import { FlagsBuffer1D } from "../../../../../buffers/flags.js";
import { cullFaces, cullVertices } from "../../_core/cull.js";
const shadeMesh = (mesh, model_to_clip, clip_space_vertex_positions) => {
    // Transform the mesh's vertex positions into clip space:
    mesh.vertices.positions.mul(model_to_clip, clip_space_vertex_positions);
    return INSIDE;
};
export default shadeMesh;
export const shadeMeshByCullingBBox = (mesh, model_to_clip, clip_space_vertex_positions) => {
    // Transform the bounding box into clip space:
    mesh.bbox.vertex_positions.mul(model_to_clip, BBOX_VERTEX_POSITIONS);
    // Cull the bounding box against the view frustum:
    if (cullVertices(BBOX_POSITIONS_ARRAYS, BBOX_VERTEX_FLAGS, CUBE_VERTEX_COUNT) &&
        cullFaces(BBOX_POSITIONS_ARRAYS, BBOX_FACE_VERTICES_ARRAYS, BBOX_FACE_FLAGS, BBOX_VERTEX_FLAGS))
        // The bounding box is visible in the viewport in some way.
        return shadeMesh(mesh, model_to_clip, clip_space_vertex_positions);
    return CULL;
};
const BBOX_BOUNDS = new Bounds4D();
const BBOX_VERTEX_POSITIONS = BBOX_BOUNDS.vertex_positions;
const BBOX_POSITIONS_ARRAYS = BBOX_VERTEX_POSITIONS.arrays;
const BBOX_FACE_VERTICES_ARRAYS = BBOX_VERTEX_POSITIONS.face_vertices.arrays;
const BBOX_FACE_FLAGS = new FlagsBuffer1D().init(BBOX_FACE_VERTICES_ARRAYS.length).array;
const BBOX_VERTEX_FLAGS = new FlagsBuffer1D().init(CUBE_VERTEX_COUNT).array;
//# sourceMappingURL=mesh.js.map