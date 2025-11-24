/**
 * JqAttr - Implementation of the DOM Attr interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Attr
 */

import {JqElement} from './JqElement';
import {JqNodeListOf} from './JqNodeList';

export class JqAttr implements Attr {
    private readonly _node: JqElement | null;
    private readonly _name: string;
    private _detachedValue?: string;

    constructor(name: string, nodeOrValue?: JqElement | string) {
        this._name = name;
        if (typeof nodeOrValue === 'string' || nodeOrValue === undefined) {
            // Detached attribute
            this._node = null;
            this._detachedValue = nodeOrValue || '';
        } else {
            // Attached attribute
            this._node = nodeOrValue;
            this._detachedValue = undefined;
        }
    }

    // Attr-specific properties
    get name(): string {
        return this._name;
    }

    get localName(): string {
        // For non-namespaced attributes, localName is the same as name
        return this._name;
    }

    get namespaceURI(): string | null {
        // jqnode doesn't currently support namespaced attributes
        return null;
    }

    get ownerElement(): Element | null {
        // Return null if detached, otherwise return the JqElement
        return this._node ? (this._node as unknown as Element) : null;
    }

    get prefix(): string | null {
        // jqnode doesn't currently support namespaced attributes
        return null;
    }

    get specified(): boolean {
        // Always returns true per spec
        return true;
    }

    get value(): string {
        if (this._node === null) {
            // Detached attribute - use stored value
            return this._detachedValue || '';
        }
        // Attached attribute - access internal data to avoid infinite recursion
        const data = this._node.attributes._getData();
        return data[this._name] || '';
    }

    set value(v: string) {
        if (this._node === null) {
            // Detached attribute - update stored value
            this._detachedValue = v;
            return;
        }
        // Attached attribute - access internal data directly
        const data = this._node.attributes._getData();
        data[this._name] = v;
        this._node.attributes._setData(data);
    }

    // Node interface properties
    get nodeType(): number {
        return this.ATTRIBUTE_NODE;
    }

    get nodeName(): string {
        return this._name;
    }

    get nodeValue(): string | null {
        return this.value;
    }

    set nodeValue(v: string | null) {
        this.value = v || '';
    }

    get textContent(): string {
        return this.value;
    }

    set textContent(v: string) {
        this.value = v;
    }

    // Methods
    cloneNode(_deep?: boolean): Attr {
        // Per DOM spec, cloning an Attr creates a detached attribute (ownerElement = null)
        // with the same name and value
        return new JqAttr(this._name, this.value);
    }

    isEqualNode(otherNode: Node | null): boolean {
        if (!otherNode || otherNode.nodeType !== this.nodeType) {
            return false;
        }
        const other = otherNode as Attr;
        return other.name === this.name && other.value === this.value;
    }

    // Standard Node methods (stubbed)
    appendChild<T extends Node>(_node: T): T { throw new Error('Not supported'); }
    contains(_other: Node | null): boolean { return false; }
    getRootNode(_options?: GetRootNodeOptions): Node { return this; }
    hasChildNodes(): boolean { return false; }
    insertBefore<T extends Node>(_node: T, _child: Node | null): T { throw new Error('Not supported'); }
    isDefaultNamespace(_namespace: string | null): boolean { return false; }
    isSameNode(otherNode: Node | null): boolean { return this === otherNode; }
    lookupNamespaceURI(_prefix: string | null): string | null { return null; }
    lookupPrefix(_namespace: string | null): string | null { return null; }
    normalize(): void { }
    removeChild<T extends Node>(_child: T): T { throw new Error('Not supported'); }
    replaceChild<T extends Node>(_node: Node, _child: T): T { throw new Error('Not supported'); }

    readonly baseURI: string = '';
    readonly childNodes: NodeListOf<ChildNode> = new JqNodeListOf<ChildNode>([]) as unknown as NodeListOf<ChildNode>;
    readonly firstChild: ChildNode | null = null;
    readonly isConnected: boolean = false;
    readonly lastChild: ChildNode | null = null;
    readonly nextSibling: ChildNode | null = null;
    readonly parentElement: HTMLElement | null = null;
    readonly parentNode: ParentNode | null = null;
    readonly previousSibling: ChildNode | null = null;
    readonly ownerDocument: Document = null as unknown as Document;

    readonly ELEMENT_NODE = 1;
    readonly ATTRIBUTE_NODE = 2;
    readonly TEXT_NODE = 3;
    readonly CDATA_SECTION_NODE = 4;
    readonly ENTITY_REFERENCE_NODE = 5;
    readonly ENTITY_NODE = 6;
    readonly PROCESSING_INSTRUCTION_NODE = 7;
    readonly COMMENT_NODE = 8;
    readonly DOCUMENT_NODE = 9;
    readonly DOCUMENT_TYPE_NODE = 10;
    readonly DOCUMENT_FRAGMENT_NODE = 11;
    readonly NOTATION_NODE = 12;

    readonly DOCUMENT_POSITION_DISCONNECTED = 1;
    readonly DOCUMENT_POSITION_PRECEDING = 2;
    readonly DOCUMENT_POSITION_FOLLOWING = 4;
    readonly DOCUMENT_POSITION_CONTAINS = 8;
    readonly DOCUMENT_POSITION_CONTAINED_BY = 16;
    readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;

    compareDocumentPosition(_other: Node): number {
        return 0;
    }

    dispatchEvent(_event: Event): boolean {
        return false;
    }

    addEventListener(_type: string, _callback: EventListenerOrEventListenerObject | null, _options?: boolean | AddEventListenerOptions): void { }
    removeEventListener(_type: string, _callback: EventListenerOrEventListenerObject | null, _options?: boolean | EventListenerOptions): void { }
}
