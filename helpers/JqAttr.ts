import { HtmlNode } from '../types';

export class JqAttr implements Attr {
    private readonly _node: HtmlNode;
    private readonly _name: string;

    constructor(node: HtmlNode, name: string) {
        this._node = node;
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    get value(): string {
        // Access internal data directly to avoid infinite recursion
        const data = this._node.attributes._getData();
        return data[this._name] || '';
    }

    set value(v: string) {
        // Access internal data directly
        const data = this._node.attributes._getData();
        data[this._name] = v;
        this._node.attributes._setData(data);
    }
}

// Methods
cloneNode(_deep ?: boolean): Attr {
    // Attr cloning is always shallow in effect (just name/value), 
    // but creating a new JqAttr on the same node would link it to the same live attribute.
    // However, DOM cloneNode on Attr usually creates a standalone Attr.
    // Since JqAttr is tied to an HtmlNode, we might need a detached node or just return a new instance
    // that represents the same data but maybe isn't live if it's supposed to be a copy.
    // But for this implementation, let's return a new JqAttr on the same node for now, 
    // or ideally, it should be a copy. 
    // Given the architecture, JqAttr is a view on the node's attribs.
    // A true clone would need to be independent.
    // For now, we'll return a new instance wrapper.
    return new JqAttr(this._node, this._name);
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
getRootNode(_options ?: GetRootNodeOptions): Node { return this; }
hasChildNodes(): boolean { return false; }
insertBefore<T extends Node>(_node: T, _child: Node | null): T { throw new Error('Not supported'); }
isDefaultNamespace(_namespace: string | null): boolean { return false; }
isSameNode(otherNode: Node | null): boolean { return this === otherNode; }
lookupNamespaceURI(_prefix: string | null): string | null { return null; }
lookupPrefix(_namespace: string | null): string | null { return null; }
normalize(): void {}
removeChild<T extends Node>(_child: T): T { throw new Error('Not supported'); }
replaceChild<T extends Node>(_node: Node, _child: T): T { throw new Error('Not supported'); }

    readonly baseURI: string = '';
    readonly childNodes: NodeListOf<ChildNode> = [] as unknown as NodeListOf<ChildNode>;
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

addEventListener(_type: string, _callback: EventListenerOrEventListenerObject | null, _options ?: boolean | AddEventListenerOptions): void {}
removeEventListener(_type: string, _callback: EventListenerOrEventListenerObject | null, _options ?: boolean | EventListenerOptions): void {}
}
