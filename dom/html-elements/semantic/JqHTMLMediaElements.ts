/**
 * HTML elements for media, embedding, and interactive content
 * Based on MDN HTML Element Reference
 */

import { JqElement } from '../../core/JqElement';

// Image and Multimedia
export class JqHTMLAreaElement extends JqElement {
    constructor() { super('element', 'area'); }

    get alt(): string {
        return this.getAttribute('alt') || '';
    }

    set alt(value: string) {
        this.setAttribute('alt', value);
    }

    get coords(): string {
        return this.getAttribute('coords') || '';
    }

    set coords(value: string) {
        this.setAttribute('coords', value);
    }

    get shape(): string {
        return this.getAttribute('shape') || '';
    }

    set shape(value: string) {
        this.setAttribute('shape', value);
    }

    get href(): string {
        return this.getAttribute('href') || '';
    }

    set href(value: string) {
        this.setAttribute('href', value);
    }

    get target(): string {
        return this.getAttribute('target') || '';
    }

    set target(value: string) {
        this.setAttribute('target', value);
    }
}

export class JqHTMLMapElement extends JqElement {
    constructor() { super('element', 'map'); }
}

export class JqHTMLTrackElement extends JqElement {
    constructor() { super('element', 'track'); }

    get kind(): string {
        return this.getAttribute('kind') || '';
    }

    set kind(value: string) {
        this.setAttribute('kind', value);
    }

    get src(): string {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
    }

    get srclang(): string {
        return this.getAttribute('srclang') || '';
    }

    set srclang(value: string) {
        this.setAttribute('srclang', value);
    }

    get label(): string {
        return this.getAttribute('label') || '';
    }

    set label(value: string) {
        this.setAttribute('label', value);
    }

    get default(): boolean {
        return this.hasAttribute('default');
    }

    set default(value: boolean) {
        if (value) {
            this.setAttribute('default', '');
        } else {
            this.removeAttribute('default');
        }
    }
}

// Embedded Content
export class JqHTMLEmbedElement extends JqElement {
    constructor() { super('element', 'embed'); }

    get src(): string {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
    }

    override get type(): string {
        return this.getAttribute('type') || '';
    }

    override set type(value: string) {
        this.setAttribute('type', value);
    }

    get width(): string {
        return this.getAttribute('width') || '';
    }

    set width(value: string) {
        this.setAttribute('width', value);
    }

    get height(): string {
        return this.getAttribute('height') || '';
    }

    set height(value: string) {
        this.setAttribute('height', value);
    }
}

export class JqHTMLObjectElement extends JqElement {
    constructor() { super('element', 'object'); }

    override get data(): string {
        return this.getAttribute('data') || '';
    }

    override set data(value: string) {
        this.setAttribute('data', value);
    }

    override get type(): string {
        return this.getAttribute('type') || '';
    }

    override set type(value: string) {
        this.setAttribute('type', value);
    }

    get width(): string {
        return this.getAttribute('width') || '';
    }

    set width(value: string) {
        this.setAttribute('width', value);
    }

    get height(): string {
        return this.getAttribute('height') || '';
    }

    set height(value: string) {
        this.setAttribute('height', value);
    }
}

export class JqHTMLPictureElement extends JqElement {
    constructor() { super('element', 'picture'); }
}

export class JqHTMLSourceElement extends JqElement {
    constructor() { super('element', 'source'); }

    get src(): string {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
    }

    override get type(): string {
        return this.getAttribute('type') || '';
    }

    override set type(value: string) {
        this.setAttribute('type', value);
    }

    get srcset(): string {
        return this.getAttribute('srcset') || '';
    }

    set srcset(value: string) {
        this.setAttribute('srcset', value);
    }

    get sizes(): string {
        return this.getAttribute('sizes') || '';
    }

    set sizes(value: string) {
        this.setAttribute('sizes', value);
    }

    get media(): string {
        return this.getAttribute('media') || '';
    }

    set media(value: string) {
        this.setAttribute('media', value);
    }
}

