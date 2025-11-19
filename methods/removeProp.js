/**
 * Removes a property set by the .prop() method.
 * @see https://api.jquery.com/removeProp/
 * @param {string} name - Property name to remove
 * @returns {JQ} The JQ instance for chaining
 */
module.exports = function removeProp(name) {
    this.debugLog(`JQ.removeProp: Removing property "${name}" from ${this.nodes.length} elements`);

    // jQuery doesn't remove standard HTML properties with removeProp
    const standardProperties = ['checked', 'selected', 'disabled', 'readonly', 'required', 'type', 'name'];

    if (standardProperties.includes(name)) {
        this.debugLog(`JQ.removeProp: Not removing standard HTML property "${name}"`);
        return this;
    }

    // Special handling for 'value' property - jQuery doesn't actually remove it from DOM elements
    // For consistency, we also don't remove it from our internal elements
    if (name === 'value') {
        // For DOM elements, jQuery's removeProp('value') doesn't actually remove the value property
        // It remains as-is. For our implementation, we also keep the property.
        this.nodes.forEach(element => {
            if (element && element._originalElement && name === 'value') {
                // For real DOM elements, don't change anything - matches jQuery behavior
                // The value property remains
            } else if (element && element.properties && name === 'value') {
                // For our internal elements, also don't remove the value property to match jQuery
                // Keep element.properties.value as-is
            }
        });
        return this;
    }

    this.nodes.forEach(element => {
        if (element && element.properties) {
            delete element.properties[name];

            // For DOM elements, we need special handling for other properties
            if (element._originalElement && element._originalElement[name] !== undefined) {
                // For other properties, we might need to update the DOM element
                // But for now, we just remove from our properties object
            }
        }
    });
    return this;
};