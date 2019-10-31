import { Mesh, MeshInputs, MeshOptions } from "../primitives/mesh.js";
const loadMeshFromObj = (obj, options = new MeshOptions()) => {
    if (!has_positions.test(obj))
        throw `Invalid obj file sting - no vertex positions found!`;
    const face_type = has_quads.test(obj) ?
        4 /* QUAD */ :
        3 /* TRIANGLE */;
    let attributes = 1 /* position */;
    if (has_normals.test(obj))
        attributes |= 2 /* normal */;
    if (has_colors.test(obj))
        attributes |= 4 /* color */;
    if (has_uvs.test(obj))
        attributes |= 8 /* uv */;
    const inputs = new MeshInputs(attributes, face_type);
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
    return new Mesh(inputs, options);
};
const setPositionAndColor = (inputs, line_parts) => {
    line_parts.shift();
    const [x, y, z, r, g, b,] = line_parts;
    inputs.position.pushVertex([x, y, z]);
    if (r !== undefined)
        inputs.color.pushVertex([r, g, b]);
};
const setAttribute = (attribute, line_parts) => {
    line_parts.shift();
    const [x, y, z] = line_parts;
    attribute.pushVertex(z !== undefined ? [x, y, z] : [x, y]);
};
const setFace = (inputs, line_parts) => {
    line_parts.shift();
    const [p1, uv1, n1, p2, uv2, n2, p3, uv3, n3, p4, uv4, n4] = line_parts;
    const is_quad = p4 !== undefined;
    inputs.position.pushFace(is_quad ? [p1, p2, p3, p4] : [p1, p2, p3]);
    if (n1 !== '')
        inputs.normal.pushFace(is_quad ? [n1, n2, n3, n4] : [n1, n2, n3]);
    if (uv1 !== '')
        inputs.uv.pushFace(is_quad ? [uv1, uv2, uv3, uv4] : [uv1, uv2, uv3]);
};
const has_uvs = /^vt\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const has_normals = /^vn\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const has_colors = /^v\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const has_positions = /^v\s+-*\d+\.\d+\s+-*\d+\.\d+\s+-*\d+\.\d+/m;
const has_quads = /^f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)$/m;
const position_and_color = /v\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const position = /v\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const normal = /vn\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const uv = /vt\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)/;
const triangle = /f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)/;
const quad = /f\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)\s+(\d+)\/(\d*)\/(\d*)/;
//# sourceMappingURL=obj.js.map