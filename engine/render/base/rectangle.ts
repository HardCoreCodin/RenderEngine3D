import {IRectangle, ISize} from "../../core/interfaces/render.js";
import {I2D} from "../../core/interfaces/vectors.js";

export default class Rectangle implements IRectangle{
    readonly size: ISize = {width: 1, height: 1};
    readonly position: I2D = {x: 0, y: 0};
    constructor(
        size?: ISize,
        position?: I2D
    ) {
        if (size && position)
            this.setTo(size.width, size.height, position.x, position.y);
    }

    get x(): number {return this.position.x}
    get y(): number {return this.position.y}

    set x(x: number) {this.setTo(this.size.width, this.size.height, x, this.position.y)}
    set y(y: number) {this.setTo(this.size.width, this.size.height, this.position.x, y)}

    get width(): number {return this.size.width}
    get height(): number {return this.size.height}

    set width(width: number) {this.setTo(width, this.size.height, this.position.x, this.position.y)}
    set height(height: number) {this.setTo(this.size.width, height, this.position.x, this.position.y)}

    setPosition(x: number, y: number): void {this.setTo(this.size.width, this.size.height, x, y)}
    resize(width: number, height: number): void {this.setTo(width, height, this.position.x, this.position.y)}

    setTo(
        width: number = this.size.width,
        height: number = this.size.height,
        x: number = this.position.x,
        y: number = this.position.y
    ): void {
        this.size.width = width;
        this.size.height = height;
        this.position.x = x;
        this.position.y = y;
    }
}