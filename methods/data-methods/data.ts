import type { JQ } from '../../types';
import {
    initDataAttributes,
    getData,
    toCamelCase,
    NodeWithData,
    getDataFromAttribute,
} from '../../helpers/dataHelper';

/**
 * Store arbitrary data associated with the matched elements or return the value at the named data store for the first element in the set of matched elements.
 * @see https://api.jquery.com/data/
 */
function data(
    this: JQ,
    key?: string | Record<string, unknown>,
    value?: unknown,
): JQ | Record<string, unknown> | unknown | undefined {
    // Case 1: No arguments - return all data for first element
    if (key === undefined) {
        if (this.nodes.length === 0) return undefined;
        const node = this.nodes[0] as NodeWithData;
        initDataAttributes(node);
        return node._jqData;
    }

    // Case 2: key is an object - set multiple values for all elements
    if (typeof key === 'object') {
        return this.each(function (this: NodeWithData) {
            const d = getData(this);
            Object.keys(key).forEach((k) => {
                d[toCamelCase(k)] = key[k];
            });
        });
    }

    // Case 3: key and value provided - set value for all elements
    if (value !== undefined) {
        return this.each(function (this: NodeWithData) {
            const d = getData(this);
            d[toCamelCase(key as string)] = value;
        });
    }

    // Case 4: key provided, no value - get value for first element
    if (this.nodes.length === 0) return undefined;
    const node = this.nodes[0] as NodeWithData;

    initDataAttributes(node);

    const d = getData(node);
    const camelKey = toCamelCase(key as string);

    if (d[camelKey] === undefined) {
        const attrValue = getDataFromAttribute(node, camelKey);
        if (attrValue !== undefined) {
            d[camelKey] = attrValue;
            return attrValue;
        }
    }

    return d[camelKey];
}

export = data;
