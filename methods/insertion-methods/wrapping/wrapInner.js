function wrapInner(wrappingElement) {
    this.debugLog(`JQ.wrapInner: Wrapping inner content of ${this.nodes.length} elements`);

    const wrapperNodes = this._normalizeContent(wrappingElement);
    this.debugLog(`JQ.wrapInner: Normalized ${wrapperNodes.length} wrapper nodes`);

    for (const element of this.nodes) {
        if (element.type === 'element' && wrapperNodes.length > 0) {
            // Clone the wrapper
            const wrapper = this._cloneNode(wrapperNodes[0]);

            // Find the deepest element in the wrapper structure to place content
            let targetContainer = wrapper;
            while (targetContainer.type === 'element' && targetContainer.children && targetContainer.children.length > 0) {
                // Look for the last element child to place content in
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

            // Move the element's children into the target container
            if (element.children && element.children.length > 0) {
                const clonedChildren = element.children.map(child => this._cloneNode(child));

                // Ensure target container has a children array
                if (!targetContainer.children) {
                    targetContainer.children = [];
                }

                // Add cloned children to target container
                targetContainer.children.push(...clonedChildren);

                // Set parent references
                for (const clonedChild of clonedChildren) {
                    clonedChild.parent = targetContainer;
                }
            }

            // Replace the element's children with the wrapper
            element.children = [wrapper];
            wrapper.parent = element;

            this.debugLog(`JQ.wrapInner: Wrapped inner content of <${element.tagName}> with <${wrapper.tagName}>`);
        }
    }

    return this;
}

module.exports = wrapInner;