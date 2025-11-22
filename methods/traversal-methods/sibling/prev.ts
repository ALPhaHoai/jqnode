import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../../types';

/**
 * Gets the immediately preceding sibling of each element, optionally filtered by a selector.
 */
function prev(this: JQ, selector?: CssSelector): JQ {
    const prevSiblings: HtmlNode[] = [];

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const allChildren = node.parent.children;
            const currentIndex = allChildren.indexOf(node);

            if (currentIndex > 0) {
                if (selector) {
                    const parsedSelector = parseSelector(selector);
                    if (parsedSelector) {
                        for (let i = currentIndex - 1; i >= 0; i--) {
                            const sibling = allChildren[i];
                            if (sibling.type === 'element' && nodeMatchesSelector(sibling, parsedSelector)) {
                                prevSiblings.push(sibling);
                                break;
                            }
                        }
                    }
                } else {
                    for (let i = currentIndex - 1; i >= 0; i--) {
                        const sibling = allChildren[i];
                        if (sibling.type === 'element') {
                            prevSiblings.push(sibling);
                            break;
                        }
                    }
                }
            }
        }
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = prevSiblings;
    result.length = prevSiblings.length;
    return result;
}

export = prev;
