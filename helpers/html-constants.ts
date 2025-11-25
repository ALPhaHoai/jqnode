/**
 * HTML5 Boolean Attributes
 * These attributes are either present (true) or absent (false)
 * @see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
 */
export const BOOLEAN_ATTRIBUTES = [
    'checked',
    'selected',
    'disabled',
    'readonly',
    'required',
    'multiple',
    'autofocus',
    'autoplay',
    'hidden',
    'controls',
    'loop',
    'muted',
    'default',
    'open',
    'reversed',
    'scoped',
    'async',
    'defer',
] as const;

/**
 * Check if an attribute name is a boolean attribute
 * @param name - The attribute name to check
 * @returns True if the attribute is a boolean attribute
 */
export function isBooleanAttribute(name: string): boolean {
    return BOOLEAN_ATTRIBUTES.includes(name as any);
}

/**
 * HTML5 Void Elements
 * These elements are always self-closing and cannot have content
 * @see https://html.spec.whatwg.org/multipage/syntax.html#void-elements
 */
export const VOID_ELEMENTS = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);

/**
 * Check if an element is a void element
 * @param tagName - The tag name to check
 * @returns True if the element is a void element
 */
export function isVoidElement(tagName: string): boolean {
    return VOID_ELEMENTS.has(tagName.toLowerCase());
}

/**
 * Raw Text Elements
 * Elements whose content should be treated as raw text, not parsed as HTML
 * @see https://html.spec.whatwg.org/multipage/parsing.html#raw-text-elements
 */
export const RAW_TEXT_ELEMENTS = new Set(['script', 'style']);

/**
 * Check if an element is a raw text element
 * @param tagName - The tag name to check
 * @returns True if the element's content should be treated as raw text
 */
export function isRawTextElement(tagName: string): boolean {
    return RAW_TEXT_ELEMENTS.has(tagName.toLowerCase());
}

/**
 * Auto-Close Rules
 * Tags that automatically close when certain other tags are encountered
 * @see https://html.spec.whatwg.org/multipage/parsing.html#optional-tags
 */
export const AUTO_CLOSE_RULES: Record<string, string[]> = {
    p: [
        'address',
        'article',
        'aside',
        'blockquote',
        'div',
        'dl',
        'fieldset',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'hgroup',
        'hr',
        'main',
        'nav',
        'ol',
        'p',
        'pre',
        'section',
        'table',
        'ul',
    ],
    li: ['li'],
    dt: ['dt', 'dd'],
    dd: ['dt', 'dd'],
    option: ['option', 'optgroup'],
    optgroup: ['optgroup'],
    tr: ['tr'],
    td: ['td', 'th'],
    th: ['td', 'th'],
    thead: ['tbody', 'tfoot'],
    tbody: ['tbody', 'tfoot'],
    tfoot: ['tbody'],
    colgroup: ['thead', 'tbody', 'tfoot', 'tr'],
    body: ['head'],
    head: ['body'],
    rb: ['rb', 'rt', 'rtc', 'rp'],
    rt: ['rb', 'rt', 'rtc', 'rp'],
    rtc: ['rb', 'rtc', 'rp'],
    rp: ['rb', 'rt', 'rtc', 'rp'],
};

/**
 * Check if a tag should auto-close when encountering a new tag
 * @param currentTag - The currently open tag
 * @param newTag - The new tag being opened
 * @returns True if currentTag should auto-close
 */
export function shouldAutoClose(currentTag: string, newTag: string): boolean {
    const rules = AUTO_CLOSE_RULES[currentTag.toLowerCase()];
    return rules ? rules.includes(newTag.toLowerCase()) : false;
}
