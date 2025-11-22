import $ from '../../../index';
import JQ from '../../../jq';

describe('val() method', () => {
    let root: JQ;

    beforeEach(() => {
        $.clearRootNodesRegistry();
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
        root = $(html);
    });

    test('val() should get value from input elements with value attribute', () => {
        const textInput = root.find('#text-input');
        expect(textInput.val()).toBe('initial text');

        const emailInput = root.find('#email-input');
        expect(emailInput.val()).toBe('test@example.com');
    });

    test('val() should get value from input elements with value property', () => {
        const passwordInput = root.find('#password-input');
        passwordInput.prop('value', 'secret password');
        expect(passwordInput.val()).toBe('secret password');
    });

    test('val() should get value from textarea elements', () => {
        const textarea = root.find('#textarea');
        expect(textarea.val()).toBe('Initial content');
    });

    test('val() should get value from select elements', () => {
        const select = root.find('#select');
        expect(select.val()).toBe('option2'); // The selected option
    });

    test('val() should return empty string for non-form elements', () => {
        const div = root.find('#div');
        expect(div.val()).toBe('');
    });

    test('val() should return undefined for empty selection', () => {
        const empty = root.find('.non-existent');
        expect(empty.val()).toBeUndefined();
    });

    test('val() should set value on input elements', () => {
        const textInput = root.find('#text-input');
        textInput.val('new value');
        expect(textInput.val()).toBe('new value');
    });

    test('val() should set value on textarea elements', () => {
        const textarea = root.find('#textarea');
        textarea.val('New textarea content');
        expect(textarea.val()).toBe('New textarea content');
    });

    test('val() should set value on select elements', () => {
        const select = root.find('#select');
        select.val('option3');
        expect(select.val()).toBe('option3');
    });

    test('val() should set value on multiple elements', () => {
        const inputs = root.find('input[type="text"], input[type="email"]');
        inputs.val('same value');

        const textInput = root.find('#text-input');
        const emailInput = root.find('#email-input');

        expect(textInput.val()).toBe('same value');
        expect(emailInput.val()).toBe('same value');
    });

    test('val() should be chainable when setting', () => {
        const textInput = root.find('#text-input');
        const result = textInput.val('chained value');
        expect(result).toBe(textInput);
        expect(textInput.val()).toBe('chained value');
    });

    test('val() should handle empty string values', () => {
        const textInput = root.find('#text-input');
        textInput.val('');
        expect(textInput.val()).toBe('');
    });

    test('val() should handle numeric values', () => {
        const textInput = root.find('#text-input');
        textInput.val(123);
        expect(textInput.val()).toBe('123');
    });

    test('val() should work with property setting and getting', () => {
        const textInput = root.find('#text-input');

        // Initially should get from attribute
        expect(textInput.val()).toBe('initial text');

        // Set property - should now get from property
        textInput.prop('value', 'property value');
        expect(textInput.val()).toBe('property value');

        // Remove property - for input elements, value property typically can't be removed
        // so val() should still return the property value
        textInput.removeProp('value');
        expect(textInput.val()).toBe('property value');
    });

    test('val() should work with checkbox elements', () => {
        const checkbox = root.find('#checkbox');
        checkbox.prop('value', 'checkbox-value');
        expect(checkbox.val()).toBe('checkbox-value');
    });

    test('val() should handle undefined values gracefully', () => {
        const passwordInput = root.find('#password-input');
        expect(passwordInput.val()).toBe('');

        passwordInput.val(undefined);
        expect(passwordInput.val()).toBe('');
    });
});
