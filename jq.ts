/**
 * jQuery-style wrapper class for working with HTML node trees.
 * Provides methods similar to jQuery for DOM manipulation and traversal.
 */

import { setupParentReferences } from './selector';
import type {
    JqElement,
    CssSelector,
    GetterSetterReturn,
    AttributeValue,
    FormValueInput,
    CssValueInput,
    CssProperties,
    ClassNameInput,
    ToJSONOptions,
    EachCallback,
    MapCallback,
    FilterCallback,
    UntilSelector,
    IndexTarget,
    ContentInput,
    JQ as IJQ,
} from './types';

// Selector methods
import find from './methods/selector-methods/find';

// Attribute methods
import attr from './methods/attributes-methods/attr';
import prop from './methods/attributes-methods/prop';
import removeAttr from './methods/attributes-methods/removeAttr';
import removeProp from './methods/attributes-methods/removeProp';
import val from './methods/attributes-methods/val';
import css from './methods/attributes-methods/css';
import cssCamel from './methods/attributes-methods/cssCamel';
import addClass from './methods/attributes-methods/addClass';
import removeClass from './methods/attributes-methods/removeClass';
import toggleClass from './methods/attributes-methods/toggleClass';
import hasClass from './methods/attributes-methods/hasClass';

// Content methods
import text from './methods/content-methods/text';
import normalizedText from './methods/content-methods/normalizedText';
import html from './methods/content-methods/html';
import toJSON from './methods/content-methods/toJSON';
import findTableWithHeader from './methods/content-methods/findTableWithHeader';
import title from './methods/content-methods/title';

// Iteration methods
import each from './methods/iteration-methods/each';
import map from './methods/iteration-methods/map';

// Traversal methods - Ancestor
import parent from './methods/traversal-methods/ancestor/parent';
import parents from './methods/traversal-methods/ancestor/parents';
import parentsUntil from './methods/traversal-methods/ancestor/parentsUntil';
import closest from './methods/traversal-methods/ancestor/closest';

// Traversal methods - Descendant
import children from './methods/traversal-methods/descendant/children';
import contents from './methods/traversal-methods/descendant/contents';

// Traversal methods - Sibling
import siblings from './methods/traversal-methods/sibling/siblings';
import next from './methods/traversal-methods/sibling/next';
import nextAll from './methods/traversal-methods/sibling/nextAll';
import nextUntil from './methods/traversal-methods/sibling/nextUntil';
import prev from './methods/traversal-methods/sibling/prev';
import prevAll from './methods/traversal-methods/sibling/prevAll';
import prevUntil from './methods/traversal-methods/sibling/prevUntil';

// Traversal methods - Other
import end from './methods/traversal-methods/end';
import pushStack from './methods/traversal-methods/pushStack';

// Filtering methods
import eq from './methods/filtering-methods/eq';
import first from './methods/filtering-methods/first';
import last from './methods/filtering-methods/last';
import filter from './methods/filtering-methods/filter';
import not from './methods/filtering-methods/not';
import has from './methods/filtering-methods/has';
import is from './methods/filtering-methods/is';
import slice from './methods/filtering-methods/slice';

// Insertion methods - Inside
import append from './methods/insertion-methods/inside/append';
import appendTo from './methods/insertion-methods/inside/appendTo';
import prepend from './methods/insertion-methods/inside/prepend';
import prependTo from './methods/insertion-methods/inside/prependTo';

// Insertion methods - Outside
import before from './methods/insertion-methods/outside/before';
import insertBefore from './methods/insertion-methods/outside/insertBefore';
import after from './methods/insertion-methods/outside/after';
import insertAfter from './methods/insertion-methods/outside/insertAfter';

// Insertion methods - Wrapping
import wrap from './methods/insertion-methods/wrapping/wrap';
import wrapAll from './methods/insertion-methods/wrapping/wrapAll';
import wrapInner from './methods/insertion-methods/wrapping/wrapInner';

