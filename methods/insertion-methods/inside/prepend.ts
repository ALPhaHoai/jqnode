import type { HtmlNode, JQ, ContentInput } from '../../../types';

/**
 * Insert content to the beginning of each element in the set of matched elements.
 * @param content - Content to insert
 * @returns The JQ instance for chaining
 */
function prepend(this: JQ, ...content: ContentInput[]): JQ {
    // Flatten all content arguments into a single array of nodes
    const allContent: HtmlNode[] = [];
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

export = prepend;
