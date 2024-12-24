precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_postprocess_slider;
uniform float u_time;

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    gl_FragColor = texColor;
}