import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../utils/jquery-comparison-helpers';

describe('Performance and large document handling - Node-Query vs jQuery Comparison', () => {
    test('should handle deeply nested structures - jquery-comparison', () => {
        // Create a deeply nested HTML structure
        let nestedHtml = '<div class="level-1">';
        for (let i = 2; i <= 10; i++) {
            nestedHtml += `<div class="level-${i}">`;
        }
        nestedHtml += '<span class="deep">Deep content</span>';
        for (let i = 10; i >= 2; i--) {
            nestedHtml += '</div>';
        }
        nestedHtml += '</div>';

        const { jquery: jqNested, nodeQuery: nqNested } = createTestDom(nestedHtml);

        const nqDeepElement = nqNested.find('.deep');
        const jqDeepElement = jqNested.find('.deep');

        expect(nqDeepElement.nodes).toHaveLength(1);
        expect(jqDeepElement.length).toBe(1);

        const nqClass = nqDeepElement.attr('class');
        const jqClass = jqDeepElement.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('deep');
    });

    test('should handle many elements with same class - jquery-comparison', () => {
        // Create HTML with many elements of same class
        let manyHtml = '<div>';
        for (let i = 1; i <= 100; i++) {
            manyHtml += `<span class="item" data-id="${i}">Item ${i}</span>`;
        }
        manyHtml += '</div>';

        const { jquery: jqMany, nodeQuery: nqMany } = createTestDom(manyHtml);

        const nqItems = nqMany.find('.item');
        const jqItems = jqMany.find('.item');

        expect(nqItems.nodes).toHaveLength(100);
        expect(jqItems.length).toBe(100);

        // Test first and last elements
        const nqFirstId = nqItems.first().attr('data-id');
        const jqFirstId = jqItems.first().attr('data-id');

        expect(nqFirstId).toBe(jqFirstId);
        expect(nqFirstId).toBe('1');

        const nqLastId = nqItems.last().attr('data-id');
        const jqLastId = jqItems.last().attr('data-id');

        expect(nqLastId).toBe(jqLastId);
        expect(nqLastId).toBe('100');
    });

    test('should handle large documents efficiently - jquery-comparison', () => {
        // Create a larger document
        let largeHtml = '<div class="container">';
        for (let i = 1; i <= 500; i++) {
            largeHtml += `<div class="item" data-id="${i}"><span>Nested ${i}</span></div>`;
        }
        largeHtml += '</div>';

        const { jquery: jqLarge, nodeQuery: nqLarge } = createTestDom(largeHtml);

        const nqAllItems = nqLarge.find('.item');
        const jqAllItems = jqLarge.find('.item');

        expect(nqAllItems.nodes).toHaveLength(500);
        expect(jqAllItems.length).toBe(500);

        // Test filtering on large collection
        const nqEvenItems = nqAllItems.filter((index) => index % 2 === 0);
        const jqEvenItems = jqAllItems.filter((index) => index % 2 === 0);

        expect(nqEvenItems.nodes).toHaveLength(250);
        expect(jqEvenItems.length).toBe(250);
    });
});
