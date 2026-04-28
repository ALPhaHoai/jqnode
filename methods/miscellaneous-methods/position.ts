import type { JqElement, JQ } from '../../types';

/**
 * Get the current coordinates of the first element in the set of matched elements, relative to the offset parent.
 * @see https://api.jquery.com/position/
 */
function position(this: JQ): { top: number; left: number } | undefined {
    if (this.nodes.length === 0) {
        return undefined;
    }

    const node: JqElement = this.nodes[0];

    // For browser DOM elements
    if (typeof document !== 'undefined' && node.nodeType === 1) {
        const elem = node;

        const top = elem.offsetTop || 0;
        const left = elem.offsetLeft || 0;

        return { top, left };
    }

    // For internal nodes (server-side), return default position
    return { top: 0, left: 0 };
}

export default position;
