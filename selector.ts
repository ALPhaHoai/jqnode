/**
 * CSS Selector engine for node tree queries.
 * Supports comprehensive CSS selectors including attribute selectors, pseudo-selectors, combinators, etc.
 */

import { decodeHTMLEntities } from './helpers/html-entities';
import type { HtmlNode, CssSelector } from './types';

/**
 * Token types for CSS selector tokenization
 */
interface SelectorToken {
    type: 'combinator' | 'comma' | 'attribute' | 'pseudo' | 'universal' | 'id' | 'class' | 'ident';
    value: string;
}

/**
 * Parsed attribute selector
 */
interface AttributeSelector {
    name: string;
    operator: string | null;
    value: string | null;
}

/**
 * Parsed pseudo-selector
 */
interface PseudoSelector {
    name: string;
    args: string | null;
}

/**
 * Simple selector component (without combinators)
 */
interface SimpleSelector {
    tagName?: string | null;
    id?: string | null;
    classes?: string[];
    attributes?: AttributeSelector[];
    pseudos?: PseudoSelector[];
    universal?: boolean;
}

/**
 * Complex selector with combinators
 */
interface ComplexSelector {
    type: 'complex';
    parts: (SimpleSelector | { type: 'combinator'; combinator: string })[];
}

/**
 * Compound selector (comma-separated)
 */
interface CompoundSelector {
    type: 'compound';
    selectors: ParsedSelector[];
}

/**
 * Parsed selector result
 */
type ParsedSelector = SimpleSelector | ComplexSelector | CompoundSelector;

/**
 * Context for pseudo-selector matching
 */
interface SelectorContext {
    siblings?: HtmlNode[];
    isRoot?: boolean;
}

/**
 * Tokenizes a CSS selector string.
 */
