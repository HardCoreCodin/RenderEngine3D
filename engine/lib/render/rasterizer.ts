import {Matrix4x4} from "../accessors/matrix.js";
import {VertexPositions3D, VertexPositions4D} from "../geometry/positions.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {cube_face_vertices} from "../geometry/cube.js";
import {cullAndClip, CULL} from "../math/rasterization.js";

const clip_box_face_flags = new Uint8Array(6);
const clip_box_vertex_flags = new Uint8Array(8);


export default class Rasterizer
{
    // readonly view_positions: VertexPositions3D;
    readonly clip_space_positions: VertexPositions4D;
    readonly ndc_space_positions: VertexPositions4D;
    readonly new_faces_positions: VertexPositions4D;
    protected result_flags: number;

    // readonly screen_positions: VertexPositions3D;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly local_positions: VertexPositions3D,
        readonly local_bbox_positions: VertexPositions3D,
        readonly local_to_world: Matrix4x4,

        readonly local_to_clip = new Matrix4x4(),
        readonly face_count = face_vertices.arrays[0].length,
        readonly vertex_count = local_positions.length,

        readonly face_flags: Uint8Array = new Uint8Array(face_count),
        readonly vertex_flags: Uint8Array = new Uint8Array(vertex_count),

        readonly face_areas = new Float32Array(face_count),
        readonly new_face_areas = new Float32Array(face_count),
        readonly clip_bbox_positions = new VertexPositions4D(cube_face_vertices),
    ) {
        this.clip_space_positions = new VertexPositions4D(face_vertices);
        this.ndc_space_positions = new VertexPositions4D(face_vertices);
        this.new_faces_positions = new VertexPositions4D(face_vertices);
    }

    orient(world_to_clip: Matrix4x4) {
        this.local_to_world.times(world_to_clip, this.local_to_clip);
    }

    cullBoundingBox(): number {
        this.local_bbox_positions.mat4mul(this.local_to_clip, this.clip_bbox_positions);

        // Check if the clip-space bounding-box is visible in the view frustum:
        this.result_flags = cullAndClip(
            this.clip_space_positions.arrays,
            this.ndc_space_positions.arrays,
            this.new_faces_positions.arrays,
            cube_face_vertices.arrays,
            clip_box_vertex_flags,
            clip_box_face_flags
        );

        return this.result_flags;
    }

    cullAndClip() {
        // The bounding box is visible in the view frustum.
        // Do the frustum check again, this time with the full mesh:
        this.local_positions.mat4mul(this.local_to_clip, this.clip_space_positions);
        this.result_flags = cullAndClip(
            this.clip_space_positions.arrays,
            this.ndc_space_positions.arrays,
            this.new_faces_positions.arrays,
            this.face_vertices.arrays,
            this.vertex_flags,
            this.face_flags,
            this.face_areas,
            this.new_face_areas,
        );
        if (this.result_flags === CULL)
            return CULL;
    }
}