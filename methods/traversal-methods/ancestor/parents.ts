import { parseSelector, nodeMatchesSelector } from '../../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
  * @see https://api.jquery.com/parents/
 */
function parents(this: JQ, selector?: CssSelector): JQ {
    const ancestors: HtmlNode[] = [];
    const seen = new Set<string>();

    // Parse selector if provided
    let parsedSelector = null;
    if (selector) {
        parsedSelector = parseSelector(selector);
        if (!parsedSelector) {
            const result = Object.create(Object.getPrototypeOf(this));
            result.nodes = [];
            result.length = 0;
            return result;
        }
    }

    for (const node of this.nodes) {
        // If we have a DOM element, traverse the actual DOM tree
        if (node._originalElement) {
            let domCurrent = node._originalElement.parentElement;
            while (domCurrent && domCurrent.nodeType === 1) {
                // Create a unique key to avoid duplicates
                const attributes: Record<string, string> = {};
                for (let i = 0; i < domCurrent.attributes.length; i++) {
                    const attr = domCurrent.attributes[i];
                    attributes[attr.name] = attr.value;
                }
                const key = `${domCurrent.tagName.toLowerCase()}-${JSON.stringify(attributes)}`;

                if (!seen.has(key)) {
                    seen.add(key);

                    // Convert DOM element to node format
                    const domNode = {
                        type: 'element' as const,
                        name: domCurrent.tagName.toLowerCase(),
                        tagName: domCurrent.tagName.toLowerCase(),
                        attributes: attributes,
                        attribs: attributes,
                        properties: {},
                        children: [],
                        parent: undefined,
                        _originalElement: domCurrent
                    };

                    // If selector provided, check if this ancestor matches
                    if (!parsedSelector || nodeMatchesSelector(domNode, parsedSelector)) {
                        ancestors.push(domNode);
                    }
                }
                domCurrent = domCurrent.parentElement;
            }
        } else {
            // Otherwise, traverse the internal node tree
            let current: HtmlNode | undefined = node.parent;
            while (current) {
                if (current.type === 'element') {
                    // Create a unique key to avoid duplicates
                    const key = `${current.tagName}-${JSON.stringify(current.attributes)}`;

                    if (!seen.has(key)) {
                        seen.add(key);

                        // If selector provided, check if this ancestor matches
                        if (!parsedSelector || nodeMatchesSelector(current, parsedSelector)) {
                            ancestors.push(current);
                        }
                    }
                }
                current = current.parent;
            }
        }
    }
    return new JQClass(ancestors);
}

export = parents;
