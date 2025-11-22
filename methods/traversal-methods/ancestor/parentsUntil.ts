import { selectNodes } from '../../../selector';
import type { HtmlNode, CssSelector, JQ, UntilSelector } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the ancestors of each element, up to but not including the element matched by the selector.
 */
function parentsUntil(this: JQ, selector?: UntilSelector, filter?: CssSelector): JQ {
    const ancestors: HtmlNode[] = [];
    const seen = new Set<string>();
    const stopElements = new Set<HtmlNode>();

    // Find stop elements if selector provided
    if (selector) {
        if (typeof selector === 'string') {
            const rootNodes = this._findCommonRoots(this.nodes);
            const stopNodes = selectNodes(rootNodes, selector);
            stopNodes.forEach((node: HtmlNode) => stopElements.add(node));
        }
    }

    for (const node of this.nodes) {
        if (node._originalElement) {
            let domCurrent = node._originalElement.parentElement;
            while (domCurrent && domCurrent.nodeType === 1) {
                // Stop if we reach a stop element
                const shouldStop = Array.from(stopElements).some((stopNode: HtmlNode) => {
                    if (stopNode._originalElement === domCurrent) return true;
                    if (stopNode.tagName === domCurrent!.tagName.toLowerCase()) {
                        const stopAttrs = stopNode.attributes || {};
                        const domAttrs: Record<string, string> = {};
                        for (let i = 0; i < domCurrent!.attributes.length; i++) {
                            const attr = domCurrent!.attributes[i];
                            domAttrs[attr.name] = attr.value;
                        }
                        return Object.keys(stopAttrs).every(key => domAttrs[key] === stopAttrs[key]);
                    }
                    return false;
                });

                if (shouldStop) break;

                const attributes: Record<string, string> = {};
                for (let i = 0; i < domCurrent.attributes.length; i++) {
                    const attr = domCurrent.attributes[i];
                    attributes[attr.name] = attr.value;
                }
                const key = `dom-${domCurrent.tagName.toLowerCase()}-${JSON.stringify(attributes)}`;

                if (!seen.has(key)) {
                    seen.add(key);
                    const domNode: HtmlNode = {
                        type: 'element',
                        tagName: domCurrent.tagName.toLowerCase(),
                        attributes: attributes,
                        properties: {},
                        children: [],
                        parent: undefined,
                        _originalElement: domCurrent
                    };
                    ancestors.push(domNode);
                }
                domCurrent = domCurrent.parentElement;
            }
        } else {
            let current: HtmlNode | undefined = node.parent;
            while (current) {
                if (stopElements.has(current)) break;

                const key = `internal-${current.tagName}-${JSON.stringify(current.attributes)}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    ancestors.push(current);
                }
                current = current.parent;
            }
        }
    }

    let resultNodes = ancestors;

    if (filter) {
        const rootNodes = this._findCommonRoots(this.nodes);
        const matchingAncestors = selectNodes(rootNodes, filter);
        resultNodes = ancestors.filter((ancestor: HtmlNode) => matchingAncestors.includes(ancestor));
    }

    return new JQClass(resultNodes);
}

export = parentsUntil;
