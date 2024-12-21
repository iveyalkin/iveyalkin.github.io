precision mediump float;

uniform vec2 u_resolution;
varying vec2 v_texCoord;
uniform sampler2D u_texture;



void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    gl_FragColor = texColor;
}