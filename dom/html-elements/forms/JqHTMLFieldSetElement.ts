/**
 * Represents an HTML <fieldset> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLFieldSetElement extends JqElement {
    constructor() {
        super('element', 'fieldset');
    }

    /**
     * Whether the fieldset is disabled
     */
    get disabled(): boolean {
        return this.hasAttribute('disabled');
    }

    set disabled(value: boolean) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    /**
     * The name of the fieldset
     */
    get name(): string {
        return this.getAttribute('name') || '';
    }

    set name(value: string) {
        this.setAttribute('name', value);
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
