/**
 * Represents an HTML <ol> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLOListElement extends JqElement {
    constructor() {
        super('element', 'ol');
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
     * Whether the list order should be reversed
     */
    get reversed(): boolean {
        return this.hasAttribute('reversed');
    }

    set reversed(value: boolean) {
        if (value) {
            this.setAttribute('reversed', '');
        } else {
            this.removeAttribute('reversed');
        }
    }

    /**
     * Starting value for numbering
     */
    get start(): number {
        const value = this.getAttribute('start');
        return value ? parseInt(value, 10) : 1;
    }

    set start(value: number) {
        this.setAttribute('start', value.toString());
    }

    /**
     * Type of numbering
     */
    override get type(): string {
        return this.getAttribute('type') || '';
    }

    override set type(value: string) {
        this.setAttribute('type', value);
    }
}
