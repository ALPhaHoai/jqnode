function appendTo(target) {
    this.debugLog(`JQ.appendTo: Appending ${this.nodes.length} elements to target`);

    let targetJQ;
    let isDynamicTarget = false;
    if (target instanceof this.constructor) {
        targetJQ = target;
    } else if (typeof target === 'string') {
        if (target.trim().startsWith('<')) {
            // HTML string - parse it and mark as dynamic
            targetJQ = new this.constructor(this._normalizeContent(target));
            isDynamicTarget = true;
        } else {
            // Selector string - find matching elements
            const {selectNodes} = require('../selector');
            targetJQ = new this.constructor(selectNodes(this.constructor.allRootNodes, target));
        }
    } else {
        // Other content - normalize it
        targetJQ = new this.constructor(this._normalizeContent(target));
        isDynamicTarget = true;
    }
    this.debugLog(`JQ.appendTo: Target has ${targetJQ.nodes.length} elements`);

    for (const targetElement of targetJQ.nodes) {
        if (targetElement.type === 'element' && targetElement.children) {
            // Clone our nodes to avoid sharing references
            const clonedNodes = this.nodes.map(node => this._cloneNode(node));
            targetElement.children.push(...clonedNodes);

            // Set parent references for the cloned nodes
            for (const clonedNode of clonedNodes) {
                clonedNode.parent = targetElement;
            }

            this.debugLog(`JQ.appendTo: Appended ${clonedNodes.length} elements to target <${targetElement.tagName}>`);
        }
    }

    // If this is a dynamically created target, add it to the root
    if (isDynamicTarget) {
        for (const targetElement of targetJQ.nodes) {
            if (!this.constructor.allRootNodes.includes(targetElement)) {
                this.constructor.allRootNodes.push(targetElement);
                this.debugLog(`JQ.appendTo: Added dynamic target <${targetElement.tagName}> to root nodes`);
            }
        }
    }

    return this;
}

module.exports = appendTo;