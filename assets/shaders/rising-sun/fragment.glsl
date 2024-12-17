precision mediump float;

uniform vec2 u_resolution;

// background checkerboard pattern to highlight the shape
vec3 checkerboard(vec2 uv, float size) {
    uv.x *= u_resolution.x / u_resolution.y; // ratio
    vec2 checkPos = floor(uv * size);
    float pattern = mod(checkPos.x + checkPos.y, 2.0);
    float colorA = 0.01;
    float colorB = 0.1;
    return vec3(pattern * colorA + colorB);
}

// cosine gradient generator
// realtime representation of the palette http://dev.thi.ng/gradients/
vec3 palette(in float t, in vec3 brightness, in vec3 contrast, in vec3 frequency, in vec3 phase) {
    return brightness + contrast * cos(6.28318 * (frequency * t + phase));
}

// c is the sin/cos of the angle. r is the radius
float sdPie(in vec2 p, in vec2 c, in float r) {
    p.x = abs(p.x);
    float l = length(p) - r;
    float m = length(p - c * clamp(dot(p, c), 0.0, r));
    return max(l, m * sign(c.y * p.x - c.x * p.y));
}

void main() {
    // normalized pixel coordinates
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;

    // scale down
    p *= 1.54;

    //[0.731 1.098 0.192] [0.358 1.090 0.657] [0.345 0.115 0.105] [0.965 2.265 0.837]
    vec3 brightness = vec3(0.731, 1.098, 0.192);
    vec3 contrast = vec3(0.358, 1.090, 0.657);
    vec3 frequency = vec3(0.345, 0.115, 0.105); // how quickly color changes
    vec3 phase = vec3(0.965, 2.265, 0.837); // color picks location

    vec3 gradientColor = palette(length(p), brightness, contrast, frequency, phase);

    float t = 3.14 / 16.;
    float dd = 1.0;
    for(int j = 0; j < 12; j++) {
        float angle = float(j) * (2.0 * 3.14 / 12.0);
        float cs = cos(angle);
        float sn = sin(angle);
        vec2 pp = vec2(p.x * cs - p.y * sn, p.x * sn + p.y * cs);

        // inner radius
        pp.y += .1;

        // distance
        float d = sdPie(pp, vec2(sin(t), cos(t)), 1.5);

        dd = min(dd, d);
    }

    // coloring
    vec3 col = mix(gradientColor, vec3(0.0), step(0.0, dd));

    // Create checkerboard background pattern
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 background = checkerboard(uv, 20.0);

    float alpha = clamp(1.0 - length(p), 0.0, 1.0);
    vec3 finalColor = mix(background, col, alpha);

    gl_FragColor = vec4(finalColor, 1.0);
}