const debugLog = require('../jq').debugLog;

/**
 * Helper method to check if an element has a specific descendant.
 * @param {Object} element - The element to check
 * @param {Object} targetElement - The target descendant element
 * @returns {boolean} True if the element contains the target as a descendant
 */
module.exports = function _hasDescendant(element, targetElement) {
    if (element.children) {
        for (const child of element.children) {
            if (child === targetElement || (child.type === 'element' && this._hasDescendant(child, targetElement))) {
                return true;
            }
        }
    }
    return false;
};