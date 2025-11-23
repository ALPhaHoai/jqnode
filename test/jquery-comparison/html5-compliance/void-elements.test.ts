import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('HTML5 Void Elements - jQuery Comparison', () => {
    test('should parse br as self-closing - jquery-comparison', () => {
        const html = '<p>Line 1<br>Line 2</p>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqBr = nqRoot.find('br');
        const jqBr = jqRoot.find('br');

        expect(nqBr.nodes).toHaveLength(1);
        expect(jqBr.length).toBe(1);
        expect(nqBr.nodes[0].children).toHaveLength(0);
    });

    test('should parse img as self-closing - jquery-comparison', () => {
        const html = '<img src="test.jpg" alt="Test">';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqImg = nqRoot.find('img');
        const jqImg = jqRoot.find('img');

        expect(nqImg.nodes).toHaveLength(1);
        expect(jqImg.length).toBe(1);
        expect(nqImg.attr('src')).toBe(jqImg.attr('src'));
        expect(nqImg.attr('alt')).toBe(jqImg.attr('alt'));
        expect(nqImg.nodes[0].children).toHaveLength(0);
    });

    test('should parse input as self-closing - jquery-comparison', () => {
        const html = '<input type="text" name="username">';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('input');
        const jqInput = jqRoot.find('input');

        expect(nqInput.nodes).toHaveLength(1);
        expect(jqInput.length).toBe(1);
        expect(nqInput.attr('type')).toBe(jqInput.attr('type'));
        expect(nqInput.nodes[0].children).toHaveLength(0);
    });

    test('should parse hr as self-closing - jquery-comparison', () => {
        const html = '<div><p>Text</p><hr><p>More text</p></div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqHr = nqRoot.find('hr');
        const jqHr = jqRoot.find('hr');

        expect(nqHr.nodes).toHaveLength(1);
        expect(jqHr.length).toBe(1);
        expect(nqHr.nodes[0].children).toHaveLength(0);
    });

    test('should handle void elements with explicit self-closing syntax - jquery-comparison', () => {
        const html = '<img src="test.jpg" /><br /><input type="text" />';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqImg = nqRoot.find('img');
        const nqBr = nqRoot.find('br');
        const nqInput = nqRoot.find('input');

        const jqImg = jqRoot.find('img');
        const jqBr = jqRoot.find('br');
        const jqInput = jqRoot.find('input');

        expect(nqImg.nodes).toHaveLength(1);
        expect(jqImg.length).toBe(1);
        expect(nqBr.nodes).toHaveLength(1);
        expect(jqBr.length).toBe(1);
        expect(nqInput.nodes).toHaveLength(1);
        expect(jqInput.length).toBe(1);
    });
});
