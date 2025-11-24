/**
 * Represents an HTML <body> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLBodyElement extends JqElement {
    constructor() {
        super('element', 'body');
    }

    // Event handler properties would typically be defined here
    // (onload, onunload, onbeforeunload, etc.)
    // These are handled through the standard event system in practice
}
