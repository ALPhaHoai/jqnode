import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('data() fallback behavior', () => {
    test('should fall back to data-* attribute after removeData()', () => {
        const html = '<div id="test" data-foo="bar"></div>';
        const { jquery, nodeQuery } = createTestDom(html);
        const nqEl = nodeQuery.find('#test');
        const jqEl = jquery.find('#test');

        // Initial read
        expect(nqEl.data('foo')).toBe('bar');
        expect(jqEl.data('foo')).toBe('bar');

        // Set data via .data() (overrides attribute in cache)
        nqEl.data('foo', 'baz');
        jqEl.data('foo', 'baz');
        expect(nqEl.data('foo')).toBe('baz');
        expect(jqEl.data('foo')).toBe('baz');

        // Remove data (should clear cache)
        nqEl.removeData('foo');
        jqEl.removeData('foo');

        // Read again (should fall back to attribute)
        expect(nqEl.data('foo')).toBe('bar');
        expect(jqEl.data('foo')).toBe('bar');
    });

    test('should not fall back to attribute if data is set (cache precedence)', () => {
        const html = '<div id="test" data-foo="bar"></div>';
        const { jquery, nodeQuery } = createTestDom(html);
        const nqEl = nodeQuery.find('#test');
        const jqEl = jquery.find('#test');

        // Initialize cache
        nqEl.data('foo');
        jqEl.data('foo');

        // Change attribute via .attr()
        nqEl.attr('data-foo', 'qux');
        jqEl.attr('data-foo', 'qux');

        // Read data (should still be "bar" from cache)
        expect(nqEl.data('foo')).toBe('bar');
        expect(jqEl.data('foo')).toBe('bar');
    });

    test('should pick up new attribute value after removeData()', () => {
        const html = '<div id="test" data-foo="bar"></div>';
        const { jquery, nodeQuery } = createTestDom(html);
        const nqEl = nodeQuery.find('#test');
        const jqEl = jquery.find('#test');

        // Initialize cache
        nqEl.data('foo');
        jqEl.data('foo');

        // Remove data
        nqEl.removeData('foo');
        jqEl.removeData('foo');

        // Change attribute
        nqEl.attr('data-foo', 'qux');
        jqEl.attr('data-foo', 'qux');

        // Read data (should be "qux")
        expect(nqEl.data('foo')).toBe('qux');
        expect(jqEl.data('foo')).toBe('qux');
    });
});
