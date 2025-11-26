/**
 * Represents an HTML <button> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLButtonElement extends JqElement {
    constructor() {
        super('element', 'button');
    }

    /**
     * The type of button
     */
    override get type(): string {
        return this.getAttribute('type') || 'submit';
    }

    override set type(value: string) {
        this.setAttribute('type', value);
    }

    /**
     * The name of the button (HTML name attribute)
     */
    get name(): string {
        return this.getAttribute('name') || '';
    }

    set name(value: string) {
        this.setAttribute('name', value);
    }

    /**
     * The value of the button
     */
    get value(): string {
        return this.getAttribute('value') || '';
    }

    set value(value: string) {
        this.setAttribute('value', value);
    }

    /**
     * Whether the button is disabled
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

    /**
     * Form action override
     */
    get formAction(): string {
        return this.getAttribute('formaction') || '';
    }

    set formAction(value: string) {
        this.setAttribute('formaction', value);
    }

    /**
     * Form method override
     */
    get formMethod(): string {
        return this.getAttribute('formmethod') || '';
    }

    set formMethod(value: string) {
        this.setAttribute('formmethod', value);
    }

    /**
     * Form target override
     */
    get formTarget(): string {
        return this.getAttribute('formtarget') || '';
    }

    set formTarget(value: string) {
        this.setAttribute('formtarget', value);
    }
}
