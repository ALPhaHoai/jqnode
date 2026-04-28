import type { JqElement, JQ } from '../../types';

/**
 * Adds and/or removes elements from the set of matched elements.
 */
function splice(this: JQ, start: number, deleteCount?: number, ...items: JqElement[]): JqElement[] {
    if (deleteCount === undefined) {
        return this.nodes.splice(start);
    }
    return this.nodes.splice(start, deleteCount, ...items);
}

export default splice;
