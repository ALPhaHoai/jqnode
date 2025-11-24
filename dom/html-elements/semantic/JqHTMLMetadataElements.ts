/**
 * HTML metadata and special elements
 * Based on MDN HTML Element Reference
 */

import { JqElement } from '../../core/JqElement';

// Metadata Elements
export class JqHTMLBaseElement extends JqElement {
    constructor() { super('element', 'base'); }

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

export class JqHTMLTitleElement extends JqElement {
    constructor() { super('element', 'title'); }
}

// SVG and MathML
export class JqSVGElement extends JqElement {
    constructor() { super('element', 'svg'); }

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

    get viewBox(): string {
        return this.getAttribute('viewBox') || '';
    }

    set viewBox(value: string) {
        this.setAttribute('viewBox', value);
    }
}

export class JqMathMLElement extends JqElement {
    constructor() { super('element', 'math'); }

    get display(): string {
        return this.getAttribute('display') || '';
    }

    set display(value: string) {
        this.setAttribute('display', value);
    }
}

// Special experimental elements
export class JqHTMLFencedFrameElement extends JqElement {
    constructor() { super('element', 'fencedframe'); }

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

export class JqHTMLSelectedContentElement extends JqElement {
    constructor() { super('element', 'selectedcontent'); }
}
