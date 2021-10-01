import { Bounds4D } from "../../../../../geometry/bounds.js";
import { CULL, INSIDE } from "../../../../../core/constants.js";
import { CUBE_VERTEX_COUNT } from "../../../../../geometry/cube.js";
import { FlagsBuffer1D } from "../../../../../buffers/flags.js";
import { cullFaces, cullVertices } from "../../core/cull.js";
import { multiply_all_3D_directions_by_a_4x4_matrix_to_out3, multiply_all_3D_positions_by_a_4x4_matrix_to_out3, multiply_all_3D_positions_by_a_4x4_matrix_to_out4 } from "../../../../../core/math/vec3.js";
const shadeMesh = (input, output) => {
    // Transform the mesh's vertex positions into clip space:
    multiply_all_3D_positions_by_a_4x4_matrix_to_out3(input.mesh.vertices.positions.arrays, input.model_to_world.array, output.world_space_vertex_positions.arrays, 0, input.mesh.vertex_count);
    multiply_all_3D_positions_by_a_4x4_matrix_to_out4(output.world_space_vertex_positions.arrays, input.world_to_clip.array, output.clip_space_vertex_positions.arrays, 0, input.mesh.vertex_count);
    multiply_all_3D_directions_by_a_4x4_matrix_to_out3(input.mesh.vertices.normals.arrays, input.model_to_world_inverted_transposed.array, output.world_space_vertex_normals.arrays, 0, input.mesh.vertex_count);
    return INSIDE;
};
export default shadeMesh;
export const shadeMeshByCullingBBox = (input, output) => {
    // Transform the bounding box into clip space:
    input.mesh.bbox.vertex_positions.mul(input.model_to_clip, BBOX_VERTEX_POSITIONS);
    // Cull the bounding box against the view frustum:
    if (cullVertices(BBOX_POSITIONS_ARRAYS, BBOX_VERTEX_FLAGS, CUBE_VERTEX_COUNT) &&
        cullFaces(BBOX_POSITIONS_ARRAYS, BBOX_FACE_VERTICES_ARRAYS, BBOX_FACE_FLAGS, BBOX_VERTEX_FLAGS))
        // The bounding box is visible in the viewport in some way.
        return shadeMesh(input, output);
    return CULL;
};
const BBOX_BOUNDS = new Bounds4D();
const BBOX_VERTEX_POSITIONS = BBOX_BOUNDS.vertex_positions;
const BBOX_POSITIONS_ARRAYS = BBOX_VERTEX_POSITIONS.arrays;
const BBOX_FACE_VERTICES_ARRAYS = BBOX_VERTEX_POSITIONS.face_vertices.arrays;
const BBOX_FACE_FLAGS = new FlagsBuffer1D().init(BBOX_FACE_VERTICES_ARRAYS.length).array;
const BBOX_VERTEX_FLAGS = new FlagsBuffer1D().init(CUBE_VERTEX_COUNT).array;
//# sourceMappingURL=mesh.js.map