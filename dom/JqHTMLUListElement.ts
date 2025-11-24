/**
 * Represents an HTML <ul> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
 */

import { JqElement } from './JqElement';

export class JqHTMLUListElement extends JqElement {
    constructor() {
        super('element', 'ul');
    }

    /**
     * Whether the list should be compacted (obsolete, use CSS instead)
     */
    get compact(): boolean {
        return this.hasAttribute('compact');
    }

    set compact(value: boolean) {
        if (value) {
            this.setAttribute('compact', '');
        } else {
            this.removeAttribute('compact');
        }
    }

    /**
     * Type of bullet (obsolete, use CSS instead)
     */
    get type(): string {
        return this.getAttribute('type') || '';
    }

    set type(value: string) {
        this.setAttribute('type', value);
    }
}
