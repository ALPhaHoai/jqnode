/**
 * HTML Escape Utilities
 * 
 * Functions for safely escaping special characters in HTML content.
 * These utilities are used for serializing DOM nodes to HTML strings.
 */

/**
 * Escapes special characters in text content for HTML
 * @param text - The text content to escape
 * @returns The escaped text safe for HTML
 */
export function escapeText(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Escapes special characters in attribute values for HTML
 * @param value - The attribute value to escape
 * @returns The escaped value safe for HTML attributes
 */
export function escapeAttribute(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Escapes special characters in comment content
 * Note: Comments cannot contain -- so we replace it with - -
 * @param text - The comment text to escape
 * @returns The escaped comment text
 */
export function escapeComment(text: string): string {
    return text.replace(/--/g, '- -');
}
