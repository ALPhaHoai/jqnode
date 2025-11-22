import type { HtmlNode, JQ } from '../../types';


/**
 * Selects the element at a specific index from the matched set (0-based).
 */
function eq(this: JQ, index: number | string | undefined): JQ {
    const originalIndex = index;

    // jQuery behavior:
    // - null becomes 0
    // - undefined becomes NaN, return empty collection
    // - Invalid strings become NaN, return empty collection
    // - Fractional numbers are truncated towards zero
    // - Negative indices wrap around

    let numericIndex = Number(index);

    // Special case: undefined becomes NaN, return empty
    if (index === undefined) {
        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = [];
        return result;
    }

    if (isNaN(numericIndex)) {
        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = [];
        return result;
    }

    // Truncate fractional numbers towards zero
    numericIndex = Math.trunc(numericIndex);

    // Handle negative indices - wrap around like jQuery does
    if (numericIndex < 0) {
        numericIndex = this.nodes.length + numericIndex;
    }

    // Check bounds
    if (numericIndex >= 0 && numericIndex < this.nodes.length) {
        let selectedNode: HtmlNode | undefined = this.nodes[numericIndex];

        // For fractional indices, create a detached copy to match jQuery behavior
        if (typeof originalIndex === 'number' && originalIndex % 1 !== 0) {
            selectedNode = { ...selectedNode, _detached: true } as HtmlNode;
        }

        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = [selectedNode];
        result._prevObject = this;
        return result;
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = [];
    result._prevObject = this;
    return result;
}

export = eq;
