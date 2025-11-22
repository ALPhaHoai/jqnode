import type { HtmlNode, ContentInput } from '../types';

// Import will be updated once html-parser is converted
const { parseHTML } = require('../html-parser');

/**
 * Helper method to normalize content into an array of nodes.
 * @this {object} JQ instance
 * @param content - HTML string, node object, JQ object, or array of these
 * @returns Array of node objects
 */
function _normalizeContent(this: any, content: ContentInput): HtmlNode[] {
    if (typeof content === 'string') {
        // HTML string - parse it
        return parseHTML(content);
    } else if (content && typeof content === 'object') {
        // Type guard for HtmlNode
        if ('type' in content && (content.type === 'element' || content.type === 'text' || content.type === 'comment')) {
            // Single node object
            return [content as HtmlNode];
        } else if ('constructor' in content && content.constructor && content.constructor.name === 'JQ') {
            // JQ object - return its nodes
            return (content as any).nodes.slice(); // Clone to avoid modifying original
        } else if ('nodes' in content && Array.isArray((content as any).nodes)) {
            // JQ object - return its nodes (more robust check for browser compatibility)
            return (content as any).nodes.slice(); // Clone to avoid modifying original
        } else if (Array.isArray(content)) {
            // Array of content - flatten and normalize each item
            const result: HtmlNode[] = [];
            for (const item of content) {
                result.push(...this._normalizeContent(item));
            }
            return result;
        }
    }

    // Invalid content - return empty array
    return [];
}

export = _normalizeContent;
