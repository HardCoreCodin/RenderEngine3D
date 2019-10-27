import * as C from "../constants.js";
import {Mesh} from "../primitives/mesh.js";
import {MeshInputs, AttributeInputs} from "../primitives/attributes/input.js";

const vertex_uv_test_re = /^vt\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const vertex_normal_test_re = /^vn\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const vertex_color_test_re = /^v\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;

const vertex_position_and_color_re = /v\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const vertex_position_re = /v\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const vertex_normal_re = /vn\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const vertex_uv_re = /vt\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;

const triangle_indices_re = /f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)/;
const quad_indices_re = /f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)/;

const loadMeshFromObjString = (obj: string, flags: number = C.DEFAULT_FLAGS): Mesh => {
    const inputs = new MeshInputs(
        vertex_normal_test_re.test(obj),
        vertex_color_test_re.test(obj),
        vertex_uv_test_re.test(obj)
    );

    for (const line of obj.split('\n'))
        if (vertex_position_and_color_re.test(line))
            setInputVertexPositionAndColor(inputs, vertex_position_and_color_re.exec(line));
        else if (vertex_position_re.test(line))
            setInputVertexPositionAndColor(inputs, vertex_position_re.exec(line));
        else if (vertex_normal_re.test(line))
            setInputVertexAttribute(inputs.normal, vertex_normal_re.exec(line));
        else if (vertex_uv_re.test(line))
            setInputVertexAttribute(inputs.uv, vertex_uv_re.exec(line));
        else if (quad_indices_re.test(line))
            setFaceIndices(inputs, quad_indices_re.exec(line));
        else if (triangle_indices_re.test(line))
            setFaceIndices(inputs, triangle_indices_re.exec(line));

    return new Mesh(inputs, flags);
};


const setInputVertexPositionAndColor = (inputs: MeshInputs, strings: string[]) : void => {
    if (strings.length === 7)
        setInputVertexAttribute(inputs.color, strings.slice(3, 7));
    setInputVertexAttribute(inputs.position, strings.slice(0, 4));
};

const setInputVertexAttribute = (attribute: AttributeInputs, strings: string[]) : void =>
    strings.length === 3 ?
        attribute.pushVertex([strings[1], strings[2]]) :
        attribute.pushVertex([strings[1], strings[2], strings[3]]);

const setFaceIndices = (inputs: MeshInputs, strings: string[]) : void => {
    const is_quad = strings.length === 13;

    inputs.position.pushFace(is_quad ? [
        strings[1], strings[4], strings[7], strings[10]
    ] : [
        strings[1], strings[4], strings[7],
    ]);

    if (strings[2] !== '') {
        inputs.uv.pushFace(is_quad ? [
            strings[2], strings[5], strings[8], strings[11]
        ] : [
            strings[2], strings[5], strings[8],
        ]);
    }

    if (strings[3] !== '') {
        inputs.normal.pushFace(is_quad ? [
            strings[3], strings[6], strings[9], strings[12]
        ] : [
            strings[3], strings[6], strings[9],
        ]);
    }
};