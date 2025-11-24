import { JqNode } from './JqNode';
import { JqElement } from './JqElement';
import { JqText } from './JqText';
import { JqComment } from './JqComment';
import { JqHTMLCollection } from './JqHTMLCollection';
import { JqNodeList, JqNodeListOf } from './JqNodeList';
import * as HTMLElements from './index';

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
        let element: JqElement;
        const tag = tagName.toLowerCase();

        // Factory method - return specific element types
        switch (tag) {
            // Structural elements
            case 'html': element = new HTMLElements.JqHTMLHtmlElement(); break;
            case 'head': element = new HTMLElements.JqHTMLHeadElement(); break;
            case 'body': element = new HTMLElements.JqHTMLBodyElement(); break;
            case 'div': element = new HTMLElements.JqHTMLDivElement(); break;
            case 'span': element = new HTMLElements.JqHTMLSpanElement(); break;

            // Text content
            case 'p': element = new HTMLElements.JqHTMLParagraphElement(); break;
            case 'h1': element = new HTMLElements.JqHTMLHeadingElement(1); break;
            case 'h2': element = new HTMLElements.JqHTMLHeadingElement(2); break;
            case 'h3': element = new HTMLElements.JqHTMLHeadingElement(3); break;
            case 'h4': element = new HTMLElements.JqHTMLHeadingElement(4); break;
            case 'h5': element = new HTMLElements.JqHTMLHeadingElement(5); break;
            case 'h6': element = new HTMLElements.JqHTMLHeadingElement(6); break;
            case 'br': element = new HTMLElements.JqHTMLBRElement(); break;
            case 'hr': element = new HTMLElements.JqHTMLHRElement(); break;
            case 'pre': element = new HTMLElements.JqHTMLPreElement(); break;

            // Links
            case 'a': element = new HTMLElements.JqHTMLAnchorElement(); break;

            // Lists
            case 'ul': element = new HTMLElements.JqHTMLUListElement(); break;
            case 'ol': element = new HTMLElements.JqHTMLOListElement(); break;
            case 'li': element = new HTMLElements.JqHTMLLIElement(); break;
            case 'dl': element = new HTMLElements.JqHTMLDListElement(); break;
            case 'dd': element = new HTMLElements.JqHTMLDDElement(); break;
            case 'dt': element = new HTMLElements.JqHTMLDTElement(); break;

            // Media
            case 'img': element = new HTMLElements.JqHTMLImageElement(); break;
            case 'audio': element = new HTMLElements.JqHTMLAudioElement(); break;
            case 'video': element = new HTMLElements.JqHTMLVideoElement(); break;
            case 'source': element = new HTMLElements.JqHTMLSourceElement(); break;
            case 'track': element = new HTMLElements.JqHTMLTrackElement(); break;

            // Forms
            case 'form': element = new HTMLElements.JqHTMLFormElement(); break;
            case 'input': element = new HTMLElements.JqHTMLInputElement(); break;
            case 'button': element = new HTMLElements.JqHTMLButtonElement(); break;
            case 'select': element = new HTMLElements.JqHTMLSelectElement(); break;
            case 'option': element = new HTMLElements.JqHTMLOptionElement(); break;
            case 'textarea': element = new HTMLElements.JqHTMLTextAreaElement(); break;
            case 'label': element = new HTMLElements.JqHTMLLabelElement(); break;
            case 'fieldset': element = new HTMLElements.JqHTMLFieldSetElement(); break;
            case 'legend': element = new HTMLElements.JqHTMLLegendElement(); break;
            case 'datalist': element = new HTMLElements.JqHTMLDataListElement(); break;
            case 'optgroup': element = new HTMLElements.JqHTMLOptGroupElement(); break;
            case 'output': element = new HTMLElements.JqHTMLOutputElement(); break;
            case 'progress': element = new HTMLElements.JqHTMLProgressElement(); break;
            case 'meter': element = new HTMLElements.JqHTMLMeterElement(); break;

            // Tables
            case 'table': element = new HTMLElements.JqHTMLTableElement(); break;
            case 'tr': element = new HTMLElements.JqHTMLTableRowElement(); break;
            case 'td': element = new HTMLElements.JqHTMLTableCellElement('td'); break;
            case 'th': element = new HTMLElements.JqHTMLTableCellElement('th'); break;
            case 'thead': element = new HTMLElements.JqHTMLTableSectionElement('thead'); break;
            case 'tbody': element = new HTMLElements.JqHTMLTableSectionElement('tbody'); break;
            case 'tfoot': element = new HTMLElements.JqHTMLTableSectionElement('tfoot'); break;
            case 'caption': element = new HTMLElements.JqHTMLTableCaptionElement(); break;
            case 'col': element = new HTMLElements.JqHTMLTableColElement('col'); break;
            case 'colgroup': element = new HTMLElements.JqHTMLTableColElement('colgroup'); break;

            // Metadata & Scripts
            case 'meta': element = new HTMLElements.JqHTMLMetaElement(); break;
            case 'link': element = new HTMLElements.JqHTMLLinkElement(); break;
            case 'script': element = new HTMLElements.JqHTMLScriptElement(); break;
            case 'style': element = new HTMLElements.JqHTMLStyleElement(); break;
            case 'title': element = new HTMLElements.JqHTMLTitleElement(); break;
            case 'base': element = new HTMLElements.JqHTMLBaseElement(); break;

            // Embedded content
            case 'iframe': element = new HTMLElements.JqHTMLIFrameElement(); break;
            case 'canvas': element = new HTMLElements.JqHTMLCanvasElement(); break;
            case 'embed': element = new HTMLElements.JqHTMLEmbedElement(); break;
            case 'object': element = new HTMLElements.JqHTMLObjectElement(); break;
            case 'picture': element = new HTMLElements.JqHTMLPictureElement(); break;
            case 'area': element = new HTMLElements.JqHTMLAreaElement(); break;
            case 'map': element = new HTMLElements.JqHTMLMapElement(); break;

            // Semantic elements
            case 'address': element = new HTMLElements.JqHTMLAddressElement(); break;
            case 'article': element = new HTMLElements.JqHTMLArticleElement(); break;
            case 'aside': element = new HTMLElements.JqHTMLAsideElement(); break;
            case 'footer': element = new HTMLElements.JqHTMLFooterElement(); break;
            case 'header': element = new HTMLElements.JqHTMLHeaderElement(); break;
            case 'hgroup': element = new HTMLElements.JqHTMLHGroupElement(); break;
            case 'main': element = new HTMLElements.JqHTMLMainElement(); break;
            case 'nav': element = new HTMLElements.JqHTMLNavElement(); break;
            case 'section': element = new HTMLElements.JqHTMLSectionElement(); break;
            case 'search': element = new HTMLElements.JqHTMLSearchElement(); break;
            case 'blockquote': element = new HTMLElements.JqHTMLBlockquoteElement(); break;
            case 'figure': element = new HTMLElements.JqHTMLFigureElement(); break;
            case 'figcaption': element = new HTMLElements.JqHTMLFigcaptionElement(); break;
            case 'menu': element = new HTMLElements.JqHTMLMenuElement(); break;

            // Inline text semantics
            case 'abbr': element = new HTMLElements.JqHTMLAbbrElement(); break;
            case 'b': element = new HTMLElements.JqHTMLBElement(); break;
            case 'bdi': element = new HTMLElements.JqHTMLBDIElement(); break;
            case 'bdo': element = new HTMLElements.JqHTMLBDOElement(); break;
            case 'cite': element = new HTMLElements.JqHTMLCiteElement(); break;
            case 'code': element = new HTMLElements.JqHTMLCodeElement(); break;
            case 'data': element = new HTMLElements.JqHTMLDataElement(); break;
            case 'dfn': element = new HTMLElements.JqHTMLDFNElement(); break;
            case 'em': element = new HTMLElements.JqHTMLEmElement(); break;
            case 'i': element = new HTMLElements.JqHTMLIElement(); break;
            case 'kbd': element = new HTMLElements.JqHTMLKbdElement(); break;
            case 'mark': element = new HTMLElements.JqHTMLMarkElement(); break;
            case 'q': element = new HTMLElements.JqHTMLQuoteElement(); break;
            case 'rp': element = new HTMLElements.JqHTMLRPElement(); break;
            case 'rt': element = new HTMLElements.JqHTMLRTElement(); break;
            case 'ruby': element = new HTMLElements.JqHTMLRubyElement(); break;
            case 's': element = new HTMLElements.JqHTMLSElement(); break;
            case 'samp': element = new HTMLElements.JqHTMLSampElement(); break;
            case 'small': element = new HTMLElements.JqHTMLSmallElement(); break;
            case 'strong': element = new HTMLElements.JqHTMLStrongElement(); break;
            case 'sub': element = new HTMLElements.JqHTMLSubElement(); break;
            case 'sup': element = new HTMLElements.JqHTMLSupElement(); break;
            case 'time': element = new HTMLElements.JqHTMLTimeElement(); break;
            case 'u': element = new HTMLElements.JqHTMLUElement(); break;
            case 'var': element = new HTMLElements.JqHTMLVarElement(); break;
            case 'wbr': element = new HTMLElements.JqHTMLWbrElement(); break;

            // Edits
            case 'ins': element = new HTMLElements.JqHTMLModElement('ins'); break;
            case 'del': element = new HTMLElements.JqHTMLModElement('del'); break;

            // Interactive
            case 'details': element = new HTMLElements.JqHTMLDetailsElement(); break;
            case 'dialog': element = new HTMLElements.JqHTMLDialogElement(); break;
            case 'summary': element = new HTMLElements.JqHTMLSummaryElement(); break;

            // Web components
            case 'slot': element = new HTMLElements.JqHTMLSlotElement(); break;
            case 'template': element = new HTMLElements.JqHTMLTemplateElement(); break;

            // Scripting
            case 'noscript': element = new HTMLElements.JqHTMLNoScriptElement(); break;

            // Default fallback for unknown elements
            default: element = new JqElement('element', tagName); break;
        }

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
            // @ts-ignore
            const children = node._children || node.children || [];
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
            // @ts-ignore
            const children = node._children || node.children || [];
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
            // @ts-ignore
            const children = node._children || node.children || [];
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
