import type { JqElement, ContentInput } from '../types';

// Import will be updated once html-parser is converted
const { parseHTML } = require('../html-parser');

/**
 * Helper method to normalize content into an array of nodes.
 * @param content - HTML string, node object, JQ object, or array of these
 * @returns Array of node objects
 */
function _normalizeContent(content: ContentInput): JqElement[] {
    if (typeof content === 'string') {
        // HTML string - parse it
        return parseHTML(content);
    }

    if (content && typeof content === 'object') {
        // Check for JQ object first (most specific check)
        if ('nodes' in content && Array.isArray((content as any).nodes)) {
            // JQ object - return its nodes (clone to avoid modifying original)
            return (content as any).nodes.slice();
        }

        // Check for single JqElement
        if (
            'type' in content &&
            (content.type === 'element' || content.type === 'text' || content.type === 'comment')
        ) {
            // Single node object
            return [content as JqElement];
        }

        // Check for array of content
        if (Array.isArray(content)) {
            // Array of content - flatten and normalize each item
            const result: JqElement[] = [];
            for (const item of content) {
                result.push(..._normalizeContent(item));
            }
            return result;
        }
    }

    // Invalid content - return empty array
    return [];
}

export = _normalizeContent;
