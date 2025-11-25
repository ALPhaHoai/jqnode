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

    // Determine the node type - support both internalType (JqElement) and type (plain objects)
    const nodeType = (node as any).internalType || (node as any).type || 'element';
    const nodeName = (node as any).name || '';

    // Clone attributes - handle both JqNamedNodeMap and plain objects
    let clonedAttribs: Record<string, any> = {};
    if (node.attributes && typeof node.attributes === 'object') {
        // If it's a JqNamedNodeMap with _getData method
        if ('_getData' in node.attributes && typeof node.attributes._getData === 'function') {
            clonedAttribs = node.attributes._getData();
        } else {
            // Otherwise it's a plain object, shallow copy it
            clonedAttribs = { ...node.attributes };
        }
    }

    const cloned = new JqElement(nodeType, nodeName);
    cloned.tagName = node.tagName || nodeName;
    // Copy textData from node.textData or node.data (for plain objects)
    cloned.textData = node.textData || (node as any).data || '';

    // Set attributes on the cloned node
    if (Object.keys(clonedAttribs).length > 0 && cloned.attributes && '_setData' in cloned.attributes) {
        cloned.attributes._setData(clonedAttribs);
    }

    // Copy nodeType if it exists
    if (node.nodeType) {
        cloned.nodeType = node.nodeType;
    }

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

export default _cloneNode;
