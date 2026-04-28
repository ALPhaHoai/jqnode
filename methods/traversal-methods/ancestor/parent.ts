import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { JqElement, CssSelector, JQ } from '../../../types';

/**
 * Get the parent of each element in the current set of matched elements,
 * optionally filtered by a selector.
 * @see https://api.jquery.com/parent/
 */
function parent(this: JQ, selector?: CssSelector): JQ {
    const parents: JqElement[] = [];
    const seen = new Set<JqElement>();

    for (const node of this.nodes) {
        const parentNode = node.parent || node.parentNode;

        if (parentNode && (parentNode as any).internalType === 'element') {
            const parent = parentNode as JqElement;
            if (!seen.has(parent)) {
                seen.add(parent);
                if (selector) {
                    const parsed = parseSelector(selector);
                    if (parsed && nodeMatchesSelector(parent, parsed)) {
                        parents.push(parent);
                    }
                } else {
                    parents.push(parent);
                }
            }
        }
    }

    return this.pushStack(parents);
}

export default parent;
