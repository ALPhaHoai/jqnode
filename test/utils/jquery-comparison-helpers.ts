import $ from '../../index';
import jQuery from 'jquery';
import { HtmlNode } from '../../types';

/**
 * Creates a DOM environment for testing node-query vs jQuery comparisons
 * Uses the existing Jest jsdom environment
 * @param {string} html - HTML string to set as document body content
 * @returns {Object} - Object containing both jQuery and node-query instances
 */
function createTestDom(html: string = '<div></div>') {
    // Clear node-query registry for clean state
    $.clearRootNodesRegistry();

    // Set the document body content
    document.body.innerHTML = html;

    // Create jQuery instance using the global document
    const jquery = jQuery(document);

    // Create node-query instance from the document body
    const nodeQuery = $(document.body);

    return {
        nodeQuery,
        jquery,
        document: document,
        window: window
    };
}

/**
 * Normalizes HTML output for comparison between node-query and jQuery
 * Handles differences in whitespace, attribute ordering, and self-closing tags
 * @param {string} html - HTML string to normalize
 * @returns {string} - Normalized HTML
 */
function normalizeHtml(html: string): string {
    if (!html) return '';

    return html
        // Remove extra whitespace between tags
        .replace(/>\s+</g, '><')
        // Remove whitespace around text
        .replace(/\s+/g, ' ')
        // Normalize self-closing tags
        .replace(/<([^>]+)\/>/g, '<$1>')
        // Remove trailing whitespace
        .trim()
        // Normalize quotes around attributes
        .replace(/="([^"]*)"/g, '="$1"')
        // Sort attributes for consistent comparison (basic implementation)
        .replace(/<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z][a-zA-Z0-9-]*="[^"]*")*)(\s*\/?)>/g, (match, tag, attrs, closing) => {
            if (!attrs) return match;

            const attrPairs = attrs.trim().split(/\s+/).sort();
            return `<${tag}${attrPairs.length ? ' ' + attrPairs.join(' ') : ''}${closing}>`;
        });
}

/**
 * Deep comparison utility for comparing node-query results with jQuery results
 * @param {*} nqResult - Result from node-query operation
 * @param {*} jqResult - Result from jQuery operation
 * @param {string} context - Context description for error messages
 * @returns {boolean} - True if results match
 */
function compareResults(nqResult: any, jqResult: any, context: string = ''): boolean {
    // Handle null/undefined
    if (nqResult === jqResult) return true;

    if ((nqResult === null || nqResult === undefined) &&
        (jqResult === null || jqResult === undefined)) return true;

    if (nqResult === null || nqResult === undefined ||
        jqResult === null || jqResult === undefined) {
        throw new Error(`${context}: One result is null/undefined while the other is not. Node-query: ${nqResult}, jQuery: ${jqResult}`);
    }

    // Handle arrays
    if (Array.isArray(nqResult) && Array.isArray(jqResult)) {
        if (nqResult.length !== jqResult.length) {
            throw new Error(`${context}: Array lengths differ. Node-query: ${nqResult.length}, jQuery: ${jqResult.length}`);
        }

        for (let i = 0; i < nqResult.length; i++) {
            if (!compareResults(nqResult[i], jqResult[i], `${context}[${i}]`)) {
                return false;
            }
        }
        return true;
    }

    // Handle objects
    if (typeof nqResult === 'object' && typeof jqResult === 'object') {
        const nqKeys = Object.keys(nqResult).sort();
        const jqKeys = Object.keys(jqResult).sort();

        if (nqKeys.length !== jqKeys.length) {
            throw new Error(`${context}: Object key counts differ. Node-query keys: ${nqKeys.join(',')}, jQuery keys: ${jqKeys.join(',')}`);
        }

        for (let i = 0; i < nqKeys.length; i++) {
            if (nqKeys[i] !== jqKeys[i]) {
                throw new Error(`${context}: Object keys differ at index ${i}. Node-query: ${nqKeys[i]}, jQuery: ${jqKeys[i]}`);
            }

            const key = nqKeys[i];
            if (!compareResults(nqResult[key], jqResult[key], `${context}.${key}`)) {
                return false;
            }
        }
        return true;
    }

    // Handle primitives and other types
    if (nqResult !== jqResult) {
        throw new Error(`${context}: Values differ. Node-query: ${JSON.stringify(nqResult)}, jQuery: ${JSON.stringify(jqResult)}`);
    }

    return true;
}

/**
 * Extracts text content from a DOM element or node-query node structure
 * @param {*} element - DOM element, jQuery object, or node-query node
 * @returns {string} - Text content
 */
function extractTextContent(element: any): string {
    if (!element) return '';

    // Handle jQuery objects
    if (typeof element.text === 'function') {
        return element.text();
    }

    // Handle DOM elements
    if (element.textContent) {
        return element.textContent;
    }

    // Handle node-query node structures
    if (element.nodes && Array.isArray(element.nodes)) {
        return element.nodes
            .filter((node: HtmlNode) => node.type === 'text')
            .map((node: HtmlNode) => (node as any).value || '')
            .join('');
    }

    // Handle plain text
    if (typeof element === 'string') {
        return element;
    }

    return '';
}

/**
 * Extracts HTML content from a DOM element or node-query node structure
 * @param {*} element - DOM element, jQuery object, or node-query node
 * @returns {string} - HTML content
 */
function extractHtmlContent(element: any): string {
    if (!element) return '';

    // Handle jQuery objects
    if (typeof element.html === 'function') {
        return element.html();
    }

    // Handle DOM elements
    if (element.innerHTML) {
        return element.innerHTML;
    }

    // Handle node-query node structures - this might need more complex logic
    // For now, return empty string as node-query might not have direct HTML representation
    if (element.nodes && Array.isArray(element.nodes)) {
        return '';
    }

    return '';
}

export {
    createTestDom,
    normalizeHtml,
    compareResults,
    extractTextContent,
    extractHtmlContent
};
