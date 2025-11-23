import type { HtmlNode } from './types';

/**
 * Utility functions for working with the HTML node tree.
 */

/**
 * Gets the text content of a node recursively.
 * @param node - The node to get text content from
 * @returns The concatenated text content
 */
function getTextContent(node: HtmlNode): string {
    if (node.type === 'text') {
        return node.data || '';
    }

    if (node.type === 'element') {
        // For parsed HTML nodes, traverse children
        let result = '';
        if (node.children) {
            for (const child of node.children) {
                const childText = getTextContent(child);
                result += childText;
            }
        }

        return result;
    }

    return '';
}

/**
 * Unescapes HTML entities in text content
 * @param text - Text that may contain HTML entities
 * @returns Unescaped text
 */
function unescapeHtml(text: string): string {
    return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
}

/**
 * Converts a node tree back to HTML string.
 * @param node - The node to convert to HTML
 * @returns The HTML representation of the node
 */
function nodeToHTML(node: HtmlNode): string {
    if (node.type === 'text') {
        return node.data || '';
    }

    if (node.type === 'element') {
        const attrs = Object.entries(node.attribs || {})
            .map(([key, value]) => {
                // Boolean attributes or empty values render as just the key
                if (value === 'true' || value === '') {
                    return key;
                }
                return `${key}="${value}"`;
            })
            .join(' ');

        const tagNameLower = node.name ? node.name.toLowerCase() : '';
        const tagOpen = attrs ? `<${tagNameLower} ${attrs}>` : `<${tagNameLower}>`;

        if (!node.children || node.children.length === 0) {
            // Void elements (self-closing tags) in HTML5 don't get closing tags
            const voidElements = [
                'area',
                'base',
                'br',
                'col',
                'embed',
                'hr',
                'img',
                'input',
                'link',
                'meta',
                'source',
                'track',
                'wbr',
            ];
            if (voidElements.includes(tagNameLower)) {
                return tagOpen;
            } else {
                return tagOpen.replace('>', '/>');
            }
        }

        const childrenHTML = node.children.map(nodeToHTML).join('');
        return `${tagOpen}${childrenHTML}</${tagNameLower}>`;
    }

    return '';
}

export { getTextContent, nodeToHTML, unescapeHtml };
