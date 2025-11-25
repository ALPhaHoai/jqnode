/**
 * Base class for custom HTML elements (elements with hyphen in tag name)
 * Matches the HTML5 HTMLElement interface for custom elements
 * 
 * @example
 * const elem = document.createElement('my-custom-element');
 * elem.constructor.name // "HTMLElement"
 */

import { JqElement } from './JqElement';

/**
 * Represents a custom HTML element (tag name contains a hyphen).
 * In HTML5, elements with hyphens in their tag names are treated as custom elements
 * and return HTMLElement as their constructor.
 * 
 * This class provides compatibility with Web Components and custom element APIs.
 */
export class JqHTMLElement extends JqElement {
    constructor(tagName: string) {
        super('element', tagName);
    }
}
