main();



function main() {
    const canvas = document.getElementById("glcanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
    alert(
    "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
  }

var vertices = [
    -1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0, 1.0, 0.0
];

var indices = [0, 1, 2, 2, 3, 0];


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
    'uniform sampler2D ground;' +
    'void main(void) {' +
    'gl_FragColor = vec4(0.7, 0.5, 1.0, 1.0);' +
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



var ground = new Uint8Array(canvas.width * canvas.height);

for (let i = 0; i < canvas.width * canvas.height; i++) {
    if (i < canvas.height * canvas.width / 5.0) {
        ground[i] = 1;
    }
}






    


    
// Set clear color to black, fully opaque
gl.clearColor(0.0, 0.0, 0.0, 1.0);

gl.enable(gl.DEPTH_TEST);
    
// Clear the color buffer with specified clear color
gl.clear(gl.COLOR_BUFFER_BIT);

gl.viewport(0, 0, canvas.width, canvas.height);

gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);




    
}





