/**
 * Removes an attribute from each element in the set of matched elements.
 * @see https://api.jquery.com/removeAttr/
 * @param {string} name - Attribute name to remove
 * @returns {JQ} The JQ instance for chaining
 */
module.exports = function removeAttr(name) {
    this.nodes.forEach(element => {
        if (element && element.attributes) {
            delete element.attributes[name];
            // Also update the DOM element if it exists
            if (element._originalElement) {
                element._originalElement.removeAttribute(name);
            }
        }
    });
    return this;
};