precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_postprocess_slider;
uniform float u_time;

// Pseudo-random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractal Brownian Motion
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 5; i++) {
        value += amplitude * noise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    
    // Calculate distance from center
    vec2 center = vec2(0.5);
    float dist = distance(v_texCoord, center);
    
    // Create frost pattern
    vec2 st = v_texCoord * 10.0;
    float frost = fbm(st + u_time * 0.2);
    frost = pow(frost, 1.5); // Sharpen the pattern
    
    // Animate from edges to center
    float timeWave = (1.0 - sin(u_time * 0.5)) * 0.5;
    float frostMask = smoothstep(timeWave - 0.3, timeWave + 0.3, dist);
    
    // Create crystalline highlights
    float crystal = pow(frost, 3.0) * 0.7;
    vec4 frostColor = vec4(0.8 + crystal, 0.9 + crystal, 1.0, 1.0);
    
    // Blend between original and frost
    gl_FragColor = mix(texColor, frostColor, frostMask * 0.8);
}