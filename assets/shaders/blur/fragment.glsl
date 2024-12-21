precision mediump float;

uniform vec2 u_resolution;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

const mat3 u_kernel = mat3(// 3x3 kernel weights
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0
);

vec4 sampleNeighbor(vec2 offset) {
    return texture2D(u_texture, v_texCoord + offset);
}

void main() {
    // Calculate pixel size in texture coordinate space
    vec2 pixelSize = 1.0 / u_resolution;

    vec4 color = vec4(0.0);
    float weightSum = 0.0;

    for(int y = 0; y < 3; y++) {
        for(int x = 0; x < 3; x++) {
            float weight = u_kernel[y][x];
            vec2 offset = vec2(float(x - 1) * pixelSize.x, float(y - 1) * pixelSize.y);
            color += sampleNeighbor(offset) * weight;
            weightSum += weight;
        }
    }

    gl_FragColor = color / weightSum;
}