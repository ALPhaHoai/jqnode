import type { JqElement, JQ } from '../types';

/**
 * Type Guard Utilities
 * 
 * Helper functions for checking node types and JQ objects.
 * These replace repeated internalType checks throughout the codebase.
 */

/**
 * Checks if a node is an element node
 * @param node - The node to check
 * @returns True if the node is an element
 */
export function isElementNode(node: JqElement): boolean {
    return node.internalType === 'element';
}

/**
 * Checks if a node is a text node
 * @param node - The node to check
 * @returns True if the node is a text node
 */
export function isTextNode(node: JqElement): boolean {
    return node.internalType === 'text';
}

/**
 * Checks if a node is a comment node
 * @param node - The node to check
 * @returns True if the node is a comment node
 */
export function isCommentNode(node: JqElement): boolean {
    return node.internalType === 'comment';
}

/**
 * Filters an array of nodes to only include element nodes
 * @param nodes - Array of nodes to filter
 * @returns Array containing only element nodes
 */
export function filterElements(nodes: JqElement[]): JqElement[] {
    return nodes.filter(isElementNode);
}

/**
 * Checks if an item is a JQ object instance
 * @param item - The item to check
 * @returns True if the item is a JQ object
 */
export function isJQObject(item: any): item is JQ {
    return (
        item &&
        typeof item === 'object' &&
        (item.constructor?.name === 'JQ' || (item.nodes && Array.isArray(item.nodes)))
    );
}