// Miscellaneous methods
import toArray from './methods/miscellaneous-methods/toArray';
import get from './methods/miscellaneous-methods/get';
import index from './methods/miscellaneous-methods/index';
import remove from './methods/miscellaneous-methods/remove';
import clone from './methods/miscellaneous-methods/clone';
import position from './methods/miscellaneous-methods/position';
import sort from './methods/miscellaneous-methods/sort';
import splice from './methods/miscellaneous-methods/splice';

// Data methods
import data from './methods/data-methods/data';
import removeData from './methods/data-methods/removeData';

// Private helpers
import normalizeContent from './helpers/normalizeContent';
import cloneNode from './helpers/cloneNode';
import hasDescendant from './helpers/hasDescendant';
import findCommonRoots from './helpers/findCommonRoots';

class JQ implements IJQ {
    /**
     * Global registry of all root nodes for selector searches
     */
    static allRootNodes: JqElement[] = [];

    /**
     * Static property to preserve the class name in browser environments
     * where constructor.name might be minified
     */
    static className = 'JQ';

    /**
     * Clear the global root nodes registry (mainly for testing)
     */
    static clearRootNodesRegistry(): void {
        JQ.allRootNodes = [];
    }

    /**
     * Array of HTML nodes wrapped by this instance
     */
    nodes: JqElement[];
    [index: number]: JqElement | undefined;
    _prevObject?: JQ;

    /**
     * Length of the nodes array (jQuery compatibility)
     */
    get length(): number {
        return this.nodes.length;
    }

    set length(value: number) {
        this.nodes.length = value;
    }

