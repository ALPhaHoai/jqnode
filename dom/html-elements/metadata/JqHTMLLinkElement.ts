/**
 * Represents an HTML <link> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLLinkElement extends JqElement {
    constructor() {
        super('element', 'link');
    }

    /**
     * The URL of the linked resource
     */
    get href(): string {
        return this.getAttribute('href') || '';
    }

    set href(value: string) {
        this.setAttribute('href', value);
    }

    /**
     * The relationship of the linked document
     */
    get rel(): string {
        return this.getAttribute('rel') || '';
    }

    set rel(value: string) {
        this.setAttribute('rel', value);
    }

    /**
     * The MIME type of the linked resource
     */
    override get type(): string {
        return this.getAttribute('type') || '';
    }

    override set type(value: string) {
        this.setAttribute('type', value);
    }

    /**
     * Media query for the resource
     */
    get media(): string {
        return this.getAttribute('media') || '';
    }

    set media(value: string) {
        this.setAttribute('media', value);
    }

    /**
     * Resource hint type
     */
    get as(): string {
        return this.getAttribute('as') || '';
    }

    set as(value: string) {
        this.setAttribute('as', value);
    }

    /**
     * Cross-origin attribute
     */
    get crossOrigin(): string | null {
        return this.getAttribute('crossorigin');
    }

    set crossOrigin(value: string | null) {
        if (value === null) {
            this.removeAttribute('crossorigin');
        } else {
            this.setAttribute('crossorigin', value);
        }
    }

    /**
     * Subresource integrity hash
     */
    get integrity(): string {
        return this.getAttribute('integrity') || '';
    }

    set integrity(value: string) {
        this.setAttribute('integrity', value);
    }

    /**
     * Referrer policy
     */
    get referrerPolicy(): string {
        return this.getAttribute('referrerpolicy') || '';
    }

    set referrerPolicy(value: string) {
        this.setAttribute('referrerpolicy', value);
    }

    /**
     * Sizes for icons
     */
    get sizes(): string {
        return this.getAttribute('sizes') || '';
    }

    set sizes(value: string) {
        this.setAttribute('sizes', value);
    }

    /**
     * Language of the linked resource
     */
    get hreflang(): string {
        return this.getAttribute('hreflang') || '';
    }

    set hreflang(value: string) {
        this.setAttribute('hreflang', value);
    }
}
