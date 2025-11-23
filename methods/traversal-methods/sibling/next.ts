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
                if (selector) {
                    const parsedSelector = parseSelector(selector);
                    if (parsedSelector) {
                        for (let i = currentIndex + 1; i < siblings.length; i++) {
                            const sibling = siblings[i];
                            const selectorList =
                                'type' in parsedSelector && parsedSelector.type === 'compound'
                                    ? parsedSelector.selectors
                                    : [parsedSelector];
                            if (selectorList.some((sel) => nodeMatchesSelector(sibling, sel))) {
                                nextSiblings.push(sibling);
                                break;
                            }
                        }
                    }
                } else {
                    if (currentIndex < siblings.length - 1) {
                        nextSiblings.push(siblings[currentIndex + 1]);
                    }
                }
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const rootNodes = require('../../../jq').allRootNodes;
            const currentIndex = rootNodes.indexOf(node);

            if (currentIndex !== -1) {
                if (selector) {
                    const parsedSelector = parseSelector(selector);
                    if (parsedSelector) {
                        for (let i = currentIndex + 1; i < rootNodes.length; i++) {
                            const sibling = rootNodes[i];
                            if (sibling.type === 'element') {
                                const selectorList =
                                    'type' in parsedSelector && parsedSelector.type === 'compound'
                                        ? parsedSelector.selectors
                                        : [parsedSelector];
                                if (selectorList.some((sel) => nodeMatchesSelector(sibling, sel))) {
                                    nextSiblings.push(sibling);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    for (let i = currentIndex + 1; i < rootNodes.length; i++) {
                        const sibling = rootNodes[i];
                        if (sibling.type === 'element') {
                            nextSiblings.push(sibling);
                            break;
                        }
                    }
                }
            }
        }
    }
    return new JQClass(nextSiblings);
}

export = next;
