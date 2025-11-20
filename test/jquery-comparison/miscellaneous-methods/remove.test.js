const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom } = require('../../utils/jquery-comparison-helpers');

describe('remove() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item" id="item1">Item 1</div>
        <div class="item" id="item2">Item 2</div>
        <div class="item" id="item3">Item 3</div>
        <span class="special">Special</span>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('remove() should remove elements from DOM - jquery-comparison', () => {
        const nqInitialCount = nqRoot.find('.item').length;
        const jqInitialCount = jqRoot.find('.item').length;

        expect(nqInitialCount).toBe(jqInitialCount);
        expect(nqInitialCount).toBe(3);

        nqRoot.find('#item2').remove();
        jqRoot.find('#item2').remove();

        const nqAfterCount = nqRoot.find('.item').length;
        const jqAfterCount = jqRoot.find('.item').length;

        expect(nqAfterCount).toBe(jqAfterCount);
        expect(nqAfterCount).toBe(2);
    });

    test('remove() should remove all matched elements - jquery-comparison', () => {
        nqRoot.find('.item').remove();
        jqRoot.find('.item').remove();

        expect(nqRoot.find('.item').length).toBe(jqRoot.find('.item').length);
        expect(nqRoot.find('.item').length).toBe(0);
    });

    test('remove() with selector should remove only matching elements - jquery-comparison', () => {
        const html = `
      <div class="parent">
        <div class="child even">Child 1</div>
        <div class="child odd">Child 2</div>
        <div class="child even">Child 3</div>
        <div class="child odd">Child 4</div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        nodeQuery.find('.child').remove('.even');
        jquery.find('.child').remove('.even');

        expect(nodeQuery.find('.child').length).toBe(jquery.find('.child').length);
        expect(nodeQuery.find('.child.even').length).toBe(0);
        expect(jquery.find('.child.even').length).toBe(0);
    });

    test('remove() should support chaining - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqResult = nqItems.remove();
        const jqResult = jqItems.remove();

        // Should return the removed elements
        expect(nqResult.length).toBe(jqResult.length);
    });

    test('remove() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        expect(() => {
            nqEmpty.remove();
        }).not.toThrow();

        expect(() => {
            jqEmpty.remove();
        }).not.toThrow();
    });

    test('remove() should not affect other elements - jquery-comparison', () => {
        nqRoot.find('#item1').remove();
        jqRoot.find('#item1').remove();

        // Other items should still exist
        expect(nqRoot.find('#item2').length).toBe(1);
        expect(jqRoot.find('#item2').length).toBe(1);
        expect(nqRoot.find('#item3').length).toBe(1);
        expect(jqRoot.find('#item3').length).toBe(1);
    });

    test('remove() should remove element and its children - jquery-comparison', () => {
        const html = `
      <div class="outer">
        <div class="middle">
          <div class="inner">Inner Content</div>
        </div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        nodeQuery.find('.outer').remove();
        jquery.find('.outer').remove();

        expect(nodeQuery.find('.inner').length).toBe(jquery.find('.inner').length);
        expect(nodeQuery.find('.inner').length).toBe(0);
    });

    test('remove() should work with complex selectors - jquery-comparison', () => {
        const html = `
      <div class="list">
        <div class="item active">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item active">Item 3</div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        nodeQuery.find('.item').remove('.active');
        jquery.find('.item').remove('.active');

        expect(nodeQuery.find('.item').length).toBe(jquery.find('.item').length);
        expect(nodeQuery.find('.item.active').length).toBe(0);
    });

    test('remove() should handle single element removal - jquery-comparison', () => {
        const nqSpecial = nqRoot.find('.special');
        const jqSpecial = jqRoot.find('.special');

        nqSpecial.remove();
        jqSpecial.remove();

        expect(nqRoot.find('.special').length).toBe(jqRoot.find('.special').length);
        expect(nqRoot.find('.special').length).toBe(0);
    });

    test('remove() should preserve parent structure - jquery-comparison', () => {
        nqRoot.find('.item').remove();
        jqRoot.find('.item').remove();

        // Container should still exist
        expect(nqRoot.find('.container').length).toBe(1);
        expect(jqRoot.find('.container').length).toBe(1);
    });
});
