import type { HtmlNode, JQ, MapCallback } from '../../types';

/**
 * Translate a set of elements into a new jQuery set or array.
 */
function map<R = HtmlNode>(this: JQ, callback: MapCallback<HtmlNode, R>): R[] {
    const results: R[] = [];

    for (let i = 0; i < this.nodes.length; i++) {
        try {
            const result = callback.call(this.nodes[i], i, this.nodes[i]);
            // Only include non-null and non-undefined values
            if (result != null) {
                // jQuery flattens array results
                if (Array.isArray(result)) {
                    results.push(...result);
                } else {
                    results.push(result);
                }
            }
        } catch (error) {
            // Continue to next element without adding this result
        }
    }
    return results;
}

export = map;
