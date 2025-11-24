import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { CssSelector, JQ } from '../../../types';
import { HtmlNode } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets all preceding siblings of each element, optionally filtered by a selector.
 * @see https://api.jquery.com/prevAll/
 */
function prevAll(this: JQ, selector?: CssSelector): JQ {
    const allPrecedingSiblings: HtmlNode[] = [];

    // Parse selector if provided
    let parsedSelector = null;
    if (selector) {
        parsedSelector = parseSelector(selector);
    }

    for (const node of this.nodes) {
        if (node._originalElement) {
            const element = node._originalElement;
            let sibling = element.previousElementSibling;

            while (sibling) {
                let shouldInclude = true;
                if (parsedSelector) {
                    const selectorList =
                        'type' in parsedSelector && parsedSelector.type === 'compound'
                            ? parsedSelector.selectors
                            : [parsedSelector];
                    const tempNode = new HtmlNode('element', sibling.tagName.toLowerCase());
                    const attrs: Record<string, string> = {};
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        attrs[attr.name] = attr.value;
                    }
                    tempNode.attributes._setData(attrs);
                    tempNode._originalElement = sibling;
                    if (!selectorList.some((sel) => nodeMatchesSelector(tempNode, sel))) {
                        shouldInclude = false;
                    }
                }

                if (shouldInclude) {
                    const internalNode = new HtmlNode('element', sibling.tagName.toLowerCase());
                    const attrs: Record<string, string> = {};
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        attrs[attr.name] = attr.value;
                    }
                    internalNode.attributes._setData(attrs);
                    internalNode._originalElement = sibling;
                    allPrecedingSiblings.push(internalNode);
                }

                sibling = sibling.previousElementSibling;
            }
        } else if (node.parent && node.parent.children) {
            const siblings = node.parent.children;
            const nodeIndex = siblings.indexOf(node);

            for (let i = 0; i < nodeIndex; i++) {
                const sibling = siblings[i];
                if (sibling.internalType === 'element') {
                    let shouldInclude = true;
                    if (parsedSelector) {
                        if (!nodeMatchesSelector(sibling, parsedSelector)) {
                            shouldInclude = false;
                        }
                    }
                    if (shouldInclude) {
                        allPrecedingSiblings.push(sibling);
                    }
                }
            }
        }
    }

    // Remove duplicates while preserving order
    const uniqueSiblings: HtmlNode[] = [];
    const seen = new Set<HtmlNode>();
    for (const sibling of allPrecedingSiblings) {
        if (!seen.has(sibling)) {
            seen.add(sibling);
            uniqueSiblings.push(sibling);
        }
    }
    return new JQClass(uniqueSiblings);
}

export = prevAll;

