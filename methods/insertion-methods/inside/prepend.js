function prepend(...content) {
    // Flatten all content arguments into a single array of nodes
    const allContent = [];
    for (const item of content) {
        allContent.push(...this._normalizeContent(item));
    }
    for (const element of this.nodes) {
        if (element.type === 'element' && element.children) {
            // Clone the content nodes to avoid sharing references
            const clonedContent = allContent.map(node => this._cloneNode(node));
            element.children.unshift(...clonedContent);
        }
    }

    return this;
}

module.exports = prepend;