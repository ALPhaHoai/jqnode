import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { HtmlNode, JQ } from '../../../types';

describe('toArray() method - Node-Query vs jQuery Comparison', () => {
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

    test('toArray() should return plain JavaScript array - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.toArray();
        const jqArray = jqItems.toArray();

        expect(Array.isArray(nqArray)).toBe(true);
        expect(Array.isArray(jqArray)).toBe(true);
    });

    test('toArray() should return array with correct length - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.toArray();
        const jqArray = jqItems.toArray();

        expect(nqArray.length).toBe(jqArray.length);
        expect(nqArray.length).toBe(3);
    });

    test('toArray() should return array of DOM elements - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.toArray();
        const jqArray = jqItems.toArray();

        // Each element should be a DOM node
        nqArray.forEach((elem: HtmlNode, index: number) => {
            expect(elem.tagName).toBe(jqArray[index].tagName);
            expect(elem.id).toBe(jqArray[index].id);
        });
    });

    test('toArray() should return empty array for empty collection - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqArray = nqEmpty.toArray();
        const jqArray = jqEmpty.toArray();

        expect(nqArray).toEqual(jqArray);
        expect(nqArray.length).toBe(0);
    });

    test('toArray() elements should not have jQuery/JQ methods - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.toArray();
        const jqArray = jqItems.toArray();

        // Elements should be plain DOM nodes
        expect(typeof nqArray[0].find).toBe('undefined');
        expect(typeof jqArray[0].find).toBe('undefined');
    });

    test('toArray() should allow native array methods - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.toArray();
        const jqArray = jqItems.toArray();

        // Should support array methods like map
        const nqIds = nqArray.map((el: HtmlNode) => el.id);
        const jqIds = jqArray.map((el: HTMLElement) => el.id);

        expect(nqIds).toEqual(jqIds);
        expect(nqIds).toEqual(['item1', 'item2', 'item3']);
    });

    test('toArray() should preserve element order - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.toArray();
        const jqArray = jqItems.toArray();

        for (let i = 0; i < nqArray.length; i++) {
            expect(nqArray[i].id).toBe(jqArray[i].id);
        }
    });

    test('toArray() should work with single element - jquery-comparison', () => {
        const nqSingle = nqRoot.find('#item1');
        const jqSingle = jqRoot.find('#item1');

        const nqArray = nqSingle.toArray();
        const jqArray = jqSingle.toArray();

        expect(nqArray.length).toBe(1);
        expect(jqArray.length).toBe(1);
        expect(nqArray[0].id).toBe('item1');
    });

    test('toArray() should be equivalent to get() without arguments - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqToArray = nqItems.toArray();
        const nqGet = nqItems.get();

        const jqToArray = jqItems.toArray();
        const jqGet = jqItems.get();

        expect(nqToArray).toEqual(nqGet);
        expect(jqToArray).toEqual(jqGet);
    });

    test('toArray() should allow filtering with native methods - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.toArray();
        const jqArray = jqItems.toArray();

        const nqFiltered = nqArray.filter((el: HtmlNode) => el.id === 'item2');
        const jqFiltered = jqArray.filter((el: HTMLElement) => el.id === 'item2');

        expect(nqFiltered.length).toBe(jqFiltered.length);
        expect(nqFiltered.length).toBe(1);
        expect(nqFiltered[0].id).toBe('item2');
    });

    test('toArray() result should be mutable - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqArray = nqItems.toArray();
        const jqArray = jqItems.toArray();

        // Should be able to modify the array
        nqArray.push(null);
        jqArray.push(null);

        expect(nqArray.length).toBe(4);
        expect(jqArray.length).toBe(4);
    });
});
