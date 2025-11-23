// Note: This is a placeholder comparison test for css() method
// The original css() test is complex (268 lines) with many edge cases
// This conversion includes key test cases to ensure jQuery compatibility

import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { HtmlNode } from '../../../types';

describe('css() method - jQuery Comparison (Key Tests)', () => {
    test('should get and set inline style - jquery-comparison', () => {
        const html = '<div style="color: red; width: 100px">Test</div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');
        const jqDiv = jqRoot.find('div');

        expect(nqDiv.css('color')).toBe(jqDiv.css('color'));
        expect(nqDiv.css('width')).toBe(jqDiv.css('width'));

        nqDiv.css('height', '50px');
        jqDiv.css('height', '50px');

        expect(nqDiv.css('height')).toBe(jqDiv.css('height'));
        expect(nqDiv.css('height')).toBe('50px');
    });

    test('should convert camelCase to hyphenated - jquery-comparison', () => {
        const html = '<div>Test</div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');
        const jqDiv = jqRoot.find('div');

        nqDiv.css('backgroundColor', 'red');
        jqDiv.css('backgroundColor', 'red');

        expect(nqDiv.css('background-color')).toBe(jqDiv.css('background-color'));
        expect(nqDiv.css('backgroundColor')).toBe(jqDiv.css('backgroundColor'));
    });

    test('should add px to numeric values - jquery-comparison', () => {
        const html = '<div>Test</div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');
        const jqDiv = jqRoot.find('div');

        nqDiv.css('width', 100);
        jqDiv.css('width', 100);

        expect(nqDiv.css('width')).toBe(jqDiv.css('width'));
        expect(nqDiv.css('width')).toBe('100px');
    });

    test('should not add px to opacity - jquery-comparison', () => {
        const html = '<div>Test</div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');
        const jqDiv = jqRoot.find('div');

        nqDiv.css('opacity', 0.5);
        jqDiv.css('opacity', 0.5);

        expect(nqDiv.css('opacity')).toBe(jqDiv.css('opacity'));
        expect(nqDiv.css('opacity')).toBe('0.5');
    });

    test('should set multiple properties from object - jquery-comparison', () => {
        const html = '<div>Test</div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');
        const jqDiv = jqRoot.find('div');

        nqDiv.css({ color: 'red', width: '100px' });
        jqDiv.css({ color: 'red', width: '100px' });

        expect(nqDiv.css('color')).toBe(jqDiv.css('color'));
        expect(nqDiv.css('width')).toBe(jqDiv.css('width'));
    });

    test('should work with multiple elements - jquery-comparison', () => {
        const html = '<div class="item">1</div><div class="item">2</div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        nqItems.css('color', 'blue');
        jqItems.css('color', 'blue');

        nqItems.nodes.forEach((node: HtmlNode, index: number) => {
            expect($(node).css('color')).toBe(jqItems.eq(index).css('color'));
        });
    });
});
