/**
 * JqNode - Implementation of the DOM Node interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Node
 */

import { JqNodeListOf } from '../collections/JqNodeList';

/**
 * JqNode implements the DOM Node interface.
 * This is an abstract base class that provides Node functionality.
 */
export class JqNode implements Node {
    // Node type constants
    readonly ELEMENT_NODE = 1;
    readonly ATTRIBUTE_NODE = 2;
    readonly TEXT_NODE = 3;
    readonly CDATA_SECTION_NODE = 4;
    readonly ENTITY_REFERENCE_NODE = 5; // Deprecated but part of the spec
    readonly ENTITY_NODE = 6; // Deprecated but part of the spec
    readonly PROCESSING_INSTRUCTION_NODE = 7;
    readonly COMMENT_NODE = 8;
    readonly DOCUMENT_NODE = 9;
    readonly DOCUMENT_TYPE_NODE = 10;
    readonly DOCUMENT_FRAGMENT_NODE = 11;
    readonly NOTATION_NODE = 12; // Deprecated but part of the spec

    // Document position constants
    readonly DOCUMENT_POSITION_DISCONNECTED = 1;
    readonly DOCUMENT_POSITION_PRECEDING = 2;
    readonly DOCUMENT_POSITION_FOLLOWING = 4;
    readonly DOCUMENT_POSITION_CONTAINS = 8;
    readonly DOCUMENT_POSITION_CONTAINED_BY = 16;
    readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;

    // Node properties - to be implemented by subclasses
    baseURI: string = '';

    get childNodes(): NodeListOf<ChildNode> {
        return new JqNodeListOf<ChildNode>([]) as unknown as NodeListOf<ChildNode>;
    }

    get firstChild(): ChildNode | null {
        return null;
    }

    isConnected: boolean = false;

    get lastChild(): ChildNode | null {
        return null;
    }

    get nextSibling(): ChildNode | null {
        return null;
    }

    get nodeName(): string {
        return '';
    }

    nodeType: number = 0;

    get nodeValue(): string | null {
        return null;
    }

    set nodeValue(_value: string | null) {
        // To be implemented by subclasses
    }

    private _ownerDocument: Document | null = null;

    get ownerDocument(): Document | null {
        return this._ownerDocument;
    }

    set ownerDocument(value: Document | null) {
        this._ownerDocument = value;
    }

    get parentNode(): ParentNode | null {
        return null;
    }

    parentElement: HTMLElement | null = null;

    get previousSibling(): ChildNode | null {
        return null;
    }

    /**
     * Gets or sets the text content of the node and its descendants
     */
    get textContent(): string | null {
        return null;
    }

    set textContent(_value: string | null) {
        // To be implemented by subclasses
    }

    /**
     * Adds a node to the end of the list of children of this node
     */
    appendChild<T extends Node>(_node: T): T {
        throw new Error('appendChild not implemented');
    }

    /**
     * Clones a node, and optionally, all of its contents
     */
    cloneNode(_deep?: boolean): Node {
        throw new Error('cloneNode not implemented');
    }

    /**
     * Compares the position of the current node against another node
     */
    compareDocumentPosition(other: Node): number {
        if (this === other) {
            return 0;
        }
        // Default implementation - can be overridden for more accurate positioning
        return this.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }

    /**
     * Returns true or false indicating whether a node is a descendant of the calling node
     */
    contains(other: Node | null): boolean {
        if (!other || other === this) {
            return false;
        }

        let node: Node | null = other.parentNode;
        while (node) {
            if (node === (this as Node)) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * Returns the context object's root
     */
    getRootNode(_options?: GetRootNodeOptions): Node {
        let root: Node = this;
        while (root.parentNode) {
            root = root.parentNode;
        }
        return root;
    }

    /**
     * Returns a boolean indicating whether the element has any child nodes
     */
    hasChildNodes(): boolean {
        return this.childNodes.length > 0;
    }

    /**
     * Inserts a node before a reference node as a child of this node
     */
    insertBefore<T extends Node>(_node: T, _child: Node | null): T {
        throw new Error('insertBefore not implemented');
    }

    /**
     * Returns whether the specified namespace is the default namespace
     */
    isDefaultNamespace(_namespace: string | null): boolean {
        return false;
    }

    /**
     * Tests whether two nodes are equal
     */
    isEqualNode(otherNode: Node | null): boolean {
        if (!otherNode) {
            return false;
        }

        if (this.nodeType !== otherNode.nodeType) {
            return false;
        }

        if (this.nodeName !== otherNode.nodeName) {
            return false;
        }

        if (this.nodeValue !== otherNode.nodeValue) {
            return false;
        }

        // Compare children count
        if (this.childNodes.length !== otherNode.childNodes.length) {
            return false;
        }

        // Compare children recursively
        for (let i = 0; i < this.childNodes.length; i++) {
            if (!this.childNodes[i].isEqualNode(otherNode.childNodes[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Tests whether two nodes are the same (reference equality)
     */
    isSameNode(otherNode: Node | null): boolean {
        return this === otherNode;
    }

    /**
     * Returns the prefix for a given namespace URI
     */
    lookupPrefix(_namespace: string | null): string | null {
        return null;
    }

    /**
     * Returns the namespace URI for a given prefix
     */
    lookupNamespaceURI(_prefix: string | null): string | null {
        return null;
    }

    /**
     * Normalizes the node - merges adjacent text nodes and removes empty text nodes
     */
    normalize(): void {
        // To be implemented by subclasses
    }

    /**
     * Removes a child node from the current node
     */
    removeChild<T extends Node>(_child: T): T {
        throw new Error('removeChild not implemented');
    }

    /**
     * Replaces a child node within the current node
     */
    replaceChild<T extends Node>(_node: Node, _child: T): T {
        throw new Error('replaceChild not implemented');
    }

    // EventTarget methods (Node extends EventTarget)
    addEventListener(
        _type: string,
        _callback: EventListenerOrEventListenerObject | null,
        _options?: boolean | AddEventListenerOptions,
    ): void {
        // Stub implementation
    }

    removeEventListener(
        _type: string,
        _callback: EventListenerOrEventListenerObject | null,
        _options?: boolean | EventListenerOptions,
    ): void {
        // Stub implementation
    }

    dispatchEvent(_event: Event): boolean {
        return false;
    }
}
