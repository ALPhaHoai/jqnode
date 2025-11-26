import type { JqElement, JQ } from '../../types';
import { createEmptyJQ } from '../../helpers/jq-factory';

/**
 * Selects the element at a specific index from the matched set (0-based).
 * @see https://api.jquery.com/eq/
 */
function eq(this: JQ, index: number | string | undefined): JQ {
    const originalIndex = index;

    // jQuery behavior:
    // - null becomes 0
    // - undefined becomes NaN, return empty collection
    // - Invalid strings become NaN, return empty collection
    // - Fractional numbers are truncated towards zero
    // - Negative indices wrap around
    // - Fractional indices select element but return empty text (detached behavior)

    let numericIndex = Number(index);

    // Special case: undefined becomes NaN, return empty
    if (index === undefined) {
        return createEmptyJQ(this);
    }

    if (isNaN(numericIndex)) {
        return createEmptyJQ(this);
    }

    // Truncate fractional numbers towards zero
    numericIndex = Math.trunc(numericIndex);

    // Handle negative indices - wrap around like jQuery does
    if (numericIndex < 0) {
        numericIndex = this.nodes.length + numericIndex;
    }

    // Check bounds
    if (numericIndex >= 0 && numericIndex < this.nodes.length) {
        let selectedNode: JqElement | undefined = this.nodes[numericIndex];

        // For fractional indices, create a detached copy to match jQuery behavior
        // jQuery returns an element but with empty text() for fractional indices
        if (typeof originalIndex === 'number' && originalIndex % 1 !== 0) {
            selectedNode = { ...selectedNode, _detached: true } as JqElement;
        }

        return this.pushStack([selectedNode]);
    }
    return this.pushStack([]);
}

export default eq;
