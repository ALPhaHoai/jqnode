/**
 * Represents an HTML <col> or <colgroup> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLTableColElement extends JqElement {
    constructor(tagName: 'col' | 'colgroup' = 'col') {
        super('element', tagName);
    }

    /**
     * Number of columns the element should span
     */
    get span(): number {
        const value = this.getAttribute('span');
        return value ? parseInt(value, 10) : 1;
    }

    set span(value: number) {
        this.setAttribute('span', value.toString());
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

    /**
     * Width of the column (obsolete, use CSS instead)
     */
    get width(): string {
        return this.getAttribute('width') || '';
    }

    set width(value: string) {
        this.setAttribute('width', value);
    }
}
