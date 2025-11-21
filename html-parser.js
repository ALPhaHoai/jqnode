/**
 * Minimal HTML parser that converts HTML strings to a node tree structure.
 * Each node has the format: { type: 'element'|'text', tag?, attributes?, children?, value? }
 */

/**
 * HTML5 void elements that are always self-closing
 * @const {Set<string>}
 */
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

/**
 * Elements whose content should be treated as raw text, not parsed as HTML
 * @const {Set<string>}
 */
const RAW_TEXT_ELEMENTS = new Set(['script', 'style']);

/**
 * Tags that auto-close when certain other tags are encountered
 * Key: parent tag, Value: array of tags that close the parent
 * @const {Object<string, string[]>}
 */
const AUTO_CLOSE_RULES = {
    'p': ['address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'],
    'li': ['li'],
    'dt': ['dt', 'dd'],
    'dd': ['dt', 'dd'],
    'option': ['option', 'optgroup'],
    'optgroup': ['optgroup'],
    'tr': ['tr'],
    'td': ['td', 'th'],
    'th': ['td', 'th'],
    'thead': ['tbody', 'tfoot'],
    'tbody': ['tbody', 'tfoot'],
    'tfoot': ['tbody'],
    'colgroup': ['thead', 'tbody', 'tfoot', 'tr'],
    'body': ['head'],
    'head': ['body'],
    'rb': ['rb', 'rt', 'rtc', 'rp'],
    'rt': ['rb', 'rt', 'rtc', 'rp'],
    'rtc': ['rb', 'rtc', 'rp'],
    'rp': ['rb', 'rt', 'rtc', 'rp']
};

/**
 * Maximum length for an attribute value to prevent infinite loops on malformed HTML
 * @const {number}
 */
const MAX_ATTRIBUTE_VALUE_LENGTH = 100000;

/**
 * Decodes HTML entities in a string to match jQuery/Cheerio behavior
 * @param {string} text - Text containing HTML entities
 * @returns {string} Decoded text
 */
function decodeHTMLEntities(text) {
    const entities = {
        'amp': '&',
        'lt': '<',
        'gt': '>',
        'quot': '"',
        'apos': "'",
        'nbsp': '\u00A0',
        'copy': '©',
        'reg': '®',
        'trade': '™',
        'euro': '€',
        'pound': '£',
        'yen': '¥',
        'cent': '¢',
        'mdash': '—',
        'ndash': '–',
        'hellip': '…',
        'laquo': '«',
        'raquo': '»',
        'lsquo': '\u2018',
        'rsquo': '\u2019',
        'ldquo': '\u201C',
        'rdquo': '\u201D'
    };

    return text.replace(/&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z0-9]+));/g,
        (match, dec, hex, named) => {
            if (dec) {
                const code = parseInt(dec, 10);
                return code >= 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : match;
            }
            if (hex) {
                const code = parseInt(hex, 16);
                return code >= 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : match;
            }
            return entities[named] || match;
        }
    );
}

/**
 * Parses an HTML string into a node tree.
 * @param {string} html - The HTML string to parse
 * @returns {Array} Array of parsed nodes
 */
