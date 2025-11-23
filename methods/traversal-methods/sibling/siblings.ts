import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the siblings of each element in the set of matched elements, optionally filtered by a selector.
  * @see https://api.jquery.com/siblings/
 */
function siblings(this: JQ, selector?: CssSelector): JQ {
    const allSiblings: HtmlNode[] = [];
    const seen = new Set<HtmlNode>();

    // Parse selector if provided
    let parsedSelector = null;
    if (selector) {
        parsedSelector = parseSelector(selector);
    }

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            node.parent.children.forEach((sibling: HtmlNode) => {
                // Exclude the node itself and text nodes
                if (sibling !== node && sibling.type === 'element' && !seen.has(sibling)) {
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

export = siblings;
