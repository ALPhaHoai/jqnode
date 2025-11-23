import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { HtmlNode, CssSelector, JQ, UntilSelector } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets all following siblings up to but not including the element matched by the selector.
 */
function nextUntil(this: JQ, selector?: UntilSelector, filter?: CssSelector): JQ {
    const followingSiblings: HtmlNode[] = [];
    const parsedStopSelector = selector && typeof selector === 'string' ? parseSelector(selector) : null;
    const parsedFilterSelector = filter ? parseSelector(filter) : null;

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const allSiblings = node.parent.children;
            const currentIndex = allSiblings.indexOf(node);

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < allSiblings.length; i++) {
                    const sibling = allSiblings[i];
                    const isElementSibling = sibling.type === 'element';

                    if (parsedStopSelector) {
                        const selectorList = ('type' in parsedStopSelector && parsedStopSelector.type === 'compound') ? parsedStopSelector.selectors : [parsedStopSelector];
                        if (selectorList.some((sel) => nodeMatchesSelector(sibling, sel))) {
                            break;
                        }
                    }
                    if (selector && typeof selector === 'object' && selector.type === 'element' && sibling === selector) {
                        break;
                    }
                    if (selector && typeof selector === 'object' && 'nodes' in selector && selector.nodes && Array.isArray(selector.nodes) && selector.nodes.includes(sibling)) {
                        break;
                    }

                    if (!isElementSibling) continue;

                    if (parsedFilterSelector) {
                        const selectorList = ('type' in parsedFilterSelector && parsedFilterSelector.type === 'compound') ? parsedFilterSelector.selectors : [parsedFilterSelector];
                        if (!selectorList.some((sel) => nodeMatchesSelector(sibling, sel))) {
                            continue;
                        }
                    }

                    followingSiblings.push(sibling);
                }
            }
        } else {
            const jqModule = require('../../../jq');
            const rootNodes = (jqModule.default || jqModule).allRootNodes;
            const currentIndex = rootNodes.indexOf(node);

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < rootNodes.length; i++) {
                    const sibling = rootNodes[i];
                    const isElementSibling = sibling.type === 'element';

                    if (parsedStopSelector) {
                        const selectorList = ('type' in parsedStopSelector && parsedStopSelector.type === 'compound') ? parsedStopSelector.selectors : [parsedStopSelector];
                        if (selectorList.some((sel) => nodeMatchesSelector(sibling, sel))) {
                            break;
                        }
                    }
                    if (selector && typeof selector === 'object' && selector.type === 'element' && sibling === selector) {
                        break;
                    }
                    if (selector && typeof selector === 'object' && 'nodes' in selector && selector.nodes && Array.isArray(selector.nodes) && selector.nodes.includes(sibling)) {
                        break;
                    }

                    if (!isElementSibling) continue;

                    if (parsedFilterSelector) {
                        const selectorList = ('type' in parsedFilterSelector && parsedFilterSelector.type === 'compound') ? parsedFilterSelector.selectors : [parsedFilterSelector];
                        if (!selectorList.some((sel) => nodeMatchesSelector(sibling, sel))) {
                            continue;
                        }
                    }

                    followingSiblings.push(sibling);
                }
            }
        }
    }
    return new JQClass(followingSiblings);
}

export = nextUntil;
