import { getTextContent, unescapeHtml } from '../utils';
import type { JqElement } from '../types';
import { JqElement as JqElementClass } from '../dom/JqNode/JqElement/JqElement';

/**
 * Gets the combined text content from a collection of nodes.
 * This is the common logic shared by text() and normalizedText() methods.
 * 
 * @param nodes - Array of JqElement nodes to extract text from
 * @returns The combined, unescaped text content or empty string
 */
export function getElementsText(nodes: JqElement[]): string {
    // Get text content from element nodes only
    const elementNodes = nodes.filter(
        (node: JqElement) => node.internalType === 'element' || node.nodeType === 1,
    );

    // Check if any element is detached (from fractional eq() indices)
    if (elementNodes.some((node: JqElement) => node._detached)) {
        return '';
    }

    if (elementNodes.length === 0) {
        return '';
    }

    const result = elementNodes
        .map((node: JqElement) => {
            // Use HTML5 textContent property as single source of truth
            if ('textContent' in node) {
                return node.textContent || '';
            }
            // Fallback to internal node traversal for parsed nodes
            return getTextContent(node);
        })
        .join('');

    return unescapeHtml(result);
}

/**
 * Sets the text content on a collection of nodes.
 * This is the common logic shared by text() and normalizedText() setter methods.
 * 
 * @param nodes - Array of JqElement nodes to set text content on
 * @param value - The text value to set
 */
export function setElementsText(nodes: JqElement[], value: string): void {
    nodes.forEach((node: JqElement) => {
        // Use HTML5 textContent property as single source of truth
        if ('textContent' in node) {
            node.textContent = value;
        } else if ('children' in node && Array.isArray((node as JqElement).children)) {
            // Fallback for internal nodes - replace children with text node
            const textNode = new JqElementClass('text');
            textNode.textData = value || '';
            (node as JqElement).children = [textNode];
        }
    });
}
