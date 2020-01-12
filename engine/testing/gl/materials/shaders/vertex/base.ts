const BASE_VERTEX_SHADER_CODE = `#version 300 es
    in vec3 position;
    in vec2 uv;
    out vec2 f_uv;
    uniform mat4 model_to_clip;
    
    void main() {
        f_uv = uv;
        gl_Position = model_to_clip * vec4(position, 1.0);
    }
`;

export default BASE_VERTEX_SHADER_CODE;