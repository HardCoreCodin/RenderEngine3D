export class IsPressed {
    public escape   : boolean = false;
    public pause    : boolean = false;

    public insert   : boolean = false;
    public delete   : boolean = false;
    public home     : boolean = false;
    public end      : boolean = false;
    public page_up  : boolean = false;
    public page_down: boolean = false;

    public enter    : boolean = false;
    public space    : boolean = false;
    public backspace: boolean = false;

    public up       : boolean = false;
    public left     : boolean = false;
    public right    : boolean = false;
    public down     : boolean = false;

    public alt      : boolean = false;
    public ctrl     : boolean = false;
    public shift    : boolean = false;
}

const is_pressed: IsPressed = new IsPressed();
export default is_pressed;