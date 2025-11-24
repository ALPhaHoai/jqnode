/**
 * JqComment - Implementation of the DOM Comment interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Comment
 */

import { JqCharacterData } from './JqCharacterData';
import { JqElement } from './JqElement';

/**
 * JqComment implements the DOM Comment interface.
 * Comment nodes represent textual notations within markup; 
 * they are not displayed but are available in the document's source.
 */
export class JqComment extends JqCharacterData implements Comment {
    /**
     * Internal reference to the JqElement if this is wrapping one
     */
    private _jqElement: JqElement | null = null;

    constructor(data: string = '') {
        super(data);
        this.nodeType = this.COMMENT_NODE;
    }

    /**
     * Factory method to create a JqComment from a JqElement
     */
    static fromJqElement(node: JqElement): JqComment {
        const comment = new JqComment(node.data);
        comment._jqElement = node;
        return comment;
    }

    /**
     * Gets the underlying JqElement if available
     */
    getJqElement(): JqElement | null {
        return this._jqElement;
    }

    // Override Node properties
    override get nodeName(): string {
        return '#comment';
    }

    /**
     * Clones this comment node
     */
    override cloneNode(): Comment {
        const cloned = new JqComment(this._data);

        // Comment nodes don't have children, so deep parameter doesn't matter
        return cloned;
    }

    /**
     * Helper method to create a text node
     */
    protected override _createTextNode(data: string): Node {
        // For comment nodes, we still create text nodes when needed for operations
        // like before(), after(), etc.
        // We'll need to import JqText for this, or create a simple text node
        // For now, we'll create a simple object that satisfies the Node interface
        return {
            nodeType: this.TEXT_NODE,
            nodeName: '#text',
            nodeValue: data,
            textContent: data,
        } as unknown as Node;
    }

    // Sync data changes with JqElement if present
    override set data(value: string) {
        super.data = value;
        if (this._jqElement) {
            this._jqElement.data = value;
        }
    }

    override get data(): string {
        if (this._jqElement) {
            return this._jqElement.data;
        }
        return super.data;
    }

    // ParentNode and ChildNode are not applicable to Comment nodes,
    // but they're part of the Comment interface signature through CharacterData
    // The after, before, remove, replaceWith methods are already implemented in JqCharacterData
}
