import type { JqElement } from '../types';

/**
 * Helper method to check if an element has a specific descendant.
 * @param element - The element to check
 * @param targetElement - The target descendant element
 * @returns True if the element contains the target as a descendant
 */
function _hasDescendant(element: JqElement, targetElement: JqElement): boolean {
    if (!element.children) {
        return false;
    }

    for (const child of element.children) {
        // Direct match
        if (child === targetElement) {
            return true;
        }

        // Recursive check for element children
        if (child.internalType === 'element' && _hasDescendant(child, targetElement)) {
            return true;
        }
    }

    return false;
}

export default _hasDescendant;
