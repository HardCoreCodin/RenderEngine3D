export class MouseButton {
    public down_pos_x: number = 0;
    public down_pos_y: number = 0;
    public up_pos_x: number = 0;
    public up_pos_y: number = 0;

    public click_pos_x: number = 0;
    public click_pos_y: number = 0;

    public is_pressed: boolean = false;
    public went_down: boolean = false;
    public went_up: boolean = false;

    public clicked: boolean = false;
    public click_handled: boolean = false;
    public went_down_handled: boolean = false;
    public went_up_handled: boolean = false;

    down(x: number, y: number) {
        this.is_pressed = true;
        this.went_down = true;
        this.down_pos_x = x;
        this.down_pos_y = y;
    }

    up(x: number, y: number) {
        this.is_pressed = false;
        this.went_up = true;
        this.up_pos_x = x;
        this.up_pos_y = y;
    }

    click(x: number, y: number) {
        this.click_pos_x = x;
        this.click_pos_y = y;
        this.clicked = true;
    }

    reset() {
        if (this.click_handled)
            this.clicked = false;

        if (this.went_down_handled)
            this.went_down = false;

        if (this.went_up_handled)
            this.went_up = false;

        this.click_handled = false;
        this.went_down_handled = false;
        this.went_up_handled = false;
    }
}

export class MouseWheel {
    public scrolled: boolean = false;
    public scroll_amount: number = 0;
    public scroll_handled: boolean = false;

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

export class Mouse {
    readonly right_button : MouseButton = new MouseButton();
    readonly middle_button: MouseButton = new MouseButton();
    readonly left_button  : MouseButton = new MouseButton();
    readonly buttons: Array<MouseButton> = [];

    readonly wheel = new MouseWheel();

    public pos_x: number = 0;
    public pos_y: number = 0;

    public accumulated_movement_x: number = 0;
    public accumulated_movement_y: number = 0;

    public movement_x: number = 0;
    public movement_y: number = 0;

    public double_click_pos_x: number = 0;
    public double_click_pos_y: number = 0;
    public double_clicked: boolean = false;
    public double_click_handled: boolean = false;

    public is_captured: boolean = false;

    public moved: boolean = false;

    public move_handled: boolean = false;
    public accumulated_movement_handled: boolean = false;

    constructor() { this.buttons.push(this.left_button, this.middle_button, this.right_button); }

    doubleClick(x: number, y: number) {
        this.double_click_pos_x = x;
        this.double_click_pos_y = y;
        this.double_clicked = true;
    }

    move(movement_x: number, movement_y: number) {
        this.movement_x = movement_x;
        this.movement_y = movement_y;
        this.accumulated_movement_x += movement_x;
        this.accumulated_movement_y += movement_y;
        this.moved = true;
    }

    reset() {
        if (this.move_handled) {
            this.move_handled = false;
            this.movement_x = 0;
            this.movement_y = 0;
            this.moved = false;
        }
        if (this.accumulated_movement_handled) {
            this.accumulated_movement_handled = false;
            this.accumulated_movement_x = 0;
            this.accumulated_movement_y = 0;
        }
        if (this.double_click_handled)
            this.double_clicked = false;

        this.wheel.reset();
        this.left_button.reset();
        this.middle_button.reset();
        this.right_button.reset();
        this.double_click_handled = false;
    }
}

const mouse: Mouse = new Mouse();
export default mouse;