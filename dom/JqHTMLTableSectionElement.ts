/**
 * Represents an HTML <thead>, <tbody>, or <tfoot> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
 */

import { JqElement } from './JqElement';

export class JqHTMLTableSectionElement extends JqElement {
    constructor(tagName: 'thead' | 'tbody' | 'tfoot' = 'tbody') {
        super('element', tagName);
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
     * Vertical alignment (obsolete, use CSS instead)
     */
    get vAlign(): string {
        return this.getAttribute('valign') || '';
    }

    set vAlign(value: string) {
        this.setAttribute('valign', value);
    }
}
