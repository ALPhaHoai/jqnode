import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { HtmlNode, JQ } from '../../../types';

describe('get() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item" id="item1">Item 1</div>
        <div class="item" id="item2">Item 2</div>
        <div class="item" id="item3">Item 3</div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('get() with index should return DOM element at specified position - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqFirst = nqItems.get(0)!;
        const jqFirst = jqItems.get(0)!;

        expect(nqFirst.tagName).toBe(jqFirst.tagName);
        expect(nqFirst.id).toBe(jqFirst.id);
        expect(nqFirst.id).toBe('item1');
    });

    test('get() with negative index should count from end - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqLast = nqItems.get(-1)!;
        const jqLast = jqItems.get(-1)!;

        expect(nqLast.id).toBe(jqLast.id);
        expect(nqLast.id).toBe('item3');
    });

    test('get() without arguments should return array of all elements - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.get();
        const jqArray = jqItems.get();

        expect(Array.isArray(nqArray)).toBe(true);
        expect(Array.isArray(jqArray)).toBe(true);
        expect(nqArray.length).toBe(jqArray.length);
        expect(nqArray.length).toBe(3);
    });

    test('get() should return plain DOM elements, not wrapped - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqElem = nqItems.get(0)!;
        const jqElem = jqItems.get(0)!;

        // Should not have jQuery/JQ methods
        expect(typeof (nqElem as any).find).toBe('undefined');
        expect(typeof (jqElem as any).find).toBe('undefined');
    });

    test('get() with out-of-bounds index should return undefined - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        expect(nqItems.get(999)).toBe(jqItems.get(999));
        expect(nqItems.get(999)).toBeUndefined();
    });

    test('get() on empty collection should return empty array - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqArray = nqEmpty.get();
        const jqArray = jqEmpty.get();

        expect(nqArray).toEqual(jqArray);
        expect(nqArray.length).toBe(0);
    });

    test('get() should work with single element - jquery-comparison', () => {
        const nqSingle = nqRoot.find('#item1');
        const jqSingle = jqRoot.find('#item1');

        const nqElem = nqSingle.get(0)!;
        const jqElem = jqSingle.get(0)!;

        expect(nqElem.id).toBe(jqElem.id);
        expect(nqElem.id).toBe('item1');
    });

    test('get() returned array should contain all elements in order - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.get();
        const jqArray = jqItems.get();

        const nqIds = nqArray.map((el: HtmlNode) => el.id);
        const jqIds = jqArray.map((el: HTMLElement) => el.id);

        expect(nqIds).toEqual(jqIds);
        expect(nqIds).toEqual(['item1', 'item2', 'item3']);
    });

    test('get() with multiple negative indices - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        expect(nqItems.get(-2)!.id).toBe(jqItems.get(-2)!.id);
        expect(nqItems.get(-3)!.id).toBe(jqItems.get(-3)!.id);
        expect(nqItems.get(-2)!.id).toBe('item2');
        expect(nqItems.get(-3)!.id).toBe('item1');
    });
});
