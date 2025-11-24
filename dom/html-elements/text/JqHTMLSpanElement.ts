/**
 * Represents an HTML <span> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLSpanElement extends JqElement {
    constructor() {
        super('element', 'span');
    }
}
