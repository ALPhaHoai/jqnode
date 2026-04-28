/**
 * Represents an HTML <head> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLHeadElement extends JqElement {
    constructor() {
        super('element', 'head');
    }
}
