/**
 * Create a deep copy of the set of matched elements.
 * 
 * The .clone() method performs a deep copy of the set of matched elements, 
 * meaning that it copies the matched elements as well as all of their 
 * descendant elements and text nodes.
 * 
 * @see https://api.jquery.com/clone/
 * 
 * @param {boolean} [withDataAndEvents=false] - A Boolean indicating whether event handlers 
 *                                               and data should be copied along with the elements.
 * @param {boolean} [deepWithDataAndEvents=value of withDataAndEvents] - A Boolean indicating 
 *                                                                         whether event handlers and data 
 *                                                                         for all children of the cloned element 
 *                                                                         should be copied.
 * @returns {JQ} A new JQ instance containing the cloned elements.
 * 
 * @example
 * // Clone a simple element
 * const $original = jq('<div class="hello">Hello</div>');
 * const $cloned = $original.clone();
 * 
 * @example
 * // Clone with data and events
 * const $elem = jq('<button>Click me</button>');
 * $elem.data('key', 'value');
 * const $cloned = $elem.clone(true); // Clone with data
 * 
 * @example
 * // Clone and append to duplicate elements on a page
 * const $ = jq.load('<div class="container"><div class="hello">Hello</div><div class="goodbye">Goodbye</div></div>');
 * $('.hello').clone().appendTo('.goodbye');
 */
module.exports = function clone(withDataAndEvents = false, deepWithDataAndEvents = withDataAndEvents) {
    // Get the JQ constructor from the instance
    const JQ = this.constructor;
    const _cloneNode = this._cloneNode;

    // Clone all matched elements
    const clonedNodes = this.nodes.map(node => {
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
    return new JQ(clonedNodes);
};

/**
 * Recursively copy data from source node tree to cloned node tree.
 * @param {Object} sourceNode - Original node
 * @param {Object} clonedNode - Cloned node
 * @private
 */
function copyDataRecursive(sourceNode, clonedNode) {
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
