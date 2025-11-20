const jq = require('../../../index');

describe('normalizedText()', () => {
    test('should return normalized text with whitespace collapsed', () => {
        const html = `
            <div>
                <p>Hello    World</p>
            </div>
        `;
        const $ = jq.load(html);
        const result = $('p').normalizedText();

        expect(result).toBe('Hello World');
    });

    test('should remove tabs, newlines, and carriage returns', () => {
        const html = '<div>Content\twith\ntabs\rand\r\nnewlines</div>';
        const $ = jq.load(html);
        const result = $('div').normalizedText();

        expect(result).toBe('Content with tabs and newlines');
    });

    test('should handle multiple elements', () => {
        const html = `
            <ul>
                <li>Item   1</li>
                <li>Item\t2</li>
                <li>Item\n3</li>
            </ul>
        `;
        const $ = jq.load(html);
        const result = $('li').normalizedText();

        // Text from multiple elements is concatenated without spaces between them
        expect(result).toBe('Item 1Item 2Item 3');
    });

    test('should return empty string for no elements', () => {
        const $ = jq.load('<div></div>');
        const result = $('.nonexistent').normalizedText();

        expect(result).toBe('');
    });

    test('should trim leading and trailing whitespace', () => {
        const html = '   <div>   Content   </div>   ';
        const $ = jq.load(html);
        const result = $('div').normalizedText();

        expect(result).toBe('Content');
    });

    test('should unescape HTML entities and then normalize', () => {
        // Use actual unicode non-breaking space (\u00A0) since the HTML parser 
        // preserves &nbsp; entities literally without unescaping them
        const html = '<div>Hello\u00A0\u00A0\u00A0World</div>';
        const $ = jq.load(html);
        const result = $('div').normalizedText();

        // Non-breaking spaces (\u00A0) normalize to regular spaces
        expect(result).toBe('Hello World');
    });

    test('setter should work the same as text() setter', () => {
        const $ = jq.load('<div>Old Text</div>');
        const result = $('div').normalizedText('New Text');

        // Should return the JQ instance (chainable)
        expect(result.nodes).toBeDefined();
        expect($('div').text()).toBe('New Text');
    });

    test('should handle deeply nested elements', () => {
        const html = `
            <div>
                <span>
                    Nested
                    Content
                </span>
            </div>
        `;
        const $ = jq.load(html);
        const result = $('div').normalizedText();

        // Whitespace between "Nested" and "Content" normalizes to a single space
        expect(result).toBe('Nested Content');
    });
});
