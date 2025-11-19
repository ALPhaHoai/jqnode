/**
 * Store arbitrary data associated with the matched elements or return the value at the named data store for the first element in the set of matched elements.
 * @see https://api.jquery.com/data/
 * @param {string|Object} [key] - Name of the data stored or object of data to store.
 * @param {*} [value] - Value to store.
 * @returns {*|JQ} The stored value or the JQ instance.
 */
module.exports = function data(key, value) {
    // Helper to get/set data on a node
    const getData = (node) => {
        if (!node._jqData) {
            node._jqData = {};
        }
        return node._jqData;
    };

    const parseDataValue = (val) => {
        if (typeof val !== 'string') return val;
        try {
            if (val === "true") return true;
            if (val === "false") return false;
            if (val === "null") return null;
            if (val === +val + "") return +val;
            if (/^[\[\{]/.test(val)) return JSON.parse(val);
        } catch (e) { }
        return val;
    };

    // Case 1: No arguments - return all data for first element
    if (key === undefined) {
        if (this.nodes.length === 0) return undefined;
        const node = this.nodes[0];
        const internalData = getData(node);

        // Merge with data-* attributes
        const dataAttrs = {};
        if (node.attributes) {
            // Internal node structure
            Object.keys(node.attributes).forEach(attrName => {
                if (attrName.startsWith('data-')) {
                    const dataKey = attrName.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    dataAttrs[dataKey] = parseDataValue(node.attributes[attrName]);
                }
            });
        } else if (node.nodeType === 1 && node.attributes) {
            // DOM node
            Array.from(node.attributes).forEach(attr => {
                if (attr.name.startsWith('data-')) {
                    const dataKey = attr.name.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    dataAttrs[dataKey] = parseDataValue(attr.value);
                }
            });
        }

        return { ...dataAttrs, ...internalData };
    }

    // Case 2: key is an object - set multiple values for all elements
    if (typeof key === 'object') {
        return this.each(function () {
            const d = getData(this);
            Object.assign(d, key);
        });
    }

    // Case 3: key and value provided - set value for all elements
    if (value !== undefined) {
        return this.each(function () {
            const d = getData(this);
            d[key] = value;
        });
    }

    // Case 4: key provided, no value - get value for first element
    if (this.nodes.length === 0) return undefined;
    const node = this.nodes[0];
    const d = getData(node);

    if (d && key in d) {
        return d[key];
    }

    // Fallback to data-* attribute
    // Convert camelCase key to kebab-case for attribute lookup
    const attrName = 'data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();

    let attrValue;
    if (node.getAttribute) {
        attrValue = node.getAttribute(attrName);
    } else if (node.attributes) {
        attrValue = node.attributes[attrName];
    }

    if (attrValue !== undefined && attrValue !== null) {
        return parseDataValue(attrValue);
    }

    return undefined;
};
