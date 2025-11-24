/**
 * Core type definitions for jqnode
 */

import { HtmlNode, NodeType } from './dom/HtmlNode';
import { JqNode } from './dom/JqNode';
import { JqCharacterData } from './dom/JqCharacterData';
import { JqText } from './dom/JqText';
import { JqAttr } from './dom/JqAttr';
import { JqNamedNodeMap } from './dom/JqNamedNodeMap';

// Re-export for convenience
export { HtmlNode, JqNode, JqCharacterData, JqText, JqAttr, JqNamedNodeMap };
export type { NodeType };

/**
 * CSS selector pattern
 * Can be undefined or null, which will be handled gracefully (returns empty results)
 */
export type CssSelector = string | undefined | null;

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
 * Class name input for class manipulation methods (addClass, removeClass, toggleClass)
 * Can be either a string of class names or a function that returns class names
 */
export type ClassNameInput = string | ((index: number, currentClass: string) => string);

/**
 * Value that can be set for HTML attributes and properties
 * Used by attr() and prop() methods
 */
export type AttributeValue = string | number | boolean | null;

/**
 * Input value for form elements
 * Can be a primitive value, array, or function that returns a value
 */
export type FormValueInput =
    | string
    | string[]
    | number
    | ((index: number, currentValue: string | string[]) => string | number);

/**
 * CSS property value input
 * Can be a primitive value or a function that computes the value
 */
export type CssValueInput =
    | string
    | number
    | ((index: number, currentValue: string) => string | number);

/**
 * CSS properties object for setting multiple styles
 */
export type CssProperties = Record<string, CssValueInput>;

/**
 * Selector or element to use as stopping point in traversal "Until" methods
 */
export type UntilSelector = CssSelector | HtmlNode;

/**
 * Element or selector to search for when finding index position
 */
export type IndexTarget = HtmlNode | JQ | CssSelector;

/**
 * Return type for getter/setter methods that can return value or chain
 */
export type GetterSetterReturn<T> = T | undefined | JQ;

/**
 * Callback for sorting methods
 */
export type SortCallback = (a: HtmlNode, b: HtmlNode) => number;

/**
 * JQ instance interface
 */
export interface JQ {
    nodes: HtmlNode[];
    length: number;
    [index: number]: HtmlNode | undefined;
    [Symbol.iterator](): Iterator<HtmlNode>;
    [Symbol.toStringTag]: string;
    _prevObject?: JQ; // For end() method

    // Selector methods
    find(selector: CssSelector): JQ;

    // Attribute methods
    attr(name: string): GetterSetterReturn<string>;
    attr(name: string, value: AttributeValue): JQ;
    attr(
        name: string,
        value: (index: number, attr: string) => string | number | void | undefined,
    ): JQ;
    attr(attributes: Record<string, AttributeValue>): JQ;

    prop(name: string): GetterSetterReturn<AttributeValue>;
    prop(name: string, value: AttributeValue): JQ;
    prop(name: string, value: (index: number, oldVal: any) => AttributeValue): JQ;
    prop(properties: Record<string, AttributeValue>): JQ;

    removeAttr(attributeName: string): JQ;
    removeProp(propertyName: string): JQ;

    val(): GetterSetterReturn<string | string[]>;
    val(value: FormValueInput): JQ;

    css(propertyName: string): GetterSetterReturn<string>;
    css(propertyNames: string[]): Record<string, string>;
    css(propertyName: string, value: CssValueInput): JQ;
    css(properties: CssProperties): JQ;

    cssCamel(propertyName: string): GetterSetterReturn<string>;
    cssCamel(propertyNames: string[]): Record<string, string>;
    cssCamel(propertyName: string, value: CssValueInput): JQ;
    cssCamel(properties: Record<string, string | number>): JQ;

    addClass(className: ClassNameInput): JQ;
    removeClass(className?: ClassNameInput): JQ;
    toggleClass(className: ClassNameInput, state?: boolean): JQ;
    hasClass(className: string): boolean;

