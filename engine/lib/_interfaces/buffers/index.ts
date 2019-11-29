import {VertexFacesIndices} from "../../../types.js";
import {IInt1Buffer, IInt3Buffer} from "./int.js";
import {IInt1Allocator, IInt3Allocator} from "../allocators.js";

export interface IFaceVertices extends IInt3Buffer
{
    allocator: IInt3Allocator;

    load(face_vertices: [number[], number[], number[]]): void;
}

export interface IVertexFaces extends IInt1Buffer
{
    allocator: IInt1Allocator;
    indices: VertexFacesIndices;

    load(input_indices: number[][]): void;
}