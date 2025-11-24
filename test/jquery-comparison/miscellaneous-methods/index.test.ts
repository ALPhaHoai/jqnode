import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JQ } from '../../../index';

describe('index() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item" id="item1">Item 1</div>
        <div class="item" id="item2">Item 2</div>
        <div class="item" id="item3">Item 3</div>
        <span id="span1">Span</span>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('index() without arguments should return element position among siblings - jquery-comparison', () => {
        const nqItem2 = nqRoot.find('#item2');
        const jqItem2 = jqRoot.find('#item2');

        expect(nqItem2.index()).toBe(jqItem2.index());
        expect(nqItem2.index()).toBe(1);
    });

    test('index() with selector should find position within matched elements - jquery-comparison', () => {
        const nqItem3 = nqRoot.find('#item3');
        const jqItem3 = jqRoot.find('#item3');

        expect(nqItem3.index('.item')).toBe(jqItem3.index('.item'));
        expect(nqItem3.index('.item')).toBe(2);
    });

    test('index() with element argument should find position of element - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqTargetElem = nqRoot.find('#item2').get(0);
        const jqTargetElem = jqRoot.find('#item2').get(0);

        expect(nqItems.index(nqTargetElem)).toBe(jqItems.index(jqTargetElem));
        expect(nqItems.index(nqTargetElem)).toBe(1);
    });

    test('index() with jQuery/JQ object should find position - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqTarget = nqRoot.find('#item1');
        const jqTarget = jqRoot.find('#item1');

        expect(nqItems.index(nqTarget)).toBe(jqItems.index(jqTarget));
        expect(nqItems.index(nqTarget)).toBe(0);
    });

    test('index() should return -1 for non-existent element - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqSpan = nqRoot.find('#span1').get(0);
        const jqSpan = jqRoot.find('#span1').get(0);

        expect(nqItems.index(nqSpan)).toBe(jqItems.index(jqSpan));
        expect(nqItems.index(nqSpan)).toBe(-1);
    });

    test('index() on first element should return 0 - jquery-comparison', () => {
        const nqFirst = nqRoot.find('#item1');
        const jqFirst = jqRoot.find('#item1');

        expect(nqFirst.index()).toBe(jqFirst.index());
        expect(nqFirst.index()).toBe(0);
    });

    test('index() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        expect(nqEmpty.index()).toBe(jqEmpty.index());
        expect(nqEmpty.index()).toBe(-1);
    });

    test('index() should work with nested elements - jquery-comparison', () => {
        const html = `
      <div class="outer">
        <div class="inner">
          <span id="target">Target</span>
        </div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        const nqTarget = nodeQuery.find('#target');
        const jqTarget = jquery.find('#target');

        expect(nqTarget.index()).toBe(jqTarget.index());
    });

    test('index() with multiple elements should use first element - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        // When calling index() on a collection with multiple elements,
        // it should use the first element
        expect(nqItems.index()).toBe(jqItems.index());
    });

    test('index() should count only among siblings - jquery-comparison', () => {
        const html = `
      <div>
        <div class="group">
          <span id="a">A</span>
          <span id="b">B</span>
        </div>
        <div class="group">
          <span id="c">C</span>
          <span id="d">D</span>
        </div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        const nqC = nodeQuery.find('#c');
        const jqC = jquery.find('#c');

        // Should be index 0 within its parent, not overall
        expect(nqC.index()).toBe(jqC.index());
        expect(nqC.index()).toBe(0);
    });
});
