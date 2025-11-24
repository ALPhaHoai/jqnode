import $ from '../../../index';

describe('normalizedText() - jqnode specific method', () => {
    test('should normalize whitespace in text output', () => {
        const html = '<p>Hello    World</p>';
        const nq = $(html);

        // Regular text() preserves whitespace
        expect(nq.find('p').text()).toBe('Hello    World');

        // normalizedText() collapses whitespace
        expect(nq.find('p').normalizedText()).toBe('Hello World');
    });

    test('should remove tabs and newlines', () => {
        const html = '<div>Content\t  with\n\nmultiple\r\n  spaces</div>';
        const nq = $(html);

        const result = nq.find('div').normalizedText();
        expect(result).toBe('Content with multiple spaces');
    });

    test('should handle unicode whitespace', () => {
        const html = '<div>Hello\u00A0\u00A0World</div>'; // \u00A0 = non-breaking space
        const nq = $(html);

        expect(nq.find('div').normalizedText()).toBe('Hello World');
    });

    test('setter should work like text() setter', () => {
        const html = '<div>Old</div>';
        const nq = $(html);

        const result = nq.find('div').normalizedText('New');
        expect(result.nodes).toBeDefined(); // Returns JQ instance
        expect(nq.find('div').text()).toBe('New');
    });

    test('should handle multiple elements', () => {
        const html = '<ul><li>A   B</li><li>C   D</li></ul>';
        const nq = $(html);

        // Normalizes within each element, concatenates without spaces
        expect(nq.find('li').normalizedText()).toBe('A BC D');
    });
});
