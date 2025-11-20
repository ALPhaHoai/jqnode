/**
 * Checks if the first element has the specified class.
 * @see https://api.jquery.com/hasClass/
 * @param {string} className - The class name to check for
 * @returns {boolean} True if the first element has the class, false otherwise
 */
module.exports = function hasClass(className) {
    if (this.nodes.length === 0) {
        return false;
    }

    const element = this.nodes[0];

    // If we have a reference to the original DOM element, check its className property
    // This ensures we see changes made by external code (like jQuery)
    if (element._originalElement) {
        const classNameValue = element._originalElement.className || '';
        const classes = classNameValue.split(/\s+/).filter(cls => cls.length > 0);
        const hasClass = classes.includes(className);
        return hasClass;
    }

    // Fall back to internal attributes if no DOM element reference
    if (!element.attributes || !element.attributes.class) {
        return false;
    }

    const classes = element.attributes.class.split(/\s+/);
    const hasClass = classes.includes(className);
    return hasClass;
};