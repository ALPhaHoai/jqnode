/**
 * Represents an HTML <html> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html
 */

import { JqElement } from './JqElement';

export class JqHTMLHtmlElement extends JqElement {
    constructor() {
        super('element', 'html');
    }

    /**
     * Version of the HTML Document Type Definition (DTD) (obsolete)
     */
    get version(): string {
        return this.getAttribute('version') || '';
    }

    set version(value: string) {
        this.setAttribute('version', value);
    }
}
