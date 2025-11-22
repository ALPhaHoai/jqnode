import $ from '../../../index';
import { JQ } from '../../../types';

describe('get() method', () => {
    let elements: JQ;

    beforeEach(() => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        elements = $(html).filter('.item');
    });

    test('get() should return array of all elements when no index provided', () => {
        const result = elements.get() as import('../../../types').HtmlNode[];
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);
        // Internal nodes don't have textContent property, use $().text() instead
        expect($([result[0]]).text()).toBe('First');
    });

    test('get(index) should return single element at positive index', () => {
        const result = elements.get(1);
        // Internal nodes don't have textContent property, use $().text() instead
        expect($([result]).text()).toBe('Second');
    });

    test('get(index) should return single element at negative index', () => {
        const result = elements.get(-1);
        // Internal nodes don't have textContent property, use $().text() instead
        expect($([result]).text()).toBe('Third');
    });

    test('get(index) should return undefined for out of bounds index', () => {
        expect(elements.get(5)).toBeUndefined();
        expect(elements.get(-5)).toBeUndefined();
    });
});
