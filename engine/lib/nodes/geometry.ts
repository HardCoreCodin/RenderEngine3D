import Node3D from "./_base.js";
import Mesh from "../mesh/_base.js";
import Material from "../materials/_base.js";
import {Scene} from "./scene.js";

export default class Geometry
    extends Node3D
{
    constructor(
        public readonly scene: Scene,
        public readonly mesh: Mesh,
        public material: Material = Material.DEFAULT
    ) {
        super(scene);
    }
}