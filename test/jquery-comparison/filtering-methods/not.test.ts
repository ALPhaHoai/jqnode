import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JqElement } from '../../../types';

import JQ from '../../../jq';

describe('not() method - Node-Query vs jQuery Comparison', () => {
    let elements: JQ, jqElements: JQuery<HTMLElement>;

    beforeEach(() => {
        const html = `
            <div class="item active">Active Item 1</div>
            <div class="item">Inactive Item</div>
            <div class="item active">Active Item 2</div>
            <div class="item">Inactive Item 2</div>
            <div class="item active special">Active Special Item</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqElements = jquery.find('.item');
        elements = nodeQuery.find('.item');
    });

    test('not() should exclude elements matching CSS selector - jquery-comparison', () => {
        const nqResult = elements.not('.active');
        const jqResult = jqElements.not('.active');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Inactive ItemInactive Item 2');

        // Verify all remaining elements are inactive
        nqResult.each((index: number, element: JqElement) => {
            const nqElement = $(element);
            const jqElement = jqResult.eq(index);
            expect(nqElement.hasClass('active')).toBe(false);
            expect(jqElement.hasClass('active')).toBe(false);
        });
    });

    test('not() should exclude elements matching complex CSS selector - jquery-comparison', () => {
        const nqResult = elements.not('.active.special');
        const jqResult = jqElements.not('.active.special');

        expect(nqResult.nodes).toHaveLength(4);
        expect(jqResult.length).toBe(4);

        // Verify no elements have the special class
        nqResult.each((index: number, element: JqElement) => {
            const nqElement = $(element);
            expect(nqElement.hasClass('special')).toBe(false);
        });

        jqResult.each((index: number, element: HTMLElement) => {
            const jqElement = jQuery(element);
            expect(jqElement.hasClass('special')).toBe(false);
        });
    });

    test('not() should exclude elements using function that returns true/false - jquery-comparison', () => {
        const nqResult = elements.not(function (index: number, _element: JqElement) {
            return index % 2 === 0; // Exclude even indices (0, 2, 4)
        });
        const jqResult = jqElements.not(function (index: number, _element: HTMLElement) {
            return index % 2 === 0; // Exclude even indices (0, 2, 4)
        });

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Inactive ItemInactive Item 2');
    });

    test('not() should return no elements when function always returns true - jquery-comparison', () => {
        const nqResult = elements.not(() => true);
        const jqResult = jqElements.not(() => true);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('not() should return all elements when function always returns false - jquery-comparison', () => {
        const nqResult = elements.not(() => false);
        const jqResult = jqElements.not(() => false);

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);
    });

    test('not() should return all elements when selector matches nothing - jquery-comparison', () => {
        const nqResult = elements.not('.nonexistent');
        const jqResult = jqElements.not('.nonexistent');

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);
    });

    test('not() should work with tag selectors - jquery-comparison', () => {
        const mixedHtml = `
            <div class="item">Div 1</div>
            <span class="item">Span 1</span>
            <div class="item">Div 2</div>
            <span class="item">Span 2</span>
        `;
        const { jquery: jqMixed, nodeQuery: nqMixed } = createTestDom(mixedHtml);
        const nqMixedElements = nqMixed.find('.item');
        const jqMixedElements = jqMixed.find('.item');

        const nqResult = nqMixedElements.not('div');
        const jqResult = jqMixedElements.not('div');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Span 1Span 2');

        // Verify all remaining elements are spans
        nqResult.each((index: number, element: JqElement) => {
            expect(element.tagName && element.tagName.toLowerCase()).toBe('span');
        });

        jqResult.each((index: number, element: HTMLElement) => {
            expect(element.tagName.toLowerCase()).toBe('span');
        });
    });

    test('not() should maintain element order - jquery-comparison', () => {
        const nqResult = elements.not('.active');
        const jqResult = jqElements.not('.active');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        // Check that the first inactive element comes first
        const nqFirstText = nqResult.first().text();
        const jqFirstText = jqResult.first().text();

        expect(nqFirstText).toBe(jqFirstText);
        expect(nqFirstText).toBe('Inactive Item');
    });

    test('not() should work on empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.not('.anything');
        const jqResult = jqEmptyCollection.not('.anything');

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('not() should handle invalid selector gracefully - jquery-comparison', () => {
        const nqResult = elements.not('');
        const jqResult = jqElements.not('');

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);
    });

    test('not() should handle invalid function gracefully - jquery-comparison', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nqResult = elements.not(null as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jqResult = jqElements.not(null as any);

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);
    });

    test('not() should allow chaining with other methods - jquery-comparison', () => {
        const nqResult = elements.not('.active').first();
        const jqResult = jqElements.not('.active').first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Inactive Item');
    });

    test('not() should work as inverse of filter() - jquery-comparison', () => {
        const nqFiltered = elements.filter('.active');
        const jqFiltered = jqElements.filter('.active');
        const nqNotFiltered = elements.not('.active');
        const jqNotFiltered = jqElements.not('.active');

        expect(nqFiltered.nodes.length + nqNotFiltered.nodes.length).toBe(elements.nodes.length);
        expect(jqFiltered.length + jqNotFiltered.length).toBe(jqElements.length);
    });

    test('not() should work with attribute selectors - jquery-comparison', () => {
        const html = `
            <div class="item" data-id="1">One</div>
            <div class="item" data-id="2" data-type="special">Two Special</div>
            <div class="item" data-id="3">Three</div>
            <div class="item" data-category="featured">Featured</div>
        `;
        const { jquery: jqAttr, nodeQuery: nqAttr } = createTestDom(html);
        const nqAttrElements = nqAttr.find('.item');
        const jqAttrElements = jqAttr.find('.item');

        const nqResult1 = nqAttrElements.not('[data-id]');
        const jqResult1 = jqAttrElements.not('[data-id]');

        expect(nqResult1.nodes).toHaveLength(1);
        expect(jqResult1.length).toBe(1);

        const nqText1 = nqResult1.text();
        const jqText1 = jqResult1.text();

        expect(nqText1).toBe(jqText1);
        expect(nqText1).toBe('Featured');

        const nqResult2 = nqAttrElements.not('[data-type="special"]');
        const jqResult2 = jqAttrElements.not('[data-type="special"]');

        expect(nqResult2.nodes).toHaveLength(3);
        expect(jqResult2.length).toBe(3);
    });

    test('not() should work with universal selector - jquery-comparison', () => {
        const html = `<div class="item">Test</div>`;
        const { jquery: jqUni, nodeQuery: nqUni } = createTestDom(html);
        const nqUniElements = nqUni.find('.item');
        const jqUniElements = jqUni.find('.item');

        const nqResult = nqUniElements.not('*');
        const jqResult = jqUniElements.not('*');

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('not() should work with empty string selector - jquery-comparison', () => {
        const nqResult = elements.not('');
        const jqResult = jqElements.not('');

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);
    });

    test('not() should work with multiple selectors separated by commas - jquery-comparison', () => {
        const html = `
            <div class="item type-a">Type A</div>
            <div class="item type-b">Type B</div>
            <div class="item type-c">Type C</div>
            <div class="item">Normal</div>
        `;
        const { jquery: jqMulti, nodeQuery: nqMulti } = createTestDom(html);
        const nqMultiElements = nqMulti.find('.item');
        const jqMultiElements = jqMulti.find('.item');

        const nqResult = nqMultiElements.not('.type-a, .type-c');
        const jqResult = jqMultiElements.not('.type-a, .type-c');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Type BNormal');
    });

    test('not() should return new collection instance - jquery-comparison', () => {
        const nqResult = elements.not('.active');
        const jqResult = jqElements.not('.active');

        expect(nqResult).not.toBe(elements);
        expect(jqResult).not.toBe(jqElements);

        expect(nqResult.nodes).not.toBe(elements.nodes);
        expect(nqResult.nodes.length).toBe(2);
        expect(jqResult.length).toBe(2);
    });
});
