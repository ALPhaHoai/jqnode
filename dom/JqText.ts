/**
 * JqText - Implementation of the DOM Text interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Text
 */

import { JqCharacterData } from './JqCharacterData';
import { JqElement } from './JqElement';

/**
 * JqText implements the DOM Text interface.
 * Text nodes represent textual content in the DOM.
 */
export class JqText extends JqCharacterData implements Text {
    /**
     * Internal reference to the JqElement if this is wrapping one
     */
    private _jqElement: JqElement | null = null;

    constructor(data: string = '') {
        super(data);
        this.nodeType = this.TEXT_NODE;
    }

    /**
     * Factory method to create a JqText from a JqElement
     */
    static fromJqElement(node: JqElement): JqText {
        const text = new JqText(node.data);
        text._jqElement = node;
        return text;
    }

    /**
     * Gets the underlying JqElement if available
     */
    getJqElement(): JqElement | null {
        return this._jqElement;
    }

    // Override Node properties
    override get nodeName(): string {
        return '#text';
    }

    override get ownerDocument(): Document {
        return super.ownerDocument as Document;
    }

    override set ownerDocument(value: Document) {
        super.ownerDocument = value;
    }

    /**
     * Returns the HTMLSlotElement representing the <slot> the node is inserted in.
     * In jqnode, this always returns null as we don't support Shadow DOM.
     */
    get assignedSlot(): HTMLSlotElement | null {
        return null;
    }

    /**
     * Returns a string containing the text of all Text nodes logically adjacent
     * to this Node, concatenated in document order.
     */
    get wholeText(): string {
        let text = this._data;

        // Collect text from previous text siblings
        let prevSibling = this.previousSibling;
        while (prevSibling && prevSibling.nodeType === this.TEXT_NODE) {
            text = (prevSibling as Text).data + text;
            prevSibling = prevSibling.previousSibling;
        }

        // Collect text from next text siblings
        let nextSibling = this.nextSibling;
        while (nextSibling && nextSibling.nodeType === this.TEXT_NODE) {
            text = text + (nextSibling as Text).data;
            nextSibling = nextSibling.nextSibling;
        }

        return text;
    }

    /**
     * Breaks the node into two nodes at a specified offset.
     * Returns the new node (the second half).
     */
    splitText(offset: number): Text {
        if (offset < 0 || offset > this._data.length) {
            throw new DOMException('Index or size is negative or greater than the allowed amount', 'IndexSizeError');
        }

        // Get the text after the offset
        const newData = this._data.substring(offset);

        // Truncate this node's data to the offset
        this._data = this._data.substring(0, offset);

        // Create a new text node with the remaining data
        const newNode = new JqText(newData);

        // If this node has a parent, insert the new node after this one
        if (this.parentNode) {
            const nextSibling = this.nextSibling;
            if (nextSibling) {
                this.parentNode.insertBefore(newNode, nextSibling);
            } else {
                this.parentNode.appendChild(newNode);
            }
        }

        return newNode;
    }

    /**
     * Clones this text node
     */
    override cloneNode(): Text {
        const cloned = new JqText(this._data);

        // Text nodes don't have children, so deep parameter doesn't matter
        return cloned;
    }

    /**
     * Helper method to create a text node
     */
    protected override _createTextNode(data: string): Node {
        return new JqText(data);
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

    // ParentNode and ChildNode are not applicable to Text nodes,
    // but they're part of the Text interface signature through CharacterData
    // The after, before, remove, replaceWith methods are already implemented in JqCharacterData
}
