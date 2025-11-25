import type { JqElement, JQ, ContentInput } from '../../../types';
import JQClass from '../../../jq';

/**
 * Insert content to the beginning of each element in the set of matched elements.
 * @param content - Content to insert
 * @returns The JQ instance for chaining
 * @see https://api.jquery.com/prepend/
 */
function prepend(this: JQ, ...content: ContentInput[]): JQ {
    // 1. Collect all nodes to be prepended
    const nodesToPrepend: JqElement[] = [];
    for (const item of content) {
        // Check if this is a JQ object containing existing elements
        if (
            item &&
            typeof item === 'object' &&
            (((item as any).constructor && (item as any).constructor.name === 'JQ') ||
                ((item as any).nodes && Array.isArray((item as any).nodes)))
        ) {
            nodesToPrepend.push(...(item as any).nodes);
        } else {
            nodesToPrepend.push(...this._normalizeContent(item));
        }
    }

    // 2. Prepend to each target
    const lastIndex = this.nodes.length - 1;
    for (let i = 0; i < this.nodes.length; i++) {
        const target = this.nodes[i];
        if (target.internalType !== 'element' || !target.children) continue;

        const isLast = i === lastIndex;
        const nodesToAddForTarget: JqElement[] = [];

        for (const node of nodesToPrepend) {
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

            nodeToAdd.parent = target;
            nodesToAddForTarget.push(nodeToAdd);
        }

        target.children.unshift(...nodesToAddForTarget);
    }

    return this;
}

export default prepend;
