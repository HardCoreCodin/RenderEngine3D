import Mesh from "./mesh.js";
import {MeshOptions} from "./options.js";
import {InputAttribute, MeshInputs} from "./inputs.js";
import {ATTRIBUTE} from "../../constants.js";


export const loadMeshFromObj = (obj: string, options: MeshOptions = new MeshOptions()): Mesh => {
    if (!has_positions.test(obj))
        throw `Invalid obj file sting - no vertex positions found!`;

    let included = ATTRIBUTE.position;
    if (has_normals.test(obj)) included |= ATTRIBUTE.normal;
    if (has_colors.test(obj)) included |= ATTRIBUTE.color;
    if (has_uvs.test(obj)) included |= ATTRIBUTE.uv;

    const inputs = new MeshInputs(included);

    for (const line of obj.split('\n'))
        if (position_and_color.test(line)) setPositionAndColor(inputs, position_and_color.exec(line));
        else if (position.test(line)) setPositionAndColor(inputs, position.exec(line));
        else if (normal.test(line)) setAttribute(inputs.normal, normal.exec(line));
        else if (uv.test(line)) setAttribute(inputs.uv, uv.exec(line));
        else if (quad.test(line)) setFace(inputs, quad.exec(line));
        else if (triangle.test(line)) setFace(inputs, triangle.exec(line));

    return new Mesh(inputs, options);
};


const setPositionAndColor = (inputs: MeshInputs, line_parts: string[]) : void => {
    line_parts.shift();
    const [
        x, y, z,
        r, g, b,
    ] = line_parts;

    inputs.position.addVertex(x, y, z);
    if (r !== undefined)
        inputs.color.addVertex(r, g, b);
};

const setAttribute = <Attribute extends ATTRIBUTE>(attribute: InputAttribute<Attribute>, line_parts: string[]) : void => {
    line_parts.shift();
    const [x, y, z] = line_parts;

    if (z === undefined)
        attribute.addVertex(x, y);
    else
        attribute.addVertex(x, y, z);
};

const setFace = (inputs: MeshInputs, line_parts: string[]) : void => {
    line_parts.shift();
    const [
        p1, uv1, n1,
        p2, uv2, n2,
        p3, uv3, n3,
        p4, uv4, n4
    ] = line_parts;

    if (p4 === undefined) {
        // Triangle:
        inputs.position.addFace(p1, p2, p3);
        if (n1) inputs.normal.addFace(n1, n2, n3);
        if (uv1) inputs.uv.addFace(uv1, uv2, uv3);
    } else {
        // Quad:
        inputs.position.addFace(p1, p2, p3, p4);
        if (n1) inputs.normal.addFace(n1, n2, n3, n4);
        if (uv1) inputs.uv.addFace(uv1, uv2, uv3, uv4);
    }
};

const has_uvs = /^vt\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const has_normals = /^vn\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const has_colors = /^v\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const has_positions = /^v\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;

const position_and_color = /v\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const position = /v\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const normal = /vn\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const uv = /vt\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;

const triangle = /f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)/;
const quad = /f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)/;