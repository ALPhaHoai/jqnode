const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('removeProp() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <input type="text" id="input1"/>
        <input type="checkbox" id="checkbox1"/>
        <select id="select1">
          <option value="option1">Option 1</option>
        </select>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('removeProp() should remove properties from elements - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        // Set a property first on both
        nqInputElement.prop('testProp', 'testValue');
        jqInputElement.prop('testProp', 'testValue');

        const nqInitialProp = nqInputElement.prop('testProp');
        const jqInitialProp = jqInputElement.prop('testProp');
        expect(nqInitialProp).toBe(jqInitialProp);
        expect(nqInitialProp).toBe('testValue');

        // Remove the property from both
        nqInputElement.removeProp('testProp');
        jqInputElement.removeProp('testProp');

        const nqAfterProp = nqInputElement.prop('testProp');
        const jqAfterProp = jqInputElement.prop('testProp');
        expect(nqAfterProp).toBe(jqAfterProp);
        expect(nqAfterProp).toBeUndefined();
    });

    test('removeProp() should remove multiple properties from single element - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        // Set multiple properties on both
        nqInputElement.prop('prop1', 'value1');
        nqInputElement.prop('prop2', 'value2');
        nqInputElement.prop('prop3', 'value3');

        jqInputElement.prop('prop1', 'value1');
        jqInputElement.prop('prop2', 'value2');
        jqInputElement.prop('prop3', 'value3');

        // Verify initial state
        expect(nqInputElement.prop('prop1')).toBe('value1');
        expect(jqInputElement.prop('prop1')).toBe('value1');
        expect(nqInputElement.prop('prop2')).toBe('value2');
        expect(jqInputElement.prop('prop2')).toBe('value2');
        expect(nqInputElement.prop('prop3')).toBe('value3');
        expect(jqInputElement.prop('prop3')).toBe('value3');

        // Remove properties (chained for node-query, separate for jQuery)
        nqInputElement.removeProp('prop1').removeProp('prop2');
        jqInputElement.removeProp('prop1');
        jqInputElement.removeProp('prop2');

        // Check removed properties
        expect(nqInputElement.prop('prop1')).toBeUndefined();
        expect(jqInputElement.prop('prop1')).toBeUndefined();
        expect(nqInputElement.prop('prop2')).toBeUndefined();
        expect(jqInputElement.prop('prop2')).toBeUndefined();

        // Check remaining property
        expect(nqInputElement.prop('prop3')).toBe('value3');
        expect(jqInputElement.prop('prop3')).toBe('value3');
    });

    test('removeProp() should remove properties from multiple elements - jquery-comparison', () => {
        const nqInputs = nqRoot.find('input');
        const jqInputs = jqRoot.find('input');

        // Set property on all inputs
        nqInputs.prop('sharedProp', 'sharedValue');
        jqInputs.prop('sharedProp', 'sharedValue');

        // Remove property from all inputs
        nqInputs.removeProp('sharedProp');
        jqInputs.removeProp('sharedProp');

        // Check that all inputs no longer have the property
        nqInputs.each((index, element) => {
            const nqElement = $(element);
            const jqElement = jqInputs.eq(index);
            expect(nqElement.prop('sharedProp')).toBeUndefined();
            expect(jqElement.prop('sharedProp')).toBeUndefined();
        });
    });

    test('removeProp() should handle non-existent properties gracefully - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        // Should not throw when removing non-existent properties
        expect(() => {
            nqInputElement.removeProp('nonExistentProp');
        }).not.toThrow();

        expect(() => {
            jqInputElement.removeProp('nonExistentProp');
        }).not.toThrow();

        // Element should remain unchanged
        const nqType = nqInputElement.prop('type');
        const jqType = jqInputElement.prop('type');
        expect(nqType).toBe(jqType);
    });

    test('removeProp() should be chainable - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        // Set multiple properties
        nqInputElement.prop('prop1', 'value1');
        nqInputElement.prop('prop2', 'value2');
        jqInputElement.prop('prop1', 'value1');
        jqInputElement.prop('prop2', 'value2');

        // Remove properties in chain
        const nqResult = nqInputElement.removeProp('prop1').removeProp('prop2');
        const jqResult = jqInputElement.removeProp('prop1').removeProp('prop2');

        // Both should return the element for chaining
        expect(nqResult).toBe(nqInputElement);
        expect(jqResult).toBe(jqInputElement);

        // Properties should be removed
        expect(nqInputElement.prop('prop1')).toBeUndefined();
        expect(jqInputElement.prop('prop1')).toBeUndefined();
        expect(nqInputElement.prop('prop2')).toBeUndefined();
        expect(jqInputElement.prop('prop2')).toBeUndefined();
    });

    test('removeProp() should handle different property types - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        // Set different types of properties
        nqInputElement.prop('stringProp', 'string');
        nqInputElement.prop('numberProp', 42);
        nqInputElement.prop('booleanProp', true);
        nqInputElement.prop('objectProp', { key: 'value' });

        jqInputElement.prop('stringProp', 'string');
        jqInputElement.prop('numberProp', 42);
        jqInputElement.prop('booleanProp', true);
        jqInputElement.prop('objectProp', { key: 'value' });

        // Remove all properties
        nqInputElement.removeProp('stringProp').removeProp('numberProp').removeProp('booleanProp').removeProp('objectProp');
        jqInputElement.removeProp('stringProp');
        jqInputElement.removeProp('numberProp');
        jqInputElement.removeProp('booleanProp');
        jqInputElement.removeProp('objectProp');

        // All properties should be removed
        expect(nqInputElement.prop('stringProp')).toBeUndefined();
        expect(jqInputElement.prop('stringProp')).toBeUndefined();
        expect(nqInputElement.prop('numberProp')).toBeUndefined();
        expect(jqInputElement.prop('numberProp')).toBeUndefined();
        expect(nqInputElement.prop('booleanProp')).toBeUndefined();
        expect(jqInputElement.prop('booleanProp')).toBeUndefined();
        expect(nqInputElement.prop('objectProp')).toBeUndefined();
        expect(jqInputElement.prop('objectProp')).toBeUndefined();
    });

    test('removeProp() should handle empty collections - jquery-comparison', () => {
        const nqEmptySelection = nqRoot.find('.non-existent');
        const jqEmptySelection = jqRoot.find('.non-existent');

        // Should not throw on empty collections
        expect(() => {
            nqEmptySelection.removeProp('any-property');
        }).not.toThrow();

        expect(() => {
            jqEmptySelection.removeProp('any-property');
        }).not.toThrow();
    });

    test('removeProp() should work with standard HTML properties - jquery-comparison', () => {
        const nqCheckboxElement = nqRoot.find('#checkbox1');
        const jqCheckboxElement = jqRoot.find('#checkbox1');

        // Set checked property
        nqCheckboxElement.prop('checked', true);
        jqCheckboxElement.prop('checked', true);

        expect(nqCheckboxElement.prop('checked')).toBe(true);
        expect(jqCheckboxElement.prop('checked')).toBe(true);

        // Remove checked property
        nqCheckboxElement.removeProp('checked');
        jqCheckboxElement.removeProp('checked');

        // Note: jQuery's removeProp behavior for standard HTML properties may differ
        // from node-query. We compare the actual behavior.
        const nqChecked = nqCheckboxElement.prop('checked');
        const jqChecked = jqCheckboxElement.prop('checked');
        expect(nqChecked).toBe(jqChecked);
    });
});
