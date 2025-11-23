import type { HtmlNode } from '../types';

export interface NodeWithData extends HtmlNode {
    _jqData?: Record<string, unknown>;
    _jqDataParsed?: boolean;
}

export const getData = (node: NodeWithData): Record<string, unknown> => {
    if (!node._jqData) {
        node._jqData = {};
    }
    return node._jqData;
};

export const toCamelCase = (str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

export const parseDataValue = (val: string): unknown => {
    if (typeof val !== 'string') return val;
    try {
        if (val === 'true') return true;
        if (val === 'false') return false;
        if (val === 'null') return null;
        if (val === +val + '') return +val;
        if (/^[\[\{]/.test(val)) return JSON.parse(val);
    } catch (e) {}
    return val;
};

export const initDataAttributes = (node: NodeWithData): void => {
    if (node._jqDataParsed) return;

    const d = getData(node);
    const attrs = node.attributes;

    if (!attrs) {
        node._jqDataParsed = true;
        return;
    }

    // Check for NamedNodeMap-like structure (DOM)
    // DOM attributes object has 'length' property and 'item' method
    if ((attrs as any).item && typeof (attrs as any).length === 'number') {
        const domAttrs = attrs as unknown as NamedNodeMap;
        for (let i = 0; i < domAttrs.length; i++) {
            const attr = domAttrs[i];
            if (attr.name.startsWith('data-')) {
                const dataKey = toCamelCase(attr.name.slice(5));
                if (d[dataKey] === undefined) {
                    d[dataKey] = parseDataValue(attr.value);
                }
            }
        }
    } else {
        // Plain object (Cheerio/jqnode internal)
        Object.keys(attrs).forEach((attrName) => {
            if (attrName.startsWith('data-')) {
                const dataKey = toCamelCase(attrName.slice(5));
                if (d[dataKey] === undefined) {
                    d[dataKey] = parseDataValue((attrs as any)[attrName] as string);
                }
            }
        });
    }

    node._jqDataParsed = true;
};

export const getDataFromAttribute = (node: NodeWithData, camelKey: string): unknown | undefined => {
    const kebabKey = 'data-' + camelKey.replace(/([A-Z])/g, '-$1').toLowerCase();
    const attrs = node.attributes;
    if (!attrs) return undefined;

    let value: string | undefined;

    if ((attrs as any).item && typeof (attrs as any).length === 'number') {
        const domAttrs = attrs as unknown as NamedNodeMap;
        const attr = domAttrs.getNamedItem(kebabKey);
        if (attr) value = attr.value;
    } else {
        value = (attrs as any)[kebabKey];
    }

    if (value !== undefined) {
        return parseDataValue(value);
    }
    return undefined;
};
