/**
 * Represents an HTML <dl> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
 */

import { JqElement } from './JqElement';

export class JqHTMLDListElement extends JqElement {
    constructor() {
        super('element', 'dl');
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
}
