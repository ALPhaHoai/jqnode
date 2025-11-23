import type { HtmlNode, JQ, FormValueInput, GetterSetterReturn } from '../../types';

/**
 * Gets the current value of the first element or sets the value of every matched element.
 * @see https://api.jquery.com/val/
 * @param {string} [value] - Value to set (if setting)
 * @returns {string|JQ} Current value if getting, JQ instance if setting
 */
function val(
    this: JQ,
    value?: FormValueInput
): GetterSetterReturn<string | string[]> {
    if (value === undefined) {
        // Get value from first element
        const element = this.nodes[0];
        if (!element) return undefined;

        // Handle different element types
        if (element.tagName && element.tagName.toLowerCase() === 'input') {
            // Check properties first (set by prop()), then attributes
            if (element.properties && element.properties.value !== undefined) {
                return String(element.properties.value);
            } else if (element.attributes && element.attributes.value !== undefined) {
                return String(element.attributes.value);
            } else if (element.children && element.children.length > 0) {
                // Get text content from children
                return element.children
                    .filter((child: HtmlNode) => child.type === 'text')
                    .map((child: HtmlNode) => child.data || '')
                    .join('');
            }
        } else if (element.tagName && element.tagName.toLowerCase() === 'select') {
            // For select elements, find the selected option(s)
            if (element.children) {
                const selectedValues: string[] = [];
                let prioritySelectedValue: string | null = null;
                let foundPropSelected = false;
                let firstOptionValue: string | null = null;

                for (const child of element.children) {
                    if (child.type === 'element' && child.tagName && child.tagName.toLowerCase() === 'option') {
                        const optionValue = child.attributes && child.attributes.value !== undefined ?
                            String(child.attributes.value) :
                            (child.children?.[0]?.data || '');

                        if (firstOptionValue === null) {
                            firstOptionValue = optionValue;
                        }

                        const hasProp = child.properties && child.properties.selected !== undefined;
                        const isPropSelected = hasProp && child.properties.selected === true;
                        const isAttrSelected = child.attributes && child.attributes.selected !== undefined;

                        const isSelected = hasProp ? isPropSelected : isAttrSelected;

                        if (isSelected) {
                            selectedValues.push(optionValue);

                            if (isPropSelected) {
                                prioritySelectedValue = optionValue;
                                foundPropSelected = true;
                            } else if (isAttrSelected && !foundPropSelected) {
                                prioritySelectedValue = optionValue;
                            }
                        }
                    }
                }

                const isMultiple = element.attributes && element.attributes.multiple;
                if (isMultiple) {
                    return selectedValues;
                } else {
                    // For single select, return properties.value if set, else priority value, else first option
                    if (element.properties && element.properties.value !== undefined) {
                        return String(element.properties.value);
                    }
                    if (prioritySelectedValue !== null) {
                        return prioritySelectedValue;
                    }
                    return firstOptionValue !== null ? firstOptionValue : '';
                }
            }
        } else if (element.tagName && element.tagName.toLowerCase() === 'textarea') {
            // For textarea, get the text content
            if (element.properties && element.properties.value !== undefined) {
                return String(element.properties.value);
            } else if (element.children && element.children.length > 0) {
                // Get text content from children
                return element.children
                    .filter((child: HtmlNode) => child.type === 'text')
                    .map((child: HtmlNode) => child.data || '')
                    .join('');
            }
        }
        return ''; // jQuery returns empty string for elements that don't support val()
    }

    // Check if value is a function - jQuery calls it for each element
    if (typeof value === 'function') {
        this.nodes.forEach((element: HtmlNode, index: number) => {
            if (element) {
                // Get current value of this specific element
                let currentValue: string | string[];
                if ((element.tagName && element.tagName.toLowerCase() === 'input') || (element.tagName && element.tagName.toLowerCase() === 'select')) {
                    currentValue = element.properties && element.properties.value !== undefined ?
                        String(element.properties.value) :
                        (element.attributes && element.attributes.value !== undefined ?
                            String(element.attributes.value) : '');
                } else if (element.tagName && element.tagName.toLowerCase() === 'textarea') {
                    currentValue = element.properties && element.properties.value !== undefined ?
                        String(element.properties.value) :
                        (element.children && element.children.length > 0 ?
                            element.children.filter((child: HtmlNode) => child.type === 'text').map((child: HtmlNode) => child.data || '').join('') :
                            '');
                } else {
                    currentValue = '';
                }

                const result = value.call(element, index, currentValue);
                const stringResult = result === null || result === undefined ? '' : String(result);
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
                    element.children = [{ type: 'text', data: stringResult }];
                }
            }
        });
        return this;
    }

    // Set value on all elements
    this.nodes.forEach((element: HtmlNode) => {
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
                    (element._originalElement as unknown as HTMLInputElement).value = stringValue;
                }
            } else if (element.tagName && element.tagName.toLowerCase() === 'select') {
                // For select elements, handle arrays for multiple select
                const isMultiple = element.attributes && element.attributes.multiple;
                if (isMultiple && Array.isArray(value)) {
                    // For multiple select with array value, set selected state on options
                    if (element.children) {
                        element.children.forEach((child: HtmlNode) => {
                            if (child.type === 'element' && child.tagName && child.tagName.toLowerCase() === 'option') {
                                const optionValue = child.attributes && child.attributes.value ? String(child.attributes.value) : (child.children?.[0]?.data || '');
                                const shouldBeSelected = value.includes(optionValue);

                                if (!child.properties) {
                                    child.properties = {};
                                }
                                child.properties.selected = shouldBeSelected;

                                if (child._originalElement) {
                                    (child._originalElement as unknown as HTMLOptionElement).selected = shouldBeSelected;
                                }
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
                        (element._originalElement as unknown as HTMLSelectElement).value = stringValue;
                    }

                    // Also set selected property on the matching option
                    if (element.children) {
                        element.children.forEach((child: HtmlNode) => {
                            if (child.type === 'element' && child.tagName && child.tagName.toLowerCase() === 'option') {
                                const optionValue = child.attributes && child.attributes.value ? String(child.attributes.value) : (child.children?.[0]?.data || '');
                                const shouldBeSelected = optionValue === stringValue;

                                if (!child.properties) {
                                    child.properties = {};
                                }
                                child.properties.selected = shouldBeSelected;

                                if (child._originalElement) {
                                    (child._originalElement as unknown as HTMLOptionElement).selected = shouldBeSelected;
                                }
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
                element.children = [{ type: 'text', data: stringValue }];

                // Update the actual DOM element if it exists
                if (element._originalElement) {
                    (element._originalElement as unknown as HTMLTextAreaElement).value = stringValue;
                }
            }
        }
    });

    return this;
}

export = val;
