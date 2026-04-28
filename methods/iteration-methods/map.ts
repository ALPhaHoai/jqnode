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
    return this.pushStack(results as any);
}

export default map;
