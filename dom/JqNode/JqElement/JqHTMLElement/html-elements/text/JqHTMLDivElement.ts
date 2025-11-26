/**
 * Represents an HTML <div> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLDivElement extends JqElement {
    constructor() {
        super('element', 'div');
    }

    /**
     * Alignment of the element (obsolete, use CSS instead)
     */
    get align(): string {
        return this.getAttribute('align') || '';
    }

    set align(value: string) {
        this.setAttribute('align', value);
    }
}
