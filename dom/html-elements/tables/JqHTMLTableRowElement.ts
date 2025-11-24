/**
 * Represents an HTML <tr> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLTableRowElement extends JqElement {
    constructor() {
        super('element', 'tr');
    }

    /**
     * Alignment of content in cells (obsolete, use CSS instead)
     */
    get align(): string {
        return this.getAttribute('align') || '';
    }

    set align(value: string) {
        this.setAttribute('align', value);
    }

    /**
     * Background color (obsolete, use CSS instead)
     */
    get bgColor(): string {
        return this.getAttribute('bgcolor') || '';
    }

    set bgColor(value: string) {
        this.setAttribute('bgcolor', value);
    }

    /**
     * Vertical alignment (obsolete, use CSS instead)
     */
    get vAlign(): string {
        return this.getAttribute('valign') || '';
    }

    set vAlign(value: string) {
        this.setAttribute('valign', value);
    }
}
