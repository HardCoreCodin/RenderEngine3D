const BASE_FRAGMENT_SHADER_CODE = `#version 300 es
    precision mediump float;

    out vec4 color;
    
    void main() {
        color = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

export default BASE_FRAGMENT_SHADER_CODE;