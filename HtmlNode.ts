/**
 * Core HTML node class for jqnode
 */

import { JqNamedNodeMap } from './helpers/JqNamedNodeMap';

/**
 * Node type identifier
 */
export type NodeType = 'element' | 'text' | 'comment';

/**
 * Internal HTML node structure
 */
export class HtmlNode {
    public type: NodeType;
    public name: string = '';
    public tagName: string = ''; // Tag name for elements
    public data: string = '';
    public value: string = ''; // Alternative text content property (used by some parsers)
    public children: HtmlNode[] = [];
    public parent: HtmlNode | undefined;
    public parentNode: ParentNode | null = null; // DOM parentNode reference
    public prev: HtmlNode | null = null;
    public next: HtmlNode | null = null;

    // Internal tracking for data storage
    public __jqdata__: Record<string, unknown> = {};

    // Extended properties for DOM integration
    public _originalElement: Element | null = null; // DOM element reference
    public _jqData: Record<string, unknown> = {}; // jQuery-style data storage
    public _detached: boolean = false; // Marks nodes from fractional eq() indices as detached
    public properties: Record<string, unknown> = {}; // Custom properties storage
    public nodeType: number = 0; // DOM node type
    public childNodes: ChildNode[] = []; // DOM childNodes

    // Attributes stored in JqNamedNodeMap
    private _attributes: JqNamedNodeMap;

    constructor(type: NodeType = 'element', name: string = '') {
        this.type = type;
        this.name = name;
        if (type === 'element') {
            this.tagName = name;
        }
        this._attributes = new JqNamedNodeMap(this);
    }

    get attributes(): JqNamedNodeMap {
        return this._attributes;
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

    removeChild(child: Node): Node | null {
        // Simple implementation for compatibility
        const index = this.children.findIndex(c => c === child as unknown as HtmlNode);
        if (index !== -1) {
            const removed = this.children.splice(index, 1)[0];
            removed.parent = undefined;
            return removed as unknown as Node;
        }
        return null;
    }

    get textContent(): string | null {
        if (this.type === 'text') return this.data;
        if (this.type === 'comment') return this.data;
        return this.children.map(c => c.textContent).join('');
    }

    set textContent(value: string | null) {
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
