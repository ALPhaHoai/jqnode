/**
 * Utility functions for working with the HTML node tree.
 */

/**
 * Gets the text content of a node recursively.
 * @param {Object} node - The node to get text content from
 * @returns {string} The concatenated text content
 */
function getTextContent(node) {
    if (node.type === 'text') {
        return node.value;
    }

    if (node.type === 'element') {
        // For DOM elements, use textContent
        if (node._originalElement) {
            return node._originalElement.textContent || '';
        }

        // For parsed HTML nodes, traverse children
        let result = '';
        for (const child of node.children) {
            const childText = getTextContent(child);
            result += childText;
        }

        return result;
    }

    return '';
}

/**
 * Unescapes HTML entities in text content
 * @param {string} text - Text that may contain HTML entities
 * @returns {string} Unescaped text
 */
function unescapeHtml(text) {
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
 * @param {Object} node - The node to convert to HTML
 * @returns {string} The HTML representation of the node
 */
function nodeToHTML(node) {
    if (node.type === 'text') {
        return node.value;
    }

    if (node.type === 'element') {
        const attrs = Object.entries(node.attributes || {})
            .map(([key, value]) => value === true ? key : `${key}="${value}"`)
            .join(' ');

        const tagNameLower = node.tagName ? node.tagName.toLowerCase() : '';
        const tagOpen = attrs ? `<${tagNameLower} ${attrs}>` : `<${tagNameLower}>`;

        if (node.children.length === 0) {
            // Void elements (self-closing tags) in HTML5 don't get closing tags
            const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];
            if (voidElements.includes(tagNameLower)) {
                return tagOpen.replace('>', '>');
            } else {
                return tagOpen.replace('>', '/>');
            }
        }

        const childrenHTML = node.children.map(nodeToHTML).join('');
        return `${tagOpen}${childrenHTML}</${tagNameLower}>`;
    }

    return '';
}

module.exports = {
    getTextContent,
    nodeToHTML,
    unescapeHtml
};