function tokenizeSelector(selector: string): SelectorToken[] {
    const tokens: SelectorToken[] = [];
    let i = 0;
    let lastTokenWasSelector = false;

    function readChar(): string {
        const char = selector[i++];
        if (char === '\\' && i < selector.length) {
            return selector[i++];
        }
        return char;
    }

    function readUntil(delimiterRegex: RegExp): string {
        let result = '';
        while (i < selector.length) {
            const char = selector[i];
            if (delimiterRegex.test(char)) {
                break;
            }
            result += readChar();
        }
        return result;
    }

    while (i < selector.length) {
        const char = selector[i];

        // Handle whitespace - could be descendant combinator
        if (/\s/.test(char)) {
            while (i < selector.length && /\s/.test(selector[i])) {
                i++;
            }

            if (lastTokenWasSelector && i < selector.length && !/[>,+~]/.test(selector[i])) {
                tokens.push({ type: 'combinator', value: ' ' });
            }
            continue;
        }

        // Combinators
        if (char === '>' || char === '+' || char === '~' || char === ' ') {
            tokens.push({ type: 'combinator', value: char });
            i++;
            lastTokenWasSelector = false;
            continue;
        }

        // Comma for multiple selectors
        if (char === ',') {
            tokens.push({ type: 'comma', value: ',' });
            i++;
            lastTokenWasSelector = false;
            continue;
        }

        // Attribute selectors
        if (char === '[') {
            let attr = '[';
            i++;
            while (i < selector.length && selector[i] !== ']') {
                attr += readChar();
            }
            if (i >= selector.length) {
                throw new SyntaxError(`Unclosed attribute selector: ${attr}`);
            }
            attr += ']';
            i++;
            tokens.push({ type: 'attribute', value: attr });
            lastTokenWasSelector = true;
            continue;
        }

        // Pseudo-selectors
        if (char === ':') {
            let pseudo = ':';
            i++;
            while (i < selector.length && /[a-zA-Z0-9\-_]/.test(selector[i])) {
                pseudo += readChar();
            }

            if (i < selector.length && selector[i] === '(') {
                pseudo += '(';
                i++;
                let parenCount = 1;
                while (i < selector.length && parenCount > 0) {
                    const c = readChar();
                    pseudo += c;
                    if (c === '(') parenCount++;
                    else if (c === ')') parenCount--;
                }
            }

            tokens.push({ type: 'pseudo', value: pseudo });
            lastTokenWasSelector = true;
            continue;
        }

        // Universal selector
        if (char === '*') {
            tokens.push({ type: 'universal', value: '*' });
            i++;
            lastTokenWasSelector = true;
            continue;
        }

        // ID selector
        if (char === '#') {
            let id = '#';
            i++;
            const idValue = readUntil(/[\s\[\]{}().,>+#]/);
            id += idValue;
            tokens.push({ type: 'id', value: id });
            lastTokenWasSelector = true;
            continue;
        }

        // Class selector
        if (char === '.') {
            let cls = '.';
            i++;
            const classValue = readUntil(/[\s\[\]{}().,>:+#]/);
            cls += classValue;
            tokens.push({ type: 'class', value: cls });
            lastTokenWasSelector = true;
            continue;
        }

        // Tag name or identifier
        const ident = readUntil(/[\s\[\]{}().,>:+#.]/);
        if (ident) {
            tokens.push({ type: 'ident', value: ident });
            lastTokenWasSelector = true;
        } else {
            i++;
        }
    }

    return tokens;
}

/**
 * Parses a CSS selector into its components.
 */
function parseSelector(selector: CssSelector): ParsedSelector | null {
    if (typeof selector !== 'string') {
        return null;
    }

    const trimmed = selector.trim();

    if (trimmed.startsWith('<') || !trimmed) {
        return null;
    }

    if (trimmed === '#' || trimmed === '.') {
        throw new SyntaxError(`Invalid selector: ${trimmed}`);
    }

    const tokens = tokenizeSelector(trimmed);

    if (tokens.length === 0) {
        return null;
    }

    const selectors: ParsedSelector[] = [];
    let currentSelector: SelectorToken[] = [];
    let i = 0;

    while (i < tokens.length) {
        if (tokens[i].type === 'comma') {
            if (currentSelector.length > 0) {
                selectors.push(parseComplexSelector(currentSelector));
                currentSelector = [];
            }
        } else {
            currentSelector.push(tokens[i]);
        }
        i++;
    }

    if (currentSelector.length > 0) {
        selectors.push(parseComplexSelector(currentSelector));
    }

    if (selectors.length === 0) {
        return null;
    }

    const finalSelector =
        selectors.length === 1 ? selectors[0] : { type: 'compound' as const, selectors };

    const hasMeaningfulParts = (sel: ParsedSelector): boolean => {
        if ('type' in sel && sel.type === 'compound') {
            return sel.selectors.some(hasMeaningfulParts);
        }
        if ('type' in sel && sel.type === 'complex') {
            return true;
        }
        const simpleSel = sel as SimpleSelector;
        return (
            (simpleSel.tagName !== null && simpleSel.tagName !== undefined) ||
            (simpleSel.id !== null && simpleSel.id !== '') ||
            (simpleSel.classes && simpleSel.classes.length > 0) ||
            (simpleSel.attributes && simpleSel.attributes.length > 0) ||
            (simpleSel.pseudos && simpleSel.pseudos.length > 0) ||
            simpleSel.universal === true
        );
    };

    if (!hasMeaningfulParts(finalSelector)) {
        return null;
    }

    return finalSelector;
}

/**
 * Parses a complex selector with combinators.
 */
function parseComplexSelector(tokens: SelectorToken[]): ParsedSelector {
    const parts: (SimpleSelector | { type: 'combinator'; combinator: string })[] = [];
    let i = 0;

    while (i < tokens.length) {
        if (tokens[i].type === 'comma') {
            break;
        }

        const simpleSelector = parseSimpleSelector(tokens, i);
        parts.push(simpleSelector.part);
        i = simpleSelector.nextIndex;

        if (i < tokens.length && tokens[i].type === 'combinator') {
            parts.push({ type: 'combinator', combinator: tokens[i].value });
            i++;
        }
    }

    return parts.length === 1 ? (parts[0] as SimpleSelector) : { type: 'complex', parts };
}

/**
 * Parses a simple selector (without combinators).
 */
function parseSimpleSelector(
    tokens: SelectorToken[],
    startIndex: number,
): { part: SimpleSelector; nextIndex: number } {
    let i = startIndex;
    const part: SimpleSelector = {
        tagName: null,
        id: null,
        classes: [],
        attributes: [],
        pseudos: [],
    };

    while (i < tokens.length) {
        const token = tokens[i];

        if (token.type === 'universal') {
            part.universal = true;
            i++;
        } else if (token.type === 'ident') {
            part.tagName = token.value;
            i++;
        } else if (token.type === 'id') {
            let idValue = token.value.substring(1);

            const colonIndex = idValue.indexOf(':');
            if (colonIndex !== -1) {
                const potentialPseudo = ':' + idValue.substring(colonIndex + 1);
                const pseudoMatch = potentialPseudo.match(/^:([a-z-]+)(?:\((.+)\))?$/);
                if (pseudoMatch && isValidPseudoSelector(pseudoMatch[1])) {
                    idValue = idValue.substring(0, colonIndex);
                    const pseudoName = pseudoMatch[1];
                    const pseudoArgs = pseudoMatch[2] || null;
                    part.pseudos!.push({ name: pseudoName, args: pseudoArgs });
                }
            }

            if (idValue) {
                part.id = decodeHTMLEntities(idValue);
            }
            i++;
        } else if (token.type === 'class') {
            const className = token.value.substring(1);
            if (className) {
                part.classes!.push(decodeHTMLEntities(className));
            }
            i++;
        } else if (token.type === 'attribute') {
            part.attributes!.push(parseAttributeSelector(token.value));
            i++;
        } else if (token.type === 'pseudo') {
            part.pseudos!.push(parsePseudoSelector(token.value));
            i++;
        } else if (token.type === 'comma') {
            break;
        } else {
            break;
        }
    }

    return { part, nextIndex: i };
}

/**
 * Parses an attribute selector.
 */
function parseAttributeSelector(attr: string): AttributeSelector {
    const content = attr.slice(1, -1);
    const match = content.match(/^([^=~|^$*]+)(?:([~|^$*]?=)(.+))?$/);

    if (!match) {
        return { name: content, operator: null, value: null };
    }

    const [, name, operator, value] = match;
    return {
        name: name.trim(),
        operator: operator || null,
        value: value ? value.replace(/^["']|["']$/g, '') : null,
    };
}

/**
 * Parses a pseudo-selector.
 */
function parsePseudoSelector(pseudo: string): PseudoSelector {
    const match = pseudo.match(/^:([a-z-]+)(?:\((.+)\))?$/);
    if (!match) {
        return { name: pseudo.substring(1), args: null };
    }

    const [, name, args] = match;
    return {
        name,
        args: args ? args.trim() : null,
    };
}

/**
 * Checks if a node matches a simple selector (without combinators).
 */
function nodeMatchesSelector(
    node: HtmlNode,
    selector: ParsedSelector,
    context: SelectorContext = {},
): boolean {
    // const isElement = node.type === 'element';

    if ('type' in selector && selector.type === 'complex') {
        return false;
    }

    if ('type' in selector && selector.type === 'compound') {
        return selector.selectors.some((sel) => nodeMatchesSelector(node, sel, context));
    }

    const simpleSelector = selector as SimpleSelector;

    const nodeTag = (node.name && node.name.toLowerCase()) || '';
    const selectorTag = (simpleSelector.tagName || '').toLowerCase();
    if (!simpleSelector.universal && selectorTag && nodeTag !== selectorTag) {
        return false;
    }

    if (simpleSelector.id !== null && simpleSelector.id !== undefined) {
        if (simpleSelector.id === '') {
            return false;
        }
        const nodeId = node.attribs?.id;
        if (nodeId !== simpleSelector.id) {
            return false;
        }
    }

    if (simpleSelector.classes && simpleSelector.classes.length > 0) {
        const nodeClass = node.attribs?.class;
        if (!nodeClass) {
            return false;
        }
        const nodeClasses = nodeClass.split(/\s+/);
        for (const cls of simpleSelector.classes) {
            if (!nodeClasses.includes(cls)) {
                return false;
            }
        }
    }

    if (simpleSelector.attributes && simpleSelector.attributes.length > 0) {
        for (const attr of simpleSelector.attributes) {
            if (!matchesAttribute(node, attr)) {
                return false;
            }
        }
    }

    if (simpleSelector.pseudos && simpleSelector.pseudos.length > 0) {
        for (const pseudo of simpleSelector.pseudos) {
            if (!matchesPseudo(node, pseudo, context)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Checks if a node matches an attribute selector.
 */
function matchesAttribute(node: HtmlNode, attr: AttributeSelector): boolean {
    const nodeValue = node.attribs?.[attr.name];

    if (attr.operator === null) {
        return nodeValue !== undefined;
    }

    if (nodeValue === undefined) {
        return false;
    }

    const nodeStr = String(nodeValue);

    switch (attr.operator) {
        case '=':
            return nodeStr === attr.value;
        case '~=':
            const words = nodeStr.split(/\s+/);
            return words.includes(attr.value!);
        case '|=':
            return nodeStr === attr.value || nodeStr.startsWith(attr.value! + '-');
        case '^=':
            return nodeStr.startsWith(attr.value!);
        case '$=':
            return nodeStr.endsWith(attr.value!);
        case '*=':
            return nodeStr.includes(attr.value!);
        default:
            return false;
    }
}

/**
 * Checks if a pseudo-selector name is valid/supported.
 */
function isValidPseudoSelector(pseudoName: string): boolean {
    const validPseudos = [
        'first-child',
        'first',
        'last-child',
        'last',
        'only-child',
        'nth-child',
        'nth-of-type',
        'first-of-type',
        'last-of-type',
        'only-of-type',
        'nth-last-child',
        'nth-last-of-type',
        'not',
        'empty',
        'root',
        'contains',
    ];
    return validPseudos.includes(pseudoName);
}

/**
 * Helper to get text content of a node
 */
function getTextContent(node: HtmlNode): string {
    if (node.type === 'text') {
        return node.data || '';
    }
    if (node.children) {
        return node.children.map(getTextContent).join('');
    }
    return '';
}

/**
 * Checks if a node matches a pseudo-selector.
 */
function matchesPseudo(node: HtmlNode, pseudo: PseudoSelector, context: SelectorContext): boolean {
    const siblings = context.siblings || [];
    const nodeIndex = siblings.indexOf(node);

    switch (pseudo.name) {
        case 'first-child':
            return nodeIndex === 0;

        case 'first':
            return false; // jQuery :first is not CSS :first-child

        case 'last-child':
            return nodeIndex === siblings.length - 1;

        case 'last':
            return false; // jQuery :last is not CSS :last-child

        case 'only-child':
            return siblings.length === 1;

        case 'nth-child':
            return matchesNth(pseudo.args!, nodeIndex + 1);

        case 'nth-of-type':
            const typeIndex = siblings
                .slice(0, nodeIndex + 1)
                .filter((sibling) => sibling.name === node.name).length;
            return matchesNth(pseudo.args!, typeIndex);

        case 'first-of-type':
            const firstOfTypeIndex = siblings.findIndex((sibling) => sibling.name === node.name);
            return nodeIndex === firstOfTypeIndex;

        case 'last-of-type':
            const lastOfTypeIndex = siblings
                .slice()
                .reverse()
                .findIndex((sibling) => sibling.name === node.name);
            return nodeIndex === siblings.length - 1 - lastOfTypeIndex;

        case 'only-of-type':
            const sameTypeCount = siblings.filter((sibling) => sibling.name === node.name).length;
            return sameTypeCount === 1;

        case 'nth-last-child':
            return matchesNth(pseudo.args!, siblings.length - nodeIndex);

        case 'nth-last-of-type':
            const typeSiblings = siblings.filter((sibling) => sibling.name === node.name);
            const typeIndexFromEnd = typeSiblings.length - typeSiblings.indexOf(node);
            return matchesNth(pseudo.args!, typeIndexFromEnd);

        case 'not':
            const notSelector = parseSelector(pseudo.args!);
            return notSelector ? !nodeMatchesSelector(node, notSelector, context) : true;

        case 'empty':
            return (
                !node.children ||
                node.children.length === 0 ||
                node.children.every((child) => child.type === 'text' && !child.data?.trim())
            );

        case 'root':
            return context.isRoot || false;

        case 'contains':
            if (!pseudo.args) return false;
            // Remove quotes if present
            const text = pseudo.args.replace(/^['"]|['"]$/g, '');
            return getTextContent(node).includes(text);

        default:
            return false;
    }
}

/**
 * Checks if a number matches an nth expression like "2n+1", "even", "odd", etc.
 */
function matchesNth(expr: string, n: number): boolean {
    if (!expr) return false;

    expr = expr.trim().toLowerCase();

    if (expr === 'even') return n % 2 === 0;
    if (expr === 'odd') return n % 2 === 1;

    const match = expr.match(/^(\d*)n(?:([+-]\d+))?$/);
    if (!match) {
        const num = parseInt(expr);
        return !isNaN(num) && n === num;
    }

    const [, a = '1', b = '0'] = match;
    const step = parseInt(a) || 1;
    const offset = parseInt(b) || 0;

    return (n - offset) % step === 0 && (n - offset) / step >= 0;
}

/**
 * Finds all nodes in the tree that match the selector (internal implementation).
 */
function selectNodesInternal(nodes: HtmlNode[], selector: CssSelector): HtmlNode[] {
    let parsedSelector: ParsedSelector | null;
    try {
        parsedSelector = parseSelector(selector);
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw error;
        }
        return [];
    }

    if (!parsedSelector) {
        return [];
    }

    if ('type' in parsedSelector && parsedSelector.type === 'compound') {
        const results = new Set<HtmlNode>();
        for (const sel of parsedSelector.selectors) {
            const matches = selectWithSelector(nodes, sel);
            matches.forEach((node) => results.add(node));
        }
        return Array.from(results);
    } else {
        return selectWithSelector(nodes, parsedSelector);
    }
}

/**
 * Selects nodes matching a single selector (may be complex with combinators).
 */
function selectWithSelector(nodes: HtmlNode[], selector: ParsedSelector): HtmlNode[] {
    if ('type' in selector && selector.type === 'complex') {
        return selectWithComplexSelector(nodes, selector.parts);
    } else {
        return selectAllDescendants(nodes, selector as SimpleSelector);
    }
}

/**
 * Selects nodes matching a complex selector with combinators.
 */
function selectWithComplexSelector(
    nodes: HtmlNode[],
    parts: (SimpleSelector | { type: 'combinator'; combinator: string })[],
): HtmlNode[] {
    let candidates: HtmlNode[] = [];

    const firstPart = parts[0];
    if ('type' in firstPart && firstPart.type === 'combinator') {
        return [];
    }

    candidates = selectAllDescendants(nodes, firstPart as SimpleSelector);

    for (let i = 1; i < parts.length; i += 2) {
        const combinatorPart = parts[i];
        const nextSelector = parts[i + 1];

        if (!('type' in combinatorPart) || combinatorPart.type !== 'combinator') {
            return [];
        }

        if (!nextSelector) {
            return [];
        }

        candidates = applyCombinatorLeftToRight(
            candidates,
            combinatorPart.combinator,
            firstPart as SimpleSelector,
            nextSelector as SimpleSelector,
            nodes,
        );
    }

    return candidates;
}

/**
 * Applies a combinator to find next matches (left to right processing).
 */
function applyCombinatorLeftToRight(
    candidates: HtmlNode[],
    combinator: string,
    _firstSelector: SimpleSelector,
    secondSelector: SimpleSelector,
    rootNodes: HtmlNode[],
): HtmlNode[] {
    const results: HtmlNode[] = [];

    switch (combinator) {
        case ' ':
            for (const candidate of candidates) {
                const descendants = selectAllDescendants(candidate.children || [], secondSelector);
                results.push(...descendants);
            }
            break;

        case '>':
            for (const candidate of candidates) {
                if (candidate.children) {
                    for (const child of candidate.children) {
                        if (
                            child.type === 'element' &&
                            nodeMatchesSelectorWithContext(child, secondSelector, rootNodes)
                        ) {
                            results.push(child);
                        }
                    }
                }
            }
            break;

        case '+':
            for (const candidate of candidates) {
                const siblings = getSiblings(candidate);
                const index = siblings.indexOf(candidate);
                if (index >= 0 && index < siblings.length - 1) {
                    const nextSibling = siblings[index + 1];
                    if (
                        nextSibling.type === 'element' &&
                        nodeMatchesSelectorWithContext(nextSibling, secondSelector, rootNodes)
                    ) {
                        results.push(nextSibling);
                    }
                }
            }
            break;

        case '~':
            for (const candidate of candidates) {
                const siblings = getSiblings(candidate);
                const startIndex = siblings.indexOf(candidate);
                if (startIndex >= 0) {
                    for (let i = startIndex + 1; i < siblings.length; i++) {
                        const sibling = siblings[i];
                        if (
                            sibling.type === 'element' &&
                            nodeMatchesSelectorWithContext(sibling, secondSelector, rootNodes)
                        ) {
                            results.push(sibling);
                        }
                    }
                }
            }
            break;
    }

    return [...new Set(results)];
}

/**
 * Gets all siblings of a node.
 */
function getSiblings(node: HtmlNode): HtmlNode[] {
    if (!node.parent || !node.parent.children) {
        return [node];
    }

    return node.parent.children.filter((child) => child.type === 'element');
}

/**
 * Selects all descendants matching a selector.
 */
function selectAllDescendants(nodes: HtmlNode[], selector: SimpleSelector): HtmlNode[] {
    const results: HtmlNode[] = [];

    function traverse(nodeList: HtmlNode[]): void {
        for (const node of nodeList) {
            if (node.type === 'element') {
                if (nodeMatchesSelectorWithContext(node, selector, nodes)) {
                    results.push(node);
                }

                if (node.children) {
                    traverse(node.children);
                }
            }
        }
    }

    traverse(nodes);
    return results;
}

/**
 * Checks if a node matches a selector with proper context for pseudo-selectors.
 */
function nodeMatchesSelectorWithContext(
    node: HtmlNode,
    selector: ParsedSelector,
    rootNodes: HtmlNode[],
): boolean {
    const context: SelectorContext = {};

    context.isRoot = rootNodes.includes(node);

    const parentNode = node.parent;
    if (parentNode) {
        if (parentNode.children) {
            context.siblings = parentNode.children.filter((child) => child.type === 'element');
        } else {
            context.siblings = [];
        }
    } else {
        context.siblings = [];
    }

    return nodeMatchesSelector(node, selector, context);
}

/**
 * Sets up parent references for nodes in the tree.
 */
function setupParentReferences(nodes: HtmlNode[], parent: HtmlNode | null = null): void {
    for (const node of nodes) {
        if (node.parent === undefined) {
            node.parent = parent || undefined;
        }
        if (node.children) {
            setupParentReferences(node.children, node);
        }
    }
}

/**
 * Checks if a string looks like a CSS selector rather than HTML.
 */
function isCSSSelector(str: string): boolean {
    const trimmed = str.trim();
    if (!trimmed) return false;

    if (trimmed.startsWith('<')) return false;

    return true;
}

/**
 * Finds all nodes in the tree that match the selector (public interface).
 */
function selectNodes(nodes: HtmlNode[], selector: CssSelector): HtmlNode[] {
    setupParentReferences(nodes);
    return selectNodesInternal(nodes, selector);
}

export { parseSelector, nodeMatchesSelector, selectNodes, isCSSSelector, setupParentReferences };
