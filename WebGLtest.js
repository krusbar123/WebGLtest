
const canvas = document.getElementById("glcanvas");

// Initialize the GL context
const gl = canvas.getContext("webgl");

var vertices;

var indices;

var ground;

var texture;

main();

function main() {
    
    // Only continue if WebGL is available and working
    if (!gl) {
    alert(
    "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
    }

    vertices = [
        -1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0,
        1.0, 1.0, 0.0
    ];
    
    indices = [0, 1, 2, 2, 3, 0];
    
    
    var vertex_buffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    
    var index_buffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    
    
    
    
    
        
        
    
    var vertCode = 
        'attribute vec3 coordinates;' +
        'void main(void) {' +
        'gl_Position = vec4(coordinates, 1.0);' +
        '}';
    
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    
    
    
    var fragCode = 
        'precision highp float;' +
        'uniform sampler2D ground;' +
        'void main(void) {' +
        '    vec2 screen = vec2(640.0, 480.0);' +
        '    vec2 current = gl_FragCoord.xy / screen;' +
        '    vec2 over = current + vec2(0.0, 1.0 / screen.y);' +
        '    vec2 under = current - vec2(0.0, 1.0 / screen.y);' +
        '    if (texture2D(ground, current).w == 0.0) {' +
        '        if (over.y > (screen.y / 2.0)) {' +
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);' +
        '        } else {' +
        '            gl_FragColor = texture2D(ground, over);' +
        '        }' +
        '    } else {' +
        '        if (under.y < -(screen.y / 2.0)) {' +
        '            gl_FragColor = texture2D(ground, current);' +
        '        } else {' +
        '            if (texture2D(ground, under).w == 0.0) {' +
        '                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);' +
        '            } else {' +
        '                gl_FragColor = texture2D(ground, current);' +
        '            }' +
        '        }' +
        '    }' +
        '}';
    
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    
    
    var shaderProgram = gl.createProgram();
    
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    
    
    
    
    
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
             
    
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    
    
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 
             
    
    gl.enableVertexAttribArray(coord);

    noise.seed(Math.random());
    
    
    ground = new Uint8Array(canvas.width * canvas.height * 4);
    
    var groundColor = [];

    if (Math.random() < 0.25) {
        //sand
        groundColor = [240, 215, 160];
    } else if (Math.random() < 0.5) {
        //grass
        groundColor = [50, 215, 50];
    } else if (Math.random() < 0.75) {
        //snow
        groundColor = [255, 255, 255];
    } else {
        //stone
        groundColor = [160, 160, 160];
    }

    
    
    for (let i = 0; i < canvas.width * canvas.height; i++) {
        let y = Math.floor(i / canvas.width);
        let x = i - (y * canvas.width);
        
        
        if (y <= (((noise.perlin2((x / canvas.width) * 4.0, 0.1234) + 1.0) * canvas.height / 2.0 ) - 75)) {
            let light = 0.95 + (0.05 * Math.random());
            ground[(4 * i) + 0] = groundColor[0] * light;
            ground[(4 * i) + 1] = groundColor[1] * light;
            ground[(4 * i) + 2] = groundColor[2] * light;
            ground[(4 * i) + 3] = 255;
        } else {
            ground[(4 * i) + 0] = 0;
            ground[(4 * i) + 1] = 0;
            ground[(4 * i) + 2] = 0;
            ground[(4 * i) + 3] = 0;
        }
    }
    
    
    
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, ground);
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
    // Set texture parameters for non-power-of-two (NPOT) textures
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Pass texture to the shader
    var groundLoc = gl.getUniformLocation(shaderProgram, "ground");
    gl.uniform1i(groundLoc, 0);  // 0 corresponds to TEXTURE0
    
    
        
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    gl.enable(gl.DEPTH_TEST);
        
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.viewport(0, 0, canvas.width, canvas.height);

    
    setInterval(gameLoop, 1000.0 / 60.0);
    
}

function gameLoop() {

/*
    for (let i = 0; i < canvas.width * canvas.height; i++) {
        let current = i * 4
        let up = (i + canvas.width) * 4;
        let down = (i - canvas.width) * 4;

        if (down < 0) {
            continue;
        }

        

        //If dust here and not below: move down
        if ((ground[current] || ground[current + 1] || ground[current + 2]) && !(ground[down] || ground[down + 1] || ground[down + 2])) {
            ground[down + 0] = ground[current + 0];
            ground[down + 1] = ground[current + 1];
            ground[down + 2] = ground[current + 2];
            ground[down + 3] = ground[current + 3];

            ground[current + 0] = 0;
            ground[current + 1] = 0;
            ground[current + 2] = 0;
            ground[current + 3] = 0;
            
        } 


    }
            
     //Update ground texture
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, ground);

    

    */
    
    //Draw

         //Update ground texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, ground);

    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, ground);


        


}





