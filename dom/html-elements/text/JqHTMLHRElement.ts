/**
 * Represents an HTML <hr> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLHRElement extends JqElement {
    constructor() {
        super('element', 'hr');
    }

    /**
     * Alignment of the rule (obsolete, use CSS instead)
     */
    get align(): string {
        return this.getAttribute('align') || '';
    }

    set align(value: string) {
        this.setAttribute('align', value);
    }

    /**
     * Color of the rule (obsolete, use CSS instead)
     */
    get color(): string {
        return this.getAttribute('color') || '';
    }

    set color(value: string) {
        this.setAttribute('color', value);
    }

    /**
     * Shading of the rule (obsolete, use CSS instead)
     */
    get noShade(): boolean {
        return this.hasAttribute('noshade');
    }

    set noShade(value: boolean) {
        if (value) {
            this.setAttribute('noshade', '');
        } else {
            this.removeAttribute('noshade');
        }
    }

    /**
     * Width of the rule (obsolete, use CSS instead)
     */
    get width(): string {
        return this.getAttribute('width') || '';
    }

    set width(value: string) {
        this.setAttribute('width', value);
    }
}
