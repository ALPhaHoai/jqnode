import { nodeToHTML } from '../../utils';
import { parseHTML } from '../../html-parser';
import type { HtmlNode, JQ, GetterSetterReturn } from '../../types';

/**
 * Gets or sets the inner HTML of elements in the collection.
 * @see https://api.jquery.com/html/
 */
function html(this: JQ, htmlString?: string): GetterSetterReturn<string> {
    if (htmlString === undefined) {
        // Get inner HTML from first element
        if (this.nodes.length === 0) {
            return undefined;
        }

        const firstNode: HtmlNode = this.nodes[0];
        if (firstNode.type === 'element') {
            // Return the inner HTML (contents of the element)
            const result = (firstNode.children || []).map(child => {
                return nodeToHTML(child);
            }).join('');
            return result;
        } else {
            // For text nodes or other types, return their HTML representation
            const result = nodeToHTML(firstNode);
            return result;
        }
    }

    // Set inner HTML on all element nodes
    this.nodes.forEach((node: HtmlNode) => {
        if (node.type === 'element') {
            // Parse the HTML string and set as children
            const parsedNodes = parseHTML(htmlString);
            node.children = parsedNodes;
        }
    });

    return this;
}

export = html;
