// import spaceship from './spaceship.js';
// import teapot from './teapot.js';
//
// import Engine3D from "./engine/engine.js";
// import {loadMeshFromObj} from "./engine/lib/geometry/loaders.js";
//
// // import Mesh from "./engine/lib/geometry/mesh.js";
//
// const teapot_mesh = loadMeshFromObj(teapot);
// // teapot_mesh.transform.rotationAngleForY = 180;
// teapot_mesh.transform.translation.z = 5;
// teapot_mesh.transform.translation.x = 5;
// const spaceship_mesh = loadMeshFromObj(spaceship);
// // spaceship_mesh.transform.rotationAngleForY = 180;
// spaceship_mesh.transform.translation.z = 5;
// spaceship_mesh.transform.translation.x = -5;
//
//
// // import mountains from './mountains.js';
// //
// // const mountains_mesh = Mesh.from(mountains);
// // mountains_mesh.transform.matrix.i.x = 0.1;
// // mountains_mesh.transform.matrix.i.x = 0.1;
// // mountains_mesh.transform.matrix.i.x = 0.1;
// // mountains_mesh.transform.matrix.k.x = 50;
// // mountains_mesh.transform.matrix.k.y = -30;
//
// const canvas: HTMLCanvasElement = document.getElementsByTagName('canvas')[0];
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
//
// const engine = new Engine3D(canvas, [teapot_mesh, spaceship_mesh]);
// engine.start();