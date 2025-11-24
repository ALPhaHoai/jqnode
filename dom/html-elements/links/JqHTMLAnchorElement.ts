/**
 * Represents an HTML <a> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLAnchorElement extends JqElement {
    constructor() {
        super('element', 'a');
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
     * Where to display the linked URL
     */
    get target(): string {
        return this.getAttribute('target') || '';
    }

    set target(value: string) {
        this.setAttribute('target', value);
    }

    /**
     * Prompts the user to save the linked URL
     */
    get download(): string {
        return this.getAttribute('download') || '';
    }

    set download(value: string) {
        this.setAttribute('download', value);
    }

    /**
     * The relationship of the linked URL
     */
    get rel(): string {
        return this.getAttribute('rel') || '';
    }

    set rel(value: string) {
        this.setAttribute('rel', value);
    }

    /**
     * The MIME type of the linked URL
     */
    get type(): string {
        return this.getAttribute('type') || '';
    }

    set type(value: string) {
        this.setAttribute('type', value);
    }

    /**
     * The language of the linked URL
     */
    get hreflang(): string {
        return this.getAttribute('hreflang') || '';
    }

    set hreflang(value: string) {
        this.setAttribute('hreflang', value);
    }

    /**
     * Referrer policy for the link
     */
    get referrerPolicy(): string {
        return this.getAttribute('referrerpolicy') || '';
    }

    set referrerPolicy(value: string) {
        this.setAttribute('referrerpolicy', value);
    }

    /**
     * Space-separated list of URLs
     */
    get ping(): string {
        return this.getAttribute('ping') || '';
    }

    set ping(value: string) {
        this.setAttribute('ping', value);
    }
}
