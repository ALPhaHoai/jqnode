const $ = require('../../../index');

describe('removeData() method', () => {
    test('removeData(key) should remove specific data', () => {
        const div = $('<div></div>');
        div.data('test', 'value');
        div.data('other', 'keep');

        div.removeData('test');
        expect(div.data('test')).toBeUndefined();
        expect(div.data('other')).toBe('keep');
    });

    test('removeData() should remove all data', () => {
        const div = $('<div></div>');
        div.data('a', 1);
        div.data('b', 2);

        div.removeData();
        expect(div.data('a')).toBeUndefined();
        expect(div.data('b')).toBeUndefined();

        // Should check if it returns empty object or undefined when no data
        // Implementation details might vary, but accessing specific key should be undefined
    });

    test('removeData(list) should remove multiple keys', () => {
        const div = $('<div></div>');
        div.data('a', 1);
        div.data('b', 2);
        div.data('c', 3);

        div.removeData('a c');
        expect(div.data('a')).toBeUndefined();
        expect(div.data('b')).toBe(2);
        expect(div.data('c')).toBeUndefined();
    });

    test('removeData(array) should remove keys in array', () => {
        const div = $('<div></div>');
        div.data('a', 1);
        div.data('b', 2);

        div.removeData(['a', 'b']);
        expect(div.data('a')).toBeUndefined();
        expect(div.data('b')).toBeUndefined();
    });
});
