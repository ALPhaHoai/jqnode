import type { HtmlNode, JQ, CssValueInput, CssProperties } from '../../types';
import { getComputedStyleValue, setStyleValue } from '../../css-utils';

/**
 * Gets or sets CSS properties on elements.
 */
function css(
    this: JQ,
    prop: string | string[] | CssProperties,
    value?: CssValueInput
): JQ {

    // GETTER CASES
    // Arrays and non-objects (strings) go through getter logic
    if (value === undefined && (typeof prop !== 'object' || Array.isArray(prop))) {
        const element = this.nodes[0];

        if (!element) {
            return undefined as unknown as JQ;
        }

        // Case 1: Get array of properties - returns object
        if (Array.isArray(prop)) {
            const result: Record<string, string | undefined> = {};
            prop.forEach(function (property: string) {
                result[property] = getComputedStyleValue(element, property) as string;
            });
            return result as unknown as JQ;
        }

        // Case 2: Get single property - returns string
        return getComputedStyleValue(element, prop) as unknown as JQ;
    }

    // SETTER CASES
    // Case 1: Set object of properties
    if (typeof prop === 'object' && !Array.isArray(prop)) {
        this.nodes.forEach(function (element: HtmlNode) {
            if (!element) return;

            Object.keys(prop).forEach(function (property: string) {
                const value = prop[property];
                // Only string | number values allowed in object syntax (not functions)
                if (typeof value !== 'function') {
                    setStyleValue(element, property, value);
                }
            });
        });
        return this;
    }

    // Case 2: Set single property with function
    if (typeof value === 'function') {

        this.nodes.forEach(function (element: HtmlNode, index: number) {
            if (!element) return;

            const currentValue = getComputedStyleValue(element, prop as string) || '';
            const newValue = value.call(element, index, currentValue);
            setStyleValue(element, prop as string, newValue);
        });
        return this;
    }

    // Case 3: Set single property with value
    this.nodes.forEach(function (element: HtmlNode) {
        if (!element) return;
        setStyleValue(element, prop as string, value!);
    });

    return this;
}

export = css;


