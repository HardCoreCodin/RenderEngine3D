import {
    SharedVertexColors,
    SharedVertexNormals,
    SharedVertexPositions,
    SharedVertexUVs,
    UnsharedVertexColors,
    UnsharedVertexNormals,
    UnsharedVertexPositions,
    UnsharedVertexUVs
} from "../attributes/vertex.js";
import {FaceColors, FaceNormals, FacePositions} from "../attributes/face.js";
import {
    ATTRIBUTE,
    CONVERT, FACE_COLOR_MODE, FACE_INCLUDE,
    GEN,
    MASK,
    OFFSET,
    SHARE,
    VERTEX_COLOR_MODE,
    VERTEX_INCLUDE,
    VERTEX_NORMAL_MODE
} from "../../constants.js";
import {FaceVertices, VertexFaces} from "../../types.js";
import {MeshInputs} from "./inputs.js";
import {AttributeInputs} from "../attributes/input";

export class Vertices {
    public readonly position: SharedVertexPositions | UnsharedVertexPositions;
    public readonly normal: SharedVertexNormals | UnsharedVertexNormals | null;
    public readonly color: SharedVertexColors | UnsharedVertexColors | null;
    public readonly uv:  SharedVertexUVs | UnsharedVertexUVs | null;

    constructor(count: number, include: number, share: number) {
        this.position = share & ATTRIBUTE.position ?
            new SharedVertexPositions(count) :
            new UnsharedVertexPositions(count);

        if (include & ATTRIBUTE.normal)
            this.normal = share & ATTRIBUTE.normal ?
                new SharedVertexNormals(count) :
                new UnsharedVertexNormals(count);

        if (include & ATTRIBUTE.color)
            this.color = share & ATTRIBUTE.color ?
                new SharedVertexColors(count) :
                new UnsharedVertexColors(count);

        if (include & ATTRIBUTE.uv)
            this.uv = share & ATTRIBUTE.uv ?
                new SharedVertexUVs(count) :
                new UnsharedVertexUVs(count);
    }
}

export class Faces {
    public readonly position: FacePositions | null;
    public readonly normal: FaceNormals | null;
    public readonly color: FaceColors | null;

    constructor(count: number, include: number) {
        if (include & ATTRIBUTE.position) this.position = new FacePositions(count);
        if (include & ATTRIBUTE.normal) this.normal = new FaceNormals(count);
        if (include & ATTRIBUTE.color) this.color = new FaceColors(count);
    }
}

export class MeshData {
    public readonly faces: Faces;
    public readonly face_vertices: FaceVertices;

    public readonly vertices: Vertices;
    public readonly vertex_faces: VertexFaces;

    public _flags: number;

    constructor(
        flags: number,

        public readonly inputs: MeshInputs,
        public readonly face_count: number = inputs.position.faces[0].length,
        public readonly vertex_count: number = inputs.position.vertices[0].length
    ) {
        this.flags = flags;

        this.faces = new Faces(face_count, this.face_includes);
        this.vertices = new Vertices(vertex_count, flags);

        this.vertices.position.load(inputs.position);
    }

    get flags() : number {return this._flags}
    set flags(flags) {
        // Sanitize the vertex loading flags to load only from what's included in the inputs:
        if (flags & VERTEX_NORMAL_MODE.LOAD && this.inputs.normal === null)
            flags &= ~VERTEX_NORMAL_MODE.LOAD;
        if (flags & VERTEX_COLOR_MODE.LOAD && this.inputs.color === null)
            flags &= ~VERTEX_COLOR_MODE.LOAD;
        if (flags & VERTEX_INCLUDE.UV && this.inputs.uv === null)
            flags &= ~VERTEX_INCLUDE.UV;

        // If face colors are asked to be gathered from vertex colors,
        // but either of the following conditions are detected, disable face color gathering:
        // 1. Face colors are asked to also be 'generated' (favour that)
        // 2. Vertex colors are asked to be gathered from face colors (and they can not gather from each other)
        // 3. No vertex colors are available to be gathered (not loaded nor generated).
        if (flags & FACE_COLOR_MODE.GATHER && (
            flags & FACE_COLOR_MODE.GENERATE ||
            flags & VERTEX_COLOR_MODE.GATHER || !(
                flags & VERTEX_COLOR_MODE.GENERATE |
                flags & VERTEX_COLOR_MODE.LOAD
            )
        ))
            flags &= ~FACE_COLOR_MODE.GATHER;

        // If vertex colors are asked to be gathered from face colors,
        // but face colors are't being generated, disable vertex color gathering::
        if (flags & VERTEX_COLOR_MODE.GATHER && !(
            flags & FACE_COLOR_MODE.GENERATE))
            flags &= ~VERTEX_COLOR_MODE.GATHER;

        // If vertex normals are asked to be gathered from face normals,
        // but face normals are't being generated, disable vertex normal gathering:
        if (flags & VERTEX_NORMAL_MODE.GATHER && !(
            flags & FACE_INCLUDE.NORMAL))
            flags &= ~VERTEX_NORMAL_MODE.GATHER;

        // If vertex colors are being generated or converted-to, there is no point in loading them:
        if (flags & VERTEX_COLOR_MODE.LOAD &&
            (flags & GEN.v_color || flags & CONVERT.f2v_color))
            flags &= ~VERTEX_COLOR_MODE.LOAD;

        // If vertex normals are being generated, there is no point in loading them:
        if (flags & CONVERT.f2v_normal &&
            flags & ATTRIBUTE.normal)
            flags &= ~VERTEX_NORMAL_MODE.LOAD;

        // Sanitize the vertex sharing flags to share only from what's available:
        flags &= (flags << OFFSET.SHARE) | (MASK.ALL & ~MASK.SHARE);

        this._flags = flags;
    }
}