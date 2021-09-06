export class MeshOptions {
    constructor(share = 0, normal = 0, color = 0, include_uvs = false, generate_face_positions = false) {
        this.share = share;
        this.normal = normal;
        this.color = color;
        this.include_uvs = include_uvs;
        this.generate_face_positions = generate_face_positions;
    }
    get vertex_attributes() {
        let flags = 1 /* position */;
        if (this.normal !== 0 /* NO_VERTEX__NO_FACE */ &&
            this.normal !== 1 /* NO_VERTEX__GENERATE_FACE */)
            flags |= 2 /* normal */;
        if (this.color !== 0 /* NO_VERTEX__NO_FACE */ &&
            this.color !== 1 /* NO_VERTEX__GENERATE_FACE */)
            flags |= 4 /* color */;
        if (this.include_uvs)
            flags |= 8 /* uv */;
        return flags;
    }
    get face_attributes() {
        let flags = 0;
        if (this.normal !== 0 /* NO_VERTEX__NO_FACE */ &&
            this.normal !== 2 /* LOAD_VERTEX__NO_FACE */)
            flags |= 2 /* normal */;
        if (this.color !== 0 /* NO_VERTEX__NO_FACE */ &&
            this.color !== 2 /* LOAD_VERTEX__NO_FACE */ &&
            this.color !== 5 /* GENERATE_VERTEX__NO_FACE */)
            flags |= 4 /* color */;
        if (this.generate_face_positions)
            flags |= 1 /* position */;
        return flags;
    }
    sanitize(inputs) {
        if (!(inputs.included & 2 /* normal */)) {
            switch (this.normal) {
                case 2 /* LOAD_VERTEX__NO_FACE */:
                    this.normal = 0 /* NO_VERTEX__NO_FACE */;
                    break;
                case 3 /* LOAD_VERTEX__GENERATE_FACE */:
                    this.normal = 1 /* NO_VERTEX__GENERATE_FACE */;
            }
        }
        if (!(inputs.included & 4 /* color */)) {
            switch (this.color) {
                case 2 /* LOAD_VERTEX__NO_FACE */:
                case 3 /* LOAD_VERTEX__GATHER_FACE */:
                    this.color = 0 /* NO_VERTEX__NO_FACE */;
                    break;
                case 4 /* LOAD_VERTEX__GENERATE_FACE */:
                    this.color = 1 /* NO_VERTEX__GENERATE_FACE */;
            }
        }
        if (!(inputs.included & 8 /* uv */))
            this.include_uvs = false;
    }
}
//# sourceMappingURL=options.js.map