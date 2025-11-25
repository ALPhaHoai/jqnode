import type { JQ } from '../types';

/**
 * Creates a new JQ instance with the same prototype as the provided instance.
 * This is a helper to eliminate the repeated pattern: Object.create(Object.getPrototypeOf(this))
 * 
 * @param prototype - The JQ instance to clone the prototype from
 * @returns A new JQ instance with empty nodes array
 */
export function createEmptyJQ(prototype: JQ): JQ {
    const newJQ = Object.create(Object.getPrototypeOf(prototype));
    newJQ.nodes = [];
    return newJQ;
}

/**
 * Creates a new JQ instance with the provided nodes.
 * 
 * @param prototype - The JQ instance to clone the prototype from
 * @param nodes - The nodes to populate the new JQ instance with
 * @returns A new JQ instance with the specified nodes
 */
export function createJQWithNodes(prototype: JQ, nodes: any[]): JQ {
    const newJQ = Object.create(Object.getPrototypeOf(prototype));
    newJQ.nodes = nodes;
    return newJQ;
}
