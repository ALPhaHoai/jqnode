/**
 * Represents an HTML <iframe> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLIFrameElement extends JqElement {
    constructor() {
        super('element', 'iframe');
    }

    /**
     * The URL of the page to embed
     */
    get src(): string {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
    }

    /**
     * Inline HTML to embed
     */
    get srcdoc(): string {
        return this.getAttribute('srcdoc') || '';
    }

    set srcdoc(value: string) {
        this.setAttribute('srcdoc', value);
    }

    /**
     * Name of the iframe
     */
    get name(): string {
        return this.getAttribute('name') || '';
    }

    set name(value: string) {
        this.setAttribute('name', value);
    }

    /**
     * Sandbox restrictions
     */
    get sandbox(): string {
        return this.getAttribute('sandbox') || '';
    }

    set sandbox(value: string) {
        this.setAttribute('sandbox', value);
    }

    /**
     * Feature policy
     */
    get allow(): string {
        return this.getAttribute('allow') || '';
    }

    set allow(value: string) {
        this.setAttribute('allow', value);
    }

    /**
     * Width of the iframe
     */
    get width(): string {
        return this.getAttribute('width') || '';
    }

    set width(value: string) {
        this.setAttribute('width', value);
    }

    /**
     * Height of the iframe
     */
    get height(): string {
        return this.getAttribute('height') || '';
    }

    set height(value: string) {
        this.setAttribute('height', value);
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
     * Loading strategy
     */
    get loading(): string {
        return this.getAttribute('loading') || '';
    }

    set loading(value: string) {
        this.setAttribute('loading', value);
    }
}
