const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('val() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <form>
        <input type="text" id="text-input" value="initial text"/>
        <input type="password" id="password-input"/>
        <input type="email" id="email-input" value="test@example.com"/>
        <textarea id="textarea">Initial content</textarea>
        <select id="select">
          <option value="option1">Option 1</option>
          <option value="option2" selected>Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <select id="select-multiple" multiple>
          <option value="multi1" selected>Multi 1</option>
          <option value="multi2">Multi 2</option>
          <option value="multi3" selected>Multi 3</option>
        </select>
        <input type="checkbox" id="checkbox"/>
        <div id="div">Not a form element</div>
      </form>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('val() should get value from input elements with value attribute - jquery-comparison', () => {
        const nqTextInput = nqRoot.find('#text-input');
        const jqTextInput = jqRoot.find('#text-input');

        const nqValue = nqTextInput.val();
        const jqValue = jqTextInput.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('initial text');

        const nqEmailInput = nqRoot.find('#email-input');
        const jqEmailInput = jqRoot.find('#email-input');

        const nqEmailValue = nqEmailInput.val();
        const jqEmailValue = jqEmailInput.val();
        expect(nqEmailValue).toBe(jqEmailValue);
        expect(nqEmailValue).toBe('test@example.com');
    });

    test('val() should get value from input elements with value property - jquery-comparison', () => {
        const nqPasswordInput = nqRoot.find('#password-input');
        const jqPasswordInput = jqRoot.find('#password-input');

        // Set value using prop
        nqPasswordInput.prop('value', 'secret password');
        jqPasswordInput.prop('value', 'secret password');

        const nqValue = nqPasswordInput.val();
        const jqValue = jqPasswordInput.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('secret password');
    });

    test('val() should get value from textarea elements - jquery-comparison', () => {
        const nqTextarea = nqRoot.find('#textarea');
        const jqTextarea = jqRoot.find('#textarea');

        const nqValue = nqTextarea.val();
        const jqValue = jqTextarea.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('Initial content');
    });

    test('val() should get value from select elements - jquery-comparison', () => {
        const nqSelect = nqRoot.find('#select');
        const jqSelect = jqRoot.find('#select');

        const nqValue = nqSelect.val();
        const jqValue = jqSelect.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('option2'); // The selected option
    });

    test('val() should get values from multiple select elements - jquery-comparison', () => {
        const nqMultiSelect = nqRoot.find('#select-multiple');
        const jqMultiSelect = jqRoot.find('#select-multiple');

        const nqValues = nqMultiSelect.val();
        const jqValues = jqMultiSelect.val();

        // Should return array of selected values
        expect(Array.isArray(nqValues)).toBe(true);
        expect(Array.isArray(jqValues)).toBe(true);
        expect(nqValues).toEqual(jqValues);
        expect(nqValues).toEqual(['multi1', 'multi3']);
    });

    test('val() should set value on input elements - jquery-comparison', () => {
        const nqTextInput = nqRoot.find('#text-input');
        const jqTextInput = jqRoot.find('#text-input');

        nqTextInput.val('new value');
        jqTextInput.val('new value');

        const nqValue = nqTextInput.val();
        const jqValue = jqTextInput.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('new value');
    });

    test('val() should set value on textarea elements - jquery-comparison', () => {
        const nqTextarea = nqRoot.find('#textarea');
        const jqTextarea = jqRoot.find('#textarea');

        nqTextarea.val('New textarea content');
        jqTextarea.val('New textarea content');

        const nqValue = nqTextarea.val();
        const jqValue = jqTextarea.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('New textarea content');
    });

    test('val() should set value on select elements - jquery-comparison', () => {
        const nqSelect = nqRoot.find('#select');
        const jqSelect = jqRoot.find('#select');

        nqSelect.val('option3');
        jqSelect.val('option3');

        const nqValue = nqSelect.val();
        const jqValue = jqSelect.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('option3');
    });

    test('val() should set values on multiple select elements - jquery-comparison', () => {
        const nqMultiSelect = nqRoot.find('#select-multiple');
        const jqMultiSelect = jqRoot.find('#select-multiple');

        nqMultiSelect.val(['multi1', 'multi2']);
        jqMultiSelect.val(['multi1', 'multi2']);

        const nqValues = nqMultiSelect.val();
        const jqValues = jqMultiSelect.val();
        expect(nqValues).toEqual(jqValues);
        expect(nqValues).toEqual(['multi1', 'multi2']);
    });

    test('val() should handle checkbox elements - jquery-comparison', () => {
        const nqCheckbox = nqRoot.find('#checkbox');
        const jqCheckbox = jqRoot.find('#checkbox');

        // Set checkbox value
        nqCheckbox.val('checkbox-value');
        jqCheckbox.val('checkbox-value');

        const nqValue = nqCheckbox.val();
        const jqValue = jqCheckbox.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('checkbox-value');
    });

    test('val() should handle elements that do not support val() - jquery-comparison', () => {
        const nqDiv = nqRoot.find('#div');
        const jqDiv = jqRoot.find('#div');

        const nqValue = nqDiv.val();
        const jqValue = jqDiv.val();

        // Both should return empty string for non-form elements
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('');
    });

    test('val() should be chainable when setting - jquery-comparison', () => {
        const nqTextInput = nqRoot.find('#text-input');
        const jqTextInput = jqRoot.find('#text-input');

        const nqResult = nqTextInput.val('chained value');
        const jqResult = jqTextInput.val('chained value');

        // Both should return the element for chaining
        expect(nqResult).toBe(nqTextInput);
        expect(jqResult).toBe(jqTextInput);

        const nqValue = nqTextInput.val();
        const jqValue = jqTextInput.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('chained value');
    });

    test('val() should work with multiple elements - jquery-comparison', () => {
        const nqInputs = nqRoot.find('input[type="text"], input[type="email"]');
        const jqInputs = jqRoot.find('input[type="text"], input[type="email"]');

        // Set value on multiple elements
        nqInputs.val('bulk value');
        jqInputs.val('bulk value');

        // Check that all elements got the value
        nqInputs.each((index, element) => {
            const nqElement = $(element);
            const jqElement = jqInputs.eq(index);
            expect(nqElement.val()).toBe('bulk value');
            expect(jqElement.val()).toBe('bulk value');
        });
    });

    test('val() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqValue = nqEmpty.val();
        const jqValue = jqEmpty.val();
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBeUndefined();
    });

    test('val() should handle function parameter - jquery-comparison', () => {
        const nqInputs = nqRoot.find('input[type="text"]');
        const jqInputs = jqRoot.find('input[type="text"]');

        nqInputs.val(function(index, value) {
            return 'function-value-' + index;
        });

        jqInputs.val(function(index, value) {
            return 'function-value-' + index;
        });

        nqInputs.each((index, element) => {
            const nqElement = $(element);
            const jqElement = jqInputs.eq(index);
            expect(nqElement.val()).toBe('function-value-' + index);
            expect(jqElement.val()).toBe('function-value-' + index);
        });
    });
});
