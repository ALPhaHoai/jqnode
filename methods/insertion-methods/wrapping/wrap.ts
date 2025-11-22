import type { HtmlNode, JQ } from '../../../types';

/**
 * Wrap an HTML structure around each element in the set of matched elements.
 * @param wrappingElement - HTML string or element to wrap around each element
 * @returns The JQ instance for chaining
 */
function wrap(this: JQ, wrappingElement: string | HtmlNode): JQ {
    const wrapperNodes = this._normalizeContent(wrappingElement);

    for (const element of this.nodes) {
        if (element.parent && element.parent.children) {
            const siblings = element.parent.children;
            const elementIndex = siblings.indexOf(element);

            if (elementIndex !== -1 && wrapperNodes.length > 0) {
                // Clone the wrapper to avoid sharing references
                const wrapper = this._cloneNode(wrapperNodes[0]);

                // Find the innermost element in the wrapper to place our element
                let targetContainer = wrapper;
                while (targetContainer.children && targetContainer.children.length > 0) {
                    const lastChild = targetContainer.children[targetContainer.children.length - 1];
                    if (lastChild.type === 'element') {
                        targetContainer = lastChild;
                    } else {
                        break;
                    }
                }

                // Clone the element and add it to the wrapper
                const clonedElement = this._cloneNode(element);
                if (targetContainer.children) {
                    targetContainer.children.push(clonedElement);
                } else {
                    targetContainer.children = [clonedElement];
                }
                clonedElement.parent = targetContainer;

                // Replace the original element with the wrapper
                siblings[elementIndex] = wrapper;
                wrapper.parent = element.parent;
            }
        }
    }

    return this;
}

export = wrap;
