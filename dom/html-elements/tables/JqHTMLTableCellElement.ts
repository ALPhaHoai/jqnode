/**
 * Represents an HTML <td> or <th> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td
 * and https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLTableCellElement extends JqElement {
    constructor(tagName: 'td' | 'th' = 'td') {
        super('element', tagName);
    }

    /**
     * Number of columns this cell should span
     */
    get colSpan(): number {
        const value = this.getAttribute('colspan');
        return value ? parseInt(value, 10) : 1;
    }

    set colSpan(value: number) {
        this.setAttribute('colspan', value.toString());
    }

    /**
     * Number of rows this cell should span
     */
    get rowSpan(): number {
        const value = this.getAttribute('rowspan');
        return value ? parseInt(value, 10) : 1;
    }

    set rowSpan(value: number) {
        this.setAttribute('rowspan', value.toString());
    }

    /**
     * Space-separated list of header cell IDs
     */
    get headers(): string {
        return this.getAttribute('headers') || '';
    }

    set headers(value: string) {
        this.setAttribute('headers', value);
    }

    /**
     * Scope of the header cell (for <th>)
     */
    get scope(): string {
        return this.getAttribute('scope') || '';
    }

    set scope(value: string) {
        this.setAttribute('scope', value);
    }

    /**
     * Abbreviated version of the cell content
     */
    get abbr(): string {
        return this.getAttribute('abbr') || '';
    }

    set abbr(value: string) {
        this.setAttribute('abbr', value);
    }

    /**
     * Alignment of content (obsolete, use CSS instead)
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
     * Background color (obsolete, use CSS instead)
     */
    get bgColor(): string {
        return this.getAttribute('bgcolor') || '';
    }

    set bgColor(value: string) {
        this.setAttribute('bgcolor', value);
    }

    /**
     * Width of the cell (obsolete, use CSS instead)
     */
    get width(): string {
        return this.getAttribute('width') || '';
    }

    set width(value: string) {
        this.setAttribute('width', value);
    }

    /**
     * Height of the cell (obsolete, use CSS instead)
     */
    get height(): string {
        return this.getAttribute('height') || '';
    }

    set height(value: string) {
        this.setAttribute('height', value);
    }
}
