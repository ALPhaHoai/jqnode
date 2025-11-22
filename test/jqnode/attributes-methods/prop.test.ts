import $ from '../../../index';
import JQ from '../../../jq';
import { HtmlNode } from '../../../types';

describe('prop() method', () => {
    let root: JQ;

    beforeEach(() => {
        $.clearRootNodesRegistry();
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
        root = $(html);
    });

    test('prop() should get property values from elements', () => {
        const inputElement = root.find('#input1');
        // Initially no properties are set
        expect(inputElement.prop('customProp')).toBeUndefined();

        // Set a property first
        inputElement.prop('customProp', 'customValue');
        expect(inputElement.prop('customProp')).toBe('customValue');
    });

    test('prop() should set property values on elements', () => {
        const inputElement = root.find('#input1');
        inputElement.prop('testProp', 'testValue');
        expect(inputElement.prop('testProp')).toBe('testValue');
    });

    test('prop() should set properties on multiple elements', () => {
        const inputs = root.find('input');
        inputs.prop('sharedProp', 'sharedValue');

        inputs.each((index: number, element: HtmlNode) => {
            expect($(element).prop('sharedProp')).toBe('sharedValue');
        });
    });

    test('prop() should return undefined for non-existent properties', () => {
        const inputElement = root.find('#input1');
        expect(inputElement.prop('nonExistentProp')).toBeUndefined();
    });

    test('prop() should return undefined when no elements match', () => {
        const emptySelection = root.find('.non-existent');
        expect(emptySelection.prop('anyProp')).toBeUndefined();
    });

    test('prop() should handle different property types', () => {
        const inputElement = root.find('#input1');

        // Test value property with string
        inputElement.prop('value', 'string value');
        expect(inputElement.prop('value')).toBe('string value');

        // Test value property with number
        inputElement.prop('value', 42);
        expect(inputElement.prop('value')).toBe('42'); // Should be converted to string

        // Boolean property - test disabled
        inputElement.prop('disabled', true);
        expect(inputElement.prop('disabled')).toBe(true);

        // Test value property with different types
        inputElement.prop('value', 123);
        expect(inputElement.prop('value')).toBe('123'); // Should be converted to string
    });

    test('prop() should be chainable when setting', () => {
        const inputElement = root.find('#input1');
        const result = inputElement.prop('value', 'chained');
        expect(result).toBe(inputElement);
        expect(inputElement.prop('value')).toBe('chained');
    });

    test('prop() should work with different element types', () => {
        const inputElement = root.find('#input1');
        const checkboxElement = root.find('#checkbox1');
        const selectElement = root.find('#select1');

        // Test input value property
        inputElement.prop('value', 'testValue');
        expect(inputElement.prop('value')).toBe('testValue');

        // Test checkbox checked property
        checkboxElement.prop('checked', false);
        expect(checkboxElement.prop('checked')).toBe(false);

        // Test select value property
        selectElement.prop('value', 'option2');
        expect(selectElement.prop('value')).toBe('option2');
    });
});
