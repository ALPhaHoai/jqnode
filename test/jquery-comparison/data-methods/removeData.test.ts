import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JQ } from '../../../index';

describe('removeData() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div id="elem1" data-role="admin" data-count="5">Element 1</div>
        <div id="elem2" data-foo="bar" data-baz="qux">Element 2</div>
        <div id="elem3">Element 3</div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('removeData() should remove specific data by key - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        // Set some data first
        nqElem.data('test', 'value');
        jqElem.data('test', 'value');

        // Verify data exists
        expect(nqElem.data('test')).toBe('value');
        expect(jqElem.data('test')).toBe('value');

        // Remove the data
        nqElem.removeData('test');
        jqElem.removeData('test');

        // Verify data is removed
        expect(nqElem.data('test')).toBe(jqElem.data('test'));
        expect(nqElem.data('test')).toBeUndefined();
    });

    test('removeData() should remove all data when called without arguments - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem2');
        const jqElem = jqRoot.find('#elem2');

        // Set some additional data
        nqElem.data('extra1', 'value1');
        nqElem.data('extra2', 'value2');
        jqElem.data('extra1', 'value1');
        jqElem.data('extra2', 'value2');

        // Remove all data
        nqElem.removeData();
        jqElem.removeData();

        // Verify all data is removed
        expect(nqElem.data('extra1')).toBe(jqElem.data('extra1'));
        expect(nqElem.data('extra2')).toBe(jqElem.data('extra2'));
        expect(nqElem.data('extra1')).toBeUndefined();
        expect(nqElem.data('extra2')).toBeUndefined();
    });

    test('removeData() should support chaining - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        nqElem.data('test', 'value');
        jqElem.data('test', 'value');

        const nqResult = nqElem.removeData('test');
        const jqResult = jqElem.removeData('test');

        expect(nqResult).toBe(nqElem); // Should return the same JQ instance
        expect(jqResult).toBe(jqElem); // Should return the same jQuery instance
    });

    test('removeData() should handle non-existent keys gracefully - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        // Try to remove non-existent data
        expect(() => {
            nqElem.removeData('nonexistent');
        }).not.toThrow();

        expect(() => {
            jqElem.removeData('nonexistent');
        }).not.toThrow();
    });

    test('removeData() should handle empty collections gracefully - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        expect(() => {
            nqEmpty.removeData('test');
        }).not.toThrow();

        expect(() => {
            jqEmpty.removeData('test');
        }).not.toThrow();
    });

    test('removeData() should remove multiple keys with space-separated string - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        // Set multiple data values
        nqElem.data('key1', 'value1');
        nqElem.data('key2', 'value2');
        nqElem.data('key3', 'value3');

        jqElem.data('key1', 'value1');
        jqElem.data('key2', 'value2');
        jqElem.data('key3', 'value3');

        // Remove multiple keys
        nqElem.removeData('key1 key2');
        jqElem.removeData('key1 key2');

        // Verify only specified keys are removed
        expect(nqElem.data('key1')).toBeUndefined();
        expect(nqElem.data('key2')).toBeUndefined();
        expect(nqElem.data('key3')).toBe('value3');

        expect(jqElem.data('key1')).toBeUndefined();
        expect(jqElem.data('key2')).toBeUndefined();
        expect(jqElem.data('key3')).toBe('value3');
    });

    test('removeData() should remove camelCase data keys - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        nqElem.data('camelCaseKey', 'value');
        jqElem.data('camelCaseKey', 'value');

        nqElem.removeData('camelCaseKey');
        jqElem.removeData('camelCaseKey');

        expect(nqElem.data('camelCaseKey')).toBe(jqElem.data('camelCaseKey'));
        expect(nqElem.data('camelCaseKey')).toBeUndefined();
    });

    test('removeData() should not affect HTML data attributes - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        // Data attributes are still in the HTML
        // Remove data
        nqElem.removeData('role');
        jqElem.removeData('role');

        // Check that the behavior matches jQuery
        expect(nqElem.data('role')).toBe(jqElem.data('role'));
    });
});
