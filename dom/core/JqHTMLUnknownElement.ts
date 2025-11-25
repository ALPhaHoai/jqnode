/**
 * Class for unknown/unrecognized HTML elements (elements without hyphen in tag name)
 * Matches the HTML5 HTMLUnknownElement interface
 * 
 * @example
 * const elem = document.createElement('foobar');
 * elem.constructor.name // "HTMLUnknownElement"
 */

import { JqElement } from './JqElement';

/**
 * Represents an unknown HTML element (tag name does NOT contain a hyphen).
 * In HTML5, unrecognized element names that don't contain hyphens are treated
 * as unknown elements and return HTMLUnknownElement as their constructor.
 * 
 * This is distinct from custom elements (which have hyphens) and ensures
 * proper type identification for invalid or non-standard element names.
 */
export class JqHTMLUnknownElement extends JqElement {
    constructor(tagName: string) {
        super('element', tagName);
    }
}
