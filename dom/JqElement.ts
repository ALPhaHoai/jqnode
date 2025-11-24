/**
 * Core HTML element class for jqnode
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Element
 * and https://developer.mozilla.org/en-US/docs/Web/API/Node
 */

import { JqNamedNodeMap } from './JqNamedNodeMap';
import { JqNode } from './JqNode';
import { JqHTMLCollection } from './JqHTMLCollection';
import { JqNodeListOf } from './JqNodeList';
import { JqDOMTokenList } from './JqDOMTokenList';

/**
 * Node type identifier
 */
export type NodeType = 'element' | 'text' | 'comment';

/**
 * Internal HTML node structure
 * Extends JqNode to implement the DOM Node interface
 */
export class JqElement extends JqNode {
    public type: NodeType;
    public name: string = '';
    public tagName: string = ''; // Tag name for elements
    public data: string = '';
    public value: string = ''; // Alternative text content property (used by some parsers)
    public children: JqElement[] = [];
    public parent: JqElement | undefined;
    public prev: JqElement | null = null;
    public next: JqElement | null = null;

    // Internal tracking for data storage
    public __jqdata__: Record<string, unknown> = {};

    // Extended properties for DOM integration
    public _originalElement: Element | null = null; // DOM element reference
    public _jqData: Record<string, unknown> = {}; // jQuery-style data storage
    public _detached: boolean = false; // Marks nodes from fractional eq() indices as detached
    public properties: Record<string, unknown> = {}; // Custom properties storage

    // Attributes stored in JqNamedNodeMap
    private _attributes: JqNamedNodeMap;

    // classList support using JqDOMTokenList
    private _classList: JqDOMTokenList | null = null;

    constructor(type: NodeType = 'element', name: string = '') {
        super();
        this.type = type;
        this.name = name;

        // Set nodeType based on type
        if (type === 'element') {
            this.tagName = name;
            this.nodeType = this.ELEMENT_NODE;
        } else if (type === 'text') {
            this.nodeType = this.TEXT_NODE;
        } else if (type === 'comment') {
            this.nodeType = this.COMMENT_NODE;
        }

        this._attributes = new JqNamedNodeMap(this);
    }

    get attributes(): JqNamedNodeMap {
        return this._attributes;
    }

    /**
     * Returns a live DOMTokenList which contains the class attribute's tokens.
     */
    get classList(): DOMTokenList {
        if (!this._classList) {
            this._classList = new JqDOMTokenList(this as unknown as Element, 'class');
        }
        return this._classList as unknown as DOMTokenList;
    }

    // Node interface implementation
    override get nodeName(): string {
        if (this.type === 'element') {
            return this.tagName.toUpperCase();
        } else if (this.type === 'text') {
            return '#text';
        } else if (this.type === 'comment') {
            return '#comment';
        }
        return '';
    }

    override get nodeValue(): string | null {
        if (this.type === 'text' || this.type === 'comment') {
            return this.data;
        }
        return null;
    }

    override set nodeValue(value: string | null) {
        if (this.type === 'text' || this.type === 'comment') {
            this.data = value || '';
        }
    }

    override get firstChild(): ChildNode | null {
        return (this.children[0] as unknown as ChildNode) || null;
    }

    override get lastChild(): ChildNode | null {
        return (this.children[this.children.length - 1] as unknown as ChildNode) || null;
    }

    override get nextSibling(): ChildNode | null {
        return (this.next as unknown as ChildNode) || null;
    }

    override get previousSibling(): ChildNode | null {
        return (this.prev as unknown as ChildNode) || null;
    }

    override get parentNode(): ParentNode | null {
        return (this.parent as unknown as ParentNode) || null;
    }

    override get childNodes(): NodeListOf<ChildNode> {
        return new JqNodeListOf<ChildNode>(this.children) as unknown as NodeListOf<ChildNode>;
    }

    getAttribute(name: string): string | null {
        const attr = this.attributes.getNamedItem(name);
        return attr ? attr.value : null;
    }

    setAttribute(name: string, value: string | number): void {
        const tempAttr = {
            name: name,
            value: String(value)
        } as Attr;
        this.attributes.setNamedItem(tempAttr);
    }

    removeAttribute(name: string): void {
        try {
            this.attributes.removeNamedItem(name);
        } catch (e) {
            // Ignore error if attribute doesn't exist (matches DOM behavior)
        }
    }

