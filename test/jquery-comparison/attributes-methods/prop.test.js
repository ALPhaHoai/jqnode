const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('prop() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <input type="text" id="input1" value="initial"/>
        <input type="checkbox" id="checkbox1" checked/>
        <select id="select1">
          <option value="option1">Option 1</option>
          <option value="option2" selected>Option 2</option>
        </select>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('prop() should get property values from elements - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        // Initially no properties are set - both should return undefined
        const nqInitialProp = nqInputElement.prop('customProp');
        const jqInitialProp = jqInputElement.prop('customProp');
        expect(nqInitialProp).toBe(jqInitialProp);
        expect(nqInitialProp).toBeUndefined();

        // Set a property first
        nqInputElement.prop('customProp', 'customValue');
        jqInputElement.prop('customProp', 'customValue');

        const nqCustomProp = nqInputElement.prop('customProp');
        const jqCustomProp = jqInputElement.prop('customProp');
        expect(nqCustomProp).toBe(jqCustomProp);
        expect(nqCustomProp).toBe('customValue');
    });

    test('prop() should set property values on elements - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        nqInputElement.prop('testProp', 'testValue');
        jqInputElement.prop('testProp', 'testValue');

        const nqResult = nqInputElement.prop('testProp');
        const jqResult = jqInputElement.prop('testProp');
        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe('testValue');
    });

    test('prop() should set properties on multiple elements - jquery-comparison', () => {
        const nqInputs = nqRoot.find('input');
        const jqInputs = jqRoot.find('input');

        nqInputs.prop('sharedProp', 'sharedValue');
        jqInputs.prop('sharedProp', 'sharedValue');

        // Check that both collections have the same length
        expect(nqInputs.nodes.length).toBe(jqInputs.length);

        // Check each element has the property set
        nqInputs.each((index, element) => {
            const nqElement = $(element);
            const jqElement = jqInputs.eq(index);
            expect(nqElement.prop('sharedProp')).toBe(jqElement.prop('sharedProp'));
            expect(nqElement.prop('sharedProp')).toBe('sharedValue');
        });
    });

    test('prop() should return undefined for non-existent properties - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        const nqResult = nqInputElement.prop('nonExistentProp');
        const jqResult = jqInputElement.prop('nonExistentProp');
        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBeUndefined();
    });

    test('prop() should return undefined when no elements match - jquery-comparison', () => {
        const nqEmptySelection = nqRoot.find('.non-existent');
        const jqEmptySelection = jqRoot.find('.non-existent');

        const nqResult = nqEmptySelection.prop('anyProp');
        const jqResult = jqEmptySelection.prop('anyProp');
        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBeUndefined();
    });

    test('prop() should handle different property types - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        // Test value property with string
        nqInputElement.prop('value', 'string value');
        jqInputElement.prop('value', 'string value');

        let nqValue = nqInputElement.prop('value');
        let jqValue = jqInputElement.prop('value');
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('string value');

        // Test value property with number
        nqInputElement.prop('value', 42);
        jqInputElement.prop('value', 42);

        nqValue = nqInputElement.prop('value');
        jqValue = jqInputElement.prop('value');
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('42'); // Should be converted to string

        // Boolean property - test disabled
        nqInputElement.prop('disabled', true);
        jqInputElement.prop('disabled', true);

        const nqDisabled = nqInputElement.prop('disabled');
        const jqDisabled = jqInputElement.prop('disabled');
        expect(nqDisabled).toBe(jqDisabled);
        expect(nqDisabled).toBe(true);

        // Test value property with different types
        nqInputElement.prop('value', 123);
        jqInputElement.prop('value', 123);

        nqValue = nqInputElement.prop('value');
        jqValue = jqInputElement.prop('value');
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('123'); // Should be converted to string
    });

    test('prop() should be chainable when setting - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        const nqResult = nqInputElement.prop('value', 'chained');
        const jqResult = jqInputElement.prop('value', 'chained');

        // Both should return the element for chaining
        expect(nqResult).toBe(nqInputElement);
        expect(jqResult).toBe(jqInputElement);

        const nqValue = nqInputElement.prop('value');
        const jqValue = jqInputElement.prop('value');
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('chained');
    });

    test('prop() should work with different element types - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');
        const nqCheckboxElement = nqRoot.find('#checkbox1');
        const jqCheckboxElement = jqRoot.find('#checkbox1');
        const nqSelectElement = nqRoot.find('#select1');
        const jqSelectElement = jqRoot.find('#select1');

        // Test input value property
        nqInputElement.prop('value', 'testValue');
        jqInputElement.prop('value', 'testValue');

        let nqValue = nqInputElement.prop('value');
        let jqValue = jqInputElement.prop('value');
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('testValue');

        // Test checkbox checked property
        nqCheckboxElement.prop('checked', false);
        jqCheckboxElement.prop('checked', false);

        const nqChecked = nqCheckboxElement.prop('checked');
        const jqChecked = jqCheckboxElement.prop('checked');
        expect(nqChecked).toBe(jqChecked);
        expect(nqChecked).toBe(false);

        // Test select value property
        nqSelectElement.prop('value', 'option2');
        jqSelectElement.prop('value', 'option2');

        nqValue = nqSelectElement.prop('value');
        jqValue = jqSelectElement.prop('value');
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('option2');
    });
});
