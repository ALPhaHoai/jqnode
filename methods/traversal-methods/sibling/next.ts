import { nodeMatchesSelector, parseSelector } from '../../../selector';
import type { JqElement, CssSelector, JQ } from '../../../types';

/**
 * Get the immediately following sibling of each element in the set of matched elements.
 * If a selector is provided, it retrieves the next sibling only if it matches that selector.
 * @see https://api.jquery.com/next/
 */
function next(this: JQ, selector?: CssSelector): JQ {
    const nextSiblings: JqElement[] = [];

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const allChildren = node.parent.children;
            const currentIndex = allChildren.indexOf(node);

            if (currentIndex !== -1 && currentIndex < allChildren.length - 1) {
                // Find immediate next element sibling
                let nextElementSibling = null;
                for (let i = currentIndex + 1; i < allChildren.length; i++) {
                    const sibling = allChildren[i];
                    if (sibling.internalType === 'element') {
                        nextElementSibling = sibling;
                        break;
                    }
                }

                if (nextElementSibling) {
                    if (selector) {
                        const parsed = parseSelector(selector);
                        if (parsed && nodeMatchesSelector(nextElementSibling, parsed)) {
                            nextSiblings.push(nextElementSibling);
                        }
                    } else {
                        nextSiblings.push(nextElementSibling);
                    }
                }
            }
        }
    }
    return this.pushStack(nextSiblings);
}

export default next;
