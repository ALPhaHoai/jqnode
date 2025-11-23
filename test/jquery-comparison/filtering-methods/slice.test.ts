import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { HtmlNode, JQ } from '../../../types';

describe('slice() method - Node-Query vs jQuery Comparison', () => {
    let elements: JQ, jqElements: JQuery<HTMLElement>;

    beforeEach(() => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
            <div class="item">Fourth</div>
            <div class="item">Fifth</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqElements = jquery.find('.item');
        elements = nodeQuery.find('.item');
    });

    test('slice() should slice from start index to end of array - jquery-comparison', () => {
        const nqResult = elements.slice(2);
        const jqResult = jqElements.slice(2);

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('ThirdFourthFifth');
    });

    test('slice() should slice from start to end index (exclusive) - jquery-comparison', () => {
        const nqResult = elements.slice(1, 4);
        const jqResult = jqElements.slice(1, 4);

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('SecondThirdFourth');
    });

    test('slice() should slice from index 0 - jquery-comparison', () => {
        const nqResult = elements.slice(0, 2);
        const jqResult = jqElements.slice(0, 2);

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('FirstSecond');
    });

    test('slice() should slice single element - jquery-comparison', () => {
        const nqResult = elements.slice(2, 3);
        const jqResult = jqElements.slice(2, 3);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third');
    });

    test('slice() should handle negative start indices - jquery-comparison', () => {
        const nqResult = elements.slice(-2);
        const jqResult = jqElements.slice(-2);

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('FourthFifth');
    });

    test('slice() should handle negative end indices - jquery-comparison', () => {
        const nqResult = elements.slice(1, -1);
        const jqResult = jqElements.slice(1, -1);

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('SecondThirdFourth');
    });

    test('slice() should handle both negative indices - jquery-comparison', () => {
        const nqResult = elements.slice(-3, -1);
        const jqResult = jqElements.slice(-3, -1);

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('ThirdFourth');
    });

    test('slice() should return empty result when start >= end - jquery-comparison', () => {
        const nqResult = elements.slice(3, 3);
        const jqResult = jqElements.slice(3, 3);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('slice() should return empty result when start is out of bounds - jquery-comparison', () => {
        const nqResult = elements.slice(10);
        const jqResult = jqElements.slice(10);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('slice() should return all elements when slicing beyond bounds - jquery-comparison', () => {
        const nqResult = elements.slice(0, 10);
        const jqResult = jqElements.slice(0, 10);

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('FirstSecondThirdFourthFifth');
    });

    test('slice() should work with empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.slice(0, 2);
        const jqResult = jqEmptyCollection.slice(0, 2);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('slice() should maintain element order - jquery-comparison', () => {
        const nqResult = elements.slice(1, 4);
        const jqResult = jqElements.slice(1, 4);

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        // Verify order is maintained
        const nqTexts = [];
        const jqTexts = [];

        nqResult.each((index: number, element: HtmlNode) => {
            nqTexts.push($(element).text());
        });

        jqResult.each((index: number, element: HTMLElement) => {
            jqTexts.push(jQuery(element).text());
        });

        expect(nqTexts).toEqual(jqTexts);
        expect(nqTexts).toEqual(['Second', 'Third', 'Fourth']);
    });

    test('slice() should allow chaining with other methods - jquery-comparison', () => {
        const nqResult = elements.slice(1, 4).first();
        const jqResult = jqElements.slice(1, 4).first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second');
    });

    test('slice() should handle undefined end parameter - jquery-comparison', () => {
        const nqResult = elements.slice(2, undefined);
        const jqResult = jqElements.slice(2, undefined);

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('ThirdFourthFifth');
    });

    test('slice() should handle zero start index - jquery-comparison', () => {
        const nqResult = elements.slice(0);
        const jqResult = jqElements.slice(0);

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('FirstSecondThirdFourthFifth');
    });

    test('slice() should handle very large start indices - jquery-comparison', () => {
        const nqResult = elements.slice(100);
        const jqResult = jqElements.slice(100);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('slice() should handle very large end indices - jquery-comparison', () => {
        const nqResult = elements.slice(0, 100);
        const jqResult = jqElements.slice(0, 100);

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);
    });

    test('slice() should return new collection instance - jquery-comparison', () => {
        const nqResult = elements.slice(1, 3);
        const jqResult = jqElements.slice(1, 3);

        expect(nqResult).not.toBe(elements);
        expect(jqResult).not.toBe(jqElements);

        expect(nqResult.nodes).not.toBe(elements.nodes);
        expect(nqResult.nodes.length).toBe(2);
        expect(jqResult.length).toBe(2);

        // Original collection should remain unchanged
        expect(elements.nodes).toHaveLength(5);
        expect(jqElements.length).toBe(5);
    });

    test('slice() should preserve element attributes - jquery-comparison', () => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
        `;
        const { jquery: jqAttr, nodeQuery: nqAttr } = createTestDom(html);
        const nqAttrElements = nqAttr.find('.item');
        const jqAttrElements = jqAttr.find('.item');

        const nqResult = nqAttrElements.slice(1, 3);
        const jqResult = jqAttrElements.slice(1, 3);

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        // Check that attributes are preserved
        const nqFirstDataId = nqResult.first().attr('data-id');
        const jqFirstDataId = jqResult.first().attr('data-id');

        expect(nqFirstDataId).toBe(jqFirstDataId);
        expect(nqFirstDataId).toBe('2');

        const nqLastDataId = nqResult.last().attr('data-id');
        const jqLastDataId = jqResult.last().attr('data-id');

        expect(nqLastDataId).toBe(jqLastDataId);
        expect(nqLastDataId).toBe('3');
    });
});
