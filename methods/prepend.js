function prepend(...content) {
    this.debugLog(`JQ.prepend: Prepending content to ${this.nodes.length} elements`);

    // Flatten all content arguments into a single array of nodes
    const allContent = [];
    for (const item of content) {
        allContent.push(...this._normalizeContent(item));
    }

    this.debugLog(`JQ.prepend: Normalized ${allContent.length} nodes to prepend`);

    for (const element of this.nodes) {
        if (element.type === 'element' && element.children) {
            // Clone the content nodes to avoid sharing references
            const clonedContent = allContent.map(node => this._cloneNode(node));
            element.children.unshift(...clonedContent);
            this.debugLog(`JQ.prepend: Prepended ${clonedContent.length} nodes to element <${element.tagName}>`);
        }
    }

    return this;
}

module.exports = prepend;