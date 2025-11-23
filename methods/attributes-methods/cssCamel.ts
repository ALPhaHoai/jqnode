import type { HtmlNode, JQ } from '../../types';
import { getComputedStyleValue, setStyleValue } from '../../css-utils';

/**
 * Internal CSS helper method with camelCase property support.
 * 
 * Note: This is not a jQuery method. For jQuery CSS manipulation, use the .css() method.
 */
function cssCamel(
    this: JQ,
    prop: string | string[] | Record<string, string | number>,
    value?: string | number | ((index: number, currentValue: string) => string | number)
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
                // Always use camelCase for keys in result
                const camelProp = property.replace(/-([a-z])/g, function (_match, letter) {
                    return letter.toUpperCase();
                });
                result[camelProp] = getComputedStyleValue(element, property) as string;
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
                setStyleValue(element, property, prop[property]);
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

export = cssCamel;


