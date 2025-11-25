import type { JqElement, JQ } from '../../types';

/**
 * Retrieve the DOM elements matched by the jQuery object.
 * @see https://api.jquery.com/get/
 */
// Overload - get all elements
function get(this: JQ): JqElement[];
// Overload - get element at index
function get(this: JQ, index: number): JqElement | undefined;
// Implementation
function get(this: JQ, index?: number): JqElement[] | JqElement | undefined {
    if (index === undefined) {
        return this.nodes;
    }
    let node: JqElement | undefined;
    if (index < 0) {
        node = this.nodes[this.nodes.length + index];
    } else {
        node = this.nodes[index];
    }
    return node;
}

export default get;