    /**
     * Creates a new JQ instance.
     */
    constructor(nodes?: JqElement[]) {
        this.nodes = nodes || [];

        // Set up parent references for the node tree only if nodes are DOM elements
        const hasDomNodes = this.nodes.some(
            (node) =>
                node &&
                typeof node === 'object' &&
                (node.internalType === 'element' || node.internalType === 'text'),
        );

        if (hasDomNodes) {
            setupParentReferences(this.nodes);
            // Add root nodes to global registry for selector searches (avoid duplicates)
            if (this.nodes.length > 0) {
                this.nodes.forEach((node) => {
                    if (!JQ.allRootNodes.includes(node)) {
                        JQ.allRootNodes.push(node);
                    }
                });
            }
        }

        // Return a proxy to support array-like access
        return new Proxy(this, {
            get(target: JQ, prop: string | symbol): any {
                // Handle numeric indices
                if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                    const index = parseInt(prop, 10);
                    return target.nodes[index];
                }
                // Handle length property
                if (prop === 'length') {
                    return target.nodes.length;
                }
                // Handle other properties normally
                return (target as any)[prop];
            },
            set(target: JQ, prop: string | symbol, value: any): boolean {
                // Handle numeric indices
                if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                    const index = parseInt(prop, 10);
                    target.nodes[index] = value;
                    return true;
                }
                (target as any)[prop] = value;
                return true;
            },
        }) as JQ;
    }

    /**
     * Array-like access to nodes (jQuery compatibility)
     */
    [Symbol.iterator](): Iterator<JqElement> {
        return this.nodes[Symbol.iterator]();
    }

    /**
     * Support for numeric indexing like jQuery objects
     */
    get [Symbol.toStringTag](): string {
        return 'JQ';
    }

    // Method stubs - actual implementations are attached below
    // Selector methods
    find!: (selector: CssSelector) => JQ;

    // Attribute methods
    attr!: {
        (name: string): GetterSetterReturn<string>;
        (name: string, value: AttributeValue): JQ;
        (name: string, value: (index: number, attr: string) => string | number | void | undefined): JQ;
        (attributes: Record<string, AttributeValue>): JQ;
    };

    prop!: {
        (name: string): GetterSetterReturn<AttributeValue>;
        (name: string, value: AttributeValue): JQ;
        (name: string, value: (index: number, oldVal: any) => AttributeValue): JQ;
        (properties: Record<string, AttributeValue>): JQ;
    };

    removeAttr!: (attributeName: string) => JQ;
    removeProp!: (propertyName: string) => JQ;

    val!: {
        (): GetterSetterReturn<string | string[]>;
        (value: FormValueInput): JQ;
    };

    css!: {
        (propertyName: string): GetterSetterReturn<string>;
        (propertyNames: string[]): Record<string, string>;
        (propertyName: string, value: CssValueInput): JQ;
        (properties: CssProperties): JQ;
    };

    cssCamel!: {
        (propertyName: string): GetterSetterReturn<string>;
        (propertyNames: string[]): Record<string, string>;
        (propertyName: string, value: CssValueInput): JQ;
        (properties: Record<string, string | number>): JQ;
    };

    addClass!: (className: ClassNameInput) => JQ;
    removeClass!: (className?: ClassNameInput) => JQ;
    toggleClass!: (className: ClassNameInput, state?: boolean) => JQ;
    hasClass!: (className: string) => boolean;

    // Content methods
    text!: {
        (): GetterSetterReturn<string>;
        (content: string): JQ;
    };

    normalizedText!: {
        (): string;
        (value: string): JQ;
    };

    html!: {
        (): GetterSetterReturn<string>;
        (htmlString: string): JQ;
    };

    toJSON!: (options?: ToJSONOptions) => Record<string, string>[];

    findTableWithHeader!: (headerText: string | string[]) => JQ;

    title!: () => string;

    // Iteration methods
    each!: (callback: EachCallback) => JQ;
    map!: <R = unknown>(callback: MapCallback<JqElement, R>) => R[];

    // Traversal methods
    parent!: (selector?: CssSelector) => JQ;
    parents!: (selector?: CssSelector) => JQ;
    parentsUntil!: (selector?: UntilSelector, filter?: CssSelector) => JQ;
    closest!: (selector: CssSelector) => JQ;
    children!: (selector?: CssSelector) => JQ;
    contents!: () => JQ;
    siblings!: (selector?: CssSelector) => JQ;
    next!: (selector?: CssSelector) => JQ;
    nextAll!: (selector?: CssSelector) => JQ;
    nextUntil!: (selector?: UntilSelector, filter?: CssSelector) => JQ;
    prev!: (selector?: CssSelector) => JQ;
    prevAll!: (selector?: CssSelector) => JQ;
    prevUntil!: (selector?: UntilSelector, filter?: CssSelector) => JQ;
    eq!: (index: any) => JQ;
    end!: () => JQ;
    pushStack!: (elements: JqElement[]) => JQ;
    sort!: (compareFn?: (a: JqElement, b: JqElement) => number) => this;
    splice!: (start: number, deleteCount?: number, ...items: JqElement[]) => JqElement[];
    first!: () => JQ;
    last!: () => JQ;

    // Filtering methods
    filter!: (selector: CssSelector | FilterCallback) => JQ;
    not!: (selector: CssSelector | FilterCallback) => JQ;
    has!: (selector: CssSelector | JqElement) => JQ;
    is!: (selector: CssSelector | JqElement | JQ) => boolean;
    slice!: (start: any, end?: any) => JQ;

    // Insertion methods
    append!: (...content: ContentInput[]) => JQ;
    appendTo!: (target: CssSelector | JQ | JqElement | JqElement[]) => JQ;
    prepend!: (...content: ContentInput[]) => JQ;
    prependTo!: (target: CssSelector | JQ | JqElement | JqElement[]) => JQ;
    before!: (...content: ContentInput[]) => JQ;
    insertBefore!: (target: CssSelector | JQ | JqElement | JqElement[]) => JQ;
    after!: (...content: ContentInput[]) => JQ;
    insertAfter!: (target: CssSelector | JQ | JqElement | JqElement[]) => JQ;
    wrap!: (wrappingElement: string | JqElement | JQ) => JQ;
    wrapAll!: (wrappingElement: string | JqElement | JQ) => JQ;
    wrapInner!: (wrappingElement: string | JqElement | JQ) => JQ;

    // Miscellaneous methods
    toArray!: () => JqElement[];
    get!: {
        (): JqElement[];
        (index: number): JqElement | undefined;
    };
    index!: (element?: IndexTarget) => number;

    // Data methods
    data!: {
        (): Record<string, unknown>;
        (key: string): unknown;
        (key: string, value: unknown): JQ;
        (obj: Record<string, unknown>): JQ;
    };

    removeData!: (key?: string | string[]) => JQ;
    remove!: (selector?: CssSelector) => JQ;
    clone!: (withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean) => JQ;
    position!: () => { top: number; left: number } | undefined;

    // Private helpers (prefixed with _)
    _normalizeContent!: (content: ContentInput) => JqElement[];
    _cloneNode!: (node: JqElement | null | undefined, deep?: boolean) => JqElement | null | undefined;
    _hasDescendant!: (ancestor: JqElement, descendant: JqElement) => boolean;
    _findCommonRoots!: (nodes: JqElement[]) => JqElement[];
}

