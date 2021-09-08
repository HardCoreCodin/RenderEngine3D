import { Bounds3D } from "./bounds.js";
import Faces from "./faces.js";
import Vertices from "./vertices.js";
import { MeshOptions } from "./options.js";
import { FaceVerticesInt32, VertexFacesInt32 } from "./indices.js";
export default class Mesh {
    constructor(inputs, options = new MeshOptions(), face_vertices, vertex_faces) {
        this.inputs = inputs;
        this.options = options;
        this.faces = new Faces();
        this.vertices = new Vertices();
        this.bbox = new Bounds3D();
        this.on_mesh_loaded = new Set();
        inputs.sanitize();
        this.face_vertices = face_vertices || new FaceVerticesInt32().load(inputs.position);
        this.face_count = this.face_vertices.length;
        this.vertex_count = options.share & 1 /* position */ ? inputs.position.vertex_count : this.face_count * 3;
        this.vertex_faces = vertex_faces || new VertexFacesInt32().load(this.face_vertices, this.vertex_count);
        if (!options.share) {
            let index = 0;
            for (const array of this.face_vertices.arrays)
                for (let i = 0; i < 3; i++)
                    array[i] = index++;
        }
    }
    load() {
        this.options.sanitize(this.inputs);
        const face_attrs = this.options.face_attributes;
        const vertex_attrs = this.options.vertex_attributes;
        const pd = this.inputs.position.dim;
        const nd = this.inputs.normal ? this.inputs.normal.dim : 0;
        const cd = this.inputs.color ? this.inputs.color.dim : 0;
        const ud = this.inputs.uv ? this.inputs.uv.dim : 0;
        const fnd = nd || face_attrs & 2 /* normal */ ? pd : undefined;
        const fcd = cd || face_attrs & 4 /* color */ ? 3 /* _3D */ : undefined;
        const vnd = nd || vertex_attrs & 2 /* normal */ ? pd : undefined;
        const vcd = cd || vertex_attrs & 4 /* color */ ? 3 /* _3D */ : undefined;
        this.faces.init(this.face_vertices, face_attrs, pd, fnd, fcd);
        this.vertices.init(this.face_vertices, vertex_attrs, this.options.share, this.vertex_count, pd, vnd, vcd, ud);
        this.vertices.positions.load(this.inputs.position);
        this.bbox.load(this.vertices.positions);
        if (this.options.include_uvs)
            this.vertices.uvs.load(this.inputs.uv);
        switch (this.options.normal) {
            case 0 /* NO_VERTEX__NO_FACE */:
                break;
            case 1 /* NO_VERTEX__GENERATE_FACE */:
                this.faces.pullNormalsFrom(this.vertices.positions);
                break;
            case 2 /* LOAD_VERTEX__NO_FACE */:
                this.vertices.normals.load(this.inputs.normal);
                break;
            case 3 /* LOAD_VERTEX__GENERATE_FACE */:
                this.vertices.normals.load(this.inputs.normal);
                this.faces.pullNormalsFrom(this.vertices.positions);
                break;
            case 4 /* GATHER_VERTEX__GENERATE_FACE */:
                this.faces.pullNormalsFrom(this.vertices.positions);
                this.vertices.pullNormalsFrom(this.faces.normals, this.vertex_faces);
                break;
        }
        switch (this.options.color) {
            case 0 /* NO_VERTEX__NO_FACE */:
                break;
            case 1 /* NO_VERTEX__GENERATE_FACE */:
                this.faces.colors.generate();
                break;
            case 5 /* GENERATE_VERTEX__NO_FACE */:
                this.vertices.colors.generate();
                break;
            case 7 /* GENERATE_VERTEX__GENERATE_FACE */:
                this.faces.colors.generate();
                this.vertices.colors.generate();
                break;
            case 8 /* GATHER_VERTEX__GENERATE_FACE */:
                this.faces.colors.generate();
                this.vertices.pullColorsFrom(this.faces.colors, this.vertex_faces);
                break;
            case 6 /* GENERATE_VERTEX__GATHER_FACE */:
                this.vertices.colors.generate();
                this.faces.pullColorsFrom(this.vertices.colors);
                break;
            case 2 /* LOAD_VERTEX__NO_FACE */:
                this.vertices.colors.load(this.inputs.color);
                break;
            case 4 /* LOAD_VERTEX__GENERATE_FACE */:
                this.vertices.colors.load(this.inputs.color);
                this.faces.colors.generate();
                break;
            case 3 /* LOAD_VERTEX__GATHER_FACE */:
                this.vertices.colors.load(this.inputs.color);
                this.faces.pullColorsFrom(this.vertices.colors);
        }
        if (this.on_mesh_loaded.size)
            for (const mesh_loaded of this.on_mesh_loaded)
                mesh_loaded(this);
        return this;
    }
}
//# sourceMappingURL=mesh.js.map