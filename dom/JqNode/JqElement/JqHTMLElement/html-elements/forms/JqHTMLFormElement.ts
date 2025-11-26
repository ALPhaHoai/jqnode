/**
 * Represents an HTML <form> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLFormElement extends JqElement {
    constructor() {
        super('element', 'form');
    }

    /**
     * The URL that processes the form submission
     */
    get action(): string {
        return this.getAttribute('action') || '';
    }

    set action(value: string) {
        this.setAttribute('action', value);
    }

    /**
     * The HTTP method to submit the form with
     */
    get method(): string {
        return this.getAttribute('method') || 'get';
    }

    set method(value: string) {
        this.setAttribute('method', value);
    }

    /**
     * The encoding type for the form submission
     */
    get enctype(): string {
        return this.getAttribute('enctype') || 'application/x-www-form-urlencoded';
    }

    set enctype(value: string) {
        this.setAttribute('enctype', value);
    }

    /**
     * The name of the form
     */
    get name(): string {
        return this.getAttribute('name') || '';
    }

    set name(value: string) {
        this.setAttribute('name', value);
    }

    /**
     * Where to display the response
     */
    get target(): string {
        return this.getAttribute('target') || '';
    }

    set target(value: string) {
        this.setAttribute('target', value);
    }

    /**
     * Whether to bypass form validation
     */
    get noValidate(): boolean {
        return this.hasAttribute('novalidate');
    }

    set noValidate(value: boolean) {
        if (value) {
            this.setAttribute('novalidate', '');
        } else {
            this.removeAttribute('novalidate');
        }
    }

    /**
     * Autocomplete setting
     */
    get autocomplete(): string {
        return this.getAttribute('autocomplete') || '';
    }

    set autocomplete(value: string) {
        this.setAttribute('autocomplete', value);
    }

    /**
     * Character encodings to use for form submission
     */
    get acceptCharset(): string {
        return this.getAttribute('accept-charset') || '';
    }

    set acceptCharset(value: string) {
        this.setAttribute('accept-charset', value);
    }
}
