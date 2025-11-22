/**
 * Tests for remove() and position() methods
 */

import $ from '../index';

describe('remove() method', () => {
    beforeEach(() => {
        $.clearRootNodesRegistry();
    });

    it('should remove elements from DOM', () => {
        const $dom = $('<div><p class="remove-me">Test</p><p>Keep</p></div>');
        const $p = $dom.find('.remove-me');

        $p.remove();

        expect($dom.find('.remove-me').length).toBe(0);
        expect($dom.find('p').length).toBe(1);
    });

    it('should remove elements with selector filter', () => {
        const $dom = $('<div><p class="a">A</p><p class="b">B</p><p class="c">C</p></div>');
        const $all = $dom.find('p');

        $all.remove('.b');

        expect($dom.find('p').length).toBe(2);
        expect($dom.find('.b').length).toBe(0);
        expect($dom.find('.a').length).toBe(1);
        expect($dom.find('.c').length).toBe(1);
    });

    it('should remove all elements when no selector is provided', () => {
        const $dom = $('<div><p>1</p><p>2</p><p>3</p></div>');
        const $p = $dom.find('p');

        $p.remove();

        expect($dom.find('p').length).toBe(0);
    });

    it('should return the JQ instance for chaining', () => {
        const $dom = $('<div><p>Test</p></div>');
        const $p = $dom.find('p');

        const result = $p.remove();

        expect(result).toBe($p);
    });

    it('should clear data associated with removed elements', () => {
        const $dom = $('<div><p>Test</p></div>');
        const $p = $dom.find('p');

        $p.data('key', 'value');
        expect($p.data('key')).toBe('value');

        $p.remove();

        const node = $p.nodes[0];
        expect(node._jqData).toBeUndefined();
    });

    it('should handle empty set', () => {
        const $empty = $('<div></div>').find('.not-exists');

        expect(() => $empty.remove()).not.toThrow();
    });
});

describe('position() method', () => {
    beforeEach(() => {
        $.clearRootNodesRegistry();
    });

    it('should return position object with top and left', () => {
        const $dom = $('<div><p>Test</p></div>');
        const $p = $dom.find('p');

        const pos = $p.position();

        expect(pos).toHaveProperty('top');
        expect(pos).toHaveProperty('left');
        expect(typeof pos.top).toBe('number');
        expect(typeof pos.left).toBe('number');
    });

    it('should return undefined for empty set', () => {
        const $empty = $('<div></div>').find('.not-exists');

        const pos = $empty.position();

        expect(pos).toBeUndefined();
    });

    it('should return position for first element only', () => {
        const $dom = $('<div><p>1</p><p>2</p></div>');
        const $p = $dom.find('p');

        const pos = $p.position();

        // Should return a single position object, not multiple
        expect(pos).toHaveProperty('top');
        expect(pos).toHaveProperty('left');
        expect(typeof pos.top).toBe('number');
    });

    it('should return default position in server environment', () => {
        // In Node.js environment without real DOM
        const $dom = $('<div><p>Test</p></div>');
        const $p = $dom.find('p');

        const pos = $p.position();

        // Server-side should return default values
        expect(pos.top).toBe(0);
        expect(pos.left).toBe(0);
    });
});
