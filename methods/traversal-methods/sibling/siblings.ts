import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { JqElement, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the siblings of each element in the set of matched elements, optionally filtered by a selector.
 * @see https://api.jquery.com/siblings/
 */
function siblings(this: JQ, selector?: CssSelector): JQ {
    const allSiblings: JqElement[] = [];
    const seen = new Set<JqElement>();

    // Parse selector if provided
    let parsedSelector = null;
    if (selector) {
        parsedSelector = parseSelector(selector);
    }

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            node.parent.children.forEach((sibling: JqElement) => {
                // Exclude the node itself and text nodes
                if (sibling !== node && sibling.internalType === 'element' && !seen.has(sibling)) {
                    seen.add(sibling);

                    let shouldInclude = true;
                    if (parsedSelector) {
                        if (!nodeMatchesSelector(sibling, parsedSelector)) {
                            shouldInclude = false;
                        }
                    }

                    if (shouldInclude) {
                        allSiblings.push(sibling);
                    }
                }
            });
        }
    }
    return new JQClass(allSiblings);
}

export default siblings;
