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
import {ATTRIBUTE, CONVERT, GEN, MASK, OFFSET, SHARE} from "../../constants.js";
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

    // constructor(count: number, flags: number) {
    //     this.position = SHARE.position & flags ?
    //         new SharedVertexPositions(count) :
    //         new UnsharedVertexPositions(count);
    //
    //     if (flags & (ATTRIBUTE.normal | CONVERT.f2v_normal))
    //         this.normal = SHARE.normal & flags ?
    //             new SharedVertexNormals(count) :
    //             new UnsharedVertexNormals(count);
    //
    //     if (flags & (ATTRIBUTE.color | CONVERT.f2v_color | GEN.v_color))
    //         this.color = SHARE.color & flags ?
    //             new SharedVertexColors(count) :
    //             new UnsharedVertexColors(count);
    //
    //     if (ATTRIBUTE.uv & flags)
    //         this.uv = SHARE.uv & flags ?
    //             new SharedVertexUVs(count) :
    //             new UnsharedVertexUVs(count);
    // }
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

    // constructor(count: number, flags: number) {
    //     if (flags & CONVERT.v2f_position)
    //         this.position = new FacePositions(length);
    //
    //     if (flags & GEN.f_normal)
    //         this.normal = new FaceNormals(length);
    //
    //     if (flags & GEN.f_color | CONVERT.v2f_color)
    //         this.color = new FaceColors(length);
    // }
}

export class MeshData {
    public readonly faces: Faces;
    public readonly face_vertices: FaceVertices;

    public readonly vertices: Vertices;
    public readonly vertex_faces: VertexFaces;

    public _flags: number;

    constructor(
        flags: number = ATTRIBUTE.position,

        public readonly inputs: MeshInputs,
        public readonly face_count: number = inputs.position.faces[0].length,
        public readonly vertex_count: number = inputs.position.vertices[0].length
    ) {
        this.flags = flags;

        this.faces = new Faces(face_count, flags);
        this.vertices = new Vertices(vertex_count, flags);

        this.vertices.position.load(inputs.position);
    }

    get flags() : number {return this._flags}
    set flags(flags) {
        // Sanitize the vertex loading flags to load only from what's included in the inputs:
        flags &= this.inputs.includes | (MASK.ALL & ~MASK.LOAD);

        // If vertex color is asked to be converted from face colors

        // If vertex colors are being generated or converted-to, there is no point in loading them:
        if (flags & ATTRIBUTE.color &&
            (flags & GEN.v_color || flags & CONVERT.f2v_color))
            flags &= ~ATTRIBUTE.color;

        // If vertex normals are being generated, there is no point in loading them:
        if (flags & CONVERT.f2v_normal &&
            flags & ATTRIBUTE.normal)
            flags &= ~ATTRIBUTE.normal;

        // Sanitize the vertex sharing flags to share only from what's available:
        flags &= (flags << OFFSET.SHARE) | (MASK.ALL & ~MASK.SHARE);

        this._flags = flags;
    }
}