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
     * The name of the fieldset (HTML name attribute)
     */
    override get name(): string {
        return this.getAttribute('name') || '';
    }

    override set name(value: string) {
        this.setAttribute('name', value);
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
     * Associated form ID
     */
    get form(): string {
        return this.getAttribute('form') || '';
    }

    set form(value: string) {
        this.setAttribute('form', value);
    }
}
