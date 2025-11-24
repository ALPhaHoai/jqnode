/**
 * Represents an HTML <script> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLScriptElement extends JqElement {
    constructor() {
        super('element', 'script');
    }

    /**
     * The URL of an external script
     */
    get src(): string {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
    }

    /**
     * The type of script
     */
    get type(): string {
        return this.getAttribute('type') || '';
    }

    set type(value: string) {
        this.setAttribute('type', value);
    }

    /**
     * Whether to execute the script asynchronously
     */
    get async(): boolean {
        return this.hasAttribute('async');
    }

    set async(value: boolean) {
        if (value) {
            this.setAttribute('async', '');
        } else {
            this.removeAttribute('async');
        }
    }

    /**
     * Whether to defer script execution
     */
    get defer(): boolean {
        return this.hasAttribute('defer');
    }

    set defer(value: boolean) {
        if (value) {
            this.setAttribute('defer', '');
        } else {
            this.removeAttribute('defer');
        }
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
     * No module attribute
     */
    get noModule(): boolean {
        return this.hasAttribute('nomodule');
    }

    set noModule(value: boolean) {
        if (value) {
            this.setAttribute('nomodule', '');
        } else {
            this.removeAttribute('nomodule');
        }
    }
}
