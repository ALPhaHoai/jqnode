/**
 * Represents an HTML <label> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLLabelElement extends JqElement {
    constructor() {
        super('element', 'label');
    }

    /**
     * The ID of the form control this label is associated with
     */
    get htmlFor(): string {
        return this.getAttribute('for') || '';
    }

    set htmlFor(value: string) {
        this.setAttribute('for', value);
    }

    /**
     * Associated form ID
     */
    get form(): string {
        return this.getAttribute('form') || '';
    }

    set form(value: string) {
        this.setAttribute('form', value);
    }
}
