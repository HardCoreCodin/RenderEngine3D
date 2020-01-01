const canvas: HTMLCanvasElement = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');
if (!gl)
    alert('Your browser does not support WebGL');

export default gl;