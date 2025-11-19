const $ = require('../../index');

describe('JQ Factory Function', () => {
    test('should create JQ instance from HTML string', () => {
        const html = '<div>test content</div>';
        const result = $(html);
        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('length');
        expect(result.length).toBe(1);

        // Check if this is a node-query result (has nodes property)
        if (result.nodes) {
            expect(Array.isArray(result.nodes)).toBe(true);
            expect(result.nodes).toHaveLength(1);
            const firstNodeType = result.nodes[0].type;
            expect(firstNodeType).toBe('element');
            const firstNodeTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
            expect(firstNodeTag).toBe('div');
            // Check that the element has text content
            expect(result.nodes[0].children).toHaveLength(1);
            expect(result.nodes[0].children[0].type).toBe('text');
            expect(result.nodes[0].children[0].value).toBe('test content');
        } else {
            // jQuery result - check using jQuery API
            expect(result[0]).toBeDefined();
            expect(result[0].tagName.toLowerCase()).toBe('div');
            expect(result.text()).toBe('test content');
        }
    });

    test('should create JQ instance from nodes array', () => {
        const nodes = [{type: 'text', value: 'test'}];
        const result = $(nodes);

        // This test is only valid for node-query, not jQuery
        if (result.nodes) {
            expect(result.nodes).toEqual(nodes);
        } else {
            // Skip this test for jQuery - it doesn't support node arrays
            console.log('Skipping node array test for jQuery');
        }
    });

    test('should handle empty input', () => {
        const result = $();

        // Check length for both libraries
        expect(result.length).toBe(0);

        // Node-query specific check
        if (result.nodes) {
            expect(result.nodes).toHaveLength(0);
        }
    });

    describe('$.each() static method', () => {
        test('$.each() should iterate over arrays', () => {
            const array = [1, 2, 3, 4];
            let result = [];
            let indices = [];

            $.each(array, function (index, value) {
                result.push(value);
                indices.push(index);
            });

            expect(result).toEqual([1, 2, 3, 4]);
            expect(indices).toEqual([0, 1, 2, 3]);
        });

        test('$.each() should iterate over objects', () => {
            const obj = {a: 1, b: 2, c: 3};
            let keys = [];
            let values = [];

            $.each(obj, function (key, value) {
                keys.push(key);
                values.push(value);
            });

            const sortedKeys = keys.sort();
            expect(sortedKeys).toEqual(['a', 'b', 'c']);

            const sortedValues = values.sort();
            expect(sortedValues).toEqual([1, 2, 3]);
        });

        test('$.each() should break iteration when callback returns false', () => {
            const array = [1, 2, 3, 4];
            let result = [];

            $.each(array, function (index, value) {
                result.push(value);
                if (index === 1) {
                    return false; // Break after second element
                }
            });

            expect(result).toEqual([1, 2]); // Should only get first two elements
        });

        test('$.each() should return the original collection', () => {
            const array = [1, 2, 3];
            const result = $.each(array, function () {
                // Do nothing
            });

            expect(result).toBe(array);
        });

        test('$.each() should handle empty arrays', () => {
            const array = [];
            let count = 0;

            $.each(array, function () {
                count++;
            });

            expect(count).toBe(0);
        });

        test('$.each() should handle empty objects', () => {
            const obj = {};
            let count = 0;

            $.each(obj, function () {
                count++;
            });

            expect(count).toBe(0);
        });

        test('$.each() should handle null/undefined gracefully', () => {
            let count = 0;

            $.each(null, function () {
                count++;
            });

            $.each(undefined, function () {
                count++;
            });

            expect(count).toBe(0);
        });
    });
});
