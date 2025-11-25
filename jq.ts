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
} from './types';

class JQ {
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

    /**
     * Length of the nodes array (jQuery compatibility)
     */
    get length(): number {
        return this.nodes.length;
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
                // Prevent setting numeric indices
                if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                    return false; // Don't allow setting
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

    normalizedText!: () => string;

    html!: {
        (): GetterSetterReturn<string>;
        (htmlString: string): JQ;
    };

    toJSON!: <T = any>(options?: ToJSONOptions) => T;

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
    first!: () => JQ;
    last!: () => JQ;

    // Filtering methods
    filter!: (selector: CssSelector | FilterCallback) => JQ;
    not!: (selector: CssSelector | FilterCallback) => JQ;
    has!: (selector: CssSelector | JqElement) => JQ;
    is!: (selector: CssSelector | JqElement | JQ) => boolean;
    slice!: (start: any, end?: any) => JQ;

    // Insertion methods
    append!: (content: ContentInput) => JQ;
    appendTo!: (target: CssSelector | JQ) => JQ;
    prepend!: (content: ContentInput) => JQ;
    prependTo!: (target: CssSelector | JQ) => JQ;
    before!: (content: ContentInput) => JQ;
    insertBefore!: (target: CssSelector | JQ) => JQ;
    after!: (content: ContentInput) => JQ;
    insertAfter!: (target: CssSelector | JQ) => JQ;
    wrap!: (wrappingElement: string | JqElement) => JQ;
    wrapAll!: (wrappingElement: string | JqElement) => JQ;
    wrapInner!: (wrappingElement: string | JqElement) => JQ;

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
    _cloneNode!: (node: JqElement, deep?: boolean) => JqElement;
    _hasDescendant!: (ancestor: JqElement, descendant: JqElement) => boolean;
    _findCommonRoots!: (nodes: JqElement[]) => JqElement[];
}

// Attach all methods to the prototype
JQ.prototype.find = require('./methods/selector-methods/find');
JQ.prototype.attr = require('./methods/attributes-methods/attr');
JQ.prototype.prop = require('./methods/attributes-methods/prop');
JQ.prototype.removeAttr = require('./methods/attributes-methods/removeAttr');
JQ.prototype.removeProp = require('./methods/attributes-methods/removeProp');
JQ.prototype.val = require('./methods/attributes-methods/val');
JQ.prototype.css = require('./methods/attributes-methods/css');
JQ.prototype.cssCamel = require('./methods/attributes-methods/cssCamel');
JQ.prototype.addClass = require('./methods/attributes-methods/addClass');
JQ.prototype.removeClass = require('./methods/attributes-methods/removeClass');
JQ.prototype.toggleClass = require('./methods/attributes-methods/toggleClass');
JQ.prototype.hasClass = require('./methods/attributes-methods/hasClass');
JQ.prototype.text = require('./methods/content-methods/text');
JQ.prototype.normalizedText = require('./methods/content-methods/normalizedText');
JQ.prototype.html = require('./methods/content-methods/html');
JQ.prototype.toJSON = require('./methods/content-methods/toJSON');
JQ.prototype.findTableWithHeader = require('./methods/content-methods/findTableWithHeader');
JQ.prototype.title = require('./methods/content-methods/title');
JQ.prototype.each = require('./methods/iteration-methods/each');
JQ.prototype.map = require('./methods/iteration-methods/map');
JQ.prototype.parent = require('./methods/traversal-methods/ancestor/parent');
JQ.prototype.parents = require('./methods/traversal-methods/ancestor/parents');
JQ.prototype.parentsUntil = require('./methods/traversal-methods/ancestor/parentsUntil');
JQ.prototype.closest = require('./methods/traversal-methods/ancestor/closest');
JQ.prototype.children = require('./methods/traversal-methods/descendant/children');
JQ.prototype.contents = require('./methods/traversal-methods/descendant/contents');
JQ.prototype.siblings = require('./methods/traversal-methods/sibling/siblings');
JQ.prototype.next = require('./methods/traversal-methods/sibling/next');
JQ.prototype.nextAll = require('./methods/traversal-methods/sibling/nextAll');
JQ.prototype.nextUntil = require('./methods/traversal-methods/sibling/nextUntil');
JQ.prototype.prev = require('./methods/traversal-methods/sibling/prev');
JQ.prototype.prevAll = require('./methods/traversal-methods/sibling/prevAll');
JQ.prototype.prevUntil = require('./methods/traversal-methods/sibling/prevUntil');
JQ.prototype.eq = require('./methods/filtering-methods/eq');
JQ.prototype.end = require('./methods/traversal-methods/end');
JQ.prototype.first = require('./methods/filtering-methods/first');
JQ.prototype.last = require('./methods/filtering-methods/last');
JQ.prototype.filter = require('./methods/filtering-methods/filter');
JQ.prototype.not = require('./methods/filtering-methods/not');
JQ.prototype.has = require('./methods/filtering-methods/has');
JQ.prototype.is = require('./methods/filtering-methods/is');
JQ.prototype.slice = require('./methods/filtering-methods/slice');
JQ.prototype.append = require('./methods/insertion-methods/inside/append');
JQ.prototype.appendTo = require('./methods/insertion-methods/inside/appendTo');
JQ.prototype.prepend = require('./methods/insertion-methods/inside/prepend');
JQ.prototype.prependTo = require('./methods/insertion-methods/inside/prependTo');
JQ.prototype.before = require('./methods/insertion-methods/outside/before');
JQ.prototype.insertBefore = require('./methods/insertion-methods/outside/insertBefore');
JQ.prototype.after = require('./methods/insertion-methods/outside/after');
JQ.prototype.insertAfter = require('./methods/insertion-methods/outside/insertAfter');
JQ.prototype.wrap = require('./methods/insertion-methods/wrapping/wrap');
JQ.prototype.wrapAll = require('./methods/insertion-methods/wrapping/wrapAll');
JQ.prototype.wrapInner = require('./methods/insertion-methods/wrapping/wrapInner');
JQ.prototype.toArray = require('./methods/miscellaneous-methods/toArray');
JQ.prototype.get = require('./methods/miscellaneous-methods/get');
JQ.prototype.index = require('./methods/miscellaneous-methods/index');
JQ.prototype.data = require('./methods/data-methods/data');
JQ.prototype.removeData = require('./methods/data-methods/removeData');
JQ.prototype.remove = require('./methods/miscellaneous-methods/remove');
JQ.prototype.clone = require('./methods/miscellaneous-methods/clone');
JQ.prototype.position = require('./methods/miscellaneous-methods/position');

// Attach private helpers (prefixed with _)
JQ.prototype._normalizeContent = require('./helpers/normalizeContent');
JQ.prototype._cloneNode = require('./helpers/cloneNode');
JQ.prototype._hasDescendant = require('./helpers/hasDescendant');
JQ.prototype._findCommonRoots = require('./helpers/findCommonRoots');

export default JQ;
