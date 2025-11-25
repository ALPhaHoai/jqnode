/**
 * Represents an HTML <input> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLInputElement extends JqElement {
    constructor() {
        super('element', 'input');
    }

    /**
     * The type of control to display
     */
    override get type(): string {
        return this.getAttribute('type') || 'text';
    }

    override set type(value: string) {
        this.setAttribute('type', value);
    }

    /**
     * The name of the input (HTML name attribute)
     */
    override get name(): string {
        return this.getAttribute('name') || '';
    }

    override set name(value: string) {
        this.setAttribute('name', value);
    }

    /**
     * The current value of the control
     */
    get value(): string {
        return this.getAttribute('value') || '';
    }

    set value(value: string) {
        this.setAttribute('value', value);
    }

    /**
     * Whether the control is checked (for checkbox/radio)
     */
    get checked(): boolean {
        return this.hasAttribute('checked');
    }

    set checked(value: boolean) {
        if (value) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
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
     * Pattern for validation
     */
    get pattern(): string {
        return this.getAttribute('pattern') || '';
    }

    set pattern(value: string) {
        this.setAttribute('pattern', value);
    }

    /**
     * Minimum value
     */
    get min(): string {
        return this.getAttribute('min') || '';
    }

    set min(value: string) {
        this.setAttribute('min', value);
    }

    /**
     * Maximum value
     */
    get max(): string {
        return this.getAttribute('max') || '';
    }

    set max(value: string) {
        this.setAttribute('max', value);
    }

    /**
     * Step value for numeric inputs
     */
    get step(): string {
        return this.getAttribute('step') || '';
    }

    set step(value: string) {
        this.setAttribute('step', value);
    }

    /**
     * Accepted file types
     */
    get accept(): string {
        return this.getAttribute('accept') || '';
    }

    set accept(value: string) {
        this.setAttribute('accept', value);
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
     * Multiple file selection
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
     * Size of the control
     */
    get size(): number {
        const value = this.getAttribute('size');
        return value ? parseInt(value, 10) : 20;
    }

    set size(value: number) {
        this.setAttribute('size', value.toString());
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
     * List attribute for datalist
     */
    get list(): string {
        return this.getAttribute('list') || '';
    }

    set list(value: string) {
        this.setAttribute('list', value);
    }
}
