import {
    PositionInputs,
    NormalInputs,
    ColorInputs,
    UVInputs
} from "../attributes/input.js";

export class FaceInputs {
    public readonly position: PositionInputs;
    public readonly normal: NormalInputs | null;
    public readonly color: ColorInputs | null;
    public readonly uv: UVInputs | null;
}



