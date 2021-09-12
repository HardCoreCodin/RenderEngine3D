import {Bounds4D} from "../../../../../geometry/bounds.js";
import Mesh from "../../../../../geometry/mesh.js";
import Matrix4x4 from "../../../../../accessors/matrix4x4.js";
import {VertexPositions4D} from "../../../../../buffers/attributes/positions.js";
import {CULL, INSIDE} from "../../../../../core/constants.js";
import {CUBE_VERTEX_COUNT} from "../../../../../geometry/cube.js";
import {FlagsBuffer1D} from "../../../../../buffers/flags.js";
import {cullFaces, cullVertices} from "../../core/cull.js";

export type IMeshShader = (mesh: Mesh, mvp: Matrix4x4, vertex_positions: VertexPositions4D) => number;

const shadeMesh: IMeshShader = (mesh: Mesh, mvp: Matrix4x4, vertex_positions: VertexPositions4D): number => {
    // Transform the mesh's vertex positions into clip space:
    mesh.vertices.positions.mul(mvp, vertex_positions);

    return INSIDE;
};
export default shadeMesh;

export const shadeMeshByCullingBBox: IMeshShader = (mesh: Mesh, mvp: Matrix4x4, vertex_positions: VertexPositions4D): number => {
    // Transform the bounding box into clip space:
    mesh.bbox.vertex_positions.mul(mvp, BBOX_VERTEX_POSITIONS);

    // Cull the bounding box against the view frustum:
    if (cullVertices(BBOX_POSITIONS_ARRAYS, BBOX_VERTEX_FLAGS, CUBE_VERTEX_COUNT) &&
        cullFaces(BBOX_POSITIONS_ARRAYS, BBOX_FACE_VERTICES_ARRAYS, BBOX_FACE_FLAGS, BBOX_VERTEX_FLAGS))
        // The bounding box is visible in the viewport in some way.
        return shadeMesh(mesh, mvp, vertex_positions);

    return CULL;
};

const BBOX_BOUNDS = new Bounds4D();
const BBOX_VERTEX_POSITIONS = BBOX_BOUNDS.vertex_positions;
const BBOX_POSITIONS_ARRAYS = BBOX_VERTEX_POSITIONS.arrays;
const BBOX_FACE_VERTICES_ARRAYS = BBOX_VERTEX_POSITIONS.face_vertices.arrays;
const BBOX_FACE_FLAGS = new FlagsBuffer1D().init(BBOX_FACE_VERTICES_ARRAYS.length).array;
const BBOX_VERTEX_FLAGS = new FlagsBuffer1D().init(CUBE_VERTEX_COUNT).array;