// Scripting
export class JqHTMLNoScriptElement extends JqElement {
    constructor() { super('element', 'noscript'); }
}

// Demarcating Edits
export class JqHTMLModElement extends JqElement {
    constructor(tagName: 'ins' | 'del' = 'ins') {
        super('element', tagName);
    }

    get cite(): string {
        return this.getAttribute('cite') || '';
    }

    set cite(value: string) {
        this.setAttribute('cite', value);
    }

    get dateTime(): string {
        return this.getAttribute('datetime') || '';
    }

    set dateTime(value: string) {
        this.setAttribute('datetime', value);
    }
}

// Forms (additional elements)
export class JqHTMLDataListElement extends JqElement {
    constructor() { super('element', 'datalist'); }
}

export class JqHTMLOptGroupElement extends JqElement {
    constructor() { super('element', 'optgroup'); }

    get disabled(): boolean {
        return this.hasAttribute('disabled');
    }

    set disabled(value: boolean) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get label(): string {
        return this.getAttribute('label') || '';
    }

    set label(value: string) {
        this.setAttribute('label', value);
    }
}

export class JqHTMLOutputElement extends JqElement {
    constructor() { super('element', 'output'); }

    get htmlFor(): string {
        return this.getAttribute('for') || '';
    }

    set htmlFor(value: string) {
        this.setAttribute('for', value);
    }

    get form(): string {
        return this.getAttribute('form') || '';
    }

    set form(value: string) {
        this.setAttribute('form', value);
    }
}

export class JqHTMLProgressElement extends JqElement {
    constructor() { super('element', 'progress'); }

    get value(): number {
        const val = this.getAttribute('value');
        return val ? parseFloat(val) : 0;
    }

    set value(value: number) {
        this.setAttribute('value', value.toString());
    }

    get max(): number {
        const val = this.getAttribute('max');
        return val ? parseFloat(val) : 1;
    }

    set max(value: number) {
        this.setAttribute('max', value.toString());
    }
}

export class JqHTMLMeterElement extends JqElement {
    constructor() { super('element', 'meter'); }

    get value(): number {
        const val = this.getAttribute('value');
        return val ? parseFloat(val) : 0;
    }

    set value(value: number) {
        this.setAttribute('value', value.toString());
    }

    get min(): number {
        const val = this.getAttribute('min');
        return val ? parseFloat(val) : 0;
    }

    set min(value: number) {
        this.setAttribute('min', value.toString());
    }

    get max(): number {
        const val = this.getAttribute('max');
        return val ? parseFloat(val) : 1;
    }

    set max(value: number) {
        this.setAttribute('max', value.toString());
    }

    get low(): number {
        const val = this.getAttribute('low');
        return val ? parseFloat(val) : 0;
    }

    set low(value: number) {
        this.setAttribute('low', value.toString());
    }

    get high(): number {
        const val = this.getAttribute('high');
        return val ? parseFloat(val) : 1;
    }

    set high(value: number) {
        this.setAttribute('high', value.toString());
    }

    get optimum(): number {
        const val = this.getAttribute('optimum');
        return val ? parseFloat(val) : 0.5;
    }

    set optimum(value: number) {
        this.setAttribute('optimum', value.toString());
    }
}

// Interactive Elements
export class JqHTMLDetailsElement extends JqElement {
    constructor() { super('element', 'details'); }

    get open(): boolean {
        return this.hasAttribute('open');
    }

    set open(value: boolean) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }
}

export class JqHTMLDialogElement extends JqElement {
    constructor() { super('element', 'dialog'); }

    get open(): boolean {
        return this.hasAttribute('open');
    }

    set open(value: boolean) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }
}

export class JqHTMLSummaryElement extends JqElement {
    constructor() { super('element', 'summary'); }
}

// Web Components
export class JqHTMLSlotElement extends JqElement {
    constructor() { super('element', 'slot'); }
}

export class JqHTMLTemplateElement extends JqElement {
    constructor() { super('element', 'template'); }
}
