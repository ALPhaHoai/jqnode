import {JqNode} from './JqNode';
import {JqElement} from './JqElement';
import {JqText} from './JqText';
import {JqComment} from './JqComment';
import {JqHTMLCollection} from '../collections/JqHTMLCollection';
import {JqNodeList, JqNodeListOf} from '../collections/JqNodeList';
import {createTypedElement} from '../helpers/createTypedElement';

/**
 * JqDocument - Implementation of the DOM Document interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Document
 */
export class JqDocument extends JqNode implements Document {
    // Internal children storage
    public _children: JqElement[] = [];

    constructor() {
        super();
        this.nodeType = this.DOCUMENT_NODE;
    }

    override get nodeName(): string {
        return '#document';
    }

    override get nodeValue(): null { return null; }
    override set nodeValue(value: string | null) { }

    override get textContent(): null { return null; }
    override set textContent(value: string | null) { }

    override get ownerDocument(): null { return null; }
    override set ownerDocument(value: Document | null) { }

    // Properties
    get URL(): string {
        return 'about:blank';
    }

    get documentURI(): string {
        return 'about:blank';
    }

    get compatMode(): string {
        return 'CSS1Compat';
    }

    get characterSet(): string {
        return 'UTF-8';
    }

    get charset(): string {
        return 'UTF-8';
    }

    get inputEncoding(): string {
        return 'UTF-8';
    }

    get contentType(): string {
        return 'text/html';
    }

    get doctype(): DocumentType | null {
        return null; // TODO: Implement DocumentType if needed
    }



    get documentElement(): HTMLElement {
        return this._children.find(child => child.nodeType === this.ELEMENT_NODE && child.tagName.toUpperCase() === 'HTML') as unknown as HTMLElement;
    }

    get head(): HTMLHeadElement {
        const docEl = this.documentElement as unknown as JqElement;
        if (!docEl) return null as unknown as HTMLHeadElement;
        return (docEl.children.find(child => child.nodeType === this.ELEMENT_NODE && child.tagName.toUpperCase() === 'HEAD') as unknown as HTMLHeadElement) || null;
    }

    get body(): HTMLElement {
        const docEl = this.documentElement as unknown as JqElement;
        if (!docEl) return null as unknown as HTMLElement;
        return (docEl.children.find(child => child.nodeType === this.ELEMENT_NODE && child.tagName.toUpperCase() === 'BODY') as unknown as HTMLElement) || null;
    }

    implementation: DOMImplementation = {
        createDocument: () => this as unknown as XMLDocument,
        createDocumentType: () => null as unknown as DocumentType,
        createHTMLDocument: () => this as unknown as Document,
        hasFeature: () => true
    };

    // Methods

    createElement(tagName: string, options?: ElementCreationOptions): HTMLElement {
        const element = createTypedElement(tagName);
        element.ownerDocument = this as any;
        return element as unknown as HTMLElement;
    }

