/**
 * Represents an HTML <li> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLLIElement extends JqElement {
    constructor() {
        super('element', 'li');
    }

    /**
     * The ordinal value of the list item
     */
    get value(): number {
        const value = this.getAttribute('value');
        return value ? parseInt(value, 10) : 0;
    }

    set value(value: number) {
        this.setAttribute('value', value.toString());
    }

    /**
     * Type of bullet or numbering (obsolete, use CSS instead)
     */
    override get type(): string {
        return this.getAttribute('type') || '';
    }

    override set type(value: string) {
        this.setAttribute('type', value);
    }
}
