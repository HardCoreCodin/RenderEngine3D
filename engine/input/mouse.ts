import {pos2i} from "../accessors/position.js";

class MouseButton {
    down_pos = pos2i();
    up_pos = pos2i();

    click_pos = pos2i();
    double_click_pos = pos2i();

    is_pressed: boolean = false;
    went_down: boolean = false;
    went_up: boolean = false;

    clicked: boolean = false;
    click_handled: boolean = false;
    went_down_handled: boolean = false;
    went_up_handled: boolean = false;

    double_clicked: boolean = false;
    double_click_handled: boolean = false;

    down(x: number, y: number) {
        this.is_pressed = true;
        this.went_down = true;
        this.down_pos.x = x;
        this.down_pos.y = y;
    }

    up(x: number, y: number) {
        this.is_pressed = false;
        this.went_up = true;
        this.up_pos.x = x;
        this.up_pos.y = y;
    }

    click(x: number, y: number) {
        this.click_pos.x = x;
        this.click_pos.y = y;
        this.clicked = true;
    }

    doubleClick(x: number, y: number) {
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
    scrolled: boolean = false;
    scroll_amount: number = 0;
    scroll_handled: boolean = false;

    scroll(amount: number) {
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
    readonly middle_button: MouseButton;
    readonly right_button: MouseButton;
    readonly left_button: MouseButton;
    readonly wheel = new MouseWheel();

    readonly pos = pos2i();
    readonly pos_raw_diff = pos2i();
    readonly movement = pos2i();

    is_captured: boolean = false;

    moved: boolean = false;
    move_handled: boolean = false;
    raw_movement_handled: boolean = false;

    constructor() {
        this.middle_button = new MouseButton();
        this.right_button = new MouseButton();
        this.left_button = new MouseButton();
    }

    setMovement(x: number, y: number) {
        this.movement.x = x - this.pos.x;
        this.movement.y = y - this.pos.y;
        this.moved = true;
    }

    setRawMovement(x: number, y: number) {
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