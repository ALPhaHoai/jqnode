import type { HtmlNode, JQ, ContentInput } from '../../../types';
import JQClass from '../../../jq';

/**
 * Insert content after each element in the set of matched elements.
 * @param content - Content to insert
 * @returns The JQ instance for chaining
 */
function after(this: JQ, ...content: ContentInput[]): JQ {
    // Flatten all content arguments into a single array of nodes
    const allContent: HtmlNode[] = [];
    const contentToClone: JQ[] = [];

    for (const item of content) {
        // Check if this is a JQ object containing existing elements
        if (item && typeof item === 'object' && ((item as any).constructor && (item as any).constructor.name === 'JQ' || (item as any).nodes && Array.isArray((item as any).nodes))) {
            // This is a JQ object - we clone its elements and remove originals (jQuery behavior)
            contentToClone.push(item as JQ);
        } else {
            // Other content types - normalize and clone as before
            allContent.push(...this._normalizeContent(item));
        }
    }

    for (const element of this.nodes) {
        if (element.parent && element.parent.children) {
            const siblings = element.parent.children;
            const elementIndex = siblings.indexOf(element);

            if (elementIndex !== -1) {
                // Handle cloned content (HTML strings, etc.)
                if (allContent.length > 0) {
                    const clonedContent = allContent.map(node => this._cloneNode(node));
                    siblings.splice(elementIndex + 1, 0, ...clonedContent);

                    // Set parent references for the cloned nodes
                    for (const clonedNode of clonedContent) {
                        clonedNode.parent = element.parent;
                    }
                }

                // Handle JQ objects - clone them and remove originals
                let insertionIndex = elementIndex + 1;
                for (const jqObject of contentToClone) {
                    const clonedNodes: HtmlNode[] = [];
                    for (const nodeToClone of jqObject.nodes) {
                        // Clone the node
                        const clonedNode = this._cloneNode(nodeToClone);
                        clonedNodes.push(clonedNode);

                        // Remove original from current parent if it has one
                        if (nodeToClone.parent && nodeToClone.parent.children) {
                            const index = nodeToClone.parent.children.indexOf(nodeToClone);
                            if (index !== -1) {
                                nodeToClone.parent.children.splice(index, 1);
                            }
                        }

                        // Remove original from allRootNodes if present
                        const rootIndex = JQClass.allRootNodes.indexOf(nodeToClone);
                        if (rootIndex !== -1) {
                            JQClass.allRootNodes.splice(rootIndex, 1);
                        }
                    }

                    // Insert all cloned nodes at once in the correct order
                    siblings.splice(insertionIndex, 0, ...clonedNodes);
                    for (const clonedNode of clonedNodes) {
                        clonedNode.parent = element.parent;
                    }
                    insertionIndex += clonedNodes.length;
                }
            }
        }
    }

    return this;
}

export = after;
