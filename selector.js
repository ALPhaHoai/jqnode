/**
 * CSS Selector engine for node tree queries.
 * Supports comprehensive CSS selectors including attribute selectors, pseudo-selectors, combinators, etc.
 */

const { decodeHTMLEntities } = require('./helpers/html-entities');


/**
 * Tokenizes a CSS selector string.
 * @param {string} selector - CSS selector string
 * @returns {Array} Array of tokens
 */
function tokenizeSelector(selector) {
    const tokens = [];
    let i = 0;
    let lastTokenWasSelector = false;

    /**
     * Reads the next character, handling CSS escaping
     * @returns {string} The next character (possibly unescaped)
     */
    function readChar() {
        const char = selector[i++];
        if (char === '\\' && i < selector.length) {
            // CSS escaping: backslash escapes the next character
            return selector[i++];
        }
        return char;
    }

    /**
     * Reads a sequence of characters until a delimiter is found, handling escaping
     * @param {RegExp} delimiterRegex - Regex matching delimiter characters
     * @returns {string} The read string
     */
    function readUntil(delimiterRegex) {
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
            // Skip leading/trailing whitespace, but if we have a selector token before this,
            // the whitespace might be a descendant combinator
            let whitespaceStart = i;
            while (i < selector.length && /\s/.test(selector[i])) {
                i++;
            }

            // If we had a selector token before this whitespace and there's more content,
            // this whitespace is a descendant combinator
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
            i++; // Skip '['
            while (i < selector.length && selector[i] !== ']') {
                attr += readChar();
            }
            if (i >= selector.length) {
                // Unclosed attribute selector - jQuery throws SyntaxError
                throw new SyntaxError(`Unclosed attribute selector: ${attr}`);
            }
            attr += ']';
            i++; // Skip ']'
            tokens.push({ type: 'attribute', value: attr });
            lastTokenWasSelector = true;
            continue;
        }

        // Pseudo-selectors
        if (char === ':') {
            let pseudo = ':';
            i++; // Skip ':'
            // Read pseudo name (allowing escaped characters)
            while (i < selector.length && /[a-zA-Z0-9\-_]/.test(selector[i])) {
                pseudo += readChar();
            }

            // Handle pseudo-selector arguments
            if (i < selector.length && selector[i] === '(') {
                pseudo += '(';
                i++; // Skip '('
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
            i++; // Skip '#'
            const idValue = readUntil(/[\s\[\]{}().,>+#]/);
            id += idValue;
            tokens.push({ type: 'id', value: id });
            lastTokenWasSelector = true;
            continue;
        }

        // Class selector
        if (char === '.') {
            let cls = '.';
            i++; // Skip '.'
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
            // Unknown character
            i++;
        }
    }

    return tokens;
}

/**
 * Parses a CSS selector into its components.
 * @param {string} selector - CSS selector string
 * @returns {Object|null} Parsed selector components or null if invalid
 */
function parseSelector(selector) {
    // console.log(`[DEBUG] parseSelector: Starting to parse selector: "${selector}"`);

    // Handle non-string inputs
    if (typeof selector !== 'string') {
        // console.log(`[DEBUG] parseSelector: Invalid input type, expected string but got:`, typeof selector);
        return null;
    }

    const trimmed = selector.trim();
    // console.log(`[DEBUG] parseSelector: Trimmed selector: "${trimmed}"`);

    // Check for invalid selectors (HTML tags or empty)
    if (trimmed.startsWith('<') || !trimmed) {
        // console.log(`[DEBUG] parseSelector: Invalid selector detected (starts with '<' or empty), returning null`);
        return null;
    }

    // Check for selectors that are just combinators (jQuery throws SyntaxError for # and .)
    if (trimmed === '#' || trimmed === '.') {
        throw new SyntaxError(`Invalid selector: ${trimmed}`);
    }

    const tokens = tokenizeSelector(trimmed);
    // console.log(`[DEBUG] parseSelector: Tokenized into:`, tokens);

    if (tokens.length === 0) {
        return null;
    }

    // Parse multiple selectors (comma-separated)
    const selectors = [];
    let currentSelector = [];
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

    // Check for invalid selectors (empty or only malformed parts)
    const finalSelector = selectors.length === 1 ? selectors[0] : { type: 'compound', selectors };

    // Reject selectors that have no meaningful parts (like just "." or "#")
    const hasMeaningfulParts = (sel) => {
        if (sel.type === 'compound') {
            return sel.selectors.some(hasMeaningfulParts);
        }
        return sel.tagName !== null ||
            (sel.id !== null && sel.id !== '') ||
            (sel.classes && sel.classes.length > 0) ||
            (sel.attributes && sel.attributes.length > 0) ||
            (sel.pseudos && sel.pseudos.length > 0) ||
            sel.universal === true;
    };

    if (!hasMeaningfulParts(finalSelector)) {
        // console.log(`[DEBUG] parseSelector: Invalid selector - no meaningful parts found`);
        return null;
    }

    // console.log(`[DEBUG] parseSelector: Successfully parsed selector into:`, finalSelector);
    return finalSelector;
}

/**
 * Parses a complex selector with combinators.
 * @param {Array} tokens - Tokens for one selector
 * @returns {Object} Parsed selector
 */
function parseComplexSelector(tokens) {
    const parts = [];
    let i = 0;

    while (i < tokens.length) {
        // Stop at comma (handled by parent function)
        if (tokens[i].type === 'comma') {
            break;
        }

        const simpleSelector = parseSimpleSelector(tokens, i);
        parts.push(simpleSelector.part);
        i = simpleSelector.nextIndex;

        // Check for combinator
        if (i < tokens.length && tokens[i].type === 'combinator') {
            parts.push({ type: 'combinator', combinator: tokens[i].value });
            i++;
        }
    }

    return parts.length === 1 ? parts[0] : { type: 'complex', parts };
}

/**
 * Parses a simple selector (without combinators).
 * @param {Array} tokens - Tokens array
 * @param {number} startIndex - Starting index
 * @returns {Object} {part, nextIndex}
 */
function parseSimpleSelector(tokens, startIndex) {
    let i = startIndex;
    const part = {
        tagName: null,
        id: null,
        classes: [],
        attributes: [],
        pseudos: []
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
            let idValue = token.value.substring(1); // Remove #

            // Check if ID contains a colon followed by a pseudo-selector
            const colonIndex = idValue.indexOf(':');
            if (colonIndex !== -1) {
                const potentialPseudo = ':' + idValue.substring(colonIndex + 1);
                // Check if it's a valid pseudo-selector
                const pseudoMatch = potentialPseudo.match(/^:([a-z-]+)(?:\((.+)\))?$/);
                if (pseudoMatch && isValidPseudoSelector(pseudoMatch[1])) {
                    // Split: ID part and pseudo-selector part
                    idValue = idValue.substring(0, colonIndex);
                    // Add the pseudo-selector to the part
                    const pseudoName = pseudoMatch[1];
                    const pseudoArgs = pseudoMatch[2] || null;
                    part.pseudos.push({ name: pseudoName, args: pseudoArgs });
                }
            }

            // Decode HTML entities to match decoded attribute values from HTML parser
            if (idValue) { // Only set non-empty IDs
                part.id = decodeHTMLEntities(idValue);
            }
            i++;
        } else if (token.type === 'class') {
            const className = token.value.substring(1); // Remove .
            if (className) { // Only add non-empty class names
                // Decode HTML entities to match decoded attribute values from HTML parser
                part.classes.push(decodeHTMLEntities(className));
            }
            i++;
        } else if (token.type === 'attribute') {
            part.attributes.push(parseAttributeSelector(token.value));
            i++;
        } else if (token.type === 'pseudo') {
            part.pseudos.push(parsePseudoSelector(token.value));
            i++;
        } else if (token.type === 'comma') {
            // Comma ends the current selector
            break;
        } else {
            // End of simple selector
            break;
        }
    }

    return { part, nextIndex: i };
}

/**
 * Parses an attribute selector.
 * @param {string} attr - Attribute selector string like "[data-info]" or "[id='value']"
 * @returns {Object} Parsed attribute selector
 */
function parseAttributeSelector(attr) {
    // Remove brackets
    const content = attr.slice(1, -1);
    const match = content.match(/^([^=~|^$*]+)(?:([~|^$*]?=)(.+))?$/);

    if (!match) {
        return { name: content, operator: null, value: null };
    }

    const [, name, operator, value] = match;
    return {
        name: name.trim(),
        operator: operator || null,
        value: value ? value.replace(/^["']|["']$/g, '') : null // Remove quotes
    };
}

/**
 * Parses a pseudo-selector.
 * @param {string} pseudo - Pseudo-selector string like ":first" or ":nth-child(2)"
 * @returns {Object} Parsed pseudo-selector
 */
function parsePseudoSelector(pseudo) {
    const match = pseudo.match(/^:([a-z-]+)(?:\((.+)\))?$/);
    if (!match) {
        return { name: pseudo.substring(1), args: null };
    }

    const [, name, args] = match;
    return {
        name,
        args: args ? args.trim() : null
    };
}

/**
 * Checks if a node matches a simple selector (without combinators).
 * @param {Object} node - Node to check
 * @param {Object} selector - Parsed selector object
 * @param {Object} context - Context information for pseudo-selectors
 * @returns {boolean} Whether the node matches
 */
function nodeMatchesSelector(node, selector, context = {}) {
    // console.log(`[DEBUG] nodeMatchesSelector: Checking node type: ${node.type}, tagName: ${node.tagName || 'N/A'}`);

    // Handle both internal nodes and DOM elements
    const isElement = node.type === 'element' || node.nodeType === 1;
    if (!isElement) {
        // console.log(`[DEBUG] nodeMatchesSelector: Node is not an element, returning false`);
        return false;
    }

    // Handle compound selectors (comma-separated)
    if (selector.type === 'compound') {
        // console.log(`[DEBUG] nodeMatchesSelector: Compound selector with ${selector.selectors.length} selectors`);
        return selector.selectors.some(sel => nodeMatchesSelector(node, sel, context));
    }

    // Check tag name (case insensitive) - skip if universal
    const nodeTag = (node.tagName && node.tagName.toLowerCase()) || '';
    const selectorTag = (selector.tagName || '').toLowerCase();
    if (!selector.universal && selectorTag && nodeTag !== selectorTag) {
        // console.log(`[DEBUG] nodeMatchesSelector: Tag mismatch - expected: ${selectorTag}, got: ${nodeTag}`);
        return false;
    }

    if (selector.tagName) {
        // console.log(`[DEBUG] nodeMatchesSelector: Tag match for: ${selector.tagName}`);
    }

    // Check ID
    if (selector.id !== null) {
        // selector.id can be null (not specified) or string (specified, possibly empty)
        if (selector.id === '') {
            // Empty ID selector like "#" should not match anything
            // console.log(`[DEBUG] nodeMatchesSelector: Empty ID selector should not match anything`);
            return false;
        }
        // Handle both internal nodes and DOM elements
        const nodeId = (node.attributes && node.attributes.id) || node.id;
        if (!nodeId || nodeId !== selector.id) {
            // console.log(`[DEBUG] nodeMatchesSelector: ID mismatch - expected: ${selector.id}, got: ${nodeId || 'undefined'}`);
            return false;
        }
        // console.log(`[DEBUG] nodeMatchesSelector: ID match for: #${selector.id}`);
    }

    // Check classes
    if (selector.classes.length > 0) {
        // Check if any class name is empty (like just ".")
        if (selector.classes.some(cls => cls === '')) {
            // console.log(`[DEBUG] nodeMatchesSelector: Empty class selector should not match anything`);
            return false;
        }

        // Handle both internal nodes and DOM elements
        const nodeClass = (node.attributes && node.attributes.class) || node.className;
        if (!nodeClass) {
            // console.log(`[DEBUG] nodeMatchesSelector: No class attribute found, required classes: [${selector.classes.join(', ')}]`);
            return false;
        }

        // Ensure nodeClass is a string
        const nodeClassStr = typeof nodeClass === 'string' ? nodeClass : String(nodeClass);

        // Split class attribute by spaces and check each required class (case insensitive like jQuery)
        const nodeClasses = nodeClassStr.toLowerCase().split(/\s+/);
        // console.log(`[DEBUG] nodeMatchesSelector: Node classes: [${nodeClasses.join(', ')}], required: [${selector.classes.join(', ')}]`);

        for (const requiredClass of selector.classes) {
            if (!nodeClasses.includes(requiredClass.toLowerCase())) {
                // console.log(`[DEBUG] nodeMatchesSelector: Missing required class: .${requiredClass}`);
                return false;
            }
        }
        // console.log(`[DEBUG] nodeMatchesSelector: All required classes found`);
    }

    // Check attributes
    for (const attr of selector.attributes) {
        if (!matchesAttribute(node, attr)) {
            // console.log(`[DEBUG] nodeMatchesSelector: Attribute mismatch for: ${attr.name}`);
            return false;
        }
    }

    // Check pseudo-selectors
    for (const pseudo of selector.pseudos) {
        if (!matchesPseudo(node, pseudo, context)) {
            // console.log(`[DEBUG] nodeMatchesSelector: Pseudo-selector mismatch for: ${pseudo.name}`);
            return false;
        }
    }

    // console.log(`[DEBUG] nodeMatchesSelector: Node matches selector successfully`);
    return true;
}

/**
 * Checks if a node matches an attribute selector.
 * @param {Object} node - Node to check
 * @param {Object} attr - Attribute selector object
 * @returns {boolean} Whether the attribute matches
 */
function matchesAttribute(node, attr) {
    const nodeValue = node.attributes && node.attributes[attr.name];

    // Attribute presence check
    if (attr.operator === null) {
        return nodeValue !== undefined;
    }

    // If attribute doesn't exist, only match if we have a value and operator allows undefined
    if (nodeValue === undefined) {
        return false;
    }

    const nodeStr = String(nodeValue);

    switch (attr.operator) {
        case '=':
            return nodeStr === attr.value;
        case '~=':
            // Contains word (space-separated)
            const words = nodeStr.split(/\s+/);
            return words.includes(attr.value);
        case '|=':
            // Starts with word or word followed by hyphen
            return nodeStr === attr.value || nodeStr.startsWith(attr.value + '-');
        case '^=':
            // Starts with
            return nodeStr.startsWith(attr.value);
        case '$=':
            // Ends with
            return nodeStr.endsWith(attr.value);
        case '*=':
            // Contains substring
            return nodeStr.includes(attr.value);
        default:
            return false;
    }
}

/**
 * Checks if a pseudo-selector name is valid/supported.
 * @param {string} pseudoName - Pseudo-selector name without the colon
 * @returns {boolean} Whether the pseudo-selector is supported
 */
function isValidPseudoSelector(pseudoName) {
    const validPseudos = [
        'first-child', 'first', 'last-child', 'last', 'only-child',
        'nth-child', 'nth-of-type', 'first-of-type', 'last-of-type',
        'only-of-type', 'nth-last-child', 'nth-last-of-type',
        'not', 'empty', 'root'
    ];
    return validPseudos.includes(pseudoName);
}

/**
 * Checks if a node matches a pseudo-selector.
 * @param {Object} node - Node to check
 * @param {Object} pseudo - Pseudo-selector object
 * @param {Object} context - Context information
 * @returns {boolean} Whether the pseudo-selector matches
 */
function matchesPseudo(node, pseudo, context) {
    const siblings = context.siblings || [];
    const nodeIndex = siblings.indexOf(node);

    switch (pseudo.name) {
        case 'first-child':
            return nodeIndex === 0;

        case 'first':
            // :first is not standard CSS, return false
            return false;

        case 'last-child':
            return nodeIndex === siblings.length - 1;

        case 'last':
            // :last is not standard CSS, return false
            return false;

        case 'only-child':
            return siblings.length === 1;

        case 'nth-child':
            return matchesNth(pseudo.args, nodeIndex + 1);

        case 'nth-of-type':
            const typeIndex = siblings
                .slice(0, nodeIndex + 1)
                .filter(sibling => sibling.tagName === node.tagName)
                .length;
            return matchesNth(pseudo.args, typeIndex);

        case 'first-of-type':
            const firstOfTypeIndex = siblings
                .findIndex(sibling => sibling.tagName === node.tagName);
            return nodeIndex === firstOfTypeIndex;

        case 'last-of-type':
            const lastOfTypeIndex = siblings
                .slice()
                .reverse()
                .findIndex(sibling => sibling.tagName === node.tagName);
            return nodeIndex === siblings.length - 1 - lastOfTypeIndex;

        case 'only-of-type':
            const sameTypeCount = siblings
                .filter(sibling => sibling.tagName === node.tagName)
                .length;
            return sameTypeCount === 1;

        case 'nth-last-child':
            return matchesNth(pseudo.args, siblings.length - nodeIndex);

        case 'nth-last-of-type':
            const typeSiblings = siblings.filter(sibling => sibling.tagName === node.tagName);
            const typeIndexFromEnd = typeSiblings.length - typeSiblings.indexOf(node);
            return matchesNth(pseudo.args, typeIndexFromEnd);

        case 'not':
            // Parse the selector inside :not()
            const notSelector = parseSelector(pseudo.args);
            return notSelector ? !nodeMatchesSelector(node, notSelector, context) : true;

        case 'empty':
            return !node.children || node.children.length === 0 ||
                node.children.every(child => child.type === 'text' && !child.value.trim());

        case 'root':
            return context.isRoot || false;

        default:
            // Unknown pseudo-selector
            return false;
    }
}

/**
 * Checks if a number matches an nth expression like "2n+1", "even", "odd", etc.
 * @param {string} expr - nth expression
 * @param {number} n - Number to check (1-based)
 * @returns {boolean} Whether it matches
 */
function matchesNth(expr, n) {
    if (!expr) return false;

    expr = expr.trim().toLowerCase();

    if (expr === 'even') return n % 2 === 0;
    if (expr === 'odd') return n % 2 === 1;

    // Parse expressions like "2n+1", "3n", "n+5", etc.
    const match = expr.match(/^(\d*)n(?:([+-]\d+))?$/);
    if (!match) {
        // Simple number like "3"
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
 * @param {Array} nodes - Root nodes to search from
 * @param {string} selector - CSS selector string
 * @returns {Array} Matching nodes
 */
function selectNodesInternal(nodes, selector) {
    // console.log(`[DEBUG] selectNodes: Starting selection with selector "${selector}" on ${nodes.length} root nodes`);

    let parsedSelector;
    try {
        parsedSelector = parseSelector(selector);
    } catch (error) {
        // Re-throw syntax errors to match jQuery behavior
        if (error instanceof SyntaxError) {
            throw error;
        }
        // For other errors, fall back to empty result
        return [];
    }

    if (!parsedSelector) {
        // console.log(`[DEBUG] selectNodes: Invalid selector, returning empty array`);
        return []; // Invalid selector or HTML
    }

    // console.log(`[DEBUG] selectNodes: Selector parsed successfully, beginning traversal`);

    // Handle compound selectors (comma-separated)
    if (parsedSelector.type === 'compound') {
        const results = new Set(); // Use Set to avoid duplicates
        for (const sel of parsedSelector.selectors) {
            const matches = selectWithSelector(nodes, sel);
            matches.forEach(node => results.add(node));
        }
        const resultArray = Array.from(results);
        // console.log(`[DEBUG] selectNodes: Compound selector found ${resultArray.length} matching elements`);
        return resultArray;
    } else {
        const result = selectWithSelector(nodes, parsedSelector);
        // console.log(`[DEBUG] selectNodes: Selection complete, found ${result.length} matching elements`);
        return result;
    }
}

/**
 * Selects nodes matching a single selector (may be complex with combinators).
 * @param {Array} nodes - Root nodes to search from
 * @param {Object} selector - Parsed selector object
 * @returns {Array} Matching nodes
 */
function selectWithSelector(nodes, selector) {
    // Handle complex selectors with combinators
    if (selector.type === 'complex') {
        return selectWithComplexSelector(nodes, selector.parts);
    } else {
        // Simple selector - search all descendants
        return selectAllDescendants(nodes, selector);
    }
}

/**
 * Selects nodes matching a complex selector with combinators.
 * @param {Array} nodes - Root nodes to search from
 * @param {Array} parts - Selector parts with combinators
 * @returns {Array} Matching nodes
 */
function selectWithComplexSelector(nodes, parts) {
    // console.log(`[DEBUG] selectWithComplexSelector: Processing complex selector with ${parts.length} parts`);

    // Work from left to right
    let candidates = [];

    // Start with the leftmost selector
    const firstPart = parts[0];
    if (firstPart.type === 'combinator') {
        // console.log(`[DEBUG] selectWithComplexSelector: Invalid selector structure, starts with combinator`);
        return [];
    }

    candidates = selectAllDescendants(nodes, firstPart);
    // console.log(`[DEBUG] selectWithComplexSelector: Found ${candidates.length} candidates for leftmost selector`);

    // Apply each combinator + selector pair
    for (let i = 1; i < parts.length; i += 2) {
        const combinatorPart = parts[i];
        const nextSelector = parts[i + 1];

        if (combinatorPart.type !== 'combinator') {
            // console.log(`[DEBUG] selectWithComplexSelector: Expected combinator but found:`, combinatorPart);
            return [];
        }

        if (!nextSelector) {
            // console.log(`[DEBUG] selectWithComplexSelector: Missing selector after combinator`);
            return [];
        }

        // console.log(`[DEBUG] selectWithComplexSelector: Applying ${combinatorPart.combinator} combinator to find ${JSON.stringify(nextSelector)}`);
        candidates = applyCombinatorLeftToRight(candidates, combinatorPart.combinator, firstPart, nextSelector, nodes);
        // console.log(`[DEBUG] selectWithComplexSelector: After ${combinatorPart.combinator}, ${candidates.length} candidates remain`);
    }

    return candidates;
}

/**
 * Applies a combinator to find next matches (left to right processing).
 * @param {Array} candidates - Current candidate nodes from first selector
 * @param {string} combinator - Combinator type (' ', '>', '+', '~')
 * @param {Object} firstSelector - First selector object
 * @param {Object} secondSelector - Second selector object
 * @param {Array} rootNodes - Original root nodes
 * @returns {Array} Next set of matching nodes
 */
function applyCombinatorLeftToRight(candidates, combinator, firstSelector, secondSelector, rootNodes) {
    const results = [];

    switch (combinator) {
        case ' ': // Descendant combinator
            // For "A B", candidates are A matches, find all descendants that match B
            // (not including the candidates themselves)
            for (const candidate of candidates) {
                const descendants = selectAllDescendants(candidate.children || [], secondSelector);
                results.push(...descendants);
            }
            break;

        case '>': // Child combinator
            // For "A > B", candidates are A matches, find direct children that match B
            for (const candidate of candidates) {
                if (candidate.children) {
                    for (const child of candidate.children) {
                        if (child.type === 'element' && nodeMatchesSelectorWithContext(child, secondSelector, rootNodes)) {
                            results.push(child);
                        }
                    }
                }
            }
            break;

        case '+': // Adjacent sibling combinator
            // For "A + B", candidates are A matches, find elements that match B and are immediate next siblings of A matches
            for (const candidate of candidates) {
                const siblings = getSiblings(candidate);
                const index = siblings.indexOf(candidate);
                if (index >= 0 && index < siblings.length - 1) { // Has a next sibling
                    const nextSibling = siblings[index + 1];
                    if (nextSibling.type === 'element' && nodeMatchesSelectorWithContext(nextSibling, secondSelector, rootNodes)) {
                        results.push(nextSibling);
                    }
                }
            }
            break;

        case '~': // General sibling combinator
            // For "A ~ B", candidates are A matches, find elements that match B and are later siblings of A matches
            for (const candidate of candidates) {
                const siblings = getSiblings(candidate);
                const startIndex = siblings.indexOf(candidate);
                if (startIndex >= 0) {
                    // Check all siblings after this candidate
                    for (let i = startIndex + 1; i < siblings.length; i++) {
                        const sibling = siblings[i];
                        if (sibling.type === 'element' && nodeMatchesSelectorWithContext(sibling, secondSelector, rootNodes)) {
                            results.push(sibling);
                        }
                    }
                }
            }
            break;
    }

    // Remove duplicates
    return [...new Set(results)];
}

/**
 * Applies a combinator to filter candidates (legacy right-to-left processing).
 * @param {Array} candidates - Current candidate nodes
 * @param {string} combinator - Combinator type (' ', '>', '+', '~')
 * @param {Object} selector - Previous selector to match
 * @param {Array} rootNodes - Original root nodes
 * @returns {Array} Filtered candidates
 */
function applyCombinator(candidates, combinator, selector, rootNodes) {
    const results = [];

    switch (combinator) {
        case ' ': // Descendant combinator
            // For "A B", candidates are B matches, we want to keep only those B elements
            // that have an ancestor matching A
            for (const candidate of candidates) {
                // Check if any ancestor matches the selector
                const ancestors = findMatchingAncestors(candidate, selector, rootNodes);
                if (ancestors.length > 0) {
                    results.push(candidate);
                }
            }
            break;

        case '>': // Child combinator
            // For "A > B", candidates are B matches, we check if parent matches A
            for (const candidate of candidates) {
                if (candidate.parent && nodeMatchesSelectorWithContext(candidate.parent, selector, rootNodes)) {
                    results.push(candidate); // Return the candidate (B), not the parent (A)
                }
            }
            break;

        case '+': // Adjacent sibling combinator
            // For "A + B", candidates are B matches, we check if previous sibling matches A
            for (const candidate of candidates) {
                const siblings = getSiblings(candidate);
                const index = siblings.indexOf(candidate);
                if (index > 0) {
                    const prevSibling = siblings[index - 1];
                    if (nodeMatchesSelectorWithContext(prevSibling, selector, rootNodes)) {
                        results.push(candidate); // Return the candidate (B), not the previous sibling (A)
                    }
                }
            }
            break;

        case '~': // General sibling combinator
            // For "A ~ B", candidates are B matches, we want all previous siblings that match A
            for (const candidate of candidates) {
                const siblings = getSiblings(candidate);
                const index = siblings.indexOf(candidate);
                if (index > 0) {
                    // Check if any previous sibling matches A
                    for (let i = 0; i < index; i++) {
                        const sibling = siblings[i];
                        if (nodeMatchesSelectorWithContext(sibling, selector, rootNodes)) {
                            results.push(candidate); // Return the candidate (B) if any previous sibling matches A
                            break; // No need to check more siblings for this candidate
                        }
                    }
                }
            }
            break;
    }

    // Remove duplicates
    return [...new Set(results)];
}

/**
 * Finds all ancestors of a node that match the selector.
 * @param {Object} node - Starting node
 * @param {Object} selector - Selector to match
 * @param {Array} rootNodes - Root nodes to stop at
 * @returns {Array} Matching ancestors
 */
function findMatchingAncestors(node, selector, rootNodes) {
    const results = [];
    let current = node.parent;

    while (current) {
        // Check if we've reached the root
        if (rootNodes.includes(current)) {
            if (nodeMatchesSelectorWithContext(current, selector, rootNodes)) {
                results.push(current);
            }
            break;
        }

        if (nodeMatchesSelectorWithContext(current, selector, rootNodes)) {
            results.push(current);
        }

        current = current.parent;
    }

    return results;
}

/**
 * Gets all siblings of a node.
 * @param {Object} node - Node to get siblings for
 * @returns {Array} Sibling nodes including the node itself
 */
function getSiblings(node) {
    if (!node.parent || !node.parent.children) {
        return [node];
    }

    return node.parent.children.filter(child => child.type === 'element');
}

/**
 * Selects all descendants matching a selector.
 * @param {Array} nodes - Nodes to search in
 * @param {Object} selector - Selector to match
 * @returns {Array} Matching nodes
 */
function selectAllDescendants(nodes, selector) {
    const results = [];

    function traverse(nodeList) {
        for (const node of nodeList) {
            if (node.type === 'element') {
                // Check current node first (document order)
                if (nodeMatchesSelectorWithContext(node, selector, nodes)) {
                    results.push(node);
                }

                // Then check descendants in document order
                if (node.children) {
                    traverse(node.children);
                }
            }
        }
    }

    // For find() method, only search descendants of root nodes, not the root nodes themselves
    // This matches jQuery's behavior
    function traverseDescendantsOnly(nodeList) {
        for (const node of nodeList) {
            if (node.type === 'element' && node.children) {
                traverse(node.children);
            }
        }
    }

    // Traverse all root nodes in document order
    traverse(nodes);

    return results;
}

/**
 * Checks if a node matches a selector with proper context for pseudo-selectors.
 * @param {Object} node - Node to check
 * @param {Object} selector - Selector to match
 * @param {Array} rootNodes - Root context nodes
 * @returns {boolean} Whether the node matches
 */
function nodeMatchesSelectorWithContext(node, selector, rootNodes) {
    // Build context for pseudo-selectors
    const context = {};

    // Check if this is a root node
    context.isRoot = rootNodes.includes(node);

    // Get siblings for positional pseudo-selectors
    const parentNode = node.parent || node.parentNode;
    if (parentNode) {
        // Handle both internal nodes and DOM elements
        if (parentNode.children) {
            // Internal node structure
            context.siblings = parentNode.children.filter(child => child.type === 'element');
        } else if (parentNode.childNodes) {
            // DOM element structure
            context.siblings = Array.from(parentNode.childNodes).filter(child => child.nodeType === 1);
        } else {
            context.siblings = [];
        }
    } else {
        // Root nodes have no siblings for :first-child, :last-child, etc.
        context.siblings = [];
    }

    return nodeMatchesSelector(node, selector, context);
}

/**
 * Sets up parent references for nodes in the tree.
 * @param {Array} nodes - Root nodes
 * @param {Object} parent - Parent node (null for roots)
 */
function setupParentReferences(nodes, parent = null) {
    for (const node of nodes) {
        if (node.parent === undefined) {
            node.parent = parent;
        }
        if (node.children) {
            setupParentReferences(node.children, node);
        }
    }
}

/**
 * Checks if a string looks like a CSS selector rather than HTML.
 * @param {string} str - String to check
 * @returns {boolean} Whether it appears to be a CSS selector
 */
function isCSSSelector(str) {
    const trimmed = str.trim();
    if (!trimmed) return false;

    // HTML starts with <
    if (trimmed.startsWith('<')) return false;

    // Any string that doesn't start with < is considered a CSS selector
    return true;
}

/**
 * Finds all nodes in the tree that match the selector (public interface).
 * @param {Array} nodes - Root nodes to search from
 * @param {string} selector - CSS selector string
 * @returns {Array} Matching nodes
 */
function selectNodes(nodes, selector) {
    // Set up parent references if not already done
    setupParentReferences(nodes);

    return selectNodesInternal(nodes, selector);
}

module.exports = {
    parseSelector,
    nodeMatchesSelector,
    selectNodes,
    isCSSSelector,
    setupParentReferences
};

