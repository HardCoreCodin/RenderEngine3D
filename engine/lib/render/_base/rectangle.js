export default class Rectangle {
    constructor(size, position) {
        this.size = { width: 1, height: 1 };
        this.position = { x: 0, y: 0 };
        if (size && position)
            this.setTo(size.width, size.height, position.x, position.y);
    }
    get x() { return this.position.x; }
    get y() { return this.position.y; }
    set x(x) { this.setTo(this.size.width, this.size.height, x, this.position.y); }
    set y(y) { this.setTo(this.size.width, this.size.height, this.position.x, y); }
    get width() { return this.size.width; }
    get height() { return this.size.height; }
    set width(width) { this.setTo(width, this.size.height, this.position.x, this.position.y); }
    set height(height) { this.setTo(this.size.width, height, this.position.x, this.position.y); }
    setPosition(x, y) { this.setTo(this.size.width, this.size.height, x, y); }
    resize(width, height) { this.setTo(width, height, this.position.x, this.position.y); }
    setTo(width = this.size.width, height = this.size.height, x = this.position.x, y = this.position.y) {
        this.size.width = width;
        this.size.height = height;
        this.position.x = x;
        this.position.y = y;
    }
}
//# sourceMappingURL=rectangle.js.map