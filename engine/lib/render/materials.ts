import Geometry from "./geometry.js";
import Mesh from "../geometry/mesh.js";
import Scene from "../scene_graph/scene.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {IMaterial} from "../_interfaces/render.js";

export abstract class BaseMaterial implements IMaterial {
    static LAST_ID = 0;

    abstract prepareMeshForDrawing(mesh: Mesh): void;
    abstract drawMesh(mesh: Mesh, matrix: Matrix4x4);

    protected readonly _mesh_geometries = new Map<Mesh, Set<Geometry>>();

    protected constructor(
        readonly scene: Scene,
        readonly id: number = BaseMaterial.LAST_ID++
    ) {}

    get meshes(): Generator<Mesh> {return this._iterMeshes()}
    get mesh_count(): number {return this._mesh_geometries.size}

    hasMesh(mesh: Mesh): boolean {return this._mesh_geometries.has(mesh)}
    hasGeometry(geometry: Geometry): boolean {
        const geometries = this._mesh_geometries.get(geometry.mesh);
        return geometries ? geometries.has(geometry) : false;
    }

    getGeometries(mesh: Mesh): Generator<Geometry> {return this._iterGeometries(mesh)}
    getGeometryCount(mesh: Mesh): number {
        const geometries = this._mesh_geometries.get(mesh);
        return geometries ? geometries.size : 0;
    }

    addGeometry(geometry: Geometry) {
        let geometries = this._mesh_geometries.get(geometry.mesh);
        if (geometries) {
            if (!geometries.has(geometry))
                geometries.add(geometry);
        } else {
            geometries = new Set<Geometry>();
            geometries.add(geometry);
            this._mesh_geometries.set(geometry.mesh, geometries);
        }
    }

    removeGeometry(geometry: Geometry) {
        const geometries = this._mesh_geometries.get(geometry.mesh);
        if (geometries && geometries.has(geometry)) {
            if (geometries.size === 1) {
                if (this._mesh_geometries.size === 1)
                    this.scene.removeMaterial(this);
                this._mesh_geometries.delete(geometry.mesh);
            } else
                geometries.delete(geometry);
        }
    }

    protected *_iterGeometries(mesh: Mesh): Generator<Geometry> {
        if (this._mesh_geometries.has(mesh))
            for (const geometry of this._mesh_geometries.get(mesh))
                yield geometry
    }

    protected *_iterMeshes(): Generator<Mesh> {
        for (const mesh of this._mesh_geometries.keys())
            yield mesh;
    }
}



export class PixelShader {

}

export class StandardMaterial {

}


const SHADER_BODY_TOKEN = 'ShaderBody';
const SHADER_FUNCTION_BODY_TEMPLATE = `
    for (const pixel of pixels) {
        ${SHADER_BODY_TOKEN}
    }
`;

const SHADER_MAIN_BODY_REGEX = /BeginShader(.+)EndShader/;


const createShaderFunction = (script_element: HTMLScriptElement): Function => new Function(
    'inputs',  'outputs',
    SHADER_FUNCTION_BODY_TEMPLATE.replace(
        SHADER_BODY_TOKEN,
        SHADER_MAIN_BODY_REGEX.exec(script_element.innerText)[1]
    )
);


// // Example:
// // <script type="pixel-shader">
//
// const main = (
//     inputs: ShaderInputs,
//     outputs: ShaderOutputs,
//     x: number,
//     y: number
// ) => {
// // BeginShader
// outputs.set(inputs);
// // EndShader
// };
// // </script>
//
// // function (inputs, outputs) {
// //     for (let pixel_offset = 0; pixel_offset < frame_buffer.length; pixel_offset++) {
// //         if ()
// //         outputs.set(inputs);
// //     }
// // }