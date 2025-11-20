/**
 * Gets or sets a property on the first element in the collection.
 * @see https://api.jquery.com/prop/
 * @param {string} name - Property name
 * @param {*} [value] - Property value (if setting)
 * @returns {*|JQ} Property value if getting, JQ instance if setting
 */
module.exports = function prop(name, value) {
    if (value === undefined) {
        // Get property value from first element
        const element = this.nodes[0];
        if (!element) return undefined;

        // Initialize properties object if it doesn't exist
        if (!element.properties) {
            element.properties = {};
        }

        // Get property value from element properties
        const result = element.properties[name];

        // Convert value to string for value property (jQuery behavior)
        if (name === 'value' && result !== undefined) {
            return String(result);
        }
        return result;
    }

    // Set property value on all elements
    this.nodes.forEach(element => {
        if (element) {
            // Initialize properties object if it doesn't exist
            if (!element.properties) {
                element.properties = {};
            }
            // For value property, jQuery stores it as-is but returns as string
            element.properties[name] = value;

            // Update the actual DOM element if it exists
            if (element._originalElement && element._originalElement[name] !== undefined) {
                element._originalElement[name] = value;
            }
        }
    });

    return this;
};
