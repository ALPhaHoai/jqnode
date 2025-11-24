/**
 * Represents an HTML <style> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLStyleElement extends JqElement {
    constructor() {
        super('element', 'style');
    }

    /**
     * Media query for the styles
     */
    get media(): string {
        return this.getAttribute('media') || '';
    }

    set media(value: string) {
        this.setAttribute('media', value);
    }

    /**
     * The type of style (obsolete, always text/css)
     */
    get type(): string {
        return this.getAttribute('type') || 'text/css';
    }

    set type(value: string) {
        this.setAttribute('type', value);
    }
}
