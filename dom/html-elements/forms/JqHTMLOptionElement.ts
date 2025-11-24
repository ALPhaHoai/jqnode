/**
 * Represents an HTML <option> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLOptionElement extends JqElement {
    constructor() {
        super('element', 'option');
    }

    /**
     * Whether the option is disabled
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
     * The label for the option
     */
    get label(): string {
        return this.getAttribute('label') || this.textContent || '';
    }

    set label(value: string) {
        this.setAttribute('label', value);
    }

    /**
     * Whether the option is selected
     */
    get selected(): boolean {
        return this.hasAttribute('selected');
    }

    set selected(value: boolean) {
        if (value) {
            this.setAttribute('selected', '');
        } else {
            this.removeAttribute('selected');
        }
    }

    /**
     * The value to be submitted
     */
    get value(): string {
        return this.getAttribute('value') || this.textContent || '';
    }

    set value(value: string) {
        this.setAttribute('value', value);
    }

    /**
     * The text content of the option
     */
    get text(): string {
        return this.textContent || '';
    }

    set text(value: string) {
        this.textContent = value;
    }
}
