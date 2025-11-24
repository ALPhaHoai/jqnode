import type { JqElement, JQ } from '../../types';

/**
 * Retrieve the DOM elements matched by the jQuery object.
 * @see https://api.jquery.com/get/
 */
function get(this: JQ, index?: number): (JqElement | Element)[] | JqElement | Element | undefined {
    if (index === undefined) {
        return this.nodes.map((node: JqElement) => node._originalElement || node);
    }
    let node: JqElement | undefined;
    if (index < 0) {
        node = this.nodes[this.nodes.length + index];
    } else {
        node = this.nodes[index];
    }
    return node ? node._originalElement || node : undefined;
}

export = get;
