
const canvas = document.getElementById("glcanvas");

// Initialize the GL context
const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

var vertices;

var indices;

var ground;

var texture = [];

const targetFPS = 60.0; // Desired FPS
const frameInterval = 1000.0 / targetFPS; // Milliseconds per frame
let lastFrameTime = 0; // Timestamp of the last rendered frame
let FPS;

const tankSize = 16;
    

var vertCode;
var fragCode;

var vertex_buffer = [];
var index_buffer = [];

var vertShader = [];
var fragShader = [];
var shaderProgram = [];

var tankX = [0];
var tankY = [0];

var groundLoc;

var textureLoc;

var texOffLoc;

var texScaleLoc;

var coord;

var coord2;

const images = ["Assets/Body_Black.png"];

let loadedImages = [];

var imagesLoaded = 0;

const startScreen = document.getElementById('StartScreen');

canvas.addEventListener("click", start);

function start() {

canvas.removeEventListener("click", start);

startScreen.style.display = 'none';
  
const audioElement = new Audio("Assets/Music.mp3");

audioElement.addEventListener("canplaythrough", (event) => {
  /* the audio is now playable; play it if permissions allow */
  audioElement.play();
});

// Function to load a single image
function loadImage(src, index) {
    const img = new Image();   // Create a new Image object
    img.src = src;             // Set the image source

    img.onload = function () { // When the image loads
        loadedImages[index] = img;  // Store the loaded image at the correct index
        imagesLoaded++;
            
        if (imagesLoaded === images.length) {
            console.log("Images Loaded!");
        main();
    }
        
    };


    img.onerror = function () {     // Handle load error
        console.error("Failed to load image:", src);
    };
}

// Load all images
for (let i = 0; i < images.length; i++) {
    loadImage(images[i], i);
}




    
}

function createProgram(id, vertSource, fragSource) {

  vertShader[id] = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader[id], vertSource);
  gl.compileShader(vertShader[id]);
  

  fragShader[id] = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader[id], fragSource);
  gl.compileShader(fragShader[id]);
  

  shaderProgram[id] = gl.createProgram();
  gl.attachShader(shaderProgram[id], vertShader[id]);
  gl.attachShader(shaderProgram[id], fragShader[id]);
  gl.linkProgram(shaderProgram[id]);

  console.log("Program created!");
  return;
}



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

    
    vertex_buffer[0] = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer[0]);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    
    index_buffer[0] = gl.createBuffer();
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer[0]);
    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);





    vertex_buffer[1] = gl.createBuffer();

    index_buffer[1] = gl.createBuffer();


        
        
    
    vertCode = 
        'attribute vec3 coordinates;' +
        'void main(void) {' +
        'gl_Position = vec4(coordinates, 1.0);' +
        '}';


    fragCode = 
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
  


  
    createProgram(0, vertCode, fragCode);






    vertCode = 
        'attribute vec3 coords;' +
        'void main(void) {' +
        'gl_Position = vec4(coords / vec3(640.0, 480.0, 1.0), 1.0);' +
        '}';


    fragCode = 
        'precision highp float;' +
        'uniform sampler2D texture;' +
        'uniform vec2 textureOffset;' +
        'uniform vec2 textureScale;' +
        'void main(void) {' +
        'vec2 texCoord = (gl_FragCoord.xy - textureOffset) * textureScale;' +
        'gl_FragColor = texture2D(texture, texCoord);' +            //texture2D(texture, gl_FragCoord.xy)
        '}';

    createProgram(1, vertCode, fragCode);



    
    
     

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer[0]);        
    coord = gl.getAttribLocation(shaderProgram[0], "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);          
    gl.enableVertexAttribArray(coord);



    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer[1]);        
    coord2 = gl.getAttribLocation(shaderProgram[1], "coords");
    gl.vertexAttribPointer(coord2, 3, gl.FLOAT, false, 0, 0);          
    gl.enableVertexAttribArray(coord2);

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
    
    
    
    texture[0] = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture[0]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, ground);
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
    // Set texture parameters for non-power-of-two (NPOT) textures
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


    
    texture[1] = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture[1]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loadedImages[0]);
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
    // Set texture parameters for non-power-of-two (NPOT) textures
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    

        
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.viewport(0, 0, canvas.width, canvas.height);

    
    requestAnimationFrame(gameLoop);
    
}

function gameLoop(currentTime) {
    // currentTime is provided by requestAnimationFrame and is in milliseconds
    const elapsedTime = currentTime - lastFrameTime;

    if (elapsedTime >= frameInterval) {
        lastFrameTime = currentTime;
        FPS = 1000.0 / elapsedTime;

        //console.log(FPS);

        gl.clear(gl.COLOR_BUFFER_BIT);





        
    
             //Update ground texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture[0]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, ground);
    

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer[0]);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer[0]);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);          
        gl.enableVertexAttribArray(coord);
        gl.useProgram(shaderProgram[0]);


         // Pass texture to the shader
        groundLoc = gl.getUniformLocation(shaderProgram[0], "ground");
        gl.uniform1i(groundLoc, 0);  // 0 corresponds to TEXTURE0
      
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, ground);




                let verts = [
            tankX[0] - tankSize/2.0, tankY[0] + tankSize/2.0, 0.0,
            tankX[0] - tankSize/2.0, tankY[0] - tankSize/2.0, 0.0,
            tankX[0] + tankSize/2.0, tankY[0] - tankSize/2.0, 0.0,
            tankX[0] + tankSize/2.0, tankY[0] + tankSize/2.0, 0.0];

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer[1]);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer[1]);

        
        gl.vertexAttribPointer(coord2, 3, gl.FLOAT, false, 0, 0);          
        gl.enableVertexAttribArray(coord2);
        
        
    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 3, 0]), gl.STATIC_DRAW);
        

        gl.useProgram(shaderProgram[1]);

        

        textureLoc = gl.getUniformLocation(shaderProgram[1], "texture");
        gl.uniform1i(textureLoc, 1);  // 1 corresponds to TEXTURE1

        texOffLoc = gl.getUniformLocation(shaderProgram[1], "textureOffset");
        gl.uniform2f(texOffLoc, new Float32Array([tankX[0] - tankSize/2, tankY[0] - tankSize/2]));

        texScaleLoc = gl.getUniformLocation(shaderProgram[1], "textureScale");
        gl.uniform2f(texScaleLoc, new Float32Array([loadedImages[0].naturalWidth / tankSize, loadedImages[0].naturalWidth / tankSize]));

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        

        
    

        

    }
    requestAnimationFrame(gameLoop);
}





