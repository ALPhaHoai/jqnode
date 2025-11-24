/**
 * Represents an HTML <img> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLImageElement extends JqElement {
    constructor() {
        super('element', 'img');
    }

    /**
     * The image URL
     */
    get src(): string {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
    }

    /**
     * Alternative text
     */
    get alt(): string {
        return this.getAttribute('alt') || '';
    }

    set alt(value: string) {
        this.setAttribute('alt', value);
    }

    /**
     * Image width
     */
    get width(): number {
        const value = this.getAttribute('width');
        return value ? parseInt(value, 10) : 0;
    }

    set width(value: number) {
        this.setAttribute('width', value.toString());
    }

    /**
     * Image height
     */
    get height(): number {
        const value = this.getAttribute('height');
        return value ? parseInt(value, 10) : 0;
    }

    set height(value: number) {
        this.setAttribute('height', value.toString());
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
     * Loading strategy
     */
    get loading(): string {
        return this.getAttribute('loading') || '';
    }

    set loading(value: string) {
        this.setAttribute('loading', value);
    }

    /**
     * Responsive image sources
     */
    get srcset(): string {
        return this.getAttribute('srcset') || '';
    }

    set srcset(value: string) {
        this.setAttribute('srcset', value);
    }

    /**
     * Sizes for responsive images
     */
    get sizes(): string {
        return this.getAttribute('sizes') || '';
    }

    set sizes(value: string) {
        this.setAttribute('sizes', value);
    }

    /**
     * Decoding hint
     */
    get decoding(): string {
        return this.getAttribute('decoding') || '';
    }

    set decoding(value: string) {
        this.setAttribute('decoding', value);
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
     * Use map
     */
    get useMap(): string {
        return this.getAttribute('usemap') || '';
    }

    set useMap(value: string) {
        this.setAttribute('usemap', value);
    }

    /**
     * Whether the image is a server-side image map
     */
    get isMap(): boolean {
        return this.hasAttribute('ismap');
    }

    set isMap(value: boolean) {
        if (value) {
            this.setAttribute('ismap', '');
        } else {
            this.removeAttribute('ismap');
        }
    }
}
