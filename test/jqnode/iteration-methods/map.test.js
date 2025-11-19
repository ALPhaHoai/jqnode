const $ = require('../../../index');

describe('map() method', () => {
    let elements;

    beforeEach(() => {
        // Clear global root nodes registry for test isolation
        $.clearRootNodesRegistry();

        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
            <div class="item" data-id="4">Fourth</div>
            <div class="item" data-id="5">Fifth</div>
        `;
        elements = $(html).find('.item');
    });

    test('map() should transform elements into new values', () => {
        const result = elements.map((index, element) => {
            return `Item ${index + 1}: ${$(element).text()}`;
        });

        expect(result.nodes).toHaveLength(5);
        expect(result.nodes[0]).toBe('Item 1: First');
        expect(result.nodes[1]).toBe('Item 2: Second');
        expect(result.nodes[2]).toBe('Item 3: Third');
        expect(result.nodes[3]).toBe('Item 4: Fourth');
        expect(result.nodes[4]).toBe('Item 5: Fifth');
    });

    test('map() should filter out null values', () => {
        const result = elements.map((index, element) => {
            return index % 2 === 0 ? $(element).text() : null;
        });

        expect(result.nodes).toHaveLength(3); // indices 0, 2, 4
        expect(result.nodes).toEqual(['First', 'Third', 'Fifth']);
    });

    test('map() should filter out undefined values', () => {
        const result = elements.map((index, element) => {
            return index % 2 === 0 ? $(element).text() : undefined;
        });

        expect(result.nodes).toHaveLength(3); // indices 0, 2, 4
        expect(result.nodes).toEqual(['First', 'Third', 'Fifth']);
    });

    test('map() should return empty collection when all callbacks return null', () => {
        const result = elements.map(() => null);

        expect(result.nodes).toHaveLength(0);
    });

    test('map() should return empty collection when all callbacks return undefined', () => {
        const result = elements.map(() => undefined);

        expect(result.nodes).toHaveLength(0);
    });

    test('map() should handle different return types', () => {
        const html = `
            <div class="test" data-value="10">A</div>
            <div class="test" data-value="20">B</div>
        `;
        const elements = $(html).find('.test');

        const result = elements.map((index, element) => {
            if (index === 0) return $(element).attr('data-value'); // string
            if (index === 1) return parseInt($(element).attr('data-value')); // number
        });

        expect(result.nodes).toHaveLength(2);
        expect(result.nodes[0]).toBe('10'); // string
        expect(result.nodes[1]).toBe(20); // number
    });

    test('map() should handle object returns', () => {
        const result = elements.map((index, element) => {
            return {
                index: index,
                text: $(element).text(),
                id: $(element).attr('data-id')
            };
        });

        expect(result.nodes).toHaveLength(5);
        expect(result.nodes[0]).toEqual({index: 0, text: 'First', id: '1'});
        expect(result.nodes[1]).toEqual({index: 1, text: 'Second', id: '2'});
    });

    test('map() should handle array returns', () => {
        const result = elements.map((index, element) => {
            return [index, $(element).text()];
        });

        expect(result.nodes).toHaveLength(10); // jQuery flattens array results: [0, 'First', 1, 'Second', ...]
        expect(result.nodes[0]).toEqual(0);
        expect(result.nodes[1]).toEqual('First');
        expect(result.nodes[2]).toEqual(1);
        expect(result.nodes[3]).toEqual('Second');
    });

    test('map() should work with empty collections', () => {
        const emptyCollection = $('.nonexistent');
        const result = emptyCollection.map(() => 'test');

        expect(result.nodes).toHaveLength(0);
    });

    test('map() should provide correct arguments to callback', () => {
        let receivedArgs = [];

        elements.map((index, element) => {
            receivedArgs.push([index, element]);
            return index;
        });

        expect(receivedArgs).toHaveLength(5);
        const firstCallIndex = receivedArgs[0][0];
        expect(firstCallIndex).toBe(0); // index
        const firstCallElement = receivedArgs[0][1];
        expect(firstCallElement).toBe(elements.nodes[0]); // element
        const secondCallIndex = receivedArgs[1][0];
        expect(secondCallIndex).toBe(1); // index
        const secondCallElement = receivedArgs[1][1];
        expect(secondCallElement).toBe(elements.nodes[1]); // element
    });

    test('map() should set correct "this" context in callback', () => {
        let thisValues = [];

        elements.map(function (index, element) {
            thisValues.push(this);
            return index;
        });

        expect(thisValues).toHaveLength(5);
        const firstThisValue = thisValues[0];
        expect(firstThisValue).toBe(elements.nodes[0]);
        const secondThisValue = thisValues[1];
        expect(secondThisValue).toBe(elements.nodes[1]);
    });

    test('map() should handle errors in callback gracefully', () => {
        const result = elements.map((index, element) => {
            if (index === 2) {
                throw new Error('Test error');
            }
            return $(element).text();
        });

        // Should skip the element that threw an error
        expect(result.nodes).toHaveLength(4);
        expect(result.nodes).toEqual(['First', 'Second', 'Fourth', 'Fifth']);
    });

    test('map() should return new JQ instance', () => {
        const result = elements.map(() => 'test');

        expect(result).not.toBe(elements); // Different instance
        expect(result.nodes).not.toBe(elements.nodes); // Different node arrays
        const constructorName = result.constructor.className || result.constructor.name;
        expect(constructorName).toBe('JQ');
    });

    test('map() should work with chaining - map() after filter()', () => {
        const filtered = elements.filter((index) => index % 2 === 0); // indices 0, 2, 4
        const result = filtered.map((index, element) => $(element).text().toUpperCase());

        expect(result.nodes).toHaveLength(3);
        expect(result.nodes).toEqual(['FIRST', 'THIRD', 'FIFTH']);
    });

    test('map() should work with chaining - map() after slice()', () => {
        const sliced = elements.slice(1, 4); // Second, Third, Fourth
        const result = sliced.map((index, element) => $(element).attr('data-id'));

        expect(result.nodes).toHaveLength(3);
        expect(result.nodes).toEqual(['2', '3', '4']);
    });

    test('map() should support chaining - map() results can be chained further', () => {
        // Filter elements first, then map to get their text
        const longTexts = elements.filter((index, element) => {
            return $(element).text().length > 5;
        }).map((index, element) => {
            return $(element).text();
        });

        expect(longTexts.nodes).toHaveLength(2); // "Second" and "Fourth" both have length > 5
        expect(longTexts.nodes).toEqual(['Second', 'Fourth']);
    });

    test('map() should handle zero values (not filter them out)', () => {
        const result = elements.map((index) => index % 2 === 0 ? index : null);

        expect(result.nodes).toHaveLength(3); // indices 0, 2, 4
        expect(result.nodes).toEqual([0, 2, 4]);
    });

    test('map() should handle empty string values (not filter them out)', () => {
        const result = elements.map((index) => index % 2 === 0 ? $(elements.nodes[index]).text() : '');

        expect(result.nodes).toHaveLength(5); // Empty strings are not null/undefined
        expect(result.nodes).toEqual(['First', '', 'Third', '', 'Fifth']);
    });

    test('map() should handle false values (not filter them out)', () => {
        const result = elements.map((index) => index % 2 === 0);

        expect(result.nodes).toHaveLength(5); // false is not null/undefined
        expect(result.nodes).toEqual([true, false, true, false, true]);
    });

    test('map() should work with different element types', () => {
        const html = `
            <div class="mixed">Div content</div>
            <span class="mixed">Span content</span>
            <p class="mixed">Paragraph content</p>
        `;
        const mixedElements = $(html).find('.mixed');

        const result = mixedElements.map((index, element) => ({
            tagName: element.tagName && element.tagName.toLowerCase(),
            content: $(element).text()
        }));

        expect(result.nodes).toHaveLength(3);
        expect(result.nodes[0]).toEqual({tagName: 'div', content: 'Div content'});
        expect(result.nodes[1]).toEqual({tagName: 'span', content: 'Span content'});
        expect(result.nodes[2]).toEqual({tagName: 'p', content: 'Paragraph content'});
    });

    test('map() should work with single element collection', () => {
        const single = $(`<div>Single element</div>`);
        const result = single.map((index, element) => $(element).text());

        expect(result.nodes).toHaveLength(1);
        expect(result.nodes[0]).toBe('Single element');
    });

    test('map() should work with large collections', () => {
        const html = Array.from({length: 100}, (_, i) =>
            `<div class="item">Item ${i + 1}</div>`
        ).join('');
        const largeCollection = $(html).find('.item');


        const result = largeCollection.map((index) => index * 2);

        expect(result.nodes).toHaveLength(100);
        expect(result.nodes[0]).toBe(0);
        expect(result.nodes[50]).toBe(100);
        expect(result.nodes[99]).toBe(198);
    });

    test('map() should handle callback that returns the element itself', () => {
        const result = elements.map((index, element) => element);

        expect(result.nodes).toHaveLength(5);
        expect(result.nodes[0]).toBe(elements.nodes[0]);
        expect(result.nodes[1]).toBe(elements.nodes[1]);
    });

    test('map() should handle callback that returns another JQ object', () => {
        const result = elements.map((index, element) => $(element));

        expect(result.nodes).toHaveLength(5);
        expect(result.nodes[0]).toBeInstanceOf($().constructor);
        const firstMappedElement = result.nodes[0].nodes[0];
        expect(firstMappedElement).toBe(elements.nodes[0]);
    });

    test('map() should preserve order of results', () => {
        const result = elements.map((index) => index);

        expect(result.nodes).toEqual([0, 1, 2, 3, 4]);
    });

    test('map() should handle complex transformations', () => {
        const html = `
            <div class="product" data-price="10.99" data-category="electronics">Laptop</div>
            <div class="product" data-price="25.50" data-category="books">Book</div>
            <div class="product" data-price="5.99" data-category="electronics">Mouse</div>
        `;
        const products = $(html).find('.product');

        const result = products.map((index, element) => {
            const $el = $(element);
            return {
                name: $el.text(),
                price: parseFloat($el.attr('data-price')),
                category: $el.attr('data-category'),
                expensive: parseFloat($el.attr('data-price')) > 15
            };
        });

        expect(result.nodes).toHaveLength(3);
        expect(result.nodes[0]).toEqual({
            name: 'Laptop',
            price: 10.99,
            category: 'electronics',
            expensive: false
        });
        expect(result.nodes[1]).toEqual({
            name: 'Book',
            price: 25.50,
            category: 'books',
            expensive: true
        });
    });
});
