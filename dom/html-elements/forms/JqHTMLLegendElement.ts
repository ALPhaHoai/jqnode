/**
 * Represents an HTML <legend> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend
 */

import { JqElement } from '../../core/JqElement';

export class JqHTMLLegendElement extends JqElement {
    constructor() {
        super('element', 'legend');
    }

    /**
     * Alignment of the legend (obsolete, use CSS instead)
     */
    get align(): string {
        return this.getAttribute('align') || '';
    }

    set align(value: string) {
        this.setAttribute('align', value);
    }
}
