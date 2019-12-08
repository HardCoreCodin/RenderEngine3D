import Viewport from "./viewport.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {VertexPositions3D, VertexPositions4D} from "../geometry/positions.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {cube_face_vertices} from "../geometry/cube.js";
import {CULL, frustumCheck} from "../math/raster.js";

const clip_bbox_positions = new VertexPositions4D(cube_face_vertices);
const clip_box_face_flags = new Uint8Array(6);
const clip_box_vertex_flags = new Uint8Array(8);

const local_to_view = new Matrix4x4();
const local_to_clip = new Matrix4x4();

let result_flags: number;

export default class Rasterizer
{
    readonly view_positions: VertexPositions3D;
    readonly clip_positions: VertexPositions4D;
    readonly screen_positions: VertexPositions3D;

    readonly face_flags: Uint8Array;
    readonly vertex_flags: Uint8Array;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly local_positions: VertexPositions3D,
        readonly local_bbox_positions: VertexPositions4D,
        readonly local_to_world: Matrix4x4,
    ) {
        this.view_positions = new VertexPositions3D(face_vertices);
        this.clip_positions = new VertexPositions4D(face_vertices);
        this.screen_positions = new VertexPositions3D(face_vertices);

        this.face_flags = new Uint8Array(face_vertices.length);
        this.vertex_flags = new Uint8Array(local_positions.length);
    }

    rasterize(viewport: Viewport) {
        this.local_to_world.times(viewport.world_to_clip, local_to_clip);
        this.local_bbox_positions.matmul(local_to_clip, clip_bbox_positions);

        // Check if the clip-space bounding-box is visible in the view frustum:
        if (frustumCheck(
            clip_bbox_positions.arrays, clip_box_vertex_flags,
            cube_face_vertices.arrays, clip_box_face_flags
        ) === CULL)
            return CULL;

        // The bounding box is visible in the view frustum.
        // Do the frustum check again, this time with the full mesh:
        this.local_positions.mat4mul(local_to_clip, this.clip_positions);
        if (frustumCheck(
            this.clip_positions.arrays, this.vertex_flags,
            this.face_vertices.arrays, this.face_flags
        ) === CULL)
            return CULL;

        // The mesh is visible in the frustum - rasterize it:

    }
}