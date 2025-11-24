/**
 * Core HTML node class for jqnode
 */

import { JqNamedNodeMap } from './JqNamedNodeMap';
import { JqNode } from './JqNode';

/**
 * Node type identifier
 */
export type NodeType = 'element' | 'text' | 'comment';

/**
 * Internal HTML node structure
 * Extends JqNode to implement the DOM Node interface
 */
export class HtmlNode extends JqNode {
    public type: NodeType;
    public name: string = '';
    public tagName: string = ''; // Tag name for elements
    public data: string = '';
    public value: string = ''; // Alternative text content property (used by some parsers)
    public children: HtmlNode[] = [];
    public parent: HtmlNode | undefined;
    public prev: HtmlNode | null = null;
    public next: HtmlNode | null = null;

    // Internal tracking for data storage
    public __jqdata__: Record<string, unknown> = {};

    // Extended properties for DOM integration
    public _originalElement: Element | null = null; // DOM element reference
    public _jqData: Record<string, unknown> = {}; // jQuery-style data storage
    public _detached: boolean = false; // Marks nodes from fractional eq() indices as detached
    public properties: Record<string, unknown> = {}; // Custom properties storage

    // Attributes stored in JqNamedNodeMap
    private _attributes: JqNamedNodeMap;

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
        return this.children as unknown as NodeListOf<ChildNode>;
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
        const htmlNode = node as unknown as HtmlNode;
        this.children.push(htmlNode);
        htmlNode.parent = this;
        return node;
    }

    override removeChild<T extends Node>(child: T): T {
        const index = this.children.findIndex(c => c === child as unknown as HtmlNode);
        if (index === -1) {
            throw new Error('Node was not found');
        }
        const removed = this.children.splice(index, 1)[0];
        removed.parent = undefined;
        return child;
    }

    override insertBefore<T extends Node>(node: T, child: Node | null): T {
        const htmlNode = node as unknown as HtmlNode;

        if (child === null) {
            return this.appendChild(node);
        }

        const index = this.children.findIndex(c => c === child as unknown as HtmlNode);
        if (index === -1) {
            throw new Error('Reference node was not found');
        }

        this.children.splice(index, 0, htmlNode);
        htmlNode.parent = this;
        return node;
    }

    override replaceChild<T extends Node>(node: Node, child: T): T {
        const htmlNode = node as unknown as HtmlNode;
        const index = this.children.findIndex(c => c === child as unknown as HtmlNode);

        if (index === -1) {
            throw new Error('Node was not found');
        }

        const removed = this.children[index];
        this.children[index] = htmlNode;
        htmlNode.parent = this;
        removed.parent = undefined;

        return child;
    }

    override hasChildNodes(): boolean {
        return this.children.length > 0;
    }

    override cloneNode(deep?: boolean): HtmlNode {
        const cloned = new HtmlNode(this.type, this.name);
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
                const textNode = new HtmlNode('text');
                textNode.data = value;
                textNode.parent = this;
                this.children.push(textNode);
            }
        }
    }

    public offsetTop: number = 0; // DOM offset properties
    public offsetLeft: number = 0;
}
