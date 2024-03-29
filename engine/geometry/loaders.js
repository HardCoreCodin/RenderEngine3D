import Mesh from "./mesh.js";
import { MeshOptions } from "./options.js";
import { MeshInputs } from "./inputs.js";
export const loadMeshFromObj = (obj, options = new MeshOptions()) => {
    if (!has_positions.test(obj))
        throw `Invalid obj file sting - no vertex positions found!`;
    let included = 1 /* position */;
    if (has_normals.test(obj)) {
        options.normal = 2 /* LOAD_VERTEX__NO_FACE */;
        included |= 2 /* normal */;
    }
    if (has_colors.test(obj)) {
        included |= 4 /* color */;
    }
    if (has_uvs.test(obj)) {
        included |= 8 /* uv */;
        options.include_uvs = true;
    }
    const inputs = new MeshInputs(included);
    for (const line of obj.split('\n'))
        if (position_and_color.test(line))
            setPositionAndColor(inputs, position_and_color.exec(line));
        else if (position.test(line))
            setPositionAndColor(inputs, position.exec(line));
        else if (normal.test(line))
            setAttribute(inputs.normal, normal.exec(line));
        else if (uv.test(line))
            setAttribute(inputs.uv, uv.exec(line));
        else if (quad.test(line))
            setFace(inputs, quad.exec(line));
        else if (triangle.test(line))
            setFace(inputs, triangle.exec(line));
    return new Mesh(inputs, options).load();
};
const setPositionAndColor = (inputs, line_parts) => {
    line_parts.shift();
    const [x, y, z, r, g, b,] = line_parts;
    inputs.position.addVertex(x, y, z);
    if (r !== undefined)
        inputs.color.addVertex(r, g, b);
};
const setAttribute = (attribute, line_parts) => {
    line_parts.shift();
    const [x, y, z] = line_parts;
    if (z === undefined)
        attribute.addVertex(x, y);
    else
        attribute.addVertex(x, y, z);
};
const setFace = (inputs, line_parts) => {
    line_parts.shift();
    const [p1, uv1, n1, p2, uv2, n2, p3, uv3, n3, p4, uv4, n4] = line_parts;
    if (p4 === undefined) {
        // Triangle:
        inputs.position.addFace(Number(p1) - 1, Number(p3) - 1, Number(p2) - 1);
        if (n1)
            inputs.normal.addFace(Number(n1) - 1, Number(n3) - 1, Number(n2) - 1);
        if (uv1)
            inputs.uv.addFace(Number(uv1) - 1, Number(uv3) - 1, Number(uv2) - 1);
    }
    else {
        // Quad:
        inputs.position.addFace(Number(p1) - 1, Number(p4) - 1, Number(p3) - 1, Number(p2) - 1);
        if (n1)
            inputs.normal.addFace(Number(n1) - 1, Number(n4) - 1, Number(n3) - 1, Number(n2) - 1);
        if (uv1)
            inputs.uv.addFace(Number(uv1) - 1, Number(uv4) - 1, Number(uv3) - 1, Number(uv4) - 1);
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
//# sourceMappingURL=loaders.js.map