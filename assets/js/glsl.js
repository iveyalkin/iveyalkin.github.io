// Create and load the texture
async function loadBitmap(url) {
    return new Promise((resolve, reject) => {
        const bitmap = new Image();
        bitmap.onerror = () => reject(new Error('Failed to load texture'));
        bitmap.onload = () => resolve(bitmap);
        bitmap.src = url;
    });
}

function BindTexture(gl, srcBitmap, textureUniformLocation) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0, // level
        gl.RGBA, // internalFormat
        gl.RGBA, // srcFormat
        gl.UNSIGNED_BYTE, // srcType
        srcBitmap
    );

    if (isPowerOf2(srcBitmap.width) && isPowerOf2(srcBitmap.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    gl.uniform1i(textureUniformLocation, 0); // Use texture unit 0

    function isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }
}

async function loadShader(url) {
    const response = await fetch(url);
    return response.text();
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);

    return null;
}

// expected vsRelativePath and fsRelativePath to be defined in the HTML
document.addEventListener("DOMContentLoaded", async function() {
    const canvas = document.getElementById("webgl-canvas");
    const gl = canvas.getContext("webgl", {
        antialias: true,  // Enable MSAA
        alpha: true,
        preserveDrawingBuffer: true
    });

    if (!gl) {
        console.error("WebGL not supported");
        return;
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const vertexShaderSource = await loadShader(vsRelativePath);
    const fragmentShaderSource = await loadShader(fsRelativePath);
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array( // position buffer: vertex coord + texture coord
            [
            //  Verts     UVs
                -1, -1,   0, 0,
                 1, -1,   1, 0,
                -1,  1,   0, 1,
                -1,  1,   0, 1,
                 1, -1,   1, 0,
                 1,  1,   1, 1,
            ]
        ),
        gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2, // every coordinate composed of 2 values
        gl.FLOAT, // the data in the buffer is 32-bit float
        false, // don't normalize
        16, // how many bytes to get from one set to the next
        0 // how many bytes inside the buffer to start from
    );
    gl.enableVertexAttribArray(positionAttributeLocation);

    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    if (backgroundTextureRelativePath) {
        // Set up texture coordinates attribute
        const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
        gl.vertexAttribPointer(
            texCoordAttributeLocation,
            2,  // every coordinate composed of 2 values
            gl.FLOAT, // the data in the buffer is 32-bit float
            false, // don't normalize
            16, // how many bytes to get from one set to the next
            8 // how many bytes inside the buffer to start from
        );
        gl.enableVertexAttribArray(texCoordAttributeLocation);
    
        const srcBitmap = await loadBitmap(backgroundTextureRelativePath);
        const textureUniformLocation = gl.getUniformLocation(program, "u_texture");
        BindTexture(gl, srcBitmap,textureUniformLocation);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
});