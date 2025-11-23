import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('val() method - jQuery Comparison', () => {
    const html = `
      <form>
        <input type="text" id="text-input" value="initial text"/>
        <textarea id="textarea">Initial content</textarea>
        <select id="select">
          <option value="option1">Option 1</option>
          <option value="option2" selected>Option 2</option>
        </select>
      </form>
    `;

    test('val() should get value from input elements - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#text-input');
        const jqInput = jqRoot.find('#text-input');

        expect(nqInput.val()).toBe(jqInput.val());
        expect(nqInput.val()).toBe('initial text');
    });

    test('val() should get value from textarea - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqTextarea = nqRoot.find('#textarea');
        const jqTextarea = jqRoot.find('#textarea');

        expect(nqTextarea.val()).toBe(jqTextarea.val());
        expect(nqTextarea.val()).toBe('Initial content');
    });

    test('val() should get value from select - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqSelect = nqRoot.find('#select');
        const jqSelect = jqRoot.find('#select');

        expect(nqSelect.val()).toBe(jqSelect.val());
        expect(nqSelect.val()).toBe('option2');
    });

    test('val() should set value on input - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#text-input');
        const jqInput = jqRoot.find('#text-input');

        nqInput.val('new value');
        jqInput.val('new value');

        expect(nqInput.val()).toBe(jqInput.val());
        expect(nqInput.val()).toBe('new value');
    });

    test('val() should be chainable - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#text-input');
        const jqInput = jqRoot.find('#text-input');

        const nqResult = nqInput.val('chained');
        const jqResult = jqInput.val('chained');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });
});
