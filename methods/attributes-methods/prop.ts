import type { HtmlNode, JQ } from '../../types';

/**
 * Gets or sets a property on the first element in the collection.
 */
function prop(this: JQ, name: string, value?: string | number | boolean | null): string | number | boolean | null | undefined | JQ {
    if (value === undefined) {
        const element = this.nodes[0];
        if (!element) return undefined;

        if (!element.properties) {
            element.properties = {};
        }

        const result = element.properties[name];

        if (name === 'value' && result !== undefined) {
            return String(result);
        }
        return result as string | number | boolean | null | undefined;
    }

    this.nodes.forEach((element: HtmlNode) => {
        if (element) {
            if (!element.properties) {
                element.properties = {};
            }
            element.properties[name] = value;

            // Sync to DOM element if it exists and has this property
            if (element._originalElement) {
                const domElement = element._originalElement as unknown as Record<string, unknown>;
                if (domElement[name] !== undefined) {
                    domElement[name] = value;
                }
            }
        }
    });

    return this;
}

export = prop;
