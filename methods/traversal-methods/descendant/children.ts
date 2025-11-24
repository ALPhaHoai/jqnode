import { selectNodes } from '../../../selector';
import type { JqElement, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the children of each element in the set of matched elements, optionally filtered by a selector.
 * @see https://api.jquery.com/children/
 */
function children(this: JQ, selector?: CssSelector): JQ {
    const children: JqElement[] = [];
    const seen = new Set<JqElement>();

    for (const node of this.nodes) {
        // Handle both internal nodes and DOM elements
        const nodeChildren =
            node.children ||
            (node.childNodes
                ? Array.from(node.childNodes).filter((child: Node) => child.nodeType === 1)
                : []);

        for (const child of nodeChildren) {
            const isElement =
                ('type' in child && child.internalType === 'element') ||
                ('nodeType' in child && child.nodeType === 1);
            if (isElement && !seen.has(child as JqElement)) {
                seen.add(child as JqElement);
                children.push(child as JqElement);
            }
        }
    }

    let resultNodes = children;

    if (selector) {
        const rootNodes = this._findCommonRoots(this.nodes);
        const matchingChildren = selectNodes(rootNodes, selector);
        resultNodes = children.filter((child: JqElement) => matchingChildren.includes(child));
    }
    const result = new JQClass(resultNodes) as JQ;
    result._prevObject = this;
    return result;
}

export = children;
