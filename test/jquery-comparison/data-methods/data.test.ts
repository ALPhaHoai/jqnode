import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('data() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div id="elem1" data-role="admin" data-count="5">Element 1</div>
        <div id="elem2" data-foo="bar" data-baz="qux">Element 2</div>
        <div id="elem3">Element 3</div>
        <span data-custom="value" data-number="42">Span</span>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('data() should retrieve data attribute value by key - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        expect(nqElem.data('role')).toBe(jqElem.data('role'));
        expect(nqElem.data('count')).toBe(jqElem.data('count'));
    });

    test('data() should retrieve all data attributes when called without arguments - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem2');
        const jqElem = jqRoot.find('#elem2');

        const nqData = nqElem.data();
        const jqData = jqElem.data();

        expect(nqData).toEqual(jqData);
        expect(nqData.foo).toBe('bar');
        expect(nqData.baz).toBe('qux');
    });

    test('data() should set data value with key-value pair - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem3');
        const jqElem = jqRoot.find('#elem3');

        nqElem.data('test', 'value');
        jqElem.data('test', 'value');

        expect(nqElem.data('test')).toBe(jqElem.data('test'));
        expect(nqElem.data('test')).toBe('value');
    });

    test('data() should set multiple data values with object - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem3');
        const jqElem = jqRoot.find('#elem3');

        const dataObj = { key1: 'value1', key2: 'value2', key3: 123 };

        nqElem.data(dataObj);
        jqElem.data(dataObj);

        expect(nqElem.data('key1')).toBe(jqElem.data('key1'));
        expect(nqElem.data('key2')).toBe(jqElem.data('key2'));
        expect(nqElem.data('key3')).toBe(jqElem.data('key3'));
    });

    test('data() should handle camelCase conversion from dash-case - jquery-comparison', () => {
        const nqSpan = nqRoot.find('span');
        const jqSpan = jqRoot.find('span');

        // data-custom-value should be accessible as customValue
        const html = `<div data-custom-value="test">Test</div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqDiv = nodeQuery.find('div');
        const jqDiv = jquery.find('div');

        expect(nqDiv.data('customValue')).toBe(jqDiv.data('customValue'));
    });

    test('data() should handle numeric values correctly - jquery-comparison', () => {
        const nqSpan = nqRoot.find('span');
        const jqSpan = jqRoot.find('span');

        expect(nqSpan.data('number')).toBe(jqSpan.data('number'));
        expect(typeof nqSpan.data('number')).toBe(typeof jqSpan.data('number'));
    });

    test('data() should return undefined for non-existent keys - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        expect(nqElem.data('nonexistent')).toBe(jqElem.data('nonexistent'));
        expect(nqElem.data('nonexistent')).toBeUndefined();
    });

    test('data() should support chaining when setting - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        const nqResult = nqElem.data('chain', 'test');
        const jqResult = jqElem.data('chain', 'test');

        expect(nqResult).toBe(nqElem);
        expect(jqResult).toBe(jqElem);
        expect(nqResult.data('chain')).toBe('test');
    });

    test('data() should handle boolean values - jquery-comparison', () => {
        const html = `<div data-enabled="true" data-disabled="false">Test</div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqDiv = nodeQuery.find('div');
        const jqDiv = jquery.find('div');

        expect(nqDiv.data('enabled')).toBe(jqDiv.data('enabled'));
        expect(nqDiv.data('disabled')).toBe(jqDiv.data('disabled'));
    });

    test('data() should handle empty collections gracefully - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        expect(nqEmpty.data('test')).toBe(jqEmpty.data('test'));
        expect(nqEmpty.data('test')).toBeUndefined();
    });

    test('data() should store complex objects - jquery-comparison', () => {
        const nqElem = nqRoot.find('#elem1');
        const jqElem = jqRoot.find('#elem1');

        const complexObj = { nested: { value: 'test' }, array: [1, 2, 3] };

        nqElem.data('complex', complexObj);
        jqElem.data('complex', complexObj);

        expect(nqElem.data('complex')).toEqual(jqElem.data('complex'));
        expect(nqElem.data('complex').nested.value).toBe('test');
    });
});