function parseHTML(html) {
    // console.log(`[DEBUG] parseHTML: Starting to parse HTML string, length: ${html.length}`);

    if (typeof html !== 'string') {
        // console.error('[DEBUG] parseHTML: Invalid input type, expected string but got:', typeof html);
        throw new TypeError('parseHTML expects a string');
    }

    // In browser environment, do not use native DOM parsing

    let index = 0;
    const length = html.length;
    // console.log(`[DEBUG] parseHTML: Input HTML preview: "${html.substring(0, 100)}${html.length > 100 ? '...' : ''}"`);

    /**
     * Skips whitespace characters in the HTML string.
     */
    function skipWhitespace() {
        while (index < length && /\s/.test(html[index])) {
            index++;
        }
    }

    /**
     * Parses attributes of an HTML element.
     * @returns {Object} Object containing parsed attributes
     */
    function parseAttributes() {
        const attributes = {};
        // console.log(`[DEBUG] parseAttributes: Starting attribute parsing at index ${index}`);

        while (index < length) {
            skipWhitespace();

            // Check for end of attributes
            if (html[index] === '>' || (html[index] === '/' && html[index + 1] === '>')) {
                break;
            }

            // Parse attribute name
            let name = '';
            while (index < length && /[^\s=/>]/.test(html[index])) {
                name += html[index++];
            }

            if (!name) break;

            skipWhitespace();

            // Parse attribute value
            let value = ''; // Default for boolean attributes is empty string (HTML5 standard)
            if (html[index] === '=') {
                index++;
                skipWhitespace();

                const quote = (html[index] === '"' || html[index] === "'") ? html[index++] : null;
                let val = '';
                let attrCharCount = 0;

                // Add safety limit to prevent infinite loops on malformed HTML
                while (index < length && attrCharCount < MAX_ATTRIBUTE_VALUE_LENGTH &&
                    (quote ? html[index] !== quote : !/\s|\/|>/.test(html[index]))) {
                    val += html[index++];
                    attrCharCount++;
                }

                if (quote && html[index] === quote) {
                    index++;
                }

                value = decodeHTMLEntities(val);
            }

            attributes[name] = value;
            // console.log(`[DEBUG] parseAttributes: Parsed attribute "${name}" = "${value}"`);
        }

        // console.log(`[DEBUG] parseAttributes: Finished parsing attributes:`, attributes);
        return attributes;
    }

    /**
     * Recursively parses HTML nodes.
     * @param {string} [expectedClosingTag] - Expected closing tag name for this level (undefined at root)
     * @param {Array<string>} [openTags] - Stack of currently open tag names for auto-closing
     * @returns {Array} Array of parsed nodes
     */
    function parseNodes(expectedClosingTag, openTags = []) {
        const nodes = [];
        // console.log(`[DEBUG] parseNodes: Starting node parsing at index ${index}, expecting closing tag: ${expectedClosingTag || 'none (root level)'}`);

        while (index < length) {
            if (html[index] === '<') {
                if (html.substr(index, 9).toLowerCase() === '<!doctype') {
                    // DOCTYPE declaration
                    index += 9;
                    let doctypeText = '';
                    let depth = 0;
                    while (index < length) {
                        if (html[index] === '<') depth++;
                        if (html[index] === '>') {
                            if (depth === 0) break;
                            depth--;
                        }
                        doctypeText += html[index++];
                    }
                    if (html[index] === '>') {
                        index++;
                    }
                    const doctypeNode = {
                        type: 'directive',
                        name: '!DOCTYPE',
                        value: doctypeText.trim()
                    };
                    nodes.push(doctypeNode);
                    // console.log(`[DEBUG] parseNodes: Created DOCTYPE node: "${doctypeText}"`);
                } else if (html.substr(index, 9) === '<![CDATA[') {
                    // CDATA section
                    index += 9;
                    let cdataText = '';
                    while (index < length && html.substr(index, 3) !== ']]>') {
                        cdataText += html[index++];
                    }
                    if (html.substr(index, 3) === ']]>') {
                        index += 3;
                    }
                    const cdataNode = {
                        type: 'cdata',
                        value: cdataText
                    };
                    nodes.push(cdataNode);
                    // console.log(`[DEBUG] parseNodes: Created CDATA node: "${cdataText}"`);
                } else if (html.substr(index, 4) === '<!--') {
                    // Comment
                    index += 4;
                    let commentText = '';
                    while (index < length && html.substr(index, 3) !== '-->') {
                        commentText += html[index++];
                    }
                    if (html.substr(index, 3) === '-->') {
                        index += 3;
                    }
                    const commentNode = {
                        type: 'comment',
                        value: commentText
                    };
                    nodes.push(commentNode);
                    // console.log(`[DEBUG] parseNodes: Created comment node: "${commentText}"`);
                } else if (html[index + 1] === '?') {
                    // Processing instruction (e.g., <?xml version="1.0"?>)
                    index += 2;
                    let name = '';
                    while (index < length && /[a-zA-Z0-9\-_]/.test(html[index])) {
                        name += html[index++];
                    }
                    let piText = '';
                    while (index < length && html.substr(index, 2) !== '?>') {
                        piText += html[index++];
                    }
                    if (html.substr(index, 2) === '?>') {
                        index += 2;
                    }
                    const piNode = {
                        type: 'directive',
                        name: `?${name}`,
                        value: piText.trim()
                    };
                    nodes.push(piNode);
                    // console.log(`[DEBUG] parseNodes: Created processing instruction node: "<?${name} ${piText}?>"`);
                } else if (html[index + 1] === '/') {
                    // Closing tag
                    const closingTagStart = index;
                    index += 2;
                    let tagName = '';
                    // Parse tag name - allow alphanumeric, hyphens, and underscores
                    while (index < length && /[a-zA-Z0-9\-_]/.test(html[index])) {
                        tagName += html[index++];
                    }
                    // Skip any whitespace before '>'
                    while (index < length && html[index] !== '>') {
                        index++;
                    }
                    if (html[index] === '>') {
                        index++;
                    }

                    const closingTagLower = tagName.toLowerCase();
                    // console.log(`[DEBUG] parseNodes: Found closing tag </${tagName}>, expected: ${expectedClosingTag || 'none'}`);

                    // If we're expecting a specific closing tag and this matches it, return
                    if (expectedClosingTag && closingTagLower === expectedClosingTag.toLowerCase()) {
                        // console.log(`[DEBUG] parseNodes: Closing tag matches expected tag, returning ${nodes.length} nodes`);
                        return nodes;
                    }

                    // If we're at root level (no expected closing tag), ignore unmatched closing tags
                    // This handles malformed HTML where closing tags appear without matching opening tags
                    if (!expectedClosingTag) {
                        // console.log(`[DEBUG] parseNodes: Ignoring unmatched closing tag </${tagName}> at root level`);
                        continue;
                    }

                    // If we found a different closing tag than expected, this might be malformed HTML
                    // Return what we have so far and let the parent handle it
                    // console.log(`[DEBUG] parseNodes: Found unexpected closing tag </${tagName}>, expected </${expectedClosingTag}>, returning ${nodes.length} nodes`);
                    // Backtrack to before this closing tag so parent can see it
                    index = closingTagStart;
                    return nodes;
                } else {
                    // Opening tag
                    index++;
                    let tagName = '';
                    // Parse tag name - allow alphanumeric, hyphens, and underscores
                    while (index < length && /[a-zA-Z0-9\-_]/.test(html[index])) {
                        tagName += html[index++];
                    }

                    if (!tagName) {
                        // Invalid tag, skip the '<' and continue
                        continue;
                    }

                    // Check if this tag should auto-close the current parent
                    const tagLower = tagName.toLowerCase();
                    if (expectedClosingTag && AUTO_CLOSE_RULES[expectedClosingTag.toLowerCase()]) {
                        const closingTags = AUTO_CLOSE_RULES[expectedClosingTag.toLowerCase()];
                        if (closingTags.includes(tagLower)) {
                            // Auto-close the current element by backtracking
                            // console.log(`[DEBUG] parseNodes: Tag <${tagName}> auto-closes parent <${expectedClosingTag}>`);
                            index = index - tagName.length - 1; // Backtrack to before '<'
                            return nodes;
                        }
                    }

                    // console.log(`[DEBUG] parseNodes: Found opening tag: <${tagName}> at index ${index}`);
                    const attributes = parseAttributes();

                    let selfClosing = false;
                    if (html[index] === '/' && html[index + 1] === '>') {
                        selfClosing = true;
                        index += 2;
                    } else if (html[index] === '>') {
                        index++;
                    }

                    // Check if this is a self-closing tag (void elements in HTML5)
                    if (VOID_ELEMENTS.has(tagName.toLowerCase())) {
                        selfClosing = true;
                    }

                    if (selfClosing) {
                        const element = {
                            type: 'element',
                            tagName: tagName.toLowerCase(),
                            attributes,
                            children: []
                        };
                        nodes.push(element);
                        // console.log(`[DEBUG] parseNodes: Created self-closing element:`, element);
                    } else {
                        // Check if this is a raw text element (script/style)
                        if (RAW_TEXT_ELEMENTS.has(tagLower)) {
                            // Parse raw text until closing tag
                            let rawText = '';
                            const closingTag = `</${tagName}`;
                            const closingIndex = html.toLowerCase().indexOf(closingTag.toLowerCase(), index);

                            if (closingIndex !== -1) {
                                rawText = html.substring(index, closingIndex);
                                index = closingIndex;
                                // Skip the closing tag
                                index += closingTag.length;
                                while (index < length && html[index] !== '>') {
                                    index++;
                                }
                                if (html[index] === '>') {
                                    index++;
                                }
                            } else {
                                // No closing tag found, consume rest of input
                                rawText = html.substring(index);
                                index = length;
                            }

                            const element = {
                                type: 'element',
                                tagName: tagName.toLowerCase(),
                                attributes,
                                children: rawText ? [{ type: 'text', value: rawText }] : []
                            };
                            nodes.push(element);
                            // console.log(`[DEBUG] parseNodes: Created raw text element <${tagName}> with ${rawText.length} chars`);
                        } else {
                            // Parse children normally, expecting this tag's closing tag
                            const children = parseNodes(tagName, openTags);
                            const element = {
                                type: 'element',
                                tagName: tagName.toLowerCase(),
                                attributes,
                                children
                            };
                            nodes.push(element);
                            // console.log(`[DEBUG] parseNodes: Created element <${tagName}> with ${children.length} children`);
                        }
                    }
                }
            } else {
                // Text content
                let text = '';
                while (index < length && html[index] !== '<') {
                    text += html[index++];
                }

                // Only create text node if there's actual text content
                // Don't trim whitespace as it may be significant in HTML
                if (text) {
                    const textNode = {
                        type: 'text',
                        value: decodeHTMLEntities(text)
                    };
                    nodes.push(textNode);
                    // console.log(`[DEBUG] parseNodes: Created text node of length ${text.length}`);
                }
            }
        }

        // console.log(`[DEBUG] parseNodes: Reached end of input, returning ${nodes.length} nodes`);
        return nodes;
    }

    const result = parseNodes();
    // console.log(`[DEBUG] parseHTML: Parsing complete, returned ${result.length} root nodes`);
    return result;
}

module.exports = { parseHTML };
