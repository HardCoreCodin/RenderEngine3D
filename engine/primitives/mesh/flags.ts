import {ATTRIBUTE, BYTE_MASK, FLAGS} from "../../constants.js";

const DEBUG_MODE: boolean = true;

export class Flags {
    private _buffer: Uint8Array = new Uint8Array(6);

    constructor(public readonly input_includes: ATTRIBUTE = ATTRIBUTE.position) {
        if (input_includes & ATTRIBUTE.position)
            this._buffer[FLAGS.VERTEX_LOAD] |= ATTRIBUTE.position;
        else
            throw `Invalid input - missing vertex positions!`;
    }

    private _setValue(value: number, flag: FLAGS) : void {
        value &= BYTE_MASK.FIRST_HALF;

        if (DEBUG_MODE) {
            switch (flag) {
                case FLAGS.VERTEX_LOAD: value = sanitiseLoad_D(value); break;
                case FLAGS.VERTEX_SHARE: value = sanitiseShare_D(value); break;
                case FLAGS.VERTEX_PULL: value = sanitisePullV_D(value); break;
                case FLAGS.VERTEX_GEN: value = sanitiseGenV_D(value); break;
                case FLAGS.FACE_PULL: value = sanitisePullF_D(value); break;
                case FLAGS.FACE_GEN: value = sanitiseGenF_D(value); break;
            }
        } else {
            switch (flag) {
                case FLAGS.VERTEX_LOAD: value = sanitiseLoad(value); break;
                case FLAGS.VERTEX_SHARE: value = sanitiseShare(value); break;
                case FLAGS.VERTEX_PULL: value = sanitisePullV(value); break;
                case FLAGS.VERTEX_GEN: value = sanitiseGenV(value); break;
                case FLAGS.FACE_PULL: value = sanitisePullF(value); break;
                case FLAGS.FACE_GEN: value = sanitiseGenF(value); break;
            }
        }

        this._buffer[flag] = value;
    }

    get load() : number {return this._buffer[FLAGS.VERTEX_LOAD]}
    set load(value: number) {this._setValue(value, FLAGS.VERTEX_LOAD)}

    get share() : number {return this._buffer[FLAGS.VERTEX_SHARE]}
    set share(value: number) {this._setValue(value, FLAGS.VERTEX_SHARE)}

    get vertex_pull() : number {return this._buffer[FLAGS.VERTEX_PULL]}
    set vertex_pull(value: number) {this._setValue(value, FLAGS.VERTEX_PULL)}

    get face_pull() : number {return this._buffer[FLAGS.FACE_PULL]}
    set face_pull(value: number) {this._setValue(value, FLAGS.FACE_PULL)}

    get vertex_gen() : number {return this._buffer[FLAGS.VERTEX_GEN]}
    set vertex_gen(value: number) {this._setValue(value, FLAGS.VERTEX_GEN)}

    get face_gen() : number {return this._buffer[FLAGS.FACE_GEN]}
    set face_gen(value: number) {this._setValue(value, FLAGS.FACE_GEN)}

    get vertex_includes() : number {
        return ((
            this._buffer[FLAGS.VERTEX_LOAD] & this.input_includes) |
            this._buffer[FLAGS.VERTEX_PULL] |
            this._buffer[FLAGS.VERTEX_GEN]
        );
    }
    get face_includes() : number {
        return (
            this._buffer[FLAGS.FACE_PULL] |
            this._buffer[FLAGS.FACE_GEN]
        );
    }
}

const sanitiseLoad = (value: number, input: number) : number => {
    if (value - input) value &= ~(value - input);
    return value | ATTRIBUTE.position;
};
const sanitiseLoad_D = (value: number, input: number) : number => {
    if (!(value) || value === ATTRIBUTE.position)
        return ATTRIBUTE.position;

    if (!(value & ATTRIBUTE.position)) {
        console.debug('Can not disable loading of vertex positions!');
        value |= ATTRIBUTE.position;
    }

    if (value - input) {
        console.debug('Can not load unavailable attributes!');
        value -= input;
    }
};

const sanitiseShare = (value: ATTRIBUTE) : number => {

};
const sanitiseShare_D = (value: ATTRIBUTE) : number => {
    const unavailable = this.vertex_includes;
    if (value - available) {
        console.debug('Can not share unavailable vertex attributes!');
        value -= (value - available)
    }
};

const sanitisePullV = (value: ATTRIBUTE) : number => {

};
const sanitisePullV_D = (value: ATTRIBUTE) : number => {
    if (value & ATTRIBUTE.uv) {
        console.debug('Can not gather UVs!');
        value -= ATTRIBUTE.uv;
    }

    const inverse = this.face_pull;
    if (value & inverse) {
        console.debug('Vertices and faces can not gather from each other!');
        value -= inverse;
    }

    const unavailable = value - this.face_gen;
    if (unavailable) {
        console.debug('Can not gather vertex attributes from non-generated face attributes!');
        value -= unavailable
    }
};

const sanitisePullF = (value: ATTRIBUTE) : number => {

};
const sanitisePullF_D = (value: ATTRIBUTE) : number => {
    const illegal = ATTRIBUTE.uv | ATTRIBUTE.normal;
    if (value & illegal) {
        console.debug('Can not gather face UVs and/or normals!');
        value -= illegal;
    }

    const inverse = this._buffer[FLAGS.VERTEX_PULL];
    if (value & inverse) {
        console.debug('Vertices and faces can not gather from each other!');
        value -= inverse;
    }

    const unavailable = value - (this.vertex_gen | (this._buffer[FLAGS.VERTEX_LOAD] & this.input_includes));
    if (unavailable) {
        console.debug('Can not gather vertex attributes from non-generated face attributes!');
        value -= unavailable
    }
};

const sanitiseGenV = (value: ATTRIBUTE) : number => {

};
const sanitiseGenV_D = (value: ATTRIBUTE) : number => {
    const illegal = ATTRIBUTE.uv | ATTRIBUTE.normal;
    if (value & illegal) {
        console.debug('Can not generate vertex UVs and/or positions!');
        value -= illegal;
    }
};

const sanitiseGenF = (value: ATTRIBUTE) : number => {

};
const sanitiseGenF_D = (value: ATTRIBUTE) : number => {
    const illegal = ATTRIBUTE.uv | ATTRIBUTE.normal;
    if (value & illegal) {
        console.debug('Can not generate vertex UVs and/or positions!');
        value -= illegal;
    }
};