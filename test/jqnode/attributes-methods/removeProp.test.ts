import $ from '../../../index';
import JQ from '../../../jq';
import { HtmlNode } from '../../../types';

describe('removeProp() method', () => {
    let root: JQ;

    beforeEach(() => {
        $.clearRootNodesRegistry();
        const html = `
      <div class="container">
        <input type="text" id="input1"/>
        <input type="checkbox" id="checkbox1"/>
        <select id="select1">
          <option value="option1">Option 1</option>
        </select>
      </div>
    `;
        root = $(html);
    });

    test('removeProp() should remove properties from elements', () => {
        const inputElement = root.find('#input1');

        // Set a property first
        inputElement.prop('testProp', 'testValue');
        expect(inputElement.prop('testProp')).toBe('testValue');

        // Remove the property
        inputElement.removeProp('testProp');
        expect(inputElement.prop('testProp')).toBeUndefined();
    });

    test('removeProp() should remove multiple properties from single element', () => {
        const inputElement = root.find('#input1');

        inputElement.prop('prop1', 'value1');
        inputElement.prop('prop2', 'value2');
        inputElement.prop('prop3', 'value3');

        expect(inputElement.prop('prop1')).toBe('value1');
        expect(inputElement.prop('prop2')).toBe('value2');
        expect(inputElement.prop('prop3')).toBe('value3');

        inputElement.removeProp('prop1').removeProp('prop2');

        expect(inputElement.prop('prop1')).toBeUndefined();
        expect(inputElement.prop('prop2')).toBeUndefined();
        expect(inputElement.prop('prop3')).toBe('value3'); // Should still exist
    });

    test('removeProp() should remove properties from multiple elements', () => {
        const inputs = root.find('input');

        inputs.prop('sharedProp', 'sharedValue');
        inputs.each((index: number, element: HtmlNode) => {
            expect($(element).prop('sharedProp')).toBe('sharedValue');
        });

        inputs.removeProp('sharedProp');

        inputs.each((index: number, element: HtmlNode) => {
            expect($(element).prop('sharedProp')).toBeUndefined();
        });
    });

    test('removeProp() should handle non-existent properties gracefully', () => {
        const inputElement = root.find('#input1');

        expect(() => {
            inputElement.removeProp('non-existent');
        }).not.toThrow();

        // Should not affect existing properties
        inputElement.prop('existingProp', 'existingValue');
        inputElement.removeProp('non-existent');
        expect(inputElement.prop('existingProp')).toBe('existingValue');
    });

    test('removeProp() should be chainable', () => {
        const inputElement = root.find('#input1');
        inputElement.prop('prop1', 'value1');
        inputElement.prop('prop2', 'value2');

        const result = inputElement.removeProp('prop1');
        expect(result).toBe(inputElement);

        // Should be able to chain another removeProp
        inputElement.removeProp('prop2');
        expect(inputElement.prop('prop1')).toBeUndefined();
        expect(inputElement.prop('prop2')).toBeUndefined();
    });

    test('removeProp() should work with different property types', () => {
        const inputElement = root.find('#input1');

        inputElement.prop('stringProp', 'string value');
        inputElement.prop('numberProp', 42);
        inputElement.prop('booleanProp', true);
        inputElement.prop('objectProp', { key: 'value' });

        expect(inputElement.prop('stringProp')).toBe('string value');
        expect(inputElement.prop('numberProp')).toBe(42);
        expect(inputElement.prop('booleanProp')).toBe(true);
        expect(inputElement.prop('objectProp')).toEqual({ key: 'value' });

        inputElement.removeProp('stringProp');
        inputElement.removeProp('numberProp');
        inputElement.removeProp('booleanProp');
        inputElement.removeProp('objectProp');

        expect(inputElement.prop('stringProp')).toBeUndefined();
        expect(inputElement.prop('numberProp')).toBeUndefined();
        expect(inputElement.prop('booleanProp')).toBeUndefined();
        expect(inputElement.prop('objectProp')).toBeUndefined();
    });

    test('removeProp() should work with different element types', () => {
        const divElement = root.find('.container');
        const inputElement = root.find('#input1');
        const selectElement = root.find('#select1');

        divElement.prop('divProp', 'divValue');
        inputElement.prop('inputProp', 'inputValue');
        selectElement.prop('selectProp', 'selectValue');

        expect(divElement.prop('divProp')).toBe('divValue');
        expect(inputElement.prop('inputProp')).toBe('inputValue');
        expect(selectElement.prop('selectProp')).toBe('selectValue');

        divElement.removeProp('divProp');
        inputElement.removeProp('inputProp');
        selectElement.removeProp('selectProp');

        expect(divElement.prop('divProp')).toBeUndefined();
        expect(inputElement.prop('inputProp')).toBeUndefined();
        expect(selectElement.prop('selectProp')).toBeUndefined();
    });

    test('removeProp() should handle empty selection', () => {
        const emptySelection = root.find('.non-existent');
        expect(() => {
            emptySelection.removeProp('any-property');
        }).not.toThrow();
    });
});
