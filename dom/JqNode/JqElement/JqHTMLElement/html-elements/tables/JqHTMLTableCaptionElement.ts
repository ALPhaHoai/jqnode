/**
 * Represents an HTML <caption> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLTableCaptionElement extends JqElement {
    constructor() {
        super('element', 'caption');
    }

    /**
     * Alignment of the caption (obsolete, use CSS instead)
     */
    get align(): string {
        return this.getAttribute('align') || '';
    }

    set align(value: string) {
        this.setAttribute('align', value);
    }
}