    override appendChild<T extends Node>(node: T): T {
        const jqElement = node as unknown as JqElement;
        this.children.push(jqElement);
        jqElement.parent = this;
        return node;
    }

    override removeChild<T extends Node>(child: T): T {
        const index = this.children.findIndex(c => c === child as unknown as JqElement);
        if (index === -1) {
            throw new Error('Node was not found');
        }
        const removed = this.children.splice(index, 1)[0];
        removed.parent = undefined;
        return child;
    }

    override insertBefore<T extends Node>(node: T, child: Node | null): T {
        const jqElement = node as unknown as JqElement;

        if (child === null) {
            return this.appendChild(node);
        }

        const index = this.children.findIndex(c => c === child as unknown as JqElement);
        if (index === -1) {
            throw new Error('Reference node was not found');
        }

        this.children.splice(index, 0, jqElement);
        jqElement.parent = this;
        return node;
    }

    override replaceChild<T extends Node>(node: Node, child: T): T {
        const jqElement = node as unknown as JqElement;
        const index = this.children.findIndex(c => c === child as unknown as JqElement);

        if (index === -1) {
            throw new Error('Node was not found');
        }

        const removed = this.children[index];
        this.children[index] = jqElement;
        jqElement.parent = this;
        removed.parent = undefined;

        return child;
    }

    override hasChildNodes(): boolean {
        return this.children.length > 0;
    }

    override cloneNode(deep?: boolean): JqElement {
        const cloned = new JqElement(this.type, this.name);
        cloned.tagName = this.tagName;
        cloned.data = this.data;
        cloned.value = this.value;

        // Clone attributes
        const attrData = this._attributes._getData();
        cloned._attributes._setData(attrData);

        // Deep clone children if requested
        if (deep) {
            for (const child of this.children) {
                const clonedChild = child.cloneNode(true);
                clonedChild.parent = cloned;
                cloned.children.push(clonedChild);
            }
        }

        return cloned;
    }

    override get textContent(): string | null {
        if (this.type === 'text') return this.data;
        if (this.type === 'comment') return this.data;
        return this.children.map(c => c.textContent).join('');
    }

    override set textContent(value: string | null) {
        if (this.type === 'text' || this.type === 'comment') {
            this.data = value || '';
        } else {
            this.children = [];
            if (value) {
                const textNode = new JqElement('text');
                textNode.data = value;
                textNode.parent = this;
                this.children.push(textNode);
            }
        }
    }

    /**
     * Returns an HTMLCollection of descendant elements with the specified tag name.
     * Returns all descendant elements if tagName is "*".
     */
    getElementsByTagName(tagName: string): HTMLCollection {
        const results: JqElement[] = [];
        const search = tagName.toLowerCase();
        const matchAll = search === '*';

        const traverse = (node: JqElement) => {
            for (const child of node.children) {
                if (child.type === 'element') {
                    if (matchAll || child.tagName.toLowerCase() === search) {
                        results.push(child);
                    }
                    traverse(child);
                }
            }
        };

        traverse(this);
        return new JqHTMLCollection(results) as unknown as HTMLCollection;
    }

    /**
     * Returns an HTMLCollection of descendant elements with the specified tag name and namespace.
     * Currently ignores namespace and delegates to getElementsByTagName.
     */
    getElementsByTagNameNS(_namespaceURI: string | null, localName: string): HTMLCollection {
        return this.getElementsByTagName(localName);
    }

    /**
     * Returns an HTMLCollection of descendant elements with the specified class name(s).
     * Multiple class names can be provided separated by spaces.
     */
    getElementsByClassName(classNames: string): HTMLCollection {
        const results: JqElement[] = [];
        const classes = classNames.trim().split(/\s+/).filter(c => c.length > 0);

        if (classes.length === 0) {
            return new JqHTMLCollection(results) as unknown as HTMLCollection;
        }

        const traverse = (node: JqElement) => {
            for (const child of node.children) {
                if (child.type === 'element') {
                    const classList = (child.getAttribute('class') || '').trim().split(/\s+/);
                    const hasAllClasses = classes.every(cls => classList.includes(cls));

                    if (hasAllClasses) {
                        results.push(child);
                    }
                    traverse(child);
                }
            }
        };

        traverse(this);
        return new JqHTMLCollection(results) as unknown as HTMLCollection;
    }

    public offsetTop: number = 0; // DOM offset properties
    public offsetLeft: number = 0;
}
