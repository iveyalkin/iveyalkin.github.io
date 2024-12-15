precision mediump float;
uniform vec2 u_resolution;

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
    // vec2 st = gl_FragCoord.xy / u_resolution;
    // gl_FragColor = vec4(st.x, st.y, 0.5 + 0.5 * sin(st.x * 10.0), 1.0);

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
    vec3 col = (dd > 0.0) ? vec3(0.0, 0.0, 0.0) : gradientColor;

    gl_FragColor = vec4(col, 1.0);
}