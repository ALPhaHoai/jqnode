import type { HtmlNode, JQ, ContentInput } from '../../../types';
import JQClass from '../../../jq';

/**
 * Insert content to the end of each element in the set of matched elements.
 * @param content - Content to insert
 * @returns The JQ instance for chaining
 */
function append(this: JQ, ...content: ContentInput[]): JQ {
    // Flatten all content arguments into a single array of nodes
    const allContent: HtmlNode[] = [];
    const contentToClone: JQ[] = [];

    for (const item of content) {
        // Check if this is a JQ object containing existing elements
        if (item && typeof item === 'object' && ((item as any).constructor && (item as any).constructor.name === 'JQ' || (item as any).nodes && Array.isArray((item as any).nodes))) {
            // This is a JQ object - we move its elements (jQuery behavior)
            contentToClone.push(item as JQ);
        } else {
            // Other content types - normalize and clone as before
            allContent.push(...this._normalizeContent(item));
        }
    }

    for (const element of this.nodes) {
        if (element.type === 'element' && element.children) {
            // Handle cloned content (HTML strings, etc.)
            if (allContent.length > 0) {
                const clonedContent = allContent.map(node => this._cloneNode(node));
                element.children.push(...clonedContent);
            }

            // Handle JQ objects - move them (jQuery behavior)
            for (const jqObject of contentToClone) {
                for (const nodeToMove of jqObject.nodes) {
                    // Remove from current parent
                    if (nodeToMove.parent && nodeToMove.parent.children) {
                        const index = nodeToMove.parent.children.indexOf(nodeToMove);
                        if (index !== -1) {
                            nodeToMove.parent.children.splice(index, 1);
                        }
                    }

                    // Remove from allRootNodes if present
                    const rootIndex = JQClass.allRootNodes.indexOf(nodeToMove);
                    if (rootIndex !== -1) {
                        JQClass.allRootNodes.splice(rootIndex, 1);
                    }

                    // Add to new parent
                    element.children.push(nodeToMove);
                    nodeToMove.parent = element;
                }
            }
        }
    }

    return this;
}

export = append;
