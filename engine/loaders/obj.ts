import {ATTRIBUTE, VERTICES_PER_FACE} from "../constants.js";
import {Mesh, MeshInputs, MeshOptions} from "../primitives/mesh.js";
import {AttributeInputs} from "../primitives/inputs.js";

const loadMeshFromObj = (obj: string, options: MeshOptions = new MeshOptions()): Mesh => {
    if (!vertex_position_test_re.test(obj))
        throw `Invalid obj file sting - no vertex positions found!`;

    const vertices_per_face = quad_test_re.test(obj) ?
        VERTICES_PER_FACE.QUAD :
        VERTICES_PER_FACE.TRIANGLE;

    let attributes: ATTRIBUTE = ATTRIBUTE.position;
    if (vertex_normal_test_re.test(obj)) attributes |= ATTRIBUTE.normal;
    if (vertex_color_test_re.test(obj)) attributes |= ATTRIBUTE.color;
    if (vertex_uv_test_re.test(obj)) attributes |= ATTRIBUTE.uv;

    const inputs = new MeshInputs(attributes, vertices_per_face);

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

    return new Mesh(inputs, options);
};

const setInputVertexPositionAndColor = (inputs: MeshInputs, line_parts: string[]) : void => {
    if (line_parts.length === 7)
        setInputVertexAttribute(inputs.color, line_parts.slice(3, 7));
    setInputVertexAttribute(inputs.position, line_parts.slice(0, 4));
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

const vertex_uv_test_re = /^vt\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const vertex_normal_test_re = /^vn\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const vertex_color_test_re = /^v\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const vertex_position_test_re = /^v\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const quad_test_re = /^f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)$/m;

const vertex_position_and_color_re = /v\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const vertex_position_re = /v\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const vertex_normal_re = /vn\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const vertex_uv_re = /vt\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;

const triangle_indices_re = /f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)/;
const quad_indices_re = /f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)/;