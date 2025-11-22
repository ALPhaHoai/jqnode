import type { HtmlNode } from '../types';

/**
 * Helper method to find common root nodes for selector matching.
 * @this {object} JQ instance with nodes property
 * @returns Array of root nodes
 */
function _findCommonRoots(this: { nodes: HtmlNode[] }): HtmlNode[] {
    const roots = new Set<HtmlNode>();

    // Walk up from each node to find roots
    for (const node of this.nodes) {
        let current: HtmlNode = node;
        while (current.parent) {
            current = current.parent;
        }
        roots.add(current);
    }

    return Array.from(roots);
}

export = _findCommonRoots;
