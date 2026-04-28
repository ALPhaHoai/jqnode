import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { CssSelector, JQ, UntilSelector } from '../../../types';
import { JqElement } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets all preceding siblings up to but not including the element matched by the selector.
 * @see https://api.jquery.com/prevUntil/
 */
function prevUntil(this: JQ, selector?: UntilSelector, filter?: CssSelector): JQ {
    const precedingSiblings: JqElement[] = [];
    let parsedStopSelector = null;
    let stopElement: JqElement | Element | null = null;

    if (selector) {
        if (typeof selector === 'string') {
            parsedStopSelector = parseSelector(selector);
        } else {
            // Selector is JqElement or JQ - use type guard to check structure
            const selectorObj = selector as JqElement | JQ;
            if (
                'nodes' in selectorObj &&
                Array.isArray(selectorObj.nodes) &&
                selectorObj.nodes.length > 0
            ) {
                // It's a JQ object
                stopElement = selectorObj.nodes[0]._originalElement || selectorObj.nodes[0];
            } else if ('_originalElement' in selectorObj && selectorObj._originalElement) {
                // It's an JqElement with DOM reference
                stopElement = selectorObj._originalElement;
            } else if ('nodeType' in selectorObj && selectorObj.nodeType !== undefined) {
                // It's an JqElement
                stopElement = selectorObj;
            }
        }
    }

    const parsedFilterSelector = filter ? parseSelector(filter) : null;

    for (const node of this.nodes) {
        if (node._originalElement) {
            const element = node._originalElement;
            let sibling = element.previousElementSibling;

            while (sibling) {
                let shouldStop = false;
                if (parsedStopSelector) {
                    const selectorList =
                        'type' in parsedStopSelector && parsedStopSelector.type === 'compound'
                            ? parsedStopSelector.selectors
                            : [parsedStopSelector];
                    const attributes: Record<string, string> = {};
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        attributes[attr.name] = attr.value;
                    }
                    const tempNode = new JqElement('element', sibling.tagName.toLowerCase());
                    tempNode.attributes._setData(attributes);
                    tempNode._originalElement = sibling;
                    if (selectorList.some((sel) => nodeMatchesSelector(tempNode, sel))) {
                        shouldStop = true;
                    }
                } else if (stopElement) {
                    // Compare with type-safe checks - both are DOM Elements
                    const isSameElement = sibling === (stopElement as unknown as Element);
                    if (isSameElement) {
                        shouldStop = true;
                    }
                }

                if (shouldStop) break;

                let shouldInclude = true;
                if (parsedFilterSelector) {
                    const selectorList =
                        'type' in parsedFilterSelector && parsedFilterSelector.type === 'compound'
                            ? parsedFilterSelector.selectors
                            : [parsedFilterSelector];
                    const attributes: Record<string, string> = {};
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        attributes[attr.name] = attr.value;
                    }
                    const tempNode = new JqElement('element', sibling.tagName.toLowerCase());
                    tempNode.attributes._setData(attributes);
                    tempNode._originalElement = sibling;
                    if (!selectorList.some((sel) => nodeMatchesSelector(tempNode, sel))) {
                        shouldInclude = false;
                    }
                }

                if (shouldInclude) {
                    const attributes: Record<string, string> = {};
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        attributes[attr.name] = attr.value;
                    }
                    const internalNode = new JqElement('element', sibling.tagName.toLowerCase());
                    internalNode.attributes._setData(attributes);
                    internalNode._originalElement = sibling;
                    precedingSiblings.push(internalNode);
                }

                sibling = sibling.previousElementSibling;
            }
        } else if (node.parent && node.parent.children) {
            const siblings = node.parent.children.filter(
                (child: JqElement) => child.internalType === 'element',
            );
            const currentIndex = siblings.indexOf(node);

            if (currentIndex > 0) {
                for (let i = currentIndex - 1; i >= 0; i--) {
                    const sibling = siblings[i];

                    let shouldStop = false;
                    if (parsedStopSelector) {
                        const selectorList =
                            'type' in parsedStopSelector && parsedStopSelector.type === 'compound'
                                ? parsedStopSelector.selectors
                                : [parsedStopSelector];
                        if (selectorList.some((sel) => nodeMatchesSelector(sibling, sel))) {
                            shouldStop = true;
                        }
                    } else if (stopElement) {
                        // Type-safe comparison - check both _originalElement and direct reference
                        const stopAsElement = stopElement as JqElement | Element;
                        const isSameElement =
                            sibling._originalElement === stopAsElement || sibling === stopAsElement;
                        if (isSameElement) {
                            shouldStop = true;
                        }
                    }

                    if (shouldStop) break;

                    if (parsedFilterSelector) {
                        const selectorList =
                            'type' in parsedFilterSelector &&
                                parsedFilterSelector.type === 'compound'
                                ? parsedFilterSelector.selectors
                                : [parsedFilterSelector];
                        if (!selectorList.some((sel) => nodeMatchesSelector(sibling, sel))) {
                            continue;
                        }
                    }

                    precedingSiblings.push(sibling);
                }
            }
        }
    }

    // Remove duplicates
    const uniqueSiblings: JqElement[] = [];
    const seen = new Set<JqElement>();
    for (const sibling of precedingSiblings) {
        if (!seen.has(sibling)) {
            seen.add(sibling);
            uniqueSiblings.push(sibling);
        }
    }

    return new JQClass(uniqueSiblings);
}

export default prevUntil;
