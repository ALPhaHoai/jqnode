import type { HtmlNode, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Wrap an HTML structure around all elements in the set of matched elements.
 * @param wrappingElement - HTML string or element to wrap around all elements
 * @returns The JQ instance for chaining
 * @see https://api.jquery.com/wrapAll/
 */
function wrapAll(this: JQ, wrappingElement: string | HtmlNode | JQ): JQ {
    if (this.nodes.length === 0) {
        return this;
    }

    // 1. Create a deep clone of the wrapping structure
    let wrapperStructure: HtmlNode[];

    if (typeof wrappingElement === 'string') {
        wrapperStructure = this._normalizeContent(wrappingElement).map((n) => this._cloneNode(n));
    } else if ((wrappingElement as any).nodes && Array.isArray((wrappingElement as any).nodes)) {
        wrapperStructure = (wrappingElement as JQ).nodes.map((n) => this._cloneNode(n));
    } else {
        wrapperStructure = this._normalizeContent(wrappingElement as HtmlNode).map((n) =>
            this._cloneNode(n),
        );
    }

    if (wrapperStructure.length === 0) {
        return this;
    }

    const wrapper = wrapperStructure[0];

    // 2. Find the deepest element in the wrapper to place our elements
    let targetContainer = wrapper;
    while (targetContainer.children && targetContainer.children.length > 0) {
        let foundElement = false;
        for (const child of targetContainer.children) {
            if (child.type === 'element') {
                targetContainer = child;
                foundElement = true;
                break; // Go down the first element branch
            }
        }
        if (!foundElement) break;
    }

    // 3. Insert the wrapper before the first matched element
    const firstElement = this.nodes[0];
    if (firstElement.parent && firstElement.parent.children) {
        const siblings = firstElement.parent.children;
        const index = siblings.indexOf(firstElement);
        if (index !== -1) {
            siblings.splice(index, 0, wrapper);
            wrapper.parent = firstElement.parent;
        }
    } else if (JQClass.allRootNodes.includes(firstElement)) {
        const index = JQClass.allRootNodes.indexOf(firstElement);
        if (index !== -1) {
            JQClass.allRootNodes.splice(index, 0, wrapper);
            wrapper.parent = undefined;
        }
    }

    // 4. Move all matched elements into the target container
    if (!targetContainer.children) {
        targetContainer.children = [];
    }

    for (const element of this.nodes) {
        // Detach from current parent
        if (element.parent && element.parent.children) {
            const index = element.parent.children.indexOf(element);
            if (index !== -1) {
                element.parent.children.splice(index, 1);
            }
        } else if (JQClass.allRootNodes.includes(element)) {
            const index = JQClass.allRootNodes.indexOf(element);
            if (index !== -1) {
                JQClass.allRootNodes.splice(index, 1);
            }
        }

        // Add to target container
        targetContainer.children.push(element);
        element.parent = targetContainer;
    }

    return this;
}

export = wrapAll;
