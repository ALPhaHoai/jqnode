import { selectNodes } from '../../../selector';
import type { CssSelector, JQ, UntilSelector } from '../../../types';
import { JqElement } from '../../../dom/JqNode/JqElement/JqElement';
import JQClass from '../../../jq';

/**
 * Gets the ancestors of each element, up to but not including the element matched by the selector.
 * @see https://api.jquery.com/parentsUntil/
 */
function parentsUntil(this: JQ, selector?: UntilSelector, filter?: CssSelector): JQ {
    const ancestors: JqElement[] = [];
    const seen = new Set<string>();
    const stopElements = new Set<JqElement>();

    // Find stop elements if selector provided
    if (selector) {
        if (typeof selector === 'string') {
            const rootNodes = this._findCommonRoots(this.nodes);
            const stopNodes = selectNodes(rootNodes, selector);
            stopNodes.forEach((node: JqElement) => stopElements.add(node));
        }
    }

    for (const node of this.nodes) {
        if (node._originalElement) {
            let domCurrent = node._originalElement.parentElement;
            while (domCurrent && domCurrent.nodeType === 1) {
                // Stop if we reach a stop element
                const shouldStop = Array.from(stopElements).some((stopNode: JqElement) => {
                    if (stopNode._originalElement === domCurrent) return true;
                    if (stopNode.tagName === domCurrent!.tagName.toLowerCase()) {
                        const stopAttrs = stopNode.attributes._getData();
                        const domAttrs: Record<string, string> = {};
                        for (let i = 0; i < domCurrent!.attributes.length; i++) {
                            const attr = domCurrent!.attributes[i];
                            domAttrs[attr.name] = attr.value;
                        }
                        return Object.keys(stopAttrs).every(
                            (key) => domAttrs[key] === stopAttrs[key],
                        );
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
                    const domNode = new JqElement('element', domCurrent.tagName.toLowerCase());
                    domNode.attributes._setData(attributes);
                    domNode.properties = {};
                    domNode.children = [];
                    domNode.parent = undefined;
                    domNode._originalElement = domCurrent;
                    ancestors.push(domNode);
                }
                domCurrent = domCurrent.parentElement;
            }
        } else {
            let current: JqElement | undefined = node.parent;
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
        resultNodes = ancestors.filter((ancestor: JqElement) =>
            matchingAncestors.includes(ancestor),
        );
    }

    return new JQClass(resultNodes);
}

export default parentsUntil;
