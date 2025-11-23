import type { HtmlNode } from '../types';

/**
 * Helper method to deep clone a node.
 * @param node - Node to clone
 * @param deep - Whether to deep clone (defaults to true)
 * @returns Cloned node
 */
function _cloneNode(
    node: HtmlNode | null | undefined,
    deep: boolean = true,
): HtmlNode | null | undefined {
    if (!node) return node;

    // attributes and attribs are the same object, so only clone once
    const clonedAttribs = node.attribs ? { ...node.attribs } : undefined;

    const cloned: HtmlNode = {
        type: node.type,
        name: node.name,
        tagName: node.tagName || node.name, // Preserve tagName, fallback to name
        data: node.data,
        attribs: clonedAttribs,
        attributes: clonedAttribs, // attributes and attribs reference the same object
        children:
            deep && node.children
                ? node.children.map((child) => _cloneNode(child, deep) as HtmlNode)
                : undefined,
    };

    // Set parent references for cloned children
    if (cloned.children) {
        for (const child of cloned.children) {
            child.parent = cloned;
        }
    }

    return cloned;
}

export = _cloneNode;
