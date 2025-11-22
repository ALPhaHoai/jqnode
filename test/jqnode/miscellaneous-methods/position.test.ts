import $ from '../../../index';

describe('position() method', () => {
    test('position() should return undefined for empty selection', () => {
        const $empty = $([]);
        const result = $empty.position();

        expect(result).toBeUndefined();
    });

    test('position() should return {top: 0, left: 0} for server-side nodes', () => {
        const html = `<div class="element">Content</div>`;
        const $elem = $(html);
        const result = $elem.position();

        // In server-side (Node.js) environment, position returns default values
        expect(result).toEqual({ top: 0, left: 0 });
    });

    test('position() should work with first element in multi-element selection', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        const $items = $(html).filter('.item');
        const result = $items.position();

        // Should return position of first element only
        expect(result).toEqual({ top: 0, left: 0 });
    });

    test('position() should work with nested elements', () => {
        const html = `
            <div class="parent">
                <div class="child">Nested</div>
            </div>
        `;
        const $parent = $(html);
        const $child = $parent.find('.child');
        const result = $child.position();

        expect(result).toEqual({ top: 0, left: 0 });
    });

    test('position() should return an object with top and left properties', () => {
        const html = `<div>Element</div>`;
        const $elem = $(html);
        const result = $elem.position();

        expect(result).toBeDefined();
        expect(result).toHaveProperty('top');
        expect(result).toHaveProperty('left');
        expect(typeof result!.top).toBe('number');
        expect(typeof result!.left).toBe('number');
    });
});
