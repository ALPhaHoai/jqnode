/**
 * Represents an HTML <canvas> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
 */

import { JqElement } from './JqElement';

export class JqHTMLCanvasElement extends JqElement {
    constructor() {
        super('element', 'canvas');
    }

    /**
     * Width of the canvas
     */
    get width(): number {
        const value = this.getAttribute('width');
        return value ? parseInt(value, 10) : 300;
    }

    set width(value: number) {
        this.setAttribute('width', value.toString());
    }

    /**
     * Height of the canvas
     */
    get height(): number {
        const value = this.getAttribute('height');
        return value ? parseInt(value, 10) : 150;
    }

    set height(value: number) {
        this.setAttribute('height', value.toString());
    }
}
