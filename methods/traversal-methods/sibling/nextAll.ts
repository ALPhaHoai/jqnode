import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { CssSelector, JQ } from '../../../types';
import { HtmlNode } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets all following siblings of each element, optionally filtered by a selector.
 * @see https://api.jquery.com/nextAll/
 */
function nextAll(this: JQ, selector?: CssSelector): JQ {
    const followingSiblings: HtmlNode[] = [];
    const seen = new Set<HtmlNode>();

    for (const node of this.nodes) {
        if (node._originalElement) {
            // Use DOM traversal for elements with _originalElement
            let sibling = node._originalElement.nextElementSibling;
            while (sibling) {
                if (!seen.has(sibling as any)) {
                    seen.add(sibling as any);
                    // Create attributes object
                    const attributes: Record<string, string> = {};
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        attributes[attr.name] = attr.value;
                    }

                    // Populate children from DOM childNodes
                    const children: HtmlNode[] = [];
                    for (let i = 0; i < sibling.childNodes.length; i++) {
                        const child = sibling.childNodes[i];
                        if (child.nodeType === 3) {
                            // Text node
                            const textNode = new HtmlNode('text');
                            textNode.textData = child.textContent || '';
                            children.push(textNode);
                        } else if (child.nodeType === 1) {
                            // Element node - add placeholder, will be processed if needed
                            const elemNode = new HtmlNode('element', (child as Element).tagName.toLowerCase());
                            elemNode._originalElement = child as Element;
                            children.push(elemNode);
                        }
                    }

                    const internalNode = new HtmlNode('element', sibling.tagName.toLowerCase());
                    internalNode.attributes._setData(attributes);
                    internalNode.children = children;
                    internalNode._originalElement = sibling;
                    followingSiblings.push(internalNode);
                }
                sibling = sibling.nextElementSibling;
            }
        } else if (node.parent && node.parent.children) {
            const siblings = node.parent.children.filter(
                (child: HtmlNode) => child.internalType === 'element',
            );
            const currentIndex = siblings.indexOf(node);

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < siblings.length; i++) {
                    const sibling = siblings[i];
                    if (!seen.has(sibling)) {
                        seen.add(sibling);
                        followingSiblings.push(sibling);
                    }
                }
            }
        }
    }

    let resultNodes = followingSiblings;

    if (selector) {
        const parsedSelector = parseSelector(selector);
        if (parsedSelector) {
            resultNodes = followingSiblings.filter((sibling: HtmlNode) => {
                const selectorList =
                    'type' in parsedSelector && parsedSelector.type === 'compound'
                        ? parsedSelector.selectors
                        : [parsedSelector];
                return selectorList.some((sel) => nodeMatchesSelector(sibling, sel));
            });
        }
    }
    return new JQClass(resultNodes);
}

export = nextAll;
