import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { HtmlNode } from '../../../types';

describe('prop() method - Query Comparison', () => {
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

    test('prop() should get and set property values - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#input1');
        const jqInput = jqRoot.find('#input1');

        nqInput.prop('testProp', 'testValue');
        jqInput.prop('testProp', 'testValue');

        expect(nqInput.prop('testProp')).toBe(jqInput.prop('testProp'));
        expect(nqInput.prop('testProp')).toBe('testValue');
    });

    test('prop() should set properties on multiple elements - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInputs = nqRoot.find('input');
        const jqInputs = jqRoot.find('input');

        nqInputs.prop('sharedProp', 'sharedValue');
        jqInputs.prop('sharedProp', 'sharedValue');

        nqInputs.each((index: number, element: HtmlNode) => {
            const nqVal = $(element).prop('sharedProp');
            const jqVal = jqInputs.eq(index).prop('sharedProp');
            expect(nqVal).toBe(jqVal);
        });
    });

    test('prop() should be chainable - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#input1');
        const jqInput = jqRoot.find('#input1');

        const nqResult = nqInput.prop('value', 'chained');
        const jqResult = jqInput.prop('value', 'chained');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('prop() should set multiple properties via object - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#input1');
        const jqInput = jqRoot.find('#input1');

        const props = {
            disabled: true,
            readonly: true,
            title: 'Input Title',
        };

        nqInput.prop(props);
        jqInput.prop(props);

        expect(nqInput.prop('disabled')).toBe(jqInput.prop('disabled'));
        expect(nqInput.prop('disabled')).toBe(true);
        expect(nqInput.prop('readonly')).toBe(jqInput.prop('readonly'));
        expect(nqInput.prop('title')).toBe(jqInput.prop('title'));
    });

    test('prop() should handle function argument - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#input1');
        const jqInput = jqRoot.find('#input1');

        nqInput.prop('value', function (index: number, oldVal: any) {
            return oldVal + ' - modified';
        });
        jqInput.prop('value', function (index: number, oldVal: any) {
            return oldVal + ' - modified';
        });

        expect(nqInput.prop('value')).toBe(jqInput.prop('value'));
        expect(nqInput.prop('value')).toBe('initial - modified');
    });

    test('prop() should handle boolean properties correctly - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqCheckbox = nqRoot.find('#checkbox1');
        const jqCheckbox = jqRoot.find('#checkbox1');

        // Initial state
        expect(nqCheckbox.prop('checked')).toBe(jqCheckbox.prop('checked'));
        expect(nqCheckbox.prop('checked')).toBe(true);

        // Set to false
        nqCheckbox.prop('checked', false);
        jqCheckbox.prop('checked', false);

        expect(nqCheckbox.prop('checked')).toBe(jqCheckbox.prop('checked'));
        expect(nqCheckbox.prop('checked')).toBe(false);

        // Set to true
        nqCheckbox.prop('checked', true);
        jqCheckbox.prop('checked', true);

        expect(nqCheckbox.prop('checked')).toBe(jqCheckbox.prop('checked'));
        expect(nqCheckbox.prop('checked')).toBe(true);
    });
});
