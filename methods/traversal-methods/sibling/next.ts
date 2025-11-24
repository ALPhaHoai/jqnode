import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the immediately following sibling of each element, optionally filtered by a selector.
 * @see https://api.jquery.com/next/
 */
function next(this: JQ, selector?: CssSelector): JQ {
    const nextSiblings: HtmlNode[] = [];

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const siblings = node.parent.children.filter(
                (child: HtmlNode) => child.type === 'element',
            );
            const currentIndex = siblings.indexOf(node);

            if (currentIndex !== -1) {
                // Check if there's a next sibling
                if (currentIndex < siblings.length - 1) {
                    const nextSibling = siblings[currentIndex + 1];

                    if (selector) {
                        // With selector: only return if immediate next sibling matches
                        const parsedSelector = parseSelector(selector);
                        if (parsedSelector) {
                            const selectorList =
                                'type' in parsedSelector && parsedSelector.type === 'compound'
                                    ? parsedSelector.selectors
                                    : [parsedSelector];
                            if (selectorList.some((sel) => nodeMatchesSelector(nextSibling, sel))) {
                                nextSiblings.push(nextSibling);
                            }
                        }
                    } else {
                        // Without selector: return immediate next sibling
                        nextSiblings.push(nextSibling);
                    }
                }
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const rootNodes = require('../../../jq').allRootNodes;
            const currentIndex = rootNodes.indexOf(node);

            if (currentIndex !== -1) {
                // Find immediate next element sibling
                let nextElementSibling = null;
                for (let i = currentIndex + 1; i < rootNodes.length; i++) {
                    const sibling = rootNodes[i];
                    if (sibling.type === 'element') {
                        nextElementSibling = sibling;
                        break;
                    }
                }

                if (nextElementSibling) {
                    if (selector) {
                        // With selector: only return if immediate next sibling matches
                        const parsedSelector = parseSelector(selector);
                        if (parsedSelector) {
                            const selectorList =
                                'type' in parsedSelector && parsedSelector.type === 'compound'
                                    ? parsedSelector.selectors
                                    : [parsedSelector];
                            if (selectorList.some((sel) => nodeMatchesSelector(nextElementSibling, sel))) {
                                nextSiblings.push(nextElementSibling);
                            }
                        }
                    } else {
                        // Without selector: return immediate next sibling
                        nextSiblings.push(nextElementSibling);
                    }
                }
            }
        }
    }
    return new JQClass(nextSiblings);
}

export = next;
