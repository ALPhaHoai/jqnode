/**
 * Represents HTML heading elements <h1> through <h6>
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
 */

import { JqElement } from './JqElement';

export class JqHTMLHeadingElement extends JqElement {
    constructor(level: 1 | 2 | 3 | 4 | 5 | 6 = 1) {
        super('element', `h${level}`);
    }

    /**
     * Alignment of the heading (obsolete, use CSS instead)
     */
    get align(): string {
        return this.getAttribute('align') || '';
    }

    set align(value: string) {
        this.setAttribute('align', value);
    }
}
