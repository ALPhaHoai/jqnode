import { JqElement } from '../types';

/**
 * Helper method to deep clone a node.
 * @param node - Node to clone
 * @param deep - Whether to deep clone (defaults to true)
 * @returns Cloned node
 */
function _cloneNode(
    node: JqElement | null | undefined,
    deep: boolean = true,
): JqElement | null | undefined {
    if (!node) return node;

    // Clone attributes using JqNamedNodeMap
    const clonedAttribs = node.attributes._getData();

    const cloned = new JqElement(node.internalType, node.name);
    cloned.tagName = node.tagName || node.name;
    cloned.textData = node.textData;
    cloned.attributes._setData(clonedAttribs);

    // Copy other properties (but not _originalElement to ensure true clones)
    cloned.value = node.value;
    cloned.nodeType = node.nodeType;

    if (deep && node.children) {
        cloned.children = node.children.map((child) => _cloneNode(child, deep) as JqElement);

        // Set parent references for cloned children
        for (const child of cloned.children) {
            child.parent = cloned;
        }
    } else {
        cloned.children = [];
    }

    return cloned;
}

export = _cloneNode;
