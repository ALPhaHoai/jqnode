import type { HtmlNode, JQ } from '../../types';

/**
 * Recursively copy data from source node tree to cloned node tree.
 */
function copyDataRecursive(sourceNode: HtmlNode, clonedNode: HtmlNode): void {
    // Copy data from source children to cloned children
    if (sourceNode.children && clonedNode.children &&
        sourceNode.children.length === clonedNode.children.length) {

        for (let i = 0; i < sourceNode.children.length; i++) {
            const sourceChild = sourceNode.children[i];
            const clonedChild = clonedNode.children[i];

            // Copy data for this child
            if (sourceChild._jqData) {
                clonedChild._jqData = { ...sourceChild._jqData };
            }

            // Recurse into descendants
            copyDataRecursive(sourceChild, clonedChild);
        }
    }
}

/**
 * Create a deep copy of the set of matched elements.
 */
function clone(this: JQ, withDataAndEvents: boolean = false, deepWithDataAndEvents: boolean = withDataAndEvents): JQ {
    // Use the helper to perform deep clone
    const _cloneNode = this._cloneNode;

    // Clone all matched elements
    const clonedNodes = this.nodes.map((node: HtmlNode) => {
        // Use the helper to perform deep clone
        const clonedNode = _cloneNode(node);

        // Copy data if requested
        if (withDataAndEvents && node._jqData) {
            clonedNode._jqData = { ...node._jqData };

            // Deep copy data for children if requested
            if (deepWithDataAndEvents) {
                copyDataRecursive(node, clonedNode);
            }
        }

        return clonedNode;
    });

    // Return a new JQ instance with the cloned nodes
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = clonedNodes;
    result.length = clonedNodes.length;
    return result;
}

export = clone;
