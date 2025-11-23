import $ from '../../index';
import jQuery from 'jquery';
import {
    createTestDom,
    compareResults,
    extractTextContent,
} from '../utils/jquery-comparison-helpers';

describe('JQ Factory Function - Node-Query vs jQuery Comparison', () => {
    test('should create JQ instance from HTML string - identical behavior', () => {
        const testHtml = '<div>test content</div>';

        // Create instances with both libraries using identical input
        const nqResult = $(testHtml);
        const jqResult = jQuery(testHtml);

        // Both should create valid instances with same length
        expect(nqResult.length).toBe(jqResult.length);
        expect(nqResult.length).toBe(1);

        // Compare text content - both should extract "test content"
        const nqText = extractTextContent(nqResult);
        const jqText = extractTextContent(jqResult);
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('test content');

        // Verify element tag names match
        expect(nqResult.nodes[0].tagName && nqResult.nodes[0].tagName.toLowerCase()).toBe(
            jqResult[0].tagName.toLowerCase(),
        );
        expect(nqResult.nodes[0].tagName && nqResult.nodes[0].tagName.toLowerCase()).toBe('div');
    });

    test('should create JQ instance from nodes array - node-query specific feature', () => {
        const nodes = [{ type: 'text', value: 'test' }];
        const nqResult = $(nodes);

        // Node-query specific feature - jQuery doesn't support node arrays directly
        // Just verify node-query handles it correctly
        expect(nqResult.nodes).toEqual(nodes);
        expect(nqResult.length).toBe(1);
    });

    test('should handle empty input - identical behavior', () => {
        const nqResult = $();
        const jqResult = jQuery();

        // Both should have length 0
        expect(nqResult.length).toBe(jqResult.length);
        expect(nqResult.length).toBe(0);

        // Node-query specific - check nodes array is empty
        expect(nqResult.nodes).toHaveLength(0);
    });

    test('should create JQ instance from DOM element - identical behavior', () => {
        // Create a DOM element
        const div = document.createElement('div');
        div.textContent = 'DOM content';

        const nqResult = $(div);
        const jqResult = jQuery(div);

        // Both should wrap the same DOM element
        expect(nqResult.length).toBe(jqResult.length);
        expect(nqResult.length).toBe(1);

        // Text content should match
        const nqText = extractTextContent(nqResult);
        const jqText = extractTextContent(jqResult);
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('DOM content');
    });

    test('should create JQ instance from multiple DOM elements - identical behavior', () => {
        // Create multiple DOM elements
        const div1 = document.createElement('div');
        div1.textContent = 'First';
        const div2 = document.createElement('div');
        div2.textContent = 'Second';

        const nqResult = $([div1, div2]);
        const jqResult = jQuery([div1, div2]);

        // Both should have length 2
        expect(nqResult.length).toBe(jqResult.length);
        expect(nqResult.length).toBe(2);

        // Text content should match for each element
        expect(extractTextContent($(div1))).toBe(extractTextContent(jQuery(div1)));
        expect(extractTextContent($(div2))).toBe(extractTextContent(jQuery(div2)));
    });

    describe('$.each() static method - identical behavior', () => {
        test('$.each() should iterate over arrays - identical results', () => {
            const array = [1, 2, 3, 4];
            const nqResult = [];
            const jqResult = [];
            const nqIndices = [];
            const jqIndices = [];

            // Node-query each
            $.each(array, function (index: number, value: number) {
                nqResult.push(value);
                nqIndices.push(index);
            });

            // jQuery each - identical operation
            jQuery.each(array, function (index: number, value: number) {
                jqResult.push(value);
                jqIndices.push(index);
            });

            // Results should be identical
            expect(nqResult).toEqual(jqResult);
            expect(nqIndices).toEqual(jqIndices);
            expect(nqResult).toEqual([1, 2, 3, 4]);
            expect(nqIndices).toEqual([0, 1, 2, 3]);
        });

        test('$.each() should iterate over objects - identical results', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const nqKeys = [];
            const jqKeys = [];
            const nqValues = [];
            const jqValues = [];

            // Node-query each
            $.each(obj, function (key: string, value: number) {
                nqKeys.push(key);
                nqValues.push(value);
            });

            // jQuery each - identical operation
            jQuery.each(obj, function (key: string, value: number) {
                jqKeys.push(key);
                jqValues.push(value);
            });

            // Sort for consistent comparison since object iteration order can vary
            const sortedNqKeys = nqKeys.sort();
            const sortedJqKeys = jqKeys.sort();
            expect(sortedNqKeys).toEqual(sortedJqKeys);

            const sortedNqValues = nqValues.sort();
            const sortedJqValues = jqValues.sort();
            expect(sortedNqValues).toEqual(sortedJqValues);

            expect(sortedNqKeys).toEqual(['a', 'b', 'c']);
            expect(sortedNqValues).toEqual([1, 2, 3]);
        });

        test('$.each() should break iteration when callback returns false - identical behavior', () => {
            const array = [1, 2, 3, 4];
            const nqResult = [];
            const jqResult = [];

            // Node-query each with break
            $.each(array, function (index: number, value: number) {
                nqResult.push(value);
                if (index === 1) {
                    return false; // Break after second element
                }
            });

            // jQuery each with break - identical operation
            jQuery.each(array, function (index: number, value: number) {
                jqResult.push(value);
                if (index === 1) {
                    return false; // Break after second element
                }
            });

            expect(nqResult).toEqual(jqResult);
            expect(nqResult).toEqual([1, 2]); // Should only get first two elements
        });

        test('$.each() should return the original collection - identical return values', () => {
            const array = [1, 2, 3];
            const nqResult = $.each(array, function () {
                // Do nothing
            });

            const jqResult = jQuery.each(array, function () {
                // Do nothing
            });

            expect(nqResult).toBe(array);
            expect(jqResult).toBe(array);
        });

        test('$.each() should handle empty arrays - identical behavior', () => {
            const array: number[] = [];
            let nqCount = 0;
            let jqCount = 0;

            $.each(array, function () {
                nqCount++;
            });

            jQuery.each(array, function () {
                jqCount++;
            });

            expect(nqCount).toBe(jqCount);
            expect(nqCount).toBe(0);
        });

        test('$.each() should handle empty objects - identical behavior', () => {
            const obj = {};
            let nqCount = 0;
            let jqCount = 0;

            $.each(obj, function () {
                nqCount++;
            });

            jQuery.each(obj, function () {
                jqCount++;
            });

            expect(nqCount).toBe(jqCount);
            expect(nqCount).toBe(0);
        });

        test('$.each() should handle null/undefined gracefully - identical behavior', () => {
            let nqCount = 0;
            let jqCount = 0;

            $.each(null, function () {
                nqCount++;
            });

            $.each(undefined, function () {
                nqCount++;
            });

            jQuery.each(null, function () {
                jqCount++;
            });

            jQuery.each(undefined, function () {
                jqCount++;
            });

            expect(nqCount).toBe(jqCount);
            expect(nqCount).toBe(0);
        });

        test('$.each() should handle nested arrays - identical behavior', () => {
            const nested = [
                [1, 2],
                [3, 4],
            ];
            const nqFlat: number[] = [];
            const jqFlat: number[] = [];

            $.each(nested, function (index: number, subArray: number[]) {
                $.each(subArray, function (subIndex: number, value: number) {
                    nqFlat.push(value);
                });
            });

            jQuery.each(nested, function (index: number, subArray: number[]) {
                jQuery.each(subArray, function (subIndex: number, value: number) {
                    jqFlat.push(value);
                });
            });

            expect(nqFlat).toEqual(jqFlat);
            expect(nqFlat).toEqual([1, 2, 3, 4]);
        });
    });
});
