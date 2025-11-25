/**
 * JqDocumentFragment - Implementation of the DOM DocumentFragment interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
 *
 * DocumentFragment represents a minimal document object that has no parent.
 * It is used as a lightweight version of Document that stores a segment of a
 * document structure comprised of nodes just like a standard document.
 */

import {JqNode} from './JqNode';
import {JqElement} from './JqElement';
import {JqHTMLCollection} from '../collections/JqHTMLCollection';
import {JqNodeListOf} from '../collections/JqNodeList';
import {selectNodes} from '../../selector';

export class JqDocumentFragment extends JqNode implements DocumentFragment {
    // Internal children storage
    public override _children: JqElement[] = [];

    constructor() {
        super();
        this.nodeType = this.DOCUMENT_FRAGMENT_NODE;
    }

    override get nodeName(): string {
        return '#document-fragment';
    }

    override get nodeValue(): null {
        return null;
    }

    override set nodeValue(_value: string | null) {
        // Document fragments don't have a value
    }

    override get textContent(): string {
        // Returns the concatenated text of all descendant text nodes
        // DocumentFragment.textContent returns empty string, never null
        return this._children.map(child => child.textContent).join('');
    }

    override set textContent(value: string | null) {
        // Setting textContent removes all children and adds a single text node
        this._children = [];
        if (value !== null && value !== '') {
            const textNode = new JqElement('text');
            textNode.textData = value;
            textNode._setParent(this);
            this._children.push(textNode);
        }
    }

    // ParentNode interface properties

    get childElementCount(): number {
        return this._children.filter(child => child.nodeType === this.ELEMENT_NODE).length;
    }

    get children(): HTMLCollection {
        const elements = this._children.filter(child => child.nodeType === this.ELEMENT_NODE);
        return new JqHTMLCollection(elements) as unknown as HTMLCollection;
    }

    get firstElementChild(): Element | null {
        const firstElement = this._children.find(child => child.nodeType === this.ELEMENT_NODE);
        return (firstElement as unknown as Element) || null;
    }

    get lastElementChild(): Element | null {
        const elementChildren = this._children.filter(child => child.nodeType === this.ELEMENT_NODE);
        const lastElement = elementChildren[elementChildren.length - 1];
        return (lastElement as unknown as Element) || null;
    }

    override get childNodes(): NodeListOf<ChildNode> {
        return new JqNodeListOf<ChildNode>(this._children) as unknown as NodeListOf<ChildNode>;
    }

    override get firstChild(): ChildNode | null {
        return (this._children[0] as unknown as ChildNode) || null;
    }

    override get lastChild(): ChildNode | null {
        return (this._children[this._children.length - 1] as unknown as ChildNode) || null;
    }

    // DOM manipulation methods

    override appendChild<T extends Node>(node: T): T {
        const jqElement = node as unknown as JqElement;

        // Remove from previous parent if it exists
        if (jqElement._parentNode) {
            jqElement._parentNode.removeChild(node);
        }

        this._children.push(jqElement);
        jqElement._setParent(this);
        return node;
    }

    override removeChild<T extends Node>(child: T): T {
        const index = this._children.findIndex(c => c === (child as unknown as JqElement));
        if (index === -1) {
            throw new Error('Node was not found');
        }
        const removed = this._children.splice(index, 1)[0];
        removed._parentNode = null;
        return child;
    }

    override insertBefore<T extends Node>(node: T, child: Node | null): T {
        const jqElement = node as unknown as JqElement;

        if (!child) {
            return this.appendChild(node);
        }

        // Remove from previous parent if it exists
        if (jqElement._parentNode) {
            jqElement._parentNode.removeChild(node);
        }

        const index = this._children.findIndex(c => c === (child as unknown as JqElement));
        if (index === -1) {
            throw new Error('Reference node was not found');
        }

        this._children.splice(index, 0, jqElement);
        jqElement._setParent(this);
        return node;
    }

    override replaceChild<T extends Node>(node: Node, child: T): T {
        const jqElement = node as unknown as JqElement;
        const index = this._children.findIndex(c => c === (child as unknown as JqElement));

        if (index === -1) {
            throw new Error('Node was not found');
        }

        // Remove from previous parent if it exists
        if (jqElement._parentNode) {
            jqElement._parentNode.removeChild(node as Node);
        }

        const removed = this._children[index];
        this._children[index] = jqElement;
        jqElement._setParent(this);
        removed._parentNode = null;

        return child;
    }

    // ParentNode interface methods

    append(...nodes: (Node | string)[]): void {
        for (const node of nodes) {
            if (typeof node === 'string') {
                const textNode = new JqElement('text');
                textNode.textData = node;
                textNode._setParent(this);
                this._children.push(textNode);
            } else {
                this.appendChild(node);
            }
        }
    }

    prepend(...nodes: (Node | string)[]): void {
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            if (typeof node === 'string') {
                const textNode = new JqElement('text');
                textNode.textData = node;
                textNode._setParent(this);
                this._children.unshift(textNode);
            } else {
                const jqElement = node as unknown as JqElement;
                // Remove from previous parent if it exists
                if (jqElement._parentNode) {
                    jqElement._parentNode.removeChild(node);
                }
                jqElement._setParent(this);
                this._children.unshift(jqElement);
            }
        }
    }

    replaceChildren(...nodes: (Node | string)[]): void {
        this._children = [];
        this.append(...nodes);
    }

    // Selector methods

    querySelector<E extends Element = Element>(selectors: string): E | null {
        try {
            const results = selectNodes(this._children as unknown as JqElement[], selectors);
            return results.length > 0 ? (results[0] as unknown as E) : null;
        } catch {
            return null;
        }
    }

    querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E> {
        try {
            const results = selectNodes(this._children as unknown as JqElement[], selectors);
            return new JqNodeListOf(results) as unknown as NodeListOf<E>;
        } catch {
            return new JqNodeListOf([]) as unknown as NodeListOf<E>;
        }
    }

    getElementById(elementId: string): Element | null {
        const traverse = (nodes: JqElement[]): Element | null => {
            for (const node of nodes) {
                if (node.nodeType === this.ELEMENT_NODE) {
                    if (node.getAttribute('id') === elementId) {
                        return node as unknown as Element;
                    }
                    // Recursively search children
                    const result = traverse(node.children);
                    if (result) return result;
                }
            }
            return null;
        };

        return traverse(this._children);
    }
}
