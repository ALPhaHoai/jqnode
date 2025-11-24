import $ from '../../index';
import jQuery from 'jquery';

describe('HTML Parsing - Node-Query vs jQuery Comparison', () => {
    test('should parse HTML consistently with jQuery - jquery-comparison', () => {
        const html = '<div class="test">Hello <span>World</span></div>';

        const nqResult = $(html);
        const jqResult = jQuery(html);

        // Both should create valid instances with same length
        expect(nqResult.length).toBe(jqResult.length);

        // Both should have same text content
        expect(nqResult.text()).toBe(jqResult.text());

        // Both should find the same elements
        expect(nqResult.find('span').length).toBe(jqResult.find('span').length);
        expect(nqResult.find('span').text()).toBe(jqResult.find('span').text());

        // Both should handle attributes the same way
        expect(nqResult.attr('class')).toBe(jqResult.attr('class'));
    });

    test('should handle self-closing tags - jquery-comparison', () => {
        const html = '<img src="test.jpg" alt="pic"/>';

        const nqResult = $(html);
        const jqResult = jQuery(html);

        expect(nqResult.length).toBe(jqResult.length);
        expect(nqResult.attr('src')).toBe(jqResult.attr('src'));
        expect(nqResult.attr('alt')).toBe(jqResult.attr('alt'));
    });

    test('should handle attributes consistently - jquery-comparison', () => {
        const html = '<div class="test" id="main" data-value="123"></div>';

        const nqResult = $(html);
        const jqResult = jQuery(html);

        // Compare attributes
        expect(nqResult.attr('class')).toBe(jqResult.attr('class'));
        expect(nqResult.attr('id')).toBe(jqResult.attr('id'));
        expect(nqResult.attr('data-value')).toBe('123'); // Keep as string
        expect(jqResult.data('value')).toBe(123); // jQuery converts to number
    });

    test('should handle quoted attributes - jquery-comparison', () => {
        const html = '<p data-info=\'some info\' title="Hello World"></p>';

        const nqResult = $(html);
        const jqResult = jQuery(html);

        expect(nqResult.attr('data-info')).toBe(jqResult.attr('data-info'));
        expect(nqResult.attr('title')).toBe(jqResult.attr('title'));
    });

    test('should parse nested elements consistently - jquery-comparison', () => {
        const html = '<div><h1>Title</h1><p>Content</p></div>';

        const nqResult = $(html);
        const jqResult = jQuery(html);

        expect(nqResult.children().length).toBe(jqResult.children().length);
        expect(nqResult.find('h1').text()).toBe(jqResult.find('h1').text());
        expect(nqResult.find('p').text()).toBe(jqResult.find('p').text());
    });
});
