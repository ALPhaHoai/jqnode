/**
 * Represents an HTML <br> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLBRElement extends JqElement {
    constructor() {
        super('element', 'br');
    }

    /**
     * Clear property (obsolete, use CSS instead)
     */
    get clear(): string {
        return this.getAttribute('clear') || '';
    }

    set clear(value: string) {
        this.setAttribute('clear', value);
    }
}
