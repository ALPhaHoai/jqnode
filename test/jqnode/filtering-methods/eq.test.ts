import $ from '../../../index';

describe('eq() method', () => {
    let elements;

    beforeEach(() => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
            <div class="item">Fourth</div>
            <div class="item">Fifth</div>
        `;
        elements = $(html).filter('.item');
    });

    test('eq() should select element at positive index 0', () => {
        const result = elements.eq(0);
        expect(result.nodes).toHaveLength(1);
        const resultText = result.text();
        expect(resultText).toBe('First');
    });

    test('eq() should select element at positive index 1', () => {
        const result = elements.eq(1);
        expect(result.nodes).toHaveLength(1);
        const result1Text = result.text();
        expect(result1Text).toBe('Second');
    });

    test('eq() should select element at positive index 2', () => {
        const result = elements.eq(2);
        expect(result.nodes).toHaveLength(1);
        const result2Text = result.text();
        expect(result2Text).toBe('Third');
    });

    test('eq() should select element at positive index 3', () => {
        const result = elements.eq(3);
        expect(result.nodes).toHaveLength(1);
        const result3Text = result.text();
        expect(result3Text).toBe('Fourth');
    });

    test('eq() should select element at positive index 4', () => {
        const result = elements.eq(4);
        expect(result.nodes).toHaveLength(1);
        const result4Text = result.text();
        expect(result4Text).toBe('Fifth');
    });

    test('eq() should handle negative index -1 (last element)', () => {
        const result = elements.eq(-1);
        expect(result.nodes).toHaveLength(1);
        const resultNeg1Text = result.text();
        expect(resultNeg1Text).toBe('Fifth');
    });

    test('eq() should handle negative index -2', () => {
        const result = elements.eq(-2);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Fourth');
    });

    test('eq() should handle negative index -3', () => {
        const result = elements.eq(-3);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Third');
    });

    test('eq() should return empty result for out-of-bounds positive index', () => {
        const result = elements.eq(5);
        expect(result.nodes).toHaveLength(0);
    });

    test('eq() should handle negative indices beyond -length (wrap around)', () => {
        const result = elements.eq(-6);
        expect(result.nodes).toHaveLength(0); // Returns empty for indices beyond -length
    });

    test('eq() should return empty result when called on empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.eq(0);
        expect(result.nodes).toHaveLength(0);
    });

    test('eq() should work with single element collection', () => {
        const single = $(`<div>Single</div>`);
        const result = single.eq(0);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Single');
    });

    test('eq() should handle fractional indices (truncate towards zero)', () => {
        const result = elements.eq(2.7);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe(''); // Fractional indices return empty text
    });

    test('eq() should handle negative fractional indices', () => {
        const result = elements.eq(-1.5);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe(''); // Fractional indices return empty text
    });

    test('eq() should handle string indices (convert to numbers)', () => {
        const result = elements.eq('2');
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Third');
    });

    test('eq() should handle negative string indices', () => {
        const result = elements.eq('-2');
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Fourth');
    });

    test('eq() should handle invalid string indices', () => {
        const result = elements.eq('invalid');
        expect(result.nodes).toHaveLength(0); // Invalid strings become NaN, return empty
    });

    test('eq() should handle null index', () => {
        const result = elements.eq(null);
        expect(result.nodes).toHaveLength(1); // null becomes 0, return first element
        expect(result.text()).toBe('First');
    });

    test('eq() should handle undefined index', () => {
        const result = elements.eq(undefined);
        expect(result.nodes).toHaveLength(0); // undefined becomes NaN, return empty
    });

    test('eq() should handle very large positive indices', () => {
        const result = elements.eq(100);
        expect(result.nodes).toHaveLength(0);
    });

    test('eq() should handle very large negative indices', () => {
        const result = elements.eq(-100);
        expect(result.nodes).toHaveLength(0); // Very large negative indices return empty
    });

    test('eq() should work with chaining - eq() after filter()', () => {
        const filtered = elements.filter((index: number) => index % 2 === 0); // indices 0, 2, 4
        const result = filtered.eq(1); // Should be index 2 from original (Third)

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Third');
    });

    test('eq() should work with chaining - eq() after slice()', () => {
        const sliced = elements.slice(1, 4); // Second, Third, Fourth
        const result = sliced.eq(1); // Should be Third

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Third');
    });

    test('eq() should preserve element attributes', () => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.eq(1);

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('data-id')).toBe('2');
        expect(result.text()).toBe('Second');
    });

    test('eq() should work with different element types', () => {
        const html = `
            <div class="mixed">Div</div>
            <span class="mixed">Span</span>
            <p class="mixed">Paragraph</p>
        `;
        const mixedElements = $(html).find('.mixed');
        const result = mixedElements.eq(1);

        expect(result.nodes).toHaveLength(1);
        const resultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(resultTag).toBe('span');
        expect(result.text()).toBe('Span');
    });

    test('eq() should handle zero index on empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.eq(0);
        expect(result.nodes).toHaveLength(0);
    });

    test('eq() should handle negative index on empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.eq(-1);
        expect(result.nodes).toHaveLength(0);
    });

    test('eq() should work with large collections', () => {
        const html = Array.from({ length: 100 }, (_, i) =>
            `<div class="item">Item ${i + 1}</div>`
        ).join('');
        const largeCollection = $(html).find('.item');

        const result = largeCollection.eq(50);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Item 51');

        const lastResult = largeCollection.eq(-1);
        expect(lastResult.nodes).toHaveLength(1);
        expect(lastResult.text()).toBe('Item 100');
    });

    test('eq() should handle boundary conditions', () => {
        // Test with exactly the boundary indices
        const result0 = elements.eq(0);
        const result4 = elements.eq(4);
        const resultNeg1 = elements.eq(-1);
        const resultNeg5 = elements.eq(-5);

        expect(result0.text()).toBe('First');
        expect(result4.text()).toBe('Fifth');
        expect(resultNeg1.text()).toBe('Fifth');
        expect(resultNeg5.text()).toBe('First');
    });

    test('eq() should return new collection instance', () => {
        const result = elements.eq(2);
        expect(result).not.toBe(elements); // Different instance
        expect(result.nodes).not.toBe(elements.nodes); // Different node arrays
        const resultFirstNode = result.nodes[0];
        const elementsThirdNode = elements.nodes[2];
        expect(resultFirstNode).toBe(elementsThirdNode); // But same node reference
    });

    test('eq() should work with boolean conversion indices', () => {
        const result = elements.eq(true); // true = 1
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Second');

        const resultFalse = elements.eq(false); // false = 0
        expect(resultFalse.nodes).toHaveLength(1);
        expect(resultFalse.text()).toBe('First');
    });

    test('eq() should handle array-like indices', () => {
        const result = elements.eq([2]); // Array with single element
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Third'); // Takes first element of array
    });

    test('eq() should work with complex chaining scenarios', () => {
        const html = `
            <div class="item even">Even 1</div>
            <div class="item odd">Odd 1</div>
            <div class="item even">Even 2</div>
            <div class="item odd">Odd 2</div>
            <div class="item even">Even 3</div>
        `;
        const elements = $(html).filter('.item');

        // Chain: filter -> slice -> eq -> first (should be no-op since eq returns single element)
        const result = elements.filter('.even').slice(0, 3).eq(1).first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Even 2');
    });
});
