const $ = require('../../../index');

describe('size() method', () => {
    test('size() should return number of elements', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
        `;
        const elements = $(html).filter('.item');
        expect(elements.size()).toBe(2);
    });

    test('size() should return 0 for empty collection', () => {
        const empty = $('.nonexistent');
        expect(empty.size()).toBe(0);
    });
});
