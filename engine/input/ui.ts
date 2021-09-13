import {Vector} from "../accessors/accessor.js";

class UISlider {
    protected readonly _input_element: HTMLInputElement;
    protected readonly _label_element: HTMLLabelElement;

    constructor(
        protected current_value: number,
        protected _label: string,
        protected _id: string,
        public min_value: number = 0,
        public max_value: number = 1,
        public step_value: number = 0.01,
        protected _parent_element: HTMLElement
    ) {
        this._input_element = document.createElement('input');
        this._label_element = document.createElement('label');
        this._label_element.style.cssText = 'color: antiquewhite;';
        this._input_element.id = this._label_element.htmlFor = _id;
        this._input_element.type = 'range';
        this._input_element.className = 'slider';
        this._input_element.min = min_value.toFixed(2);
        this._input_element.max = max_value.toFixed(2);
        this._input_element.step = step_value.toFixed(2);
        this._input_element.value = current_value.toFixed(2);
        this._label_element.textContent = `${_label} : ${this._input_element.value}`;

        _parent_element.appendChild(this._input_element);
        _parent_element.appendChild(this._label_element);
        _parent_element.appendChild(document.createElement('br'));
    }

    set min(min: number) {
        this.min_value = min;
        this._input_element.min = min.toFixed(2);
    }

    set max(max: number) {
        this.max_value = max;
        this._input_element.max = max.toFixed(2);
    }

    set step(step: number) {
        this.step_value = step;
        this._input_element.min = step.toFixed(2);
    }

    set value(value: number) {
        this.current_value = value;
        this._input_element.value = value.toFixed(2);
        this._label_element.textContent = `${this._label} : ${this._input_element.value}`;
    }

    get min() { return this.min_value; }
    get max() { return this.max_value; }
    get step() { return this.step_value; }
    get value() { return this.current_value; }

    bindTo(obj: any, attr: string): this {
        this._input_element.oninput = (ev: Event): any => {
            this._label_element.textContent = this._label + ' : ' + this._input_element.value;
            obj[attr] = Number.parseFloat(this._input_element.value);
        };

        return this;
    }

    unbind() {
        this._input_element.oninput = undefined;
    }
}

export default class UILayer {
    protected readonly _element: HTMLDivElement;
    protected readonly _sliders = new Map<any, UISlider[]>();
    protected _last_id = 0;

    constructor(parent_element: HTMLElement = document.body) {
        this._element = document.createElement('div');
        this._element.style.cssText ='position: absolute; left: 0px; right: 0px;';
        parent_element.appendChild(this._element);
    }

    addSlider(label: string, obj: any, attr: string, range: [number, number], step: number = 0.01) {
        if (!(this._sliders.has(obj))) this._sliders.set(obj, []);
        const id = 'ui_slider_' + this._last_id++;
        const slider = new UISlider(obj[attr], label, id, range[0], range[1], step, this._element);
        this._sliders.get(obj).push(slider.bindTo(obj, attr));
    }

    addSliders(label: string, obj: Vector|any, range: [number, number] = [0.0, 5.0], step: number = 0.01) {
        if (obj instanceof Vector) {
            const attrs = 'u' in obj ? 'uvw' : ('r' in obj ? 'rgba' : 'xyzw');
            for (const attr of attrs)
                if (attr in obj)
                    this.addSlider(`${label}.${attr}`, obj, attr, range, step);

            const sliders: UISlider[] = this._sliders.get(obj);
            obj.on_change = (self) => {
                for (let i = 0; i < self.array.length; i++) {
                    const value = self.array[i];
                    const slider = sliders[i];
                    const range = Math.abs(slider.max - slider.min);
                    if (value < slider.min) {
                        slider.min = value;
                        slider.max = value + range;
                    } else if (value > slider.max) {
                        slider.max = value;
                        slider.min = value - range;
                    }
                    slider.value = value;
                }
            };
        } else
            for (const attr in obj) if (obj.hasOwnProperty(attr))
                this.addSlider(attr, obj, attr, range, step);
    }
}