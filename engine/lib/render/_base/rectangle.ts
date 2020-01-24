import {IRectangle, ISize} from "../../_interfaces/render.js";
import {I2D} from "../../_interfaces/vectors.js";

export default class Rectangle implements IRectangle{
    protected readonly _size: ISize = {width: 1, height: 1};
    protected readonly _position: I2D = {x: 0, y: 0};
    constructor(
        size?: ISize,
        position?: I2D
    ) {
        if (size && position)
            this.reset(size.width, size.height, position.x, position.y);
    }

    get x(): number {return this._position.x}
    get y(): number {return this._position.y}

    set x(x: number) {this.reset(this._size.width, this._size.height, x, this._position.y)}
    set y(y: number) {this.reset(this._size.width, this._size.height, this._position.x, y)}

    get width(): number {return this._size.width}
    get height(): number {return this._size.height}

    set width(width: number) {this.reset(width, this._size.height, this._position.x, this._position.y)}
    set height(height: number) {this.reset(this._size.width, height, this._position.x, this._position.y)}

    setPosition(x: number, y: number): void {this.reset(this._size.width, this._size.height, x, y)}
    resize(width: number, height: number): void {this.reset(width, height, this._position.x, this._position.y)}

    reset(
        width: number = this._size.width,
        height: number = this._size.height,
        x: number = this._position.x,
        y: number = this._position.y
    ): void {
        this._size.width = width;
        this._size.height = height;
        this._position.x = x;
        this._position.y = y;
    }
}