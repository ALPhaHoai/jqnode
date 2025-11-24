import type { JqElement, JQ, MapCallback } from '../../types';

/**
 * Translate a set of elements into a new jQuery set or array.
 * @see https://api.jquery.com/map/
 */
function map<R = JqElement>(this: JQ, callback: MapCallback<JqElement, R>): R[] {
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

    // Return a new JQ object containing the results
    // We use this.constructor to avoid circular dependency and ensure we use the correct class
    const JQClass = this.constructor as any;
    return new JQClass(results);
}

export = map;
