/**
 * Represents an HTML <select> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLSelectElement extends JqElement {
    constructor() {
        super('element', 'select');
    }

    /**
     * The name of the control
     */
    get name(): string {
        return this.getAttribute('name') || '';
    }

    set name(value: string) {
        this.setAttribute('name', value);
    }

    /**
     * Whether the control is disabled
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
     * Whether multiple options can be selected
     */
    get multiple(): boolean {
        return this.hasAttribute('multiple');
    }

    set multiple(value: boolean) {
        if (value) {
            this.setAttribute('multiple', '');
        } else {
            this.removeAttribute('multiple');
        }
    }

    /**
     * Whether the control is required
     */
    get required(): boolean {
        return this.hasAttribute('required');
    }

    set required(value: boolean) {
        if (value) {
            this.setAttribute('required', '');
        } else {
            this.removeAttribute('required');
        }
    }

    /**
     * Number of visible options
     */
    get size(): number {
        const value = this.getAttribute('size');
        return value ? parseInt(value, 10) : 0;
    }

    set size(value: number) {
        this.setAttribute('size', value.toString());
    }

    /**
     * Autocomplete hint
     */
    get autocomplete(): string {
        return this.getAttribute('autocomplete') || '';
    }

    set autocomplete(value: string) {
        this.setAttribute('autocomplete', value);
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

    /**
     * The value of the first selected option
     */
    get value(): string {
        // Find first selected option
        const options = this.getElementsByTagName('option');
        for (let i = 0; i < options.length; i++) {
            const option = options[i] as JqElement;
            if (option.hasAttribute('selected')) {
                return option.getAttribute('value') || option.textContent || '';
            }
        }
        return '';
    }

    set value(value: string) {
        // Select the option with matching value
        const options = this.getElementsByTagName('option');
        for (let i = 0; i < options.length; i++) {
            const option = options[i] as JqElement;
            const optValue = option.getAttribute('value') || option.textContent || '';
            if (optValue === value) {
                option.setAttribute('selected', '');
            } else {
                option.removeAttribute('selected');
            }
        }
    }
}
