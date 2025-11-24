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

    // Protected storage for child nodes
    protected _children: JqNode[] = [];
    protected _parentNode: JqNode | null = null;

    get childNodes(): NodeListOf<ChildNode> {
        return new JqNodeListOf<ChildNode>(this._children as unknown as ChildNode[]) as unknown as NodeListOf<ChildNode>;
    }

    get firstChild(): ChildNode | null {
        return (this._children[0] as unknown as ChildNode) || null;
    }

    isConnected: boolean = false;

    get lastChild(): ChildNode | null {
        return (this._children[this._children.length - 1] as unknown as ChildNode) || null;
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
        return this._parentNode as unknown as ParentNode;
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
    appendChild<T extends Node>(node: T): T {
        const jqNode = node as unknown as JqNode;

        // Remove from previous parent if it exists
        if (jqNode._parentNode) {
            jqNode._parentNode.removeChild(node);
        }

        this._children.push(jqNode);
        jqNode._parentNode = this;
        return node;
    }

    /**
     * Clones a node, and optionally, all of its contents
     */
    cloneNode(deep?: boolean): Node {
        // This is a basic implementation - subclasses should override for proper cloning
        const cloned = new (this.constructor as any)();

        // Copy nodeType if it's set
        if (this.nodeType) {
            cloned.nodeType = this.nodeType;
        }

        // Deep clone children if requested
        if (deep) {
            for (const child of this._children) {
                const clonedChild = child.cloneNode(true) as unknown as JqNode;
                cloned._children.push(clonedChild);
                clonedChild._parentNode = cloned;
            }
        }

        return cloned as Node;
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
        if (!other) {
            return false;
        }
        if (other === this) {
            return true;
        }

        let node: Node | null = other.parentNode;
        while (node) {
            if (node === (this as unknown as Node)) {
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
        return this._children.length > 0;
    }

    /**
     * Inserts a node before a reference node as a child of this node
     */
    insertBefore<T extends Node>(node: T, child: Node | null): T {
        const jqNode = node as unknown as JqNode;

        // If child is null, append to the end
        if (child === null) {
            return this.appendChild(node);
        }

        // Find the index of the reference child
        const index = this._children.findIndex(c => (c as unknown as Node) === child);
        if (index === -1) {
            throw new Error('Reference node was not found');
        }

        // Remove from previous parent if it exists
        if (jqNode._parentNode) {
            jqNode._parentNode.removeChild(node);
        }

        this._children.splice(index, 0, jqNode);
        jqNode._parentNode = this;
        return node;
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
    removeChild<T extends Node>(child: T): T {
        const index = this._children.findIndex(c => (c as unknown as Node) === child);
        if (index === -1) {
            throw new Error('Node was not found');
        }

        const removed = this._children.splice(index, 1)[0];
        removed._parentNode = null;
        return child;
    }

    /**
     * Replaces a child node within the current node
     */
    replaceChild<T extends Node>(node: Node, child: T): T {
        const jqNode = node as unknown as JqNode;
        const index = this._children.findIndex(c => (c as unknown as Node) === child);

        if (index === -1) {
            throw new Error('Node was not found');
        }

        // Remove from previous parent if it exists
        if (jqNode._parentNode) {
            jqNode._parentNode.removeChild(node);
        }

        const removed = this._children[index];
        this._children[index] = jqNode;
        jqNode._parentNode = this;
        removed._parentNode = null;

        return child;
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
