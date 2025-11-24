import { parseSelector, nodeMatchesSelector } from '../../../selector';
import type { CssSelector, JQ } from '../../../types';
import { HtmlNode } from '../../../types';
import JQClass from '../../../jq';

// Use ReturnType to infer ParsedSelector from parseSelector function
type ParsedSelector = NonNullable<ReturnType<typeof parseSelector>>;

/**
 * Parses and validates the provided selector.
 * @param selector - The CSS selector to parse
 * @returns The parsed selector or null if invalid
 */
function _parseAndValidateSelector(selector?: CssSelector): ParsedSelector | null {
    if (!selector) {
        return null;
    }
    return parseSelector(selector);
}

/**
 * Creates a unique key for an element to avoid duplicates.
 * @param tagName - The tag name of the element
 * @param attributes - The attributes of the element
 * @returns A unique string key
 */
function _createUniqueKey(tagName: string, attributes: Record<string, unknown>): string {
    return `${tagName.toLowerCase()}-${JSON.stringify(attributes)}`;
}

/**
 * Converts a DOM element to internal HtmlNode format.
 * @param domElement - The DOM element to convert
 * @returns The converted HtmlNode
 */
function _convertDomToNode(domElement: Element): HtmlNode {
    const attributes: Record<string, string> = {};
    for (let i = 0; i < domElement.attributes.length; i++) {
        const attr = domElement.attributes[i];
        attributes[attr.name] = attr.value;
    }

    const node = new HtmlNode('element', domElement.tagName.toLowerCase());
    node.tagName = domElement.tagName.toLowerCase();
    node.attributes._setData(attributes);
    node._originalElement = domElement;
    return node;
}

/**
 * Traverses DOM tree parents and collects matching ancestors.
 * @param node - The starting node with _originalElement
 * @param parsedSelector - The parsed selector to filter by (or null for all)
 * @param ancestors - Array to collect matching ancestors
 * @param seen - Set to track already processed elements
 */
function _traverseDomParents(
    node: HtmlNode,
    parsedSelector: ParsedSelector | null,
    ancestors: HtmlNode[],
    seen: Set<string>,
): void {
    let domCurrent = node._originalElement?.parentElement;

    while (domCurrent && domCurrent.nodeType === 1) {
        const domNode = _convertDomToNode(domCurrent);
        const attrData = domNode.attributes._getData();
        const key = _createUniqueKey(domNode.tagName || '', attrData);

        if (!seen.has(key)) {
            seen.add(key);

            // If selector provided, check if this ancestor matches
            if (!parsedSelector || nodeMatchesSelector(domNode, parsedSelector)) {
                ancestors.push(domNode);
            }
        }

        domCurrent = domCurrent.parentElement;
    }
}

/**
 * Traverses internal node tree parents and collects matching ancestors.
 * @param node - The starting node
 * @param parsedSelector - The parsed selector to filter by (or null for all)
 * @param ancestors - Array to collect matching ancestors
 * @param seen - Set to track already processed elements
 */
function _traverseInternalParents(
    node: HtmlNode,
    parsedSelector: ParsedSelector | null,
    ancestors: HtmlNode[],
    seen: Set<string>,
): void {
    let current: HtmlNode | undefined = node.parent;

    while (current) {
        if (current.internalType === 'element') {
            const attrData = current.attributes._getData();
            const key = _createUniqueKey(current.tagName || '', attrData);

            if (!seen.has(key)) {
                seen.add(key);

                // If selector provided, check if this ancestor matches
                if (!parsedSelector || nodeMatchesSelector(current, parsedSelector)) {
                    ancestors.push(current);
                }
            }
        }
        current = current.parent;
    }
}

/**
 * Collects all parent ancestors for the given nodes.
 * @param nodes - The nodes to get parents for
 * @param parsedSelector - The parsed selector to filter by (or null for all)
 * @returns Array of ancestor nodes
 */
function _collectParents(nodes: HtmlNode[], parsedSelector: ParsedSelector | null): HtmlNode[] {
    const ancestors: HtmlNode[] = [];
    const seen = new Set<string>();

    for (const node of nodes) {
        if (node._originalElement) {
            // Traverse the actual DOM tree
            _traverseDomParents(node, parsedSelector, ancestors, seen);
        } else {
            // Traverse the internal node tree
            _traverseInternalParents(node, parsedSelector, ancestors, seen);
        }
    }

    return ancestors;
}

/**
 * Gets the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
 * @see https://api.jquery.com/parents/
 */
function parents(this: JQ, selector?: CssSelector): JQ {
    const parsedSelector = _parseAndValidateSelector(selector);

    // If selector was provided but failed to parse, return empty JQ object
    if (selector && !parsedSelector) {
        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = [];
        result.length = 0;
        return result;
    }

    const ancestors = _collectParents(this.nodes, parsedSelector);
    return new JQClass(ancestors);
}

export = parents;
