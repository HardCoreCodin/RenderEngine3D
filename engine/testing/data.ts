import {T3} from "../types.js";
import {InputColors, InputPositions} from "../lib/geometry/inputs.js";
import {FaceVerticesInt8} from "../lib/geometry/indices.js";
import {VertexPositions3D} from "../lib/geometry/positions.js";
import {VertexColors3D} from "../lib/geometry/colors.js";

const input_positions = new InputPositions();
const input_colors = new InputColors();

// Top
input_positions.pushVertex([-1, 1, -1]),
input_positions.pushVertex([-1, 1,  1]),
input_positions.pushVertex([1,  1,  1]),
input_positions.pushVertex([1,  1, -1]),

// Left
input_positions.pushVertex([-1,  1,  1]);
input_positions.pushVertex([-1, -1,  1]);
input_positions.pushVertex([-1, -1, -1]);
input_positions.pushVertex([-1,  1, -1]);

// Right
input_positions.pushVertex([1,  1,  1]);
input_positions.pushVertex([1, -1,  1]);
input_positions.pushVertex([1, -1, -1]);
input_positions.pushVertex([1,  1, -1]);

// Front
input_positions.pushVertex([ 1,  1, 1]);
input_positions.pushVertex([ 1, -1, 1]);
input_positions.pushVertex([-1, -1, 1]);
input_positions.pushVertex([-1,  1, 1]);

// Back
input_positions.pushVertex([ 1,  1, -1]);
input_positions.pushVertex([ 1, -1, -1]);
input_positions.pushVertex([-1, -1, -1]);
input_positions.pushVertex([-1,  1, -1]);

// Bottom
input_positions.pushVertex([-1, -1, -1]);
input_positions.pushVertex([-1, -1,  1]);
input_positions.pushVertex([ 1, -1,  1]);
input_positions.pushVertex([ 1, -1, -1]);

// Top
input_positions.pushFace([0,  1,  2]);
input_positions.pushFace([0,  2,  3]);

// Left
input_positions.pushFace([5,  4,  6]);
input_positions.pushFace([6,  4,  7]);

// Right
input_positions.pushFace([8,  9,  10]);
input_positions.pushFace([8,  10, 11]);

// Front
input_positions.pushFace([13, 12, 14]);
input_positions.pushFace([15, 14, 12]);

// Back
input_positions.pushFace([16, 17, 18]);
input_positions.pushFace([16, 18, 19]);

// Bottom
input_positions.pushFace([21, 20, 22]);
input_positions.pushFace([22, 20, 23]);

export const face_count = input_positions.face_count;
const quad_count = face_count >> 1;

input_colors.pushVertex([0.5, 0.5, 0.5]); // Top
input_colors.pushVertex([0.75, 0.25, 0.5]); // Left
input_colors.pushVertex([0.25, 0.25, 0.75]); // Right
input_colors.pushVertex([1, 0, 0.15]); // Front
input_colors.pushVertex([0, 1, 0.15]); // Back
input_colors.pushVertex([0.5, 0.5, 1]); // Bottom

const quad_color_indices = Array<number>(3) as T3<number>;
for (let quad_index = 0; quad_index < quad_count; quad_index++) {
    quad_color_indices.fill(quad_index);
    input_colors.pushFace(quad_color_indices);
    input_colors.pushFace(quad_color_indices);
}

export const vertex_count = input_positions.vertex_count;
export const face_vertices = new FaceVerticesInt8().load(input_positions);
export const positions = new VertexPositions3D(vertex_count, face_vertices).load(input_positions);
export const colors = new VertexColors3D(vertex_count, face_vertices).load(input_colors);