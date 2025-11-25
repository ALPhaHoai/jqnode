/**
 * Minimal HTML parser that converts HTML strings to a node tree structure.
 */

import { decodeHTMLEntities } from './helpers/html-entities';
import { JqElement } from './dom';
import { createTypedElement } from './dom/helpers/createTypedElement';
import { VOID_ELEMENTS, RAW_TEXT_ELEMENTS, AUTO_CLOSE_RULES } from './helpers/html-constants';

/**
 * Maximum length for an attribute value to prevent infinite loops on malformed HTML
 */
const MAX_ATTRIBUTE_VALUE_LENGTH = 100000;


/**
 * Parses an HTML string into a node tree.
 * @param html - The HTML string to parse
 * @returns Array of parsed nodes
 */
function parseHTML(html: string): JqElement[] {
    if (typeof html !== 'string') {
        throw new TypeError('parseHTML expects a string');
    }

    let index = 0;
    const length = html.length;

    /**
     * Skips whitespace characters in the HTML string.
     */
    function skipWhitespace(): void {
        while (index < length && /\s/.test(html[index])) {
            index++;
        }
    }

    /**
     * Parses attributes of an HTML element.
     * @returns Object containing parsed attributes
     */
    function parseAttributes(): Record<string, string> {
        const attributes: Record<string, string> = {};

        while (index < length) {
            skipWhitespace();

            // Check for end of attributes
            if (html[index] === '>' || (html[index] === '/' && html[index + 1] === '>')) {
                break;
            }

            // Parse attribute name
            let name = '';
            while (index < length && /[^\s=/> ]/.test(html[index])) {
                name += html[index++];
            }

            if (!name) break;

            skipWhitespace();

            // Parse attribute value
            // For boolean attributes, HTML5 allows: disabled, disabled="", or disabled="disabled"
            // jQuery returns the attribute name when present, so we default to that
            let value = name; // Default to attribute name for boolean attributes
            if (html[index] === '=') {
                index++;
                skipWhitespace();

                const quote = html[index] === '"' || html[index] === "'" ? html[index++] : null;
                let val = '';
                let attrCharCount = 0;

                // Add safety limit to prevent infinite loops on malformed HTML
                while (
                    index < length &&
                    attrCharCount < MAX_ATTRIBUTE_VALUE_LENGTH &&
                    (quote ? html[index] !== quote : !/\s|\/|>/.test(html[index]))
                ) {
                    val += html[index++];
                    attrCharCount++;
                }

                if (quote && html[index] === quote) {
                    index++;
                }

                // Decode HTML entities in attribute value
                const decodedValue = decodeHTMLEntities(val);
                // If value is non-empty, use it; otherwise keep the attribute name (matches jQuery behavior)
                value = decodedValue || name;
            }

            attributes[name] = value;
        }

        return attributes;
    }

    /**
     * Recursively parses HTML nodes.
     * @param expectedClosingTag - Expected closing tag name for this level (undefined at root)
     * @param openTags - Stack of currently open tag names for auto-closing
     * @returns Array of parsed nodes
     */
    function parseNodes(expectedClosingTag?: string, openTags: string[] = []): JqElement[] {
        const nodes: JqElement[] = [];

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
                    const doctypeNode = new JqElement('text');
                    doctypeNode.tagName = '!DOCTYPE';
                    doctypeNode.data = doctypeText.trim();
                    nodes.push(doctypeNode);
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
                    const cdataNode = new JqElement('text');
                    cdataNode.data = cdataText;
                    nodes.push(cdataNode);
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
                    const commentNode = new JqElement('comment');
                    commentNode.data = commentText;
                    nodes.push(commentNode);
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
                    const piNode = new JqElement('text');
                    piNode.tagName = `?${name}`;
                    piNode.data = piText.trim();
                    nodes.push(piNode);
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

                    // If we're expecting a specific closing tag and this matches it, return
                    if (
                        expectedClosingTag &&
                        closingTagLower === expectedClosingTag.toLowerCase()
                    ) {
                        return nodes;
                    }

                    // If we're at root level (no expected closing tag), ignore unmatched closing tags
                    // This handles malformed HTML where closing tags appear without matching opening tags
                    if (!expectedClosingTag) {
                        continue;
                    }

                    // If we found a different closing tag than expected, this might be malformed HTML
                    // Return what we have so far and let the parent handle it
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
                            index = index - tagName.length - 1; // Backtrack to before '<'
                            return nodes;
                        }
                    }

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
                        const element = createTypedElement(tagName);
                        element.attributes._setData(attributes);
                        nodes.push(element);
                    } else {
                        // Check if this is a raw text element (script/style)
                        if (RAW_TEXT_ELEMENTS.has(tagLower)) {
                            // Parse raw text until closing tag
                            let rawText = '';
                            const closingTag = `</${tagName}`;
                            const closingIndex = html
                                .toLowerCase()
                                .indexOf(closingTag.toLowerCase(), index);

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

                            const element = createTypedElement(tagName);
                            element.attributes._setData(attributes);
                            if (rawText) {
                                const textNode = new JqElement('text');
                                textNode.textData = rawText;
                                element.children = [textNode];
                            }
                            nodes.push(element);
                        } else {
                            // Parse children normally, expecting this tag's closing tag
                            const children = parseNodes(tagName, openTags);
                            const element = createTypedElement(tagName);
                            element.attributes._setData(attributes);
                            element.children = children;
                            nodes.push(element);
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
                    const textNode = new JqElement('text');
                    textNode.textData = decodeHTMLEntities(text);
                    nodes.push(textNode);
                }
            }
        }

        return nodes;
    }

    const result = parseNodes();
    return result;
}

export { parseHTML };
