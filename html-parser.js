/**
 * Minimal HTML parser that converts HTML strings to a node tree structure.
 * Each node has the format: { type: 'element'|'text', tag?, attributes?, children?, value? }
 */

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
            let value = name; // Default for boolean attributes is the attribute name
            if (html[index] === '=') {
                index++;
                skipWhitespace();

                const quote = (html[index] === '"' || html[index] === "'") ? html[index++] : null;
                let val = '';

                while (index < length && (quote ? html[index] !== quote : !/\s|\/|>/.test(html[index]))) {
                    val += html[index++];
                }

                if (quote && html[index] === quote) {
                    index++;
                }

                value = val;
            }

            attributes[name] = value;
            // console.log(`[DEBUG] parseAttributes: Parsed attribute "${name}" = "${value}"`);
        }

        // console.log(`[DEBUG] parseAttributes: Finished parsing attributes:`, attributes);
        return attributes;
    }

    /**
     * Recursively parses HTML nodes.
     * @returns {Array} Array of parsed nodes
     */
    function parseNodes() {
        const nodes = [];
        // console.log(`[DEBUG] parseNodes: Starting node parsing at index ${index}`);

        while (index < length) {
            if (html[index] === '<') {
                if (html.substr(index, 4) === '<!--') {
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
                } else if (html[index + 1] === '/') {
                    // Closing tag - return current nodes
                    index += 2;
                    let tagName = '';
                    while (index < length && html[index] !== '>') {
                        tagName += html[index++];
                    }
                    index++;
                    return nodes;
                } else {
                    // Opening tag
                    index++;
                    let tagName = '';
                    while (index < length && /[a-zA-Z0-9]/.test(html[index])) {
                        tagName += html[index++];
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
                    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
                    if (voidElements.includes(tagName)) {
                        selfClosing = true;
                    }

                    if (selfClosing) {
                        const element = {
                            type: 'element',
                            tagName: tagName.toUpperCase(),
                            attributes,
                            children: []
                        };
                        nodes.push(element);
                        // console.log(`[DEBUG] parseNodes: Created self-closing element:`, element);
                    } else {
                        const children = parseNodes();
                        const element = {
                            type: 'element',
                            tagName: tagName.toUpperCase(),
                            attributes,
                            children
                        };
                        nodes.push(element);
                        // console.log(`[DEBUG] parseNodes: Created element with ${children.length} children:`, element);
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
                        value: text
                    };
                    nodes.push(textNode);
                    // console.log(`[DEBUG] parseNodes: Created text node: "${text}"`);
                }
            }
        }

        return nodes;
    }

    const result = parseNodes();
    // console.log(`[DEBUG] parseHTML: Parsing complete, returned ${result.length} root nodes`);
    return result;
}

module.exports = {parseHTML};
