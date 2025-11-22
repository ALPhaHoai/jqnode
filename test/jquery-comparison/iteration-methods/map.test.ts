import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../utils/jquery-comparison-helpers';
import { HtmlNode } from '../../../types';

describe('map() method - Node-Query vs jQuery Comparison', () => {
    let elements, jqElements;

    beforeEach(() => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
            <div class="item" data-id="4">Fourth</div>
            <div class="item" data-id="5">Fifth</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqElements = jquery.find('.item');
        elements = nodeQuery.find('.item');
    });

    test('map() should transform elements into new values - jquery-comparison', () => {
        const nqResult = elements.map((index: number, element: HtmlNode) => {
            return `Item ${index + 1}: ${$(element).text()}`;
        });
        const jqResult = jqElements.map((index: number, element: HTMLElement) => {
            return `Item ${index + 1}: ${jQuery(element).text()}`;
        });

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);

        // Compare the mapped results
        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes[0]).toBe('Item 1: First');
        expect(nqResult.nodes[1]).toBe('Item 2: Second');
        expect(nqResult.nodes[2]).toBe('Item 3: Third');
        expect(nqResult.nodes[3]).toBe('Item 4: Fourth');
        expect(nqResult.nodes[4]).toBe('Item 5: Fifth');
    });

    test('map() should filter out null values - jquery-comparison', () => {
        const nqResult = elements.map((index: number, element: HtmlNode) => {
            return index % 2 === 0 ? $(element).text() : null;
        });
        const jqResult = jqElements.map((index: number, element: HTMLElement) => {
            return index % 2 === 0 ? jQuery(element).text() : null;
        });

        expect(nqResult.nodes).toHaveLength(3); // indices 0, 2, 4
        expect(jqResult.length).toBe(3);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes).toEqual(['First', 'Third', 'Fifth']);
    });

    test('map() should filter out undefined values - jquery-comparison', () => {
        const nqResult = elements.map((index: number, element: HtmlNode) => {
            return index % 2 === 0 ? $(element).text() : undefined;
        });
        const jqResult = jqElements.map((index: number, element: HTMLElement) => {
            return index % 2 === 0 ? jQuery(element).text() : undefined;
        });

        expect(nqResult.nodes).toHaveLength(3); // indices 0, 2, 4
        expect(jqResult.length).toBe(3);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes).toEqual(['First', 'Third', 'Fifth']);
    });

    test('map() should return empty collection when all callbacks return null - jquery-comparison', () => {
        const nqResult = elements.map(() => null);
        const jqResult = jqElements.map(() => null);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('map() should return empty collection when all callbacks return undefined - jquery-comparison', () => {
        const nqResult = elements.map(() => undefined);
        const jqResult = jqElements.map(() => undefined);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('map() should handle different return types - jquery-comparison', () => {
        const html = `
            <div class="test" data-value="10">A</div>
            <div class="test" data-value="20">B</div>
        `;
        const { jquery: jqTypes, nodeQuery: nqTypes } = createTestDom(html);
        const nqTypeElements = nqTypes.find('.test');
        const jqTypeElements = jqTypes.find('.test');

        const nqResult = nqTypeElements.map((index: number, element: HtmlNode) => {
            if (index === 0) return $(element).attr('data-value'); // string
            if (index === 1) return parseInt($(element).attr('data-value')); // number
        });
        const jqResult = jqTypeElements.map((index: number, element: HTMLElement) => {
            if (index === 0) return jQuery(element).attr('data-value'); // string
            if (index === 1) return parseInt(jQuery(element).attr('data-value')); // number
        });

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes[0]).toBe('10'); // string
        expect(nqResult.nodes[1]).toBe(20); // number
    });

    test('map() should handle object returns - jquery-comparison', () => {
        const nqResult = elements.map((index: number, element: HtmlNode) => {
            return {
                index: index,
                text: $(element).text(),
                id: $(element).attr('data-id')
            };
        });
        const jqResult = jqElements.map((index: number, element: HTMLElement) => {
            return {
                index: index,
                text: jQuery(element).text(),
                id: jQuery(element).attr('data-id')
            };
        });

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes[0]).toEqual({ index: 0, text: 'First', id: '1' });
        expect(nqResult.nodes[1]).toEqual({ index: 1, text: 'Second', id: '2' });
    });

    test('map() should handle array returns - jquery-comparison', () => {
        const nqResult = elements.map((index: number, element: HtmlNode) => {
            return [index, $(element).text()];
        });
        const jqResult = jqElements.map((index: number, element: HTMLElement) => {
            return [index, jQuery(element).text()];
        });

        expect(nqResult.nodes).toHaveLength(10); // jQuery flattens array results: [0, 'First', 1, 'Second', ...]
        expect(jqResult.length).toBe(10);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes[0]).toEqual(0);
        expect(nqResult.nodes[1]).toEqual('First');
        expect(nqResult.nodes[2]).toEqual(1);
        expect(nqResult.nodes[3]).toEqual('Second');
    });

    test('map() should work with empty collections - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.map(() => 'test');
        const jqResult = jqEmptyCollection.map(() => 'test');

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('map() should return new JQ instance - jquery-comparison', () => {
        const nqResult = elements.map(() => 'test');
        const jqResult = jqElements.map(() => 'test');

        expect(nqResult).not.toBe(elements); // Different instance
        expect(jqResult).not.toBe(jqElements); // Different instance

        expect(nqResult.nodes).not.toBe(elements.nodes); // Different node arrays
        expect(nqResult.nodes.length).toBe(5);
        expect(jqResult.length).toBe(5);

        // Check that both are JQ-like objects
        const nqConstructorName = nqResult.constructor.className || nqResult.constructor.name;
        expect(nqConstructorName).toBe('JQ');
    });

    test('map() should work with chaining - map() after filter() - jquery-comparison', () => {
        const nqFiltered = elements.filter((index: number) => index % 2 === 0); // indices 0, 2, 4
        const jqFiltered = jqElements.filter((index: number) => index % 2 === 0); // indices 0, 2, 4

        const nqResult = nqFiltered.map((index: number, element: HtmlNode) => $(element).text().toUpperCase());
        const jqResult = jqFiltered.map((index: number, element: HTMLElement) => jQuery(element).text().toUpperCase());

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes).toEqual(['FIRST', 'THIRD', 'FIFTH']);
    });

    test('map() should work with chaining - map() after slice() - jquery-comparison', () => {
        const nqSliced = elements.slice(1, 4); // Second, Third, Fourth
        const jqSliced = jqElements.slice(1, 4); // Second, Third, Fourth

        const nqResult = nqSliced.map((index: number, element: HtmlNode) => $(element).attr('data-id'));
        const jqResult = jqSliced.map((index: number, element: HTMLElement) => jQuery(element).attr('data-id'));

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes).toEqual(['2', '3', '4']);
    });

    test('map() should support chaining - map() results can be chained further - jquery-comparison', () => {
        // Note: This test is tricky because jQuery's map() returns a regular array, not a jQuery object
        // So we'll test the mapping behavior directly
        const nqMapped = elements.map((index: number, element: HtmlNode) => $(element).text());
        const jqMapped = jqElements.map((index: number, element: HTMLElement) => jQuery(element).text()).get();

        // Filter the node-query results (JQ object)
        const nqFiltered = nqMapped.filter((index: number, value: any) => value.length > 5);

        // Filter the jQuery results (plain array) manually
        const jqFiltered = jqMapped.filter((value: string) => value.length > 5);

        expect(nqFiltered.nodes).toHaveLength(2); // "Second" and "Fourth" both have length > 5
        expect(jqFiltered.length).toBe(2);

        expect(nqFiltered.nodes).toEqual(jqFiltered);
        expect(nqFiltered.nodes).toEqual(['Second', 'Fourth']);
    });

    test('map() should handle zero values (not filter them out) - jquery-comparison', () => {
        const nqResult = elements.map((index: number) => index % 2 === 0 ? index : null);
        const jqResult = jqElements.map((index: number) => index % 2 === 0 ? index : null);

        expect(nqResult.nodes).toHaveLength(3); // indices 0, 2, 4
        expect(jqResult.length).toBe(3);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes).toEqual([0, 2, 4]);
    });

    test('map() should handle empty string values (not filter them out) - jquery-comparison', () => {
        const nqResult = elements.map((index: number) => index % 2 === 0 ? $(elements.nodes[index]).text() : '');
        const jqResult = jqElements.map((index: number) => index % 2 === 0 ? jQuery(jqElements[index]).text() : '');

        expect(nqResult.nodes).toHaveLength(5); // Empty strings are not null/undefined
        expect(jqResult.length).toBe(5);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes).toEqual(['First', '', 'Third', '', 'Fifth']);
    });

    test('map() should handle false values (not filter them out) - jquery-comparison', () => {
        const nqResult = elements.map((index: number) => index % 2 === 0);
        const jqResult = jqElements.map((index: number) => index % 2 === 0);

        expect(nqResult.nodes).toHaveLength(5); // false is not null/undefined
        expect(jqResult.length).toBe(5);

        expect(nqResult.nodes).toEqual(jqResult.get());
        expect(nqResult.nodes).toEqual([true, false, true, false, true]);
    });
});
