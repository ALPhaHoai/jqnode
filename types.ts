/**
 * Core type definitions for jqnode
 */

/**
 * Node type identifier
 */
export type NodeType = 'element' | 'text' | 'comment';

/**
 * Internal HTML node structure
 */
export interface HtmlNode {
    type: NodeType;
    name?: string;
    tagName?: string; // Tag name for elements
    data?: string;
    attribs?: Record<string, string>;
    children?: HtmlNode[];
    parent?: HtmlNode;
    parentNode?: ParentNode | null; // DOM parentNode reference
    prev?: HtmlNode | null;
    next?: HtmlNode | null;
    // Internal tracking for data storage
    __jqdata__?: Record<string, unknown>;
    // Extended properties for DOM integration
    _originalElement?: Element | null; // DOM element reference
    _jqData?: Record<string, unknown>; // jQuery-style data storage
    _detached?: boolean; // Marks nodes from fractional eq() indices as detached
    properties?: Record<string, unknown>; // Custom properties storage
    nodeType?: number; // DOM node type
    childNodes?: ChildNode[]; // DOM childNodes
    attributes?: Record<string, unknown>; // Attributes as plain object (cheerio-style)
    getAttribute?: (name: string) => string | null;
    setAttribute?: (name: string, value: string | number) => void;
    removeAttribute?: (name: string) => void;
    removeChild?: (child: Node) => Node | null; // DOM removeChild method
    textContent?: string | null; // DOM text content
    offsetTop?: number; // DOM offset properties
    offsetLeft?: number;
}


/**
 * CSS selector pattern
 */
export type CssSelector = string;

/**
 * Content that can be inserted/appended
 */
export type ContentInput = string | HtmlNode | HtmlNode[] | JQ;

/**
 * Callback for iteration methods
 */
export type EachCallback<T = HtmlNode> = (this: T, index: number, element: T) => void | boolean;

/**
 * Callback for map methods
 */
export type MapCallback<T = HtmlNode, R = unknown> = (this: T, index: number, element: T) => R;

/**
 * Filter callback
 */
export type FilterCallback = (this: HtmlNode, index: number, element: HtmlNode) => boolean;

/**
 * JQ instance interface
 */
export interface JQ {
    nodes: HtmlNode[];
    length: number;
    [index: number]: HtmlNode | undefined;
    _prevObject?: JQ; // For end() method

    // Selector methods
    find(selector: CssSelector): JQ;

    // Attribute methods
    attr(name: string): string | undefined;
    attr(name: string, value: string | number | null): JQ;
    attr(attributes: Record<string, string | number | null>): JQ;

    prop(name: string): unknown;
    prop(name: string, value: unknown): JQ;
    prop(properties: Record<string, unknown>): JQ;

    removeAttr(attributeName: string): JQ;
    removeProp(propertyName: string): JQ;

    val(): string | undefined;
    val(value: string | number): JQ;

    css(propertyName: string): string | undefined;
    css(propertyName: string, value: string | number): JQ;
    css(properties: Record<string, string | number>): JQ;

    cssCamel(propertyName: string): string | undefined;

    addClass(className: string | ((index: number, currentClass: string) => string)): JQ;
    removeClass(className: string): JQ;
    toggleClass(className: string): JQ;
    hasClass(className: string): boolean;

    // Content methods
    text(): string;
    text(content: string): JQ;

    normalizedText(): string;

    html(): string;
    html(htmlString: string): JQ;

    toJSON(): unknown;

    findTableWithHeader(headerText: string): JQ;

    title(): string;

    // Data methods
    data(key: string): unknown;
    data(key: string, value: unknown): JQ;
    data(obj: Record<string, unknown>): JQ;

    removeData(key: string): JQ;

    // Filtering methods
    eq(index: number): JQ;
    first(): JQ;
    last(): JQ;
    filter(selector: CssSelector | FilterCallback): JQ;
    not(selector: CssSelector | FilterCallback): JQ;
    has(selector: CssSelector): JQ;
    is(selector: CssSelector): boolean;
    slice(start: number, end?: number): JQ;

    // Insertion methods
    append(content: ContentInput): JQ;
    appendTo(target: CssSelector | JQ): JQ;
    prepend(content: ContentInput): JQ;
    prependTo(target: CssSelector | JQ): JQ;
    before(content: ContentInput): JQ;
    insertBefore(target: CssSelector | JQ): JQ;
    after(content: ContentInput): JQ;
    insertAfter(target: CssSelector | JQ): JQ;
    wrap(wrappingElement: string | HtmlNode): JQ;
    wrapAll(wrappingElement: string | HtmlNode): JQ;
    wrapInner(wrappingElement: string | HtmlNode): JQ;

    // Iteration methods
    each(callback: EachCallback): JQ;
    map<R = unknown>(callback: MapCallback<HtmlNode, R>): R[];

    // Miscellaneous methods
    toArray(): HtmlNode[];
    get(index?: number): HtmlNode | HtmlNode[] | undefined;
    index(element?: HtmlNode | JQ | CssSelector): number;
    remove(selector?: CssSelector): JQ;
    clone(withDataAndEvents?: boolean): JQ;
    position(): { top: number; left: number } | undefined;

    // Traversal methods
    parent(selector?: CssSelector): JQ;
    parents(selector?: CssSelector): JQ;
    parentsUntil(selector?: CssSelector | HtmlNode, filter?: CssSelector): JQ;
    closest(selector: CssSelector): JQ;
    children(selector?: CssSelector): JQ;
    contents(): JQ;
    siblings(selector?: CssSelector): JQ;
    next(selector?: CssSelector): JQ;
    nextAll(selector?: CssSelector): JQ;
    nextUntil(selector?: CssSelector | HtmlNode, filter?: CssSelector): JQ;
    prev(selector?: CssSelector): JQ;
    prevAll(selector?: CssSelector): JQ;
    prevUntil(selector?: CssSelector | HtmlNode, filter?: CssSelector): JQ;
    end(): JQ;

    // Private helpers (prefixed with _)
    _normalizeContent(content: ContentInput): HtmlNode[];
    _cloneNode(node: HtmlNode, deep?: boolean): HtmlNode;
    _hasDescendant(ancestor: HtmlNode, descendant: HtmlNode): boolean;
    _findCommonRoots(nodes: HtmlNode[]): HtmlNode[];
    noop(): void;
    param(obj: Record<string, unknown>): string;
    parseHTML(html: string): HtmlNode[];
    isArray(obj: unknown): obj is unknown[];
    isFunction(obj: unknown): obj is Function;
    isNumeric(obj: unknown): boolean;
    isPlainObject(obj: unknown): obj is Record<string, unknown>;
    isEmptyObject(obj: unknown): boolean;
    type(obj: unknown): string;
    trim(str: string): string;
    merge<T>(first: T[], second: T[]): T[];
    grep<T>(array: T[], callback: (element: T, index: number) => boolean, invert?: boolean): T[];
    makeArray<T>(arrayLike: ArrayLike<T> | T): T[];
    inArray<T>(value: T, array: T[], fromIndex?: number): number;
    unique<T>(array: T[]): T[];
    escapeSelector(selector: string): string;
    title(html: string): string;
    normalizeHTML(html: string): string;
}
