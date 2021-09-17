import { pos2i } from "../accessors/position.js";
class MouseButton {
    constructor() {
        this.down_pos = pos2i();
        this.up_pos = pos2i();
        this.click_pos = pos2i();
        this.double_click_pos = pos2i();
        this.is_pressed = false;
        this.went_down = false;
        this.went_up = false;
        this.clicked = false;
        this.click_handled = false;
        this.went_down_handled = false;
        this.went_up_handled = false;
        this.double_clicked = false;
        this.double_click_handled = false;
    }
    down(x, y) {
        this.is_pressed = true;
        this.went_down = true;
        this.down_pos.x = x;
        this.down_pos.y = y;
    }
    up(x, y) {
        this.is_pressed = false;
        this.went_up = true;
        this.up_pos.x = x;
        this.up_pos.y = y;
    }
    click(x, y) {
        this.click_pos.x = x;
        this.click_pos.y = y;
        this.clicked = true;
    }
    doubleClick(x, y) {
        this.double_click_pos.x = x;
        this.double_click_pos.y = y;
        this.double_clicked = true;
    }
    reset() {
        if (this.click_handled)
            this.clicked = false;
        if (this.double_click_handled)
            this.double_clicked = false;
        if (this.went_down_handled)
            this.went_down = false;
        if (this.went_up_handled)
            this.went_up = false;
        this.click_handled = false;
        this.double_click_handled = false;
        this.went_down_handled = false;
        this.went_up_handled = false;
    }
}
class MouseWheel {
    constructor() {
        this.scrolled = false;
        this.scroll_amount = 0;
        this.scroll_handled = false;
    }
    scroll(amount) {
        this.scroll_amount += amount;
        this.scrolled = true;
    }
    reset() {
        if (this.scroll_handled) {
            this.scrolled = false;
            this.scroll_amount = 0;
        }
    }
}
export default class Mouse {
    constructor() {
        this.wheel = new MouseWheel();
        this.pos = pos2i();
        this.pos_raw_diff = pos2i();
        this.movement = pos2i();
        this.is_captured = false;
        this.moved = false;
        this.move_handled = false;
        this.raw_movement_handled = false;
        this.middle_button = new MouseButton();
        this.right_button = new MouseButton();
        this.left_button = new MouseButton();
    }
    setMovement(x, y) {
        this.movement.x = x - this.pos.x;
        this.movement.y = y - this.pos.y;
        this.moved = true;
    }
    setRawMovement(x, y) {
        this.pos_raw_diff.x += x;
        this.pos_raw_diff.y += y;
        this.moved = true;
    }
    reset() {
        if (this.move_handled) {
            this.move_handled = false;
            this.movement.setAllTo(0);
            this.moved = false;
        }
        if (this.raw_movement_handled) {
            this.raw_movement_handled = false;
            this.pos_raw_diff.setAllTo(0);
        }
        this.wheel.reset();
        this.left_button.reset();
        this.middle_button.reset();
        this.right_button.reset();
    }
}
//# sourceMappingURL=mouse.js.map