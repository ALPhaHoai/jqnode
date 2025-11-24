/**
 * Core HTML element class for jqnode
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Element
 * and https://developer.mozilla.org/en-US/docs/Web/API/Node
 */

import { JqNamedNodeMap } from '../collections/JqNamedNodeMap';
import { JqNode } from './JqNode';
import { JqHTMLCollection } from '../collections/JqHTMLCollection';
import { JqNodeListOf } from '../collections/JqNodeList';
import { JqDOMTokenList } from '../collections/JqDOMTokenList';
import { selectNodes, nodeMatchesSelector, parseSelector } from '../../selector';

/**
 * Node type identifier
 */
export type NodeType = 'element' | 'text' | 'comment';

/**
 * Internal HTML node structure
 * Extends JqNode to implement the DOM Node interface
 */
export class JqElement extends JqNode {
    public internalType: NodeType;
    public name: string = '';
    public tagName: string = ''; // Tag name for elements
    public textData: string = ''; public children: JqElement[] = [];
    public parent: JqElement | undefined;
    public prev: JqElement | null = null;
    public next: JqElement | null = null;

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
        this.internalType = type;
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
        if (this.internalType === 'element') {
            return this.tagName.toUpperCase();
        } else if (this.internalType === 'text') {
            return '#text';
        } else if (this.internalType === 'comment') {
            return '#comment';
        }
        return '';
    }

    override get nodeValue(): string | null {
        if (this.internalType === 'text' || this.internalType === 'comment') {
            return this.textData;
        }
        return null;
    }

    override set nodeValue(value: string | null) {
        if (this.internalType === 'text' || this.internalType === 'comment') {
            this.textData = value || '';
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
        const cloned = new JqElement(this.internalType, this.name);
        cloned.tagName = this.tagName;
        cloned.textData = this.textData;        // Clone attributes
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
        if (this.internalType === 'text') return this.textData;
        if (this.internalType === 'comment') return this.textData;
        return this.children.map(c => c.textContent).join('');
    }

    override set textContent(value: string | null) {
        if (this.internalType === 'text' || this.internalType === 'comment') {
            this.textData = value || '';
        } else {
            this.children = [];
            if (value) {
                const textNode = new JqElement('text');
                textNode.textData = value;
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
                if (child.internalType === 'element') {
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
                if (child.internalType === 'element') {
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

    // ==================== Core Element Properties ====================

    /**
     * Gets or sets the ID attribute of the element
     */
    get id(): string {
        return this.getAttribute('id') || '';
    }

    set id(value: string) {
        this.setAttribute('id', value);
    }

    /**
     * Gets or sets the class attribute as a string
     */
    get className(): string {
        return this.getAttribute('class') || '';
    }

    set className(value: string) {
        this.setAttribute('class', value);
    }

    /**
     * Gets or sets the HTML content of the element
     */
    get innerHTML(): string {
        return this.children.map(child => this.serializeNode(child)).join('');
    }

    set innerHTML(_html: string) {
        // Stub implementation - would need full HTML parser
        this.children = [];
        if (_html) {
            const textNode = new JqElement('text');
            textNode.textData = _html;
            textNode.parent = this;
            this.children.push(textNode);
        }
    }

    /**
     * Gets or sets the HTML including the element itself
     */
    get outerHTML(): string {
        return this.serializeNode(this);
    }

    set outerHTML(_html: string) {
        // Stub implementation - would need full HTML parser
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index !== -1) {
                this.parent.children.splice(index, 1);
            }
        }
    }

    /**
     * Helper method to serialize a node to HTML string
     */
    private serializeNode(node: JqElement): string {
        if (node.internalType === 'text') {
            return node.textData || '';
        }
        if (node.internalType === 'comment') {
            return `<!--${node.textData || ''}-->`;
        }
        if (node.internalType === 'element') {
            let html = `<${node.tagName}`;

            // Add attributes
            const attrs = node.attributes;
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs.item(i);
                if (attr) {
                    html += ` ${attr.name}="${attr.value}"`;
                }
            }

            html += '>';

            // Add children
            for (const child of node.children) {
                html += this.serializeNode(child);
            }

            html += `</${node.tagName}>`;
            return html;
        }
        return '';
    }

    /**
     * Returns the local name (without namespace prefix)
     */
    get localName(): string {
        return this.tagName.toLowerCase();
    }

    /**
     * Returns the namespace URI (null for HTML elements)
     */
    get namespaceURI(): string | null {
        return null;
    }

    /**
     * Returns the namespace prefix (null for HTML elements)
     */
    get prefix(): string | null {
        return null;
    }

    // ==================== Element Relationship Properties ====================

    /**
     * Returns the number of child elements
     */
    get childElementCount(): number {
        return this.children.filter(child => child.internalType === 'element').length;
    }

    /**
     * Returns the first child element
     */
    get firstElementChild(): Element | null {
        const firstElement = this.children.find(child => child.internalType === 'element');
        return (firstElement as unknown as Element) || null;
    }

    /**
     * Returns the last child element
     */
    get lastElementChild(): Element | null {
        const elementChildren = this.children.filter(child => child.internalType === 'element');
        const lastElement = elementChildren[elementChildren.length - 1];
        return (lastElement as unknown as Element) || null;
    }

    /**
     * Returns the next sibling element
     */
    get nextElementSibling(): Element | null {
        if (!this.parent) return null;
        const siblings = this.parent.children;
        const index = siblings.indexOf(this);
        if (index === -1) return null;

        for (let i = index + 1; i < siblings.length; i++) {
            if (siblings[i].internalType === 'element') {
                return siblings[i] as unknown as Element;
            }
        }
        return null;
    }

    /**
     * Returns the previous sibling element
     */
    get previousElementSibling(): Element | null {
        if (!this.parent) return null;
        const siblings = this.parent.children;
        const index = siblings.indexOf(this);
        if (index === -1) return null;

        for (let i = index - 1; i >= 0; i--) {
            if (siblings[i].internalType === 'element') {
                return siblings[i] as unknown as Element;
            }
        }
        return null;
    }

    // ==================== Selector Methods ====================

    /**
     * Returns the first element that matches the CSS selector
     */
    querySelector<E extends Element = Element>(selectors: string): E | null {
        try {
            const results = selectNodes(this.children as unknown as JqElement[], selectors);
            return results.length > 0 ? (results[0] as unknown as E) : null;
        } catch {
            return null;
        }
    }

    /**
     * Returns all elements that match the CSS selector
     */
    querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E> {
        try {
            const results = selectNodes(this.children as unknown as JqElement[], selectors);
            return new JqNodeListOf(results) as unknown as NodeListOf<E>;
        } catch {
            return new JqNodeListOf([]) as unknown as NodeListOf<E>;
        }
    }

    /**
     * Returns true if the element matches the CSS selector
     */
    matches(selectors: string): boolean {
        try {
            const parsed = parseSelector(selectors);
            if (!parsed) return false;
            return nodeMatchesSelector(this as unknown as JqElement, parsed);
        } catch {
            return false;
        }
    }

    /**
     * Returns the closest ancestor (including this element) that matches the selector
     */
    closest<E extends Element = Element>(selectors: string): E | null {
        try {
            const parsed = parseSelector(selectors);
            if (!parsed) return null;

            let current: JqElement | undefined = this;
            while (current) {
                if (nodeMatchesSelector(current as unknown as JqElement, parsed)) {
                    return current as unknown as E;
                }
                current = current.parent;
            }
            return null;
        } catch {
            return null;
        }
    }

    // ==================== Attribute Methods ====================

    /**
     * Returns true if the element has the specified attribute
     */
    hasAttribute(name: string): boolean {
        return this.getAttribute(name) !== null;
    }

    /**
     * Returns true if the element has the specified attribute with namespace
     */
    hasAttributeNS(_namespace: string | null, localName: string): boolean {
        // Simplified - ignores namespace
        return this.hasAttribute(localName);
    }

    /**
     * Returns true if the element has any attributes
     */
    hasAttributes(): boolean {
        return this.attributes.length > 0;
    }

    /**
     * Returns an array of attribute names
     */
    getAttributeNames(): string[] {
        const names: string[] = [];
        for (let i = 0; i < this.attributes.length; i++) {
            const attr = this.attributes.item(i);
            if (attr) {
                names.push(attr.name);
            }
        }
        return names;
    }

    /**
     * Toggles an attribute on/off
     */
    toggleAttribute(name: string, force?: boolean): boolean {
        const hasAttr = this.hasAttribute(name);

        if (force === undefined) {
            if (hasAttr) {
                this.removeAttribute(name);
                return false;
            } else {
                this.setAttribute(name, '');
                return true;
            }
        }

        if (force) {
            if (!hasAttr) {
                this.setAttribute(name, '');
            }
            return true;
        } else {
            if (hasAttr) {
                this.removeAttribute(name);
            }
            return false;
        }
    }

    /**
     * Gets attribute node
     */
    getAttributeNode(name: string): Attr | null {
        return this.attributes.getNamedItem(name);
    }

    /**
     * Gets attribute node with namespace
     */
    getAttributeNodeNS(_namespace: string | null, localName: string): Attr | null {
        // Simplified - ignores namespace
        return this.getAttributeNode(localName);
    }

    /**
     * Sets attribute from Attr node
     */
    setAttributeNode(attr: Attr): Attr | null {
        return this.attributes.setNamedItem(attr);
    }

    /**
     * Sets attribute with namespace from Attr node
     */
    setAttributeNodeNS(attr: Attr): Attr | null {
        return this.setAttributeNode(attr);
    }

    /**
     * Removes attribute by Attr node
     */
    removeAttributeNode(attr: Attr): Attr {
        this.attributes.removeNamedItem(attr.name);
        return attr;
    }

    /**
     * Gets attribute with namespace
     */
    getAttributeNS(_namespace: string | null, localName: string): string | null {
        // Simplified - ignores namespace
        return this.getAttribute(localName);
    }

    /**
     * Sets attribute with namespace
     */
    setAttributeNS(_namespace: string | null, qualifiedName: string, value: string): void {
        // Simplified - ignores namespace, uses qualified name as attribute name
        this.setAttribute(qualifiedName, value);
    }

    /**
     * Removes attribute with namespace
     */
    removeAttributeNS(_namespace: string | null, localName: string): void {
        // Simplified - ignores namespace
        this.removeAttribute(localName);
    }

    // ==================== DOM Manipulation Methods ====================

    /**
     * Inserts nodes after this element
     */
    after(...nodes: (Node | string)[]): void {
        if (!this.parent) return;

        const siblings = this.parent.children;
        const index = siblings.indexOf(this);
        if (index === -1) return;

        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            if (typeof node === 'string') {
                const textNode = new JqElement('text');
                textNode.textData = node;
                textNode.parent = this.parent;
                siblings.splice(index + 1, 0, textNode);
            } else {
                const jqNode = node as unknown as JqElement;
                jqNode.parent = this.parent;
                siblings.splice(index + 1, 0, jqNode);
            }
        }
    }

    /**
     * Inserts nodes before this element
     */
    before(...nodes: (Node | string)[]): void {
        if (!this.parent) return;

        const siblings = this.parent.children;
        const index = siblings.indexOf(this);
        if (index === -1) return;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (typeof node === 'string') {
                const textNode = new JqElement('text');
                textNode.textData = node;
                textNode.parent = this.parent;
                siblings.splice(index + i, 0, textNode);
            } else {
                const jqNode = node as unknown as JqElement;
                jqNode.parent = this.parent;
                siblings.splice(index + i, 0, jqNode);
            }
        }
    }

    /**
     * Appends nodes or strings as children
     */
    append(...nodes: (Node | string)[]): void {
        for (const node of nodes) {
            if (typeof node === 'string') {
                const textNode = new JqElement('text');
                textNode.textData = node;
                textNode.parent = this;
                this.children.push(textNode);
            } else {
                const jqNode = node as unknown as JqElement;
                jqNode.parent = this;
                this.children.push(jqNode);
            }
        }
    }

    /**
     * Prepends nodes or strings as children
     */
    prepend(...nodes: (Node | string)[]): void {
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            if (typeof node === 'string') {
                const textNode = new JqElement('text');
                textNode.textData = node;
                textNode.parent = this;
                this.children.unshift(textNode);
            } else {
                const jqNode = node as unknown as JqElement;
                jqNode.parent = this;
                this.children.unshift(jqNode);
            }
        }
    }

    /**
     * Removes this element from its parent
     */
    remove(): void {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index !== -1) {
                this.parent.children.splice(index, 1);
            }
            this.parent = undefined;
        }
    }

    /**
     * Replaces this element with the given nodes
     */
    replaceWith(...nodes: (Node | string)[]): void {
        if (!this.parent) return;

        const siblings = this.parent.children;
        const index = siblings.indexOf(this);
        if (index === -1) return;

        const parentRef = this.parent;
        siblings.splice(index, 1);
        this.parent = undefined;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (typeof node === 'string') {
                const textNode = new JqElement('text');
                textNode.textData = node;
                textNode.parent = parentRef;
                siblings.splice(index + i, 0, textNode);
            } else {
                const jqNode = node as unknown as JqElement;
                jqNode.parent = parentRef;
                siblings.splice(index + i, 0, jqNode);
            }
        }
    }

    /**
     * Replaces all children with the given nodes
     */
    replaceChildren(...nodes: (Node | string)[]): void {
        this.children = [];
        this.append(...nodes);
    }

    // ==================== Dimension Properties (Stubs) ====================

    get clientHeight(): number { return 0; }
    get clientWidth(): number { return 0; }
    get clientTop(): number { return 0; }
    get clientLeft(): number { return 0; }

    get scrollHeight(): number { return 0; }
    get scrollWidth(): number { return 0; }

    private _scrollTop: number = 0;
    get scrollTop(): number { return this._scrollTop; }
    set scrollTop(value: number) { this._scrollTop = value; }

    private _scrollLeft: number = 0;
    get scrollLeft(): number { return this._scrollLeft; }
    set scrollLeft(value: number) { this._scrollLeft = value; }

    get offsetHeight(): number { return 0; }
    get offsetWidth(): number { return 0; }
    get offsetParent(): Element | null { return null; }

    /**
     * Gets or sets the slot attribute for shadow DOM
     */
    get slot(): string {
        return this.getAttribute('slot') || '';
    }

    set slot(value: string) {
        this.setAttribute('slot', value);
    }

    /**
     * Returns the part attribute as DOMTokenList (stub)
     */
    get part(): DOMTokenList {
        return new JqDOMTokenList(this as unknown as Element, 'part') as unknown as DOMTokenList;
    }

    /**
     * Returns attached shadow root (stub, always null)
     */
    get shadowRoot(): ShadowRoot | null {
        return null;
    }

    // ==================== Adjacent Insertion Methods ====================

    /**
     * Inserts an element at a relative position
     */
    insertAdjacentElement(position: InsertPosition, element: Element): Element | null {
        const jqElement = element as unknown as JqElement;

        switch (position) {
            case 'beforebegin':
                if (this.parent) {
                    this.before(element);
                    return element;
                }
                return null;

            case 'afterbegin':
                if (this.children.length > 0) {
                    this.children.unshift(jqElement);
                    jqElement.parent = this;
                } else {
                    this.appendChild(element);
                }
                return element;

            case 'beforeend':
                this.appendChild(element);
                return element;

            case 'afterend':
                if (this.parent) {
                    this.after(element);
                    return element;
                }
                return null;

            default:
                throw new Error('Invalid position');
        }
    }

    /**
     * Inserts HTML at a relative position
     */
    insertAdjacentHTML(position: InsertPosition, html: string): void {
        // Stub implementation - would need HTML parser
        const textNode = new JqElement('text');
        textNode.textData = html;

        switch (position) {
            case 'beforebegin':
                if (this.parent) {
                    this.before(textNode as unknown as Node);
                }
                break;

            case 'afterbegin':
                this.prepend(textNode as unknown as Node);
                break;

            case 'beforeend':
                this.append(textNode as unknown as Node);
                break;

            case 'afterend':
                if (this.parent) {
                    this.after(textNode as unknown as Node);
                }
                break;
        }
    }

    /**
     * Inserts text at a relative position
     */
    insertAdjacentText(position: InsertPosition, text: string): void {
        const textNode = new JqElement('text');
        textNode.textData = text;

        switch (position) {
            case 'beforebegin':
                if (this.parent) {
                    this.before(textNode as unknown as Node);
                }
                break;

            case 'afterbegin':
                this.prepend(textNode as unknown as Node);
                break;

            case 'beforeend':
                this.append(textNode as unknown as Node);
                break;

            case 'afterend':
                if (this.parent) {
                    this.after(textNode as unknown as Node);
                }
                break;
        }
    }

    // ==================== Position Methods (Stubs) ====================

    /**
     * Returns the element's bounding rectangle (stub)
     */
    getBoundingClientRect(): DOMRect {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            toJSON: () => ({})
        } as DOMRect;
    }

    /**
     * Returns a collection of rectangles (stub)
     */
    getClientRects(): DOMRectList {
        return {
            length: 0,
            item: () => null,
            [Symbol.iterator]: function* () { }
        } as DOMRectList;
    }

    // ==================== Scroll Methods (Stubs) ====================

    /**
     * Scrolls to a particular set of coordinates (stub)
     */
    scroll(options?: ScrollToOptions): void;
    scroll(x: number, y: number): void;
    scroll(_optionsOrX?: ScrollToOptions | number, _y?: number): void {
        // Stub - no-op
    }

    /**
     * Scrolls by a given amount (stub)
     */
    scrollBy(options?: ScrollToOptions): void;
    scrollBy(x: number, y: number): void;
    scrollBy(_optionsOrX?: ScrollToOptions | number, _y?: number): void {
        // Stub - no-op
    }

    /**
     * Scrolls to a given position (stub)
     */
    scrollTo(options?: ScrollToOptions): void;
    scrollTo(x: number, y: number): void;
    scrollTo(_optionsOrX?: ScrollToOptions | number, _y?: number): void {
        // Stub - no-op
    }

    /**
     * Scrolls element into view (stub)
     */
    scrollIntoView(_arg?: boolean | ScrollIntoViewOptions): void {
        // Stub - no-op
    }

    // ==================== Utility Methods ====================

    /**
     * Returns HTML content (similar to innerHTML)
     */
    getHTML(_options?: { serializableShadowRoots?: boolean; shadowRoots?: ShadowRoot[] }): string {
        return this.innerHTML;
    }

    /**
     * Checks if element would be visible (stub, always returns true)
     */
    checkVisibility(_options?: { checkOpacity?: boolean; checkVisibilityCSS?: boolean; contentVisibilityAuto?: boolean; opacityProperty?: boolean; visibilityProperty?: boolean }): boolean {
        return true;
    }

    /**
     * Requests fullscreen (stub)
     */
    requestFullscreen(_options?: FullscreenOptions): Promise<void> {
        return Promise.reject(new Error('Not implemented'));
    }

    /**
     * Checks pointer capture (stub)
     */
    hasPointerCapture(_pointerId: number): boolean {
        return false;
    }

    /**
     * Sets pointer capture (stub)
     */
    setPointerCapture(_pointerId: number): void {
        // Stub - no-op
    }

    /**
     * Releases pointer capture (stub)
     */
    releasePointerCapture(_pointerId: number): void {
        // Stub - no-op
    }

    /**
     * Requests pointer lock (stub)
     */
    requestPointerLock(): void {
        // Stub - no-op
    }

    public offsetTop: number = 0; // DOM offset properties
    public offsetLeft: number = 0;
}