// Attach all methods to the prototype
JQ.prototype.find = find;
JQ.prototype.attr = attr;
JQ.prototype.prop = prop;
JQ.prototype.removeAttr = removeAttr;
JQ.prototype.removeProp = removeProp;
JQ.prototype.val = val;
JQ.prototype.css = css;
JQ.prototype.cssCamel = cssCamel;
JQ.prototype.addClass = addClass;
JQ.prototype.removeClass = removeClass;
JQ.prototype.toggleClass = toggleClass;
JQ.prototype.hasClass = hasClass;
JQ.prototype.text = text;
JQ.prototype.normalizedText = normalizedText;
JQ.prototype.html = html;
JQ.prototype.toJSON = toJSON;
JQ.prototype.findTableWithHeader = findTableWithHeader;
JQ.prototype.title = title;
JQ.prototype.each = each;
JQ.prototype.map = map;
JQ.prototype.parent = parent;
JQ.prototype.parents = parents;
JQ.prototype.parentsUntil = parentsUntil;
JQ.prototype.closest = closest;
JQ.prototype.children = children;
JQ.prototype.contents = contents;
JQ.prototype.siblings = siblings;
JQ.prototype.next = next;
JQ.prototype.nextAll = nextAll;
JQ.prototype.nextUntil = nextUntil;
JQ.prototype.prev = prev;
JQ.prototype.prevAll = prevAll;
JQ.prototype.prevUntil = prevUntil;
JQ.prototype.eq = eq;
JQ.prototype.end = end;
JQ.prototype.pushStack = pushStack;
JQ.prototype.sort = sort;
JQ.prototype.splice = splice;
JQ.prototype.first = first;
JQ.prototype.last = last;
JQ.prototype.filter = filter;
JQ.prototype.not = not;
JQ.prototype.has = has;
JQ.prototype.is = is;
JQ.prototype.slice = slice;
JQ.prototype.append = append;
JQ.prototype.appendTo = appendTo;
JQ.prototype.prepend = prepend;
JQ.prototype.prependTo = prependTo;
JQ.prototype.before = before;
JQ.prototype.insertBefore = insertBefore;
JQ.prototype.after = after;
JQ.prototype.insertAfter = insertAfter;
JQ.prototype.wrap = wrap;
JQ.prototype.wrapAll = wrapAll;
JQ.prototype.wrapInner = wrapInner;
JQ.prototype.toArray = toArray;
JQ.prototype.get = get;
JQ.prototype.index = index;
JQ.prototype.data = data;
JQ.prototype.removeData = removeData;
JQ.prototype.remove = remove;
JQ.prototype.clone = clone;
JQ.prototype.position = position;

// Attach private helpers (prefixed with _)
JQ.prototype._normalizeContent = normalizeContent;
JQ.prototype._cloneNode = cloneNode;
JQ.prototype._hasDescendant = hasDescendant;
JQ.prototype._findCommonRoots = findCommonRoots;

export default JQ;
