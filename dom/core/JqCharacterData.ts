/**
 * JqCharacterData - Implementation of the DOM CharacterData interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/CharacterData
 */

import { JqNode } from './JqNode';

/**
 * JqCharacterData implements the DOM CharacterData interface.
 * This is an abstract base class that provides CharacterData functionality.
 * CharacterData extends Node and is the base for Text, Comment, and ProcessingInstruction.
 */
export abstract class JqCharacterData extends JqNode {
    /**
     * The textual data contained in this object
     */
    protected _data: string = '';

    constructor(data: string = '') {
        super();
        this._data = data;
    }

    /**
     * Gets or sets the textual data contained in this object
     */
    get data(): string {
        return this._data;
    }

    set data(value: string) {
        this._data = value;
    }

    /**
     * Returns the size of the string contained in the object
     */
    get length(): number {
        return this._data.length;
    }

    /**
     * Returns the first Element that follows this node and is a sibling
     */
    get nextElementSibling(): Element | null {
        let sibling = this.nextSibling;
        while (sibling) {
            if (sibling.nodeType === this.ELEMENT_NODE) {
                return sibling as unknown as Element;
            }
            sibling = sibling.nextSibling;
        }
        return null;
    }

    /**
     * Returns the first Element that precedes this node and is a sibling
     */
    get previousElementSibling(): Element | null {
        let sibling = this.previousSibling;
        while (sibling) {
            if (sibling.nodeType === this.ELEMENT_NODE) {
                return sibling as unknown as Element;
            }
            sibling = sibling.previousSibling;
        }
        return null;
    }

    // Override Node properties
    override get nodeValue(): string | null {
        return this._data;
    }

    override set nodeValue(value: string | null) {
        this._data = value || '';
    }

    override get textContent(): string {
        return this._data;
    }

    override set textContent(value: string | null) {
        this._data = value || '';
    }

    /**
     * Appends the given string to the data; when this method returns,
     * data contains the concatenated string
     */
    appendData(data: string): void {
        this._data += data;
    }

    /**
     * Removes the specified amount of characters, starting at the specified offset
     */
    deleteData(offset: number, count: number): void {
        if (offset < 0 || offset > this._data.length) {
            throw new DOMException(
                'Index or size is negative or greater than the allowed amount',
                'IndexSizeError',
            );
        }

        const before = this._data.substring(0, offset);
        const after = this._data.substring(offset + count);
        this._data = before + after;
    }

    /**
     * Inserts the specified characters at the specified offset
     */
    insertData(offset: number, data: string): void {
        if (offset < 0 || offset > this._data.length) {
            throw new DOMException(
                'Index or size is negative or greater than the allowed amount',
                'IndexSizeError',
            );
        }

        const before = this._data.substring(0, offset);
        const after = this._data.substring(offset);
        this._data = before + data + after;
    }

    /**
     * Replaces the specified amount of characters, starting at the specified offset,
     * with the specified string
     */
    replaceData(offset: number, count: number, data: string): void {
        if (offset < 0 || offset > this._data.length) {
            throw new DOMException(
                'Index or size is negative or greater than the allowed amount',
                'IndexSizeError',
            );
        }

        const before = this._data.substring(0, offset);
        const after = this._data.substring(offset + count);
        this._data = before + data + after;
    }

    /**
     * Returns a string containing the part of data of the specified length
     * and starting at the specified offset
     */
    substringData(offset: number, count: number): string {
        if (offset < 0 || offset > this._data.length) {
            throw new DOMException(
                'Index or size is negative or greater than the allowed amount',
                'IndexSizeError',
            );
        }

        return this._data.substring(offset, offset + count);
    }

    /**
     * Inserts a set of Node objects or strings in the children list of the
     * CharacterData's parent, just after the CharacterData object
     */
    after(...nodes: (Node | string)[]): void {
        const parent = this.parentNode;
        if (!parent) {
            return;
        }

        const nextSibling = this.nextSibling;
        for (const node of nodes) {
            const nodeToInsert =
                typeof node === 'string'
                    ? this.ownerDocument?.createTextNode(node) || this._createTextNode(node)
                    : node;

            if (nextSibling) {
                parent.insertBefore(nodeToInsert, nextSibling);
            } else {
                parent.appendChild(nodeToInsert);
            }
        }
    }

    /**
     * Inserts a set of Node objects or strings in the children list of the
     * CharacterData's parent, just before the CharacterData object
     */
    before(...nodes: (Node | string)[]): void {
        const parent = this.parentNode;
        if (!parent) {
            return;
        }

        for (const node of nodes) {
            const nodeToInsert =
                typeof node === 'string'
                    ? this.ownerDocument?.createTextNode(node) || this._createTextNode(node)
                    : node;

            parent.insertBefore(nodeToInsert, this);
        }
    }

    /**
     * Removes the object from its parent children list
     */
    remove(): void {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    }

    /**
     * Replaces the characters in the children list of its parent with a set of
     * Node objects or strings
     */
    replaceWith(...nodes: (Node | string)[]): void {
        const parent = this.parentNode;
        if (!parent) {
            return;
        }

        const nextSibling = this.nextSibling;
        this.remove();

        for (const node of nodes) {
            const nodeToInsert =
                typeof node === 'string'
                    ? this.ownerDocument?.createTextNode(node) || this._createTextNode(node)
                    : node;

            if (nextSibling) {
                parent.insertBefore(nodeToInsert, nextSibling);
            } else {
                parent.appendChild(nodeToInsert);
            }
        }
    }

    /**
     * Helper method to create a text node when ownerDocument is not available
     */
    protected abstract _createTextNode(data: string): Node;
}
