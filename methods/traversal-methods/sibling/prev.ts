import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { JqElement, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the immediately preceding sibling of each element, optionally filtered by a selector.
 * @see https://api.jquery.com/prev/
 */
function prev(this: JQ, selector?: CssSelector): JQ {
    const prevSiblings: JqElement[] = [];

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const allChildren = node.parent.children;
            const currentIndex = allChildren.indexOf(node);

            if (currentIndex > 0) {
                // Find immediate previous element sibling
                let prevElementSibling = null;
                for (let i = currentIndex - 1; i >= 0; i--) {
                    const sibling = allChildren[i];
                    if (sibling.internalType === 'element') {
                        prevElementSibling = sibling;
                        break;
                    }
                }

                if (prevElementSibling) {
                    if (selector) {
                        // With selector: only return if immediate prev sibling matches
                        const parsedSelector = parseSelector(selector);
                        if (
                            parsedSelector &&
                            nodeMatchesSelector(prevElementSibling, parsedSelector)
                        ) {
                            prevSiblings.push(prevElementSibling);
                        }
                    } else {
                        // Without selector: return immediate prev sibling
                        prevSiblings.push(prevElementSibling);
                    }
                }
            }
        }
    }
    return new JQClass(prevSiblings);
}

export = prev;
