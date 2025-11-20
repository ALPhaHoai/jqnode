function wrapAll(wrappingElement) {
    if (this.nodes.length === 0) {
        return this;
    }

    const wrapperNodes = this._normalizeContent(wrappingElement);
    if (wrapperNodes.length === 0) {
        return this;
    }

    // Find the common parent and insert position
    const firstElement = this.nodes[0];
    if (!firstElement.parent || !firstElement.parent.children) {
        return this;
    }

    const parent = firstElement.parent;
    const siblings = parent.children;

    // Find the first element's position
    let firstIndex = siblings.indexOf(firstElement);
    if (firstIndex === -1) {
        return this;
    }

    // Clone the wrapper
    const wrapper = this._cloneNode(wrapperNodes[0]);

    // Find the innermost element in the wrapper to place our elements
    let targetContainer = wrapper;
    while (targetContainer.children && targetContainer.children.length > 0) {
        const lastChild = targetContainer.children[targetContainer.children.length - 1];
        if (lastChild.type === 'element') {
            targetContainer = lastChild;
        } else {
            break;
        }
    }

    // Clone all our elements and add them to the wrapper
    const clonedElements = this.nodes.map(node => this._cloneNode(node));
    if (targetContainer.children) {
        targetContainer.children.push(...clonedElements);
    } else {
        targetContainer.children = [...clonedElements];
    }

    for (const clonedElement of clonedElements) {
        clonedElement.parent = targetContainer;
    }

    // Remove all original elements from their parent
    const indicesToRemove = this.nodes.map(node => siblings.indexOf(node)).filter(index => index !== -1).sort((a, b) => b - a);
    for (const index of indicesToRemove) {
        siblings.splice(index, 1);
    }

    // Insert the wrapper at the position of the first element
    siblings.splice(firstIndex, 0, wrapper);
    wrapper.parent = parent;
    return this;
}

module.exports = wrapAll;