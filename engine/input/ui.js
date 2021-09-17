import { Vector } from "../accessors/accessor.js";
class UISlider {
    constructor(obj, attr, _label, _id, min_value = 0, max_value = 1, step_value = 0.01, _parent_element) {
        this.obj = obj;
        this.attr = attr;
        this._label = _label;
        this._id = _id;
        this.min_value = min_value;
        this.max_value = max_value;
        this.step_value = step_value;
        this._parent_element = _parent_element;
        this.current_value = obj[attr];
        this._input_element = document.createElement('input');
        this._label_element = document.createElement('label');
        this._label_element.style.cssText = 'color: antiquewhite;';
        this._input_element.id = this._label_element.htmlFor = _id;
        this._input_element.type = 'range';
        this._input_element.className = 'slider';
        this._input_element.min = min_value.toFixed(2);
        this._input_element.max = max_value.toFixed(2);
        this._input_element.step = step_value.toFixed(2);
        this._input_element.value = this.current_value.toFixed(2);
        this._updateLabel();
        _parent_element.appendChild(this._input_element);
        _parent_element.appendChild(this._label_element);
        _parent_element.appendChild(document.createElement('br'));
    }
    _updateLabel() {
        this._label_element.textContent = `${this._label} : ${this._input_element.value}`;
    }
    set min(min) {
        this.min_value = min;
        this._input_element.min = min.toFixed(2);
    }
    set max(max) {
        this.max_value = max;
        this._input_element.max = max.toFixed(2);
    }
    set step(step) {
        this.step_value = step;
        this._input_element.min = step.toFixed(2);
    }
    set value(value) {
        this.current_value = value;
        this._input_element.value = value.toFixed(2);
        this._updateLabel();
    }
    get min() { return this.min_value; }
    get max() { return this.max_value; }
    get step() { return this.step_value; }
    get value() { return this.current_value; }
    bindTo(obj, attr) {
        this._input_element.oninput = (ev) => {
            this.current_value = obj[attr] = Number.parseFloat(this._input_element.value);
            this._updateLabel();
        };
        return this;
    }
    unbind() {
        this._input_element.oninput = undefined;
    }
    update() {
        this.current_value = this.obj[this.attr];
        const range = Math.abs(this.max_value - this.min_value);
        if (this.current_value < this.min_value) {
            this.min = this.current_value;
            this.max = this.current_value + range;
        }
        else if (this.current_value > this.max_value) {
            this.max = this.current_value;
            this.min = this.current_value - range;
        }
        this._input_element.value = this.current_value.toFixed(2);
        this._updateLabel();
    }
}
export default class UILayer {
    constructor(parent_element = document.body) {
        this._sliders = new Map();
        this._last_id = 0;
        this._element = document.createElement('div');
        this._element.style.cssText = 'position: absolute; left: 0px; right: 0px;';
        parent_element.appendChild(this._element);
    }
    addSlider(label, obj, attr, range, step = 0.01) {
        if (!(this._sliders.has(obj)))
            this._sliders.set(obj, []);
        const id = 'ui_slider_' + this._last_id++;
        const slider = new UISlider(obj, attr, label, id, range[0], range[1], step, this._element);
        this._sliders.get(obj).push(slider.bindTo(obj, attr));
    }
    addSliders(label, obj, range = [0.0, 5.0], step = 0.01) {
        if (obj instanceof Vector) {
            for (const attr of 'u' in obj ? 'uvw' : ('r' in obj ? 'rgba' : 'xyzw'))
                if (attr in obj)
                    this.addSlider(`${label}.${attr}`, obj, attr, range, step);
        }
        else
            for (const attr in obj)
                if (obj.hasOwnProperty(attr))
                    this.addSlider(attr, obj, attr, range, step);
    }
    update() {
        for (const sliders of this._sliders.values())
            for (const slider of sliders)
                slider.update();
    }
}
//# sourceMappingURL=ui.js.map