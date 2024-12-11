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