    createElementNS(namespaceURI: "http://www.w3.org/1999/xhtml", qualifiedName: string): HTMLElement;
    createElementNS<K extends keyof SVGElementTagNameMap>(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: K): SVGElementTagNameMap[K];
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: string): SVGElement;
    createElementNS<K extends keyof MathMLElementTagNameMap>(namespaceURI: "http://www.w3.org/1998/Math/MathML", qualifiedName: K): MathMLElementTagNameMap[K];
    createElementNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", qualifiedName: string): MathMLElement;
    createElementNS(namespaceURI: string | null, qualifiedName: string, options?: ElementCreationOptions): Element;
    createElementNS(namespaceURI: string | null, qualifiedName: string, options?: string | ElementCreationOptions): Element {
        // For now, just treat as normal element
        return this.createElement(qualifiedName) as unknown as Element;
    }

    createDocumentFragment(): DocumentFragment {
        // TODO: Implement JqDocumentFragment
        throw new Error('Method not implemented.');
    }

    createTextNode(data: string): Text {
        const text = new JqText(data);
        text.ownerDocument = this as any;
        return text as unknown as Text;
    }

    createComment(data: string): Comment {
        const comment = new JqComment(data);
        comment.ownerDocument = this as any;
        return comment as unknown as Comment;
    }

    createCDATASection(data: string): CDATASection {
        throw new Error('Method not implemented.');
    }

    createProcessingInstruction(target: string, data: string): ProcessingInstruction {
        throw new Error('Method not implemented.');
    }

    importNode<T extends Node>(node: T, deep?: boolean): T {
        throw new Error('Method not implemented.');
    }

    adoptNode<T extends Node>(node: T): T {
        if (node instanceof JqNode) {
            node.ownerDocument = this as any;
        }
        return node;
    }

    createAttribute(localName: string): Attr {
        throw new Error('Method not implemented.');
    }

    createAttributeNS(namespace: string | null, qualifiedName: string): Attr {
        throw new Error('Method not implemented.');
    }

    createEvent(eventInterface: string): any {
        throw new Error('Method not implemented.');
    }

    createRange(): Range {
        throw new Error('Method not implemented.');
    }

    createNodeIterator(root: Node, whatToShow?: number, filter?: NodeFilter | null): NodeIterator {
        throw new Error('Method not implemented.');
    }

    createTreeWalker(root: Node, whatToShow?: number, filter?: NodeFilter | null): TreeWalker {
        throw new Error('Method not implemented.');
    }

    // Selection methods

    getElementById(elementId: string): HTMLElement | null {
        const traverse = (node: JqNode): HTMLElement | null => {
            if (node instanceof JqElement) {
                if (node.getAttribute('id') === elementId) {
                    return node as unknown as HTMLElement;
                }
            }
            // @ts-ignore - Access children from either JqElement or JqDocument
            const children = node.children || node._children || [];
            for (const child of children) {
                const result = traverse(child);
                if (result) return result;
            }
            return null;
        };

        return traverse(this);
    }

    getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element> {
        const results: Element[] = [];
        const search = qualifiedName.toLowerCase();
        const matchAll = search === '*';

        const traverse = (node: JqNode) => {
            // @ts-ignore - Access children from either JqElement or JqDocument
            const children = node.children || node._children || [];
            for (const child of children) {
                if (child.nodeType === this.ELEMENT_NODE) {
                    if (matchAll || child.nodeName.toLowerCase() === search) {
                        results.push(child as unknown as Element);
                    }
                    traverse(child);
                }
            }
        };

        traverse(this);
        return new JqHTMLCollection(results as any) as unknown as HTMLCollectionOf<Element>;
    }

    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", localName: string): HTMLCollectionOf<MathMLElement>;
    getElementsByTagNameNS(namespaceURI: string | null, localName: string): HTMLCollectionOf<Element>;
    getElementsByTagNameNS(namespaceURI: string | null, localName: string): HTMLCollectionOf<Element> {
        return this.getElementsByTagName(localName) as any;
    }

    getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
        const results: Element[] = [];
        const classes = classNames.trim().split(/\s+/).filter(c => c.length > 0);

        if (classes.length === 0) {
            return new JqHTMLCollection([]) as unknown as HTMLCollectionOf<Element>;
        }

        const traverse = (node: JqNode) => {
            // @ts-ignore - Access children from either JqElement or JqDocument
            const children = node.children || node._children || [];
            for (const child of children) {
                if (child.nodeType === this.ELEMENT_NODE) {
                    const classList = ((child as unknown as Element).getAttribute('class') || '').trim().split(/\s+/);
                    const hasAllClasses = classes.every(cls => classList.includes(cls));

                    if (hasAllClasses) {
                        results.push(child as unknown as Element);
                    }
                    traverse(child);
                }
            }
        };

        traverse(this);
        return new JqHTMLCollection(results as any) as unknown as HTMLCollectionOf<Element>;
    }

    // Stubs for other required properties/methods to satisfy interface

    get title(): string { return ''; }
    set title(value: string) { }

    get dir(): string { return ''; }
    set dir(value: string) { }

    get referrer(): string { return ''; }
    get lastModified(): string { return ''; }
    get readyState(): DocumentReadyState { return 'complete'; }

    location: Location = {
        href: 'about:blank',
        protocol: 'about:',
        host: '',
        hostname: '',
        port: '',
        pathname: 'blank',
        search: '',
        hash: '',
        origin: 'null',
        assign: () => { },
        reload: () => { },
        replace: () => { },
        toString: () => 'about:blank',
        ancestorOrigins: {
            length: 0,
            contains: () => false,
            item: () => null,
            [Symbol.iterator]: () => [][Symbol.iterator]()
        }
    };

    get defaultView(): (Window & typeof globalThis) | null { return null; }

    // Event handlers
    onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null = null;
    onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
    onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
    onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
    onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
    onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onbeforeinput: ((this: GlobalEventHandlers, ev: InputEvent) => any) | null = null;
    onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null = null;
    oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    oncopy: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null = null;
    oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncut: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null = null;
    ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onended: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onerror: OnErrorEventHandler = null;
    onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null = null;
    onformdata: ((this: GlobalEventHandlers, ev: FormDataEvent) => any) | null = null;
    ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
    onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
    onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
    onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;




    // Missing properties stubs to satisfy Document interface

    // SVG-related
    get rootElement(): SVGSVGElement | null { return null; }

    // Style sheets
    styleSheets: StyleSheetList = {
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () { yield* []; }
    } as unknown as StyleSheetList;

    // XML-related (deprecated but required by interface)
    xmlEncoding: string | null = null;
    xmlStandalone: boolean = false;
    xmlVersion: string | null = null;

    // Other missing properties
    wasDiscarded: boolean = false;

    // Missing event handlers
    onpointerrawupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onslotchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;

    // Webkit events
    onwebkitanimationend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwebkitanimationiteration: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwebkitanimationstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwebkittransitionend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;

    // Legacy/Deprecated properties stubs
    alinkColor: string = '';
    all: HTMLAllCollection = new JqHTMLCollection([]) as unknown as HTMLAllCollection;
    anchors: HTMLCollectionOf<HTMLAnchorElement> = new JqHTMLCollection([]) as unknown as HTMLCollectionOf<HTMLAnchorElement>;
    applets: HTMLCollectionOf<any> = new JqHTMLCollection([]) as unknown as HTMLCollectionOf<any>;
    bgColor: string = '';
    fgColor: string = '';
    forms: HTMLCollectionOf<HTMLFormElement> = new JqHTMLCollection([]) as unknown as HTMLCollectionOf<HTMLFormElement>;
    images: HTMLCollectionOf<HTMLImageElement> = new JqHTMLCollection([]) as unknown as HTMLCollectionOf<HTMLImageElement>;
    links: HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement> = new JqHTMLCollection([]) as unknown as HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement>;
    plugins: HTMLCollectionOf<HTMLEmbedElement> = new JqHTMLCollection([]) as unknown as HTMLCollectionOf<HTMLEmbedElement>;
    scripts: HTMLCollectionOf<HTMLScriptElement> = new JqHTMLCollection([]) as unknown as HTMLCollectionOf<HTMLScriptElement>;

    // More missing properties
    currentScript: HTMLScriptElement | SVGScriptElement | null = null;
    embeds: HTMLCollectionOf<HTMLEmbedElement> = new JqHTMLCollection([]) as unknown as HTMLCollectionOf<HTMLEmbedElement>;
    fragmentDirective: any = {}; // Experimental
    fullscreen: boolean = false;
    pictureInPictureEnabled: boolean = false;
    pointerLockElement: Element | null = null;
    onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null = null;
    onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onsubmit: ((this: GlobalEventHandlers, ev: SubmitEvent) => any) | null = null;
    onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    ontouchcancel: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null = null;
    ontouchend: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null = null;
    ontouchmove: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null = null;
    ontouchstart: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null = null;
    ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
    ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
    ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
    ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
    onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null = null;

    // More stubs
    cookie: string = '';
    designMode: string = 'off';
    domain: string = '';
    fullscreenEnabled: boolean = false;
    hidden: boolean = false;
    onfullscreenchange: ((this: Document, ev: Event) => any) | null = null;
    onfullscreenerror: ((this: Document, ev: Event) => any) | null = null;
    onpointerlockchange: ((this: Document, ev: Event) => any) | null = null;
    onpointerlockerror: ((this: Document, ev: Event) => any) | null = null;
    onreadystatechange: ((this: Document, ev: Event) => any) | null = null;
    onvisibilitychange: ((this: Document, ev: Event) => any) | null = null;
    scrollingElement: Element | null = null;
    timeline: DocumentTimeline = null as unknown as DocumentTimeline;
    visibilityState: DocumentVisibilityState = 'visible';

    // Methods stubs
    captureEvents(): void { }
    caretPositionFromPoint(x: number, y: number): CaretPosition | null { return null; }
    caretRangeFromPoint(x: number, y: number): Range | null { return null; }
    clear(): void { }
    close(): void { }
    createExpression(expression: string, resolver?: XPathNSResolver | null): XPathExpression { throw new Error('Not implemented'); }
    createNSResolver(nodeResolver: Node): Node { return nodeResolver; }
    elementFromPoint(x: number, y: number): Element | null { return null; }
    elementsFromPoint(x: number, y: number): Element[] { return []; }
    evaluate(expression: string, contextNode: Node, resolver: XPathNSResolver | null, type: number, result: XPathResult | null): XPathResult { throw new Error('Not implemented'); }
    execCommand(commandId: string, showUI?: boolean, value?: string): boolean { return false; }
    exitFullscreen(): Promise<void> { return Promise.resolve(); }
    exitPointerLock(): void { }
    getAnimations(): Animation[] { return []; }
    getElementsByName(elementName: string): NodeListOf<HTMLElement> { return new JqNodeList([]) as unknown as NodeListOf<HTMLElement>; }
    getSelection(): Selection | null { return null; }
    hasFocus(): boolean { return true; }
    open(unused1?: string, unused2?: string): Document;
    open(url: string | URL, name: string, features: string): WindowProxy | null;
    open(...args: any[]): any { return this; }
    queryCommandEnabled(commandId: string): boolean { return false; }
    queryCommandIndeterm(commandId: string): boolean { return false; }
    queryCommandState(commandId: string): boolean { return false; }
    queryCommandSupported(commandId: string): boolean { return false; }
    queryCommandValue(commandId: string): string { return ''; }
    querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
    querySelector<E extends Element = Element>(selectors: string): E | null;
    querySelector(selectors: string): Element | null { return null; } // TODO: Implement
    querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
    querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
    querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
    querySelectorAll(selectors: string): NodeListOf<Element> { return new JqNodeList([]) as unknown as NodeListOf<Element>; } // TODO: Implement
    releaseEvents(): void { }
    write(...text: string[]): void { }
    writeln(...text: string[]): void { }

    // ParentNode
    get childElementCount(): number {
        return this.children.length;
    }

    get children(): HTMLCollection {
        const elements = this._children.filter(node => node.nodeType === this.ELEMENT_NODE) as unknown as JqElement[];
        return new JqHTMLCollection(elements) as unknown as HTMLCollection;
    }

    get childNodes(): NodeListOf<ChildNode> {
        return new JqNodeListOf<ChildNode>(this._children) as unknown as NodeListOf<ChildNode>;
    }

    get firstChild(): ChildNode | null {
        return (this._children[0] as unknown as ChildNode) || null;
    }

    get lastChild(): ChildNode | null {
        return (this._children[this._children.length - 1] as unknown as ChildNode) || null;
    }

    get firstElementChild(): Element | null {
        return (this._children.find(c => c.nodeType === this.ELEMENT_NODE) as unknown as Element) || null;
    }

    get lastElementChild(): Element | null {
        // Reverse search
        for (let i = this._children.length - 1; i >= 0; i--) {
            if (this._children[i].nodeType === this.ELEMENT_NODE) {
                return this._children[i] as unknown as Element;
            }
        }
        return null;
    }

    append(...nodes: (string | Node)[]): void {
        nodes.forEach(node => {
            if (typeof node === 'string') {
                this.appendChild(this.createTextNode(node));
            } else {
                this.appendChild(node);
            }
        });
    }

    prepend(...nodes: (string | Node)[]): void {
        nodes.reverse().forEach(node => {
            if (typeof node === 'string') {
                this.insertBefore(this.createTextNode(node), this.firstChild);
            } else {
                this.insertBefore(node, this.firstChild);
            }
        });
    }

    replaceChildren(...nodes: (string | Node)[]): void {
        this._children = [];
        this.append(...nodes);
    }

    override appendChild<T extends Node>(node: T): T {
        const jqElement = node as unknown as JqElement;
        this._children.push(jqElement);
        jqElement.parent = this as unknown as JqElement;
        jqElement.ownerDocument = this;
        return node;
    }

    override removeChild<T extends Node>(child: T): T {
        const index = this._children.findIndex(c => c === child as unknown as JqElement);
        if (index === -1) {
            throw new Error('Node was not found');
        }
        const removed = this._children.splice(index, 1)[0];
        // @ts-ignore
        removed.parent = undefined;
        return child;
    }

    override insertBefore<T extends Node>(node: T, child: Node | null): T {
        const jqElement = node as unknown as JqElement;
        if (!child) {
            return this.appendChild(node);
        }
        const index = this._children.findIndex(c => c === child as unknown as JqElement);
        if (index === -1) {
            throw new Error('Reference node was not found');
        }
        this._children.splice(index, 0, jqElement);
        jqElement.parent = this as unknown as JqElement;
        jqElement.ownerDocument = this;
        return node;
    }



    // More missing properties
    linkColor: string = '';
    vlinkColor: string = '';
    exitPictureInPicture(): Promise<void> { return Promise.resolve(); }
    hasStorageAccess(): Promise<boolean> { return Promise.resolve(false); }
    requestStorageAccess(): Promise<void> { return Promise.resolve(); }

    activeElement: Element | null = null;
    adoptedStyleSheets: CSSStyleSheet[] = [];
    fullscreenElement: Element | null = null;
    pictureInPictureElement: Element | null = null;

    fonts: FontFaceSet = {
        ready: Promise.resolve({} as FontFaceSet),
        status: 'loaded',
        check: () => true,
        load: () => Promise.resolve([]),
        add: () => { },
        delete: () => false,
        clear: () => { },
        forEach: () => { },
        entries: function* () { yield* []; },
        keys: function* () { yield* []; },
        values: function* () { yield* []; },
        [Symbol.iterator]: function* () { yield* []; },
        has: () => false,
        size: 0,
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => true
    } as unknown as FontFaceSet;

    startViewTransition(updateCallback?: () => Promise<void> | void): ViewTransition {
        return {
            finished: Promise.resolve(),
            ready: Promise.resolve(),
            updateCallbackDone: Promise.resolve(),
            skipTransition: () => { }
        } as unknown as ViewTransition;
    }



    // Missing mouse event handlers
    onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onpaste: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null = null;
    onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent) => any) | null = null;
    onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null = null;
    onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;

    // Additional missing event handlers
    onbeforematch: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onbeforetoggle: ((this: GlobalEventHandlers, ev: ToggleEvent) => any) | null = null;
    oncontextlost: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncontextrestored: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onscrollend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onscrollsnapchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onscrollsnapchanging: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;

    [key: string]: any;
}
