/**
 * Represents an HTML <textarea> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLTextAreaElement extends JqElement {
    constructor() {
        super('element', 'textarea');
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
     * The current value of the control
     */
    get value(): string {
        return this.textContent || '';
    }

    set value(value: string) {
        this.textContent = value;
    }

    /**
     * Number of visible text rows
     */
    get rows(): number {
        const value = this.getAttribute('rows');
        return value ? parseInt(value, 10) : 2;
    }

    set rows(value: number) {
        this.setAttribute('rows', value.toString());
    }

    /**
     * Visible width of the text control
     */
    get cols(): number {
        const value = this.getAttribute('cols');
        return value ? parseInt(value, 10) : 20;
    }

    set cols(value: number) {
        this.setAttribute('cols', value.toString());
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
     * Maximum length of value
     */
    get maxLength(): number {
        const value = this.getAttribute('maxlength');
        return value ? parseInt(value, 10) : -1;
    }

    set maxLength(value: number) {
        this.setAttribute('maxlength', value.toString());
    }

    /**
     * Minimum length of value
     */
    get minLength(): number {
        const value = this.getAttribute('minlength');
        return value ? parseInt(value, 10) : -1;
    }

    set minLength(value: number) {
        this.setAttribute('minlength', value.toString());
    }

    /**
     * Placeholder text
     */
    get placeholder(): string {
        return this.getAttribute('placeholder') || '';
    }

    set placeholder(value: string) {
        this.setAttribute('placeholder', value);
    }

    /**
     * Whether the field is read-only
     */
    get readOnly(): boolean {
        return this.hasAttribute('readonly');
    }

    set readOnly(value: boolean) {
        if (value) {
            this.setAttribute('readonly', '');
        } else {
            this.removeAttribute('readonly');
        }
    }

    /**
     * Whether the field is required
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
     * How the text should wrap
     */
    get wrap(): string {
        return this.getAttribute('wrap') || '';
    }

    set wrap(value: string) {
        this.setAttribute('wrap', value);
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
