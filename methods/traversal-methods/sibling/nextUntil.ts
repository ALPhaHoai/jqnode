import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { JqElement, CssSelector, JQ, UntilSelector } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets all following siblings up to but not including the element matched by the selector.
 * @see https://api.jquery.com/nextUntil/
 */
function nextUntil(this: JQ, selector?: UntilSelector, filter?: CssSelector): JQ {
    const followingSiblings: JqElement[] = [];
    const parsedStopSelector =
        selector && typeof selector === 'string' ? parseSelector(selector) : null;
    const parsedFilterSelector = filter ? parseSelector(filter) : null;

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const allSiblings = node.parent.children;
            const currentIndex = allSiblings.indexOf(node);

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < allSiblings.length; i++) {
                    const sibling = allSiblings[i];
                    const isElementSibling = sibling.internalType === 'element';

                    if (parsedStopSelector) {
                        const selectorList =
                            'type' in parsedStopSelector && (parsedStopSelector as any).type === 'compound'
                                ? (parsedStopSelector as any).selectors
                                : [parsedStopSelector];
                        if (selectorList.some((sel: any) => nodeMatchesSelector(sibling, sel))) {
                            break;
                        }
                    }
                    if (
                        selector &&
                        typeof selector === 'object' &&
                        selector.internalType === 'element' &&
                        sibling === selector
                    ) {
                        break;
                    }
                    if (
                        selector &&
                        typeof selector === 'object' &&
                        'nodes' in selector &&
                        selector.nodes &&
                        Array.isArray(selector.nodes) &&
                        selector.nodes.includes(sibling)
                    ) {
                        break;
                    }

                    if (!isElementSibling) continue;

                    if (parsedFilterSelector) {
                        const selectorList =
                            'internalType' in parsedFilterSelector &&
                                (parsedFilterSelector as any).internalType === 'compound'
                                ? (parsedFilterSelector as any).selectors
                                : [parsedFilterSelector];
                        if (!selectorList.some((sel: any) => nodeMatchesSelector(sibling, sel))) {
                            continue;
                        }
                    }

                    followingSiblings.push(sibling);
                }
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const jqModule = require('../../../jq');
            const rootNodes = (jqModule.default || jqModule).allRootNodes;
            const currentIndex = rootNodes.indexOf(node);

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < rootNodes.length; i++) {
                    const sibling = rootNodes[i];
                    const isElementSibling = sibling.internalType === 'element';

                    if (parsedStopSelector) {
                        const selectorList =
                            'type' in parsedStopSelector && (parsedStopSelector as any).type === 'compound'
                                ? (parsedStopSelector as any).selectors
                                : [parsedStopSelector];
                        if (selectorList.some((sel: any) => nodeMatchesSelector(sibling, sel))) {
                            break;
                        }
                    }
                    if (
                        selector &&
                        typeof selector === 'object' &&
                        selector.internalType === 'element' &&
                        sibling === selector
                    ) {
                        break;
                    }
                    if (
                        selector &&
                        typeof selector === 'object' &&
                        'nodes' in selector &&
                        selector.nodes &&
                        Array.isArray(selector.nodes) &&
                        selector.nodes.includes(sibling)
                    ) {
                        break;
                    }

                    if (!isElementSibling) continue;

                    if (parsedFilterSelector) {
                        const selectorList =
                            'internalType' in parsedFilterSelector &&
                                (parsedFilterSelector as any).internalType === 'compound'
                                ? (parsedFilterSelector as any).selectors
                                : [parsedFilterSelector];
                        if (!selectorList.some((sel: any) => nodeMatchesSelector(sibling, sel))) {
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
