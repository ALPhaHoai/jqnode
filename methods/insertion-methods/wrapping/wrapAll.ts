import type { HtmlNode, JQ } from '../../../types';

/**
 * Wrap an HTML structure around all elements in the set of matched elements.
 * @param wrappingElement - HTML string or element to wrap around all elements
 * @returns The JQ instance for chaining
 */
function wrapAll(this: JQ, wrappingElement: string | HtmlNode): JQ {
    if (this.nodes.length === 0) {
        return this;
    }

    const wrapperNodes = this._normalizeContent(wrappingElement);
    if (wrapperNodes.length === 0) {
        return this;
    }

    // Get the first element
    const firstElement = this.nodes[0];
    if (!firstElement.parent || !firstElement.parent.children) {
        return this;
    }

    const parent = firstElement.parent;
    if (!parent || !parent.children) {
        return this;
    }
    const siblings = parent.children;

    // Find the first element's position
    const firstIndex = siblings.indexOf(firstElement);
    if (firstIndex === -1) {
        return this;
    }

    // Clone the wrapper
    const wrapper = this._cloneNode(wrapperNodes[0]);

    // Find the deepest element in the wrapper to place our elements
    let targetContainer = wrapper;
    while (targetContainer.type === 'element' && targetContainer.children && targetContainer.children.length > 0) {
        // Look for the last element child
        let foundElementChild = false;
        for (let i = targetContainer.children.length - 1; i >= 0; i--) {
            if (targetContainer.children[i].type === 'element') {
                targetContainer = targetContainer.children[i];
                foundElementChild = true;
                break;
            }
        }
        if (!foundElementChild) {
            break;
        }
    }

    // Clone all our elements and add them to the wrapper
    const clonedElements: HtmlNode[] = [];
    for (const element of this.nodes) {
        const clonedElement = this._cloneNode(element);
        clonedElements.push(clonedElement);
        clonedElement.parent = targetContainer;
    }

    // Ensure target container has a children array
    if (!targetContainer.children) {
        targetContainer.children = [];
    }
    targetContainer.children.push(...clonedElements);

    // Remove the original elements from their parent, keeping track of indices to remove
    const indicesToRemove: number[] = [];
    for (const element of this.nodes) {
        const index = siblings.indexOf(element);
        if (index !== -1) {
            indicesToRemove.push(index);
        }
    }

    // Sort indices in descending order to avoid index shifting during removal
    indicesToRemove.sort((a, b) => b - a);
    for (const index of indicesToRemove) {
        siblings.splice(index, 1);
    }

    // Insert the wrapper at the position of the first element
    siblings.splice(firstIndex, 0, wrapper);
    wrapper.parent = parent;

    return this;
}

export = wrapAll;
