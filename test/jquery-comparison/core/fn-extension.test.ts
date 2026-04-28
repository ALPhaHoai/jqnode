// Note: fn-extension tests validate adding custom methods to $.fn (or jQuery.fn)
// jQuery supports this pattern, so we compare both libraries
import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JQ } from '../../../index';

// Augment JQ interface for custom methods
declare module '../../../types' {
    interface JQ {
        customHighlight(color?: string): this;
        getNodeCount(): number;
    }
}

describe('$.fn Extension Pattern - jQuery Comparison', () => {
    const html = `
      <div class="container">
        <div class="item" id="item1">Item 1</div>
        <div class="item" id="item2">Item 2</div>
      </div>
    `;

    test('$.fn should be defined and point to JQ prototype - jquery-comparison', () => {
        createTestDom(html);
        expect($.fn).toBeDefined();
        expect($.fn).toBe(JQ.prototype);
        expect(jQuery.fn).toBeDefined();
    });

    test('should be able to add custom methods using $.fn - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        // Add custom method to both libraries
        $.fn.customHighlight = function (color = 'yellow') {
            return this.attr('data-highlight', color);
        };

        jQuery.fn.customHighlight = function (color = 'yellow') {
            return this.attr('data-highlight', color);
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        nqItems.customHighlight('red');
        jqItems.customHighlight('red');

        const nqHighlight = nqRoot.find('#item1').attr('data-highlight');
        const jqHighlight = jqRoot.find('#item1').attr('data-highlight');

        expect(nqHighlight).toBe(jqHighlight);
        expect(nqHighlight).toBe('red');
    });

    test('custom methods shouldsupport chaining - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        $.fn.customHighlight = function (color = 'yellow') {
            return this.attr('data-highlight', color);
        };

        jQuery.fn.customHighlight = function (color = 'yellow') {
            return this.attr('data-highlight', color);
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqResult = nqItems.customHighlight('blue').attr('data-processed', 'true');
        const jqResult = jqItems.customHighlight('blue').attr('data-processed', 'true');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqFirstHighlight = nqRoot.find('#item1').attr('data-highlight');
        const jqFirstHighlight = jqRoot.find('#item1').attr('data-highlight');

        expect(nqFirstHighlight).toBe(jqFirstHighlight);
        expect(nqFirstHighlight).toBe('blue');
    });

    test('custom methods can return values instead of chaining - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        $.fn.getNodeCount = function () {
            return this.nodes.length;
        };

        jQuery.fn.getNodeCount = function () {
            return this.length;
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqCount = nqItems.getNodeCount();
        const jqCount = jqItems.getNodeCount();

        expect(nqCount).toBe(jqCount);
        expect(nqCount).toBe(2);
    });
});
