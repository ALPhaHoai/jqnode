import type { JqElement, JQ, ContentInput } from '../../../types';
import JQClass from '../../../jq';

/**
 * Insert content before each element in the set of matched elements.
 * @param content - Content to insert
 * @returns The JQ instance for chaining
 * @see https://api.jquery.com/before/
 */
function before(this: JQ, ...content: ContentInput[]): JQ {
    // 1. Collect all nodes to be inserted
    const nodesToInsert: JqElement[] = [];
    for (const item of content) {
        // Check if this is a JQ object containing existing elements
        if (
            item &&
            typeof item === 'object' &&
            (((item as any).constructor && (item as any).constructor.name === 'JQ') ||
                ((item as any).nodes && Array.isArray((item as any).nodes)))
        ) {
            nodesToInsert.push(...(item as any).nodes);
        } else {
            nodesToInsert.push(...this._normalizeContent(item));
        }
    }

    // 2. Insert before each target
    const lastIndex = this.nodes.length - 1;

    for (let i = 0; i < this.nodes.length; i++) {
        const target = this.nodes[i];
        if (!target.parent || !target.parent.children) continue;

        const siblings = target.parent.children;
        const targetIndex = siblings.indexOf(target);
        if (targetIndex === -1) continue;

        const isLast = i === lastIndex;
        const nodesToAddForTarget: JqElement[] = [];

        for (const node of nodesToInsert) {
            let nodeToAdd: JqElement;

            if (isLast) {
                // For the last target, we move the original node
                nodeToAdd = node;

                // Detach from current parent if exists
                if (nodeToAdd.parent && nodeToAdd.parent.children) {
                    const index = nodeToAdd.parent.children.indexOf(nodeToAdd);
                    if (index !== -1) {
                        nodeToAdd.parent.children.splice(index, 1);
                    }
                }

                // Remove from allRootNodes if present
                const rootIndex = JQClass.allRootNodes.indexOf(nodeToAdd);
                if (rootIndex !== -1) {
                    JQClass.allRootNodes.splice(rootIndex, 1);
                }
            } else {
                // For non-last targets, we clone the node
                nodeToAdd = this._cloneNode(node);
            }

            nodeToAdd.parent = target.parent;
            nodesToAddForTarget.push(nodeToAdd);
        }

        // Insert all nodes at once before the target
        siblings.splice(targetIndex, 0, ...nodesToAddForTarget);
    }

    return this;
}

export default before;
