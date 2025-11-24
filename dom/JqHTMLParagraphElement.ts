/**
 * Represents an HTML <p> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p
 */

import { JqElement } from './JqElement';

export class JqHTMLParagraphElement extends JqElement {
    constructor() {
        super('element', 'p');
    }

    /**
     * Alignment of the paragraph (obsolete, use CSS instead)
     */
    get align(): string {
        return this.getAttribute('align') || '';
    }

    set align(value: string) {
        this.setAttribute('align', value);
    }
}
