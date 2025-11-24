import type { JqElement, JQ } from '../../types';

/**
 * Removes a property set by the .prop() method.
 * @see https://api.jquery.com/removeProp/
 */
function removeProp(this: JQ, name: string): JQ {
    const standardProperties = [
        'checked',
        'selected',
        'disabled',
        'readonly',
        'required',
        'type',
        'name',
    ];

    if (standardProperties.includes(name)) {
        return this;
    }

    if (name === 'value') {
        this.nodes.forEach((element: JqElement) => {
            if (element && element._originalElement && name === 'value') {
                // For real DOM elements, don't change anything
            } else if (element && element.properties && name === 'value') {
                // For internal elements, also don't remove
            }
        });
        return this;
    }

    this.nodes.forEach((element: JqElement) => {
        if (element && element.properties) {
            delete element.properties[name];

            if (
                element._originalElement &&
                (element._originalElement as unknown as Record<string, unknown>)[name] !== undefined
            ) {
                // Properties object updated
            }
        }
    });
    return this;
}

export = removeProp;
