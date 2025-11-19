const $ = require('../../../index');

describe('data() method', () => {
    test('data(key, value) should store data', () => {
        const div = $('<div></div>');
        div.data('test', 'value');
        expect(div.data('test')).toBe('value');
    });

    test('data(key) should retrieve data', () => {
        const div = $('<div></div>');
        div.data('count', 123);
        expect(div.data('count')).toBe(123);
    });

    test('data(obj) should set multiple values', () => {
        const div = $('<div></div>');
        div.data({ a: 1, b: 2 });
        expect(div.data('a')).toBe(1);
        expect(div.data('b')).toBe(2);
    });

    test('data() should return all data', () => {
        const div = $('<div></div>');
        div.data('x', 'y');
        const allData = div.data();
        expect(allData).toHaveProperty('x', 'y');
    });

    test('data() should read from data-* attributes', () => {
        const div = $('<div data-role="page" data-hidden="true" data-options=\'{"foo":"bar"}\'></div>');

        expect(div.data('role')).toBe('page');
        expect(div.data('hidden')).toBe(true);
        expect(div.data('options')).toEqual({ foo: 'bar' });
    });

    test('data() precedence: internal data over attributes', () => {
        const div = $('<div data-val="original"></div>');
        expect(div.data('val')).toBe('original');

        div.data('val', 'new');
        expect(div.data('val')).toBe('new');

        // Attribute should remain unchanged
        expect(div.attr('data-val')).toBe('original');
    });
});
