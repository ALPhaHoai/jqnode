import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { JqElement, CssSelector, JQ } from '../../../types';

/**
 * Get the children of each element in the set of matched elements,
 * optionally filtered by a selector.
 * @see https://api.jquery.com/children/
 */
function children(this: JQ, selector?: CssSelector): JQ {
    const children: JqElement[] = [];

    for (const node of this.nodes) {
        const nodeChildren = node.children ||
            (node.childNodes ? Array.from(node.childNodes).filter((child: any) => child.nodeType === 1) : []);

        for (const child of nodeChildren) {
            const childEl = child as JqElement;
            // Only include element nodes (type 1)
            if (childEl.nodeType !== 1 && childEl.internalType !== 'element') {
                continue;
            }

            if (selector) {
                const parsed = parseSelector(selector);
                if (parsed && nodeMatchesSelector(childEl, parsed)) {
                    children.push(childEl);
                }
            } else {
                children.push(childEl);
            }
        }
    }

    return this.pushStack(children);
}

export default children;