    // Content methods
    text(): GetterSetterReturn<string>;
    text(content: string): JQ;

    normalizedText(): string;

    html(): GetterSetterReturn<string>;
    html(htmlString: string): JQ;

    toJSON(): unknown;

    findTableWithHeader(headerText: string | string[]): JQ;

    title(): string;

    // Data methods
    data(): Record<string, unknown>;
    data(key: string): unknown;
    data(key: string, value: unknown): JQ;
    data(obj: Record<string, unknown>): JQ;

    removeData(key?: string | string[]): JQ;

    // Filtering methods
    eq(index: any): JQ;
    first(): JQ;
    last(): JQ;
    filter(selector: CssSelector | FilterCallback): JQ;
    not(selector: CssSelector | FilterCallback): JQ;
    has(selector: CssSelector | HtmlNode): JQ;
    is(selector: CssSelector | HtmlNode | JQ): boolean;
    slice(start: any, end?: any): JQ;

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
    get(): HtmlNode[];
    get(index: number): HtmlNode | undefined;
    index(element?: IndexTarget): number;
    remove(selector?: CssSelector): JQ;
    clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): JQ;
    position(): { top: number; left: number } | undefined;

    // Traversal methods
    parent(selector?: CssSelector): JQ;
    parents(selector?: CssSelector): JQ;
    parentsUntil(selector?: UntilSelector, filter?: CssSelector): JQ;
    closest(selector: CssSelector): JQ;
    children(selector?: CssSelector): JQ;
    contents(): JQ;
    siblings(selector?: CssSelector): JQ;
    next(selector?: CssSelector): JQ;
    nextAll(selector?: CssSelector): JQ;
    nextUntil(selector?: UntilSelector, filter?: CssSelector): JQ;
    prev(selector?: CssSelector): JQ;
    prevAll(selector?: CssSelector): JQ;
    prevUntil(selector?: UntilSelector, filter?: CssSelector): JQ;
    end(): JQ;

    // Private helpers (prefixed with _)
    _normalizeContent(content: ContentInput): HtmlNode[];
    _cloneNode(node: HtmlNode, deep?: boolean): HtmlNode;
    _hasDescendant(ancestor: HtmlNode, descendant: HtmlNode): boolean;
    _findCommonRoots(nodes: HtmlNode[]): HtmlNode[];
}

/**
 * Static interface for the JQ factory function
 */
export interface JQStatic {
    (htmlOrSelectorOrNodes?: string | HtmlNode[] | HtmlNode | any, context?: HtmlNode[] | null): JQ;
    fn: any;
    clearRootNodesRegistry(): void;

    // Utility methods
    each(
        collection: any[] | Record<string, any> | null | undefined,
        callback: (indexOrKey: any, value: any) => any,
    ): any;
    map(
        collection: any[] | Record<string, any> | null | undefined,
        callback: (value: any, indexOrKey: any) => any,
    ): any[];
    load(html: string, options?: { normalize?: boolean }): any;

    // Static utility methods
    now(): number;
    noop(): void;
    param(obj: any, traditional?: boolean): string;
    parseHTML(html: string): HtmlNode[];
    parseJSON(json: string): any;
    parseXML(xml: string): any;
    trim(str: string | null | undefined): string;
    type(obj: any): string;
    unique(array: any[]): any[];
    uniqueSort(array: any[]): any[];
    makeArray(arrayLike: any): any[];
    isPlainObject(obj: any): boolean;
    isNumeric(value: any): boolean;
    isFunction(value: any): boolean;
    isEmptyObject(obj: any): boolean;
    isArray(value: any): boolean;
    inArray(value: any, array: any[], fromIndex?: number): number;
    hasData(element: any): boolean;
    extend(...args: any[]): any;
    escapeSelector(selector: string): string;
    title(newTitle?: string): string;
    normalizeHTML(html: string): string;
}
