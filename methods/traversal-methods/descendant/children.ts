import { selectNodes } from '../../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../../types';

/**
 * Gets the children of each element in the set of matched elements, optionally filtered by a selector.
 */
function children(this: JQ, selector?: CssSelector): JQ {
    const children: HtmlNode[] = [];
    const seen = new Set<HtmlNode>();

    for (const node of this.nodes) {
        // Handle both internal nodes and DOM elements
        const nodeChildren = node.children || (node.childNodes ? Array.from(node.childNodes).filter((child: Node) => child.nodeType === 1) : []);

        for (const child of nodeChildren) {
            const isElement = ('type' in child && child.type === 'element') || ('nodeType' in child && child.nodeType === 1);
            if (isElement && !seen.has(child as HtmlNode)) {
                seen.add(child as HtmlNode);
                children.push(child as HtmlNode);
            }
        }
    }

    let resultNodes = children;

    if (selector) {
        const rootNodes = this._findCommonRoots(this.nodes);
        const matchingChildren = selectNodes(rootNodes, selector);
        resultNodes = children.filter((child: HtmlNode) => matchingChildren.includes(child));
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = resultNodes;
    result.length = resultNodes.length;
    result._prevObject = this;
    return result;
}

export = children;
