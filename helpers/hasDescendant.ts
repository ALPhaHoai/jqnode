import type { HtmlNode } from '../types';

/**
 * Helper method to check if an element has a specific descendant.
 * @this {object} JQ instance
 * @param element - The element to check
 * @param targetElement - The target descendant element
 * @returns True if the element contains the target as a descendant
 */
function _hasDescendant(this: any, element: HtmlNode, targetElement: HtmlNode): boolean {
    if (element.children) {
        for (const child of element.children) {
            if (child === targetElement || (child.type === 'element' && this._hasDescendant(child, targetElement))) {
                return true;
            }
        }
    }
    return false;
}

export = _hasDescendant;
