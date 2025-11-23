import type { HtmlNode, JQ } from '../../types';

/**
 * Remove the set of matched elements from the DOM.
 * @see https://api.jquery.com/remove/
 */
function remove(this: JQ, selector?: string): JQ {
    let nodesToRemove: HtmlNode[] = this.nodes;

    // If selector is provided, filter nodes
    if (selector) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const JQ = require('../../jq').default;
        const filtered = new JQ(this.nodes).filter(selector);
        nodesToRemove = filtered.nodes;
    }

    // Remove each node from its parent
    nodesToRemove.forEach((node: HtmlNode) => {
        if (!node) return;

        const parent = node.parent || node.parentNode;
        if (!parent) return;

        // For internal nodes
        if (parent.children && Array.isArray(parent.children)) {
            const index = parent.children.indexOf(node);
            if (index !== -1) {
                parent.children.splice(index, 1);
            }
        }
        // For DOM nodes
        else if (parent.childNodes && parent.removeChild) {
            parent.removeChild(node as unknown as Node);
        }

        // Clear data associated with the node
        if (node._jqData) {
            delete node._jqData;
        }
    });

    return this;
}

export = remove;
