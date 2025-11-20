const $ = require('../../../index');
const { createTestDom } = require('../../utils/jquery-comparison-helpers');

// Note: size() was deprecated in jQuery 1.8 and removed in jQuery 3.0
// This test only verifies jqnode's implementation
describe('size() method - Node-Query Implementation', () => {
    let nqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
        <span>Span</span>
      </div>
    `;

        const { nodeQuery } = createTestDom(html);
        nqRoot = nodeQuery;
    });

    test('size() should return number of elements in collection', () => {
        const nqItems = nqRoot.find('.item');
        expect(nqItems.size()).toBe(3);
    });

    test('size() should return 0 for empty collections', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        expect(nqEmpty.size()).toBe(0);
    });

    test('size() should return 1 for single element', () => {
        const nqSpan = nqRoot.find('span');
        expect(nqSpan.size()).toBe(1);
    });

    test('size() should match length property', () => {
        const nqItems = nqRoot.find('.item');
        expect(nqItems.size()).toBe(nqItems.length);
    });

    test('size() should work after filtering', () => {
        const nqFiltered = nqRoot.find('.item').first();
        expect(nqFiltered.size()).toBe(1);
    });

    test('size() should work with universal selector', () => {
        const nqAll = nqRoot.find('*');
        expect(nqAll.size()).toBeGreaterThan(0);
    });

    test('size() should update after DOM manipulation', () => {
        let nqItems = nqRoot.find('.item');
        const initialNqSize = nqItems.size();

        // Remove an element
        nqRoot.find('.item').first().remove();

        // Re-query
        nqItems = nqRoot.find('.item');
        expect(nqItems.size()).toBe(initialNqSize - 1);
        expect(nqItems.size()).toBe(2);
    });

    test('size() should work with complex selectors', () => {
        const html = `
      <div>
        <ul>
          <li class="active">Item 1</li>
          <li>Item 2</li>
          <li class="active">Item 3</li>
        </ul>
      </div>
    `;

        const { nodeQuery } = createTestDom(html);
        const nqActive = nodeQuery.find('li.active');
        expect(nqActive.size()).toBe(2);
    });

    test('size() should handle chained operations', () => {
        const nqChained = nqRoot.find('div').filter('.item');
        expect(nqChained.size()).toBe(3);
    });
});
