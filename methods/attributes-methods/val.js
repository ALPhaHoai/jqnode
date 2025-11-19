/**
 * Gets the current value of the first element or sets the value of every matched element.
 * @see https://api.jquery.com/val/
 * @param {string} [value] - Value to set (if setting)
 * @returns {string|JQ} Current value if getting, JQ instance if setting
 */
module.exports = function val(value) {
    if (value === undefined) {
        // Get value from first element
        const element = this.nodes[0];
        if (!element) return undefined;

        // Handle different element types
        if (element.tagName && element.tagName.toLowerCase() === 'input') {
            // Check properties first (set by prop()), then attributes
            if (element.properties && element.properties.value !== undefined) {
                const result = element.properties.value;
                this.debugLog(`JQ.val: Getting input value from properties: ${result}`);
                return result;
            } else if (element.attributes && element.attributes.value !== undefined) {
                const result = element.attributes.value;
                this.debugLog(`JQ.val: Getting input value from attributes: ${result}`);
                return result;
            }
        } else if (element.tagName && element.tagName.toLowerCase() === 'select') {
            // For select elements, find the selected option(s)
            if (element.children) {
                const selectedValues = [];
                for (const child of element.children) {
                    if (child.type === 'element' && child.tagName && child.tagName.toLowerCase() === 'option' &&
                        child.attributes && child.attributes.selected) {
                        selectedValues.push(child.attributes.value || child.children[0]?.value || '');
                    }
                }
                const isMultiple = element.attributes && element.attributes.multiple;
                if (isMultiple) {
                    this.debugLog(`JQ.val: Getting multiple select values: ${selectedValues}`);
                    return selectedValues;
                } else {
                    // For single select, return properties.value if set, else selected value
                    if (element.properties && element.properties.value !== undefined) {
                        const result = element.properties.value;
                        this.debugLog(`JQ.val: Getting single select value from properties: ${result}`);
                        return result;
                    }
                    const result = selectedValues.length > 0 ? selectedValues[0] : '';
                    this.debugLog(`JQ.val: Getting single select value: ${result}`);
                    return result;
                }
            }
        } else if (element.tagName && element.tagName.toLowerCase() === 'textarea') {
            // For textarea, get the text content
            if (element.properties && element.properties.value !== undefined) {
                const result = element.properties.value;
                this.debugLog(`JQ.val: Getting textarea value from properties: ${result}`);
                return result;
            } else if (element.children && element.children.length > 0) {
                // Get text content from children
                const textContent = element.children
                    .filter(child => child.type === 'text')
                    .map(child => child.value)
                    .join('');
                this.debugLog(`JQ.val: Getting textarea value from text content: ${textContent}`);
                return textContent;
            }
        }

        this.debugLog(`JQ.val: No value found for element, returning empty string for non-form elements`);
        return ''; // jQuery returns empty string for elements that don't support val()
    }

    // Check if value is a function - jQuery calls it for each element
    if (typeof value === 'function') {
        this.debugLog(`JQ.val: Setting value using function on ${this.nodes.length} elements`);
        this.nodes.forEach((element, index) => {
            if (element) {
                // Get current value of this specific element
                let currentValue;
                if ((element.tagName && element.tagName.toLowerCase() === 'input') || (element.tagName && element.tagName.toLowerCase() === 'select')) {
                    currentValue = element.properties && element.properties.value !== undefined ?
                        element.properties.value :
                        (element.attributes && element.attributes.value !== undefined ?
                            element.attributes.value : undefined);
                } else if (element.tagName && element.tagName.toLowerCase() === 'textarea') {
                    currentValue = element.properties && element.properties.value !== undefined ?
                        element.properties.value :
                        (element.children && element.children.length > 0 ?
                            element.children.filter(child => child.type === 'text').map(child => child.value).join('') :
                            undefined);
                } else {
                    currentValue = undefined;
                }

                const result = value.call(element, index, currentValue); // Call function with index and current value
                const stringResult = result === null || result === undefined ? '' : String(result);
                this.debugLog(`JQ.val: Function returned "${stringResult}" for element ${index}`);

                if ((element.tagName && element.tagName.toLowerCase() === 'input') || (element.tagName && element.tagName.toLowerCase() === 'select')) {
                    if (!element.properties) {
                        element.properties = {};
                    }
                    element.properties.value = stringResult;
                } else if (element.tagName && element.tagName.toLowerCase() === 'textarea') {
                    if (!element.properties) {
                        element.properties = {};
                    }
                    element.properties.value = stringResult;
                    element.children = [{type: 'text', value: stringResult}];
                }
            }
        });
        return this;
    }

    // Set value on all elements
    this.debugLog(`JQ.val: Setting value on ${this.nodes.length} elements`);
    this.nodes.forEach(element => {
        if (element) {
            if (element.tagName && element.tagName.toLowerCase() === 'input') {
                // For input elements, always set as string
                const stringValue = value === null || value === undefined ? '' : String(value);
                if (!element.properties) {
                    element.properties = {};
                }
                element.properties.value = stringValue;

                // Update the actual DOM element if it exists
                if (element._originalElement) {
                    element._originalElement.value = stringValue;
                }
            } else if (element.tagName && element.tagName.toLowerCase() === 'select') {
                // For select elements, handle arrays for multiple select
                const isMultiple = element.attributes && element.attributes.multiple;
                if (isMultiple && Array.isArray(value)) {
                    // For multiple select with array value, set selected state on options
                    // Don't store the array in properties, just update selected states
                    if (element.children) {
                        element.children.forEach(child => {
                            if (child.type === 'element' && child.tagName && child.tagName.toLowerCase() === 'option') {
                                const optionValue = child.attributes && child.attributes.value;
                                const shouldBeSelected = value.includes(optionValue);
                                if (!child.attributes) {
                                    child.attributes = {};
                                }
                                child.attributes.selected = shouldBeSelected;
                            }
                        });
                    }
                } else {
                    // For single select or non-array value, set selected on matching option
                    const stringValue = value === null || value === undefined ? '' : String(value);
                    if (!element.properties) {
                        element.properties = {};
                    }
                    element.properties.value = stringValue;

                    // Update the actual DOM element if it exists
                    if (element._originalElement) {
                        element._originalElement.value = stringValue;
                    }

                    // Also set selected attribute on the matching option
                    if (element.children) {
                        element.children.forEach(child => {
                            if (child.type === 'element' && child.tagName && child.tagName.toLowerCase() === 'option') {
                                const optionValue = child.attributes && child.attributes.value;
                                const shouldBeSelected = optionValue === stringValue;
                                if (!child.attributes) {
                                    child.attributes = {};
                                }
                                child.attributes.selected = shouldBeSelected;
                            }
                        });
                    }
                }
            } else if (element.tagName && element.tagName.toLowerCase() === 'textarea') {
                // For textarea, set the text content
                const stringValue = value === null || value === undefined ? '' : String(value);
                if (!element.properties) {
                    element.properties = {};
                }
                element.properties.value = stringValue;
                // Also update the text content
                element.children = [{type: 'text', value: stringValue}];

                // Update the actual DOM element if it exists
                if (element._originalElement) {
                    element._originalElement.value = stringValue;
                }
            }
        }
    });

    return this;
};