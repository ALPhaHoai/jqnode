import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets all following siblings of each element, optionally filtered by a selector.
 */
function nextAll(this: JQ, selector?: CssSelector): JQ {
    const followingSiblings: HtmlNode[] = [];
    const seen = new Set<HtmlNode>();

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const siblings = node.parent.children.filter((child: HtmlNode) => child.type === 'element');
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
                const selectorList = ('type' in parsedSelector && parsedSelector.type === 'compound') ? parsedSelector.selectors : [parsedSelector];
                return selectorList.some((sel) => nodeMatchesSelector(sibling, sel));
            });
        }
    }
    return new JQClass(resultNodes);
}

export = nextAll;
