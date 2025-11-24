/**
 * Represents an HTML <meta> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLMetaElement extends JqElement {
    constructor() {
        super('element', 'meta');
    }

    /**
     * The name of the metadata
     */
    get name(): string {
        return this.getAttribute('name') || '';
    }

    set name(value: string) {
        this.setAttribute('name', value);
    }

    /**
     * The value of the metadata
     */
    get content(): string {
        return this.getAttribute('content') || '';
    }

    set content(value: string) {
        this.setAttribute('content', value);
    }

    /**
     * HTTP header name
     */
    get httpEquiv(): string {
        return this.getAttribute('http-equiv') || '';
    }

    set httpEquiv(value: string) {
        this.setAttribute('http-equiv', value);
    }

    /**
     * Character encoding declaration
     */
    get charset(): string {
        return this.getAttribute('charset') || '';
    }

    set charset(value: string) {
        this.setAttribute('charset', value);
    }
}
