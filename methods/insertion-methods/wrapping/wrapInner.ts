import type { HtmlNode, JQ } from '../../../types';

/**
 * Wrap an HTML structure around the content of each element in the set of matched elements.
 * @param wrappingElement - HTML string or element to wrap around the content
 * @returns The JQ instance for chaining
  * @see https://api.jquery.com/wrapInner/
 */
function wrapInner(this: JQ, wrappingElement: string | HtmlNode | JQ): JQ {
    for (const element of this.nodes) {
        if (element.type === 'element') {
            // 1. Create a deep clone of the wrapping structure
            let wrapperStructure: HtmlNode[];

            if (typeof wrappingElement === 'string') {
                wrapperStructure = this._normalizeContent(wrappingElement).map(n => this._cloneNode(n));
            } else if ((wrappingElement as any).nodes && Array.isArray((wrappingElement as any).nodes)) {
                wrapperStructure = (wrappingElement as JQ).nodes.map(n => this._cloneNode(n));
            } else {
                wrapperStructure = this._normalizeContent(wrappingElement as HtmlNode).map(n => this._cloneNode(n));
            }

            if (wrapperStructure.length > 0) {
                const wrapper = wrapperStructure[0];

                // 2. Find the deepest element in the wrapper structure to place content
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

                // 3. Move the element's children into the target container
                if (element.children && element.children.length > 0) {
                    // Ensure target container has a children array
                    if (!targetContainer.children) {
                        targetContainer.children = [];
                    }

                    // Move children
                    targetContainer.children.push(...element.children);

                    // Update parent references
                    for (const child of element.children) {
                        child.parent = targetContainer;
                    }
                }

                // 4. Replace the element's children with the wrapper
                element.children = [wrapper];
                wrapper.parent = element;
            }
        }
    }

    return this;
}

export = wrapInner;
