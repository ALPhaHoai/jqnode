/**
 * Represents an HTML <pre> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLPreElement extends JqElement {
    constructor() {
        super('element', 'pre');
    }

    /**
     * Maximum number of characters per line (obsolete)
     */
    get width(): number {
        const value = this.getAttribute('width');
        return value ? parseInt(value, 10) : 0;
    }

    set width(value: number) {
        this.setAttribute('width', value.toString());
    }
}
