/**
 * JqCDATASection - Implementation of the DOM CDATASection interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/CDATASection
 */

import { JqText } from './JqText';
import type { JqElement } from '../../types';

/**
 * JqCDATASection implements the DOM CDATASection interface.
 * CDATA sections are used to escape blocks of text containing characters
 * that would otherwise be recognized as markup.
 *
 * CDATASection extends Text and has no specific properties or methods of its own.
 */
export class JqCDATASection extends JqText implements CDATASection {
    // Override to match CDATASection interface requirements
    // TypeScript's lib.dom.d.ts defines these as non-nullable for CharacterData-derived types

    constructor(data: string = '') {
        super(data);
        this.nodeType = this.CDATA_SECTION_NODE;
    }

    /**
     * Factory method to create a JqCDATASection from a JqElement
     */
    static override fromJqElement(node: JqElement): JqCDATASection {
        const cdataSection = new JqCDATASection(node.textData);
        (cdataSection as any)._jqElement = node;
        return cdataSection;
    }

    // Override Node properties
    override get nodeName(): string {
        return '#cdata-section';
    }

    /**
     * Clones this CDATA section node
     */
    override cloneNode(_deep?: boolean): CDATASection {
        const cloned = new JqCDATASection(this._data);

        // CDATA section nodes don't have children, so deep parameter doesn't matter
        return cloned;
    }

    /**
     * Helper method to create a text node
     */
    protected override _createTextNode(data: string): Node {
        return new JqText(data);
    }

    /**
     * Breaks the node into two nodes at a specified offset.
     * Returns the new node (the second half) as a CDATASection.
     */
    override splitText(offset: number): CDATASection {
        if (offset < 0 || offset > this._data.length) {
            throw new DOMException('Index or size is negative or greater than the allowed amount', 'IndexSizeError');
        }

        // Get the text after the offset
        const newData = this._data.substring(offset);

        // Truncate this node's data to the offset
        this.data = this._data.substring(0, offset);

        // Create a new CDATASection node with the remaining data
        const newNode = new JqCDATASection(newData);

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

    // CDATASection inherits all Text methods including:
    // - wholeText property
    // - assignedSlot property
    // And all CharacterData methods including:
    // - appendData(), deleteData(), insertData(), replaceData(), substringData()
    // - after(), before(), remove(), replaceWith()
}
