/**
 * Represents an HTML <table> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLTableElement extends JqElement {
    constructor() {
        super('element', 'table');
    }

    /**
     * Alignment of the table (obsolete, use CSS instead)
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
     * Border width (obsolete, use CSS instead)
     */
    get border(): string {
        return this.getAttribute('border') || '';
    }

    set border(value: string) {
        this.setAttribute('border', value);
    }

    /**
     * Cell padding (obsolete, use CSS instead)
     */
    get cellPadding(): string {
        return this.getAttribute('cellpadding') || '';
    }

    set cellPadding(value: string) {
        this.setAttribute('cellpadding', value);
    }

    /**
     * Cell spacing (obsolete, use CSS instead)
     */
    get cellSpacing(): string {
        return this.getAttribute('cellspacing') || '';
    }

    set cellSpacing(value: string) {
        this.setAttribute('cellspacing', value);
    }

    /**
     * Frame attribute (obsolete, use CSS instead)
     */
    get frame(): string {
        return this.getAttribute('frame') || '';
    }

    set frame(value: string) {
        this.setAttribute('frame', value);
    }

    /**
     * Rules attribute (obsolete, use CSS instead)
     */
    get rules(): string {
        return this.getAttribute('rules') || '';
    }

    set rules(value: string) {
        this.setAttribute('rules', value);
    }

    /**
     * Summary of the table (obsolete)
     */
    get summary(): string {
        return this.getAttribute('summary') || '';
    }

    set summary(value: string) {
        this.setAttribute('summary', value);
    }

    /**
     * Width of the table (obsolete, use CSS instead)
     */
    get width(): string {
        return this.getAttribute('width') || '';
    }

    set width(value: string) {
        this.setAttribute('width', value);
    }
}
