const $ = require('../../../index');

describe('toArray() method', () => {
    let elements;

    beforeEach(() => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        elements = $(html).filter('.item');
    });

    test('toArray() should return a standard array', () => {
        const result = elements.toArray();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);
    });

    test('toArray() should contain the DOM elements', () => {
        const result = elements.toArray();
        // Internal nodes don't have textContent property, use $().text() instead
        expect($([result[0]]).text()).toBe('First');
        expect($([result[1]]).text()).toBe('Second');
        expect($([result[2]]).text()).toBe('Third');
    });

    test('toArray() should return empty array for empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.toArray();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
    });
});
