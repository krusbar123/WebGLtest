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
    1.0, -1.0, 0.0
];

indices = [0, 1, 2];


var vertex_buffer = gl.createBuffer();

gl.bindbuffer(gl.ARRAY_BUFFER, vertex_buffer);

gl.bufferdata(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, null);

var Index_Buffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),


    


    

var vertCode = 
    'attribute vec3 coordinates;' +

    'void main(void) {' +
    'gl_Position = vec4(coordinates, 1.0);' +
    '}';

var fragCode = 
    'void main(void) {' +
    'gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);' +
    '}';
    
    

    
// Set clear color to black, fully opaque
gl.clearColor(0.0, 0.0, 1.0, 1.0);
// Clear the color buffer with specified clear color
gl.clear(gl.COLOR_BUFFER_BIT);
}
