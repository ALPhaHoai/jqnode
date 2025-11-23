import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('removeProp() method - jQuery Comparison', () => {
    const html = `
      <div class="container">
        <input type="text" id="input1" value="test"/>
      </div>
    `;

    test('removeProp() should remove properties - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#input1');
        const jqInput = jqRoot.find('#input1');

        nqInput.prop('customProp', 'customValue');
        jqInput.prop('customProp', 'customValue');

        expect(nqInput.prop('customProp')).toBe('customValue');
        expect(jqInput.prop('customProp')).toBe('customValue');

        nqInput.removeProp('customProp');
        jqInput.removeProp('customProp');

        expect(nqInput.prop('customProp')).toBe(jqInput.prop('customProp'));
    });

    test('removeProp() should be chainable - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#input1');
        const jqInput = jqRoot.find('#input1');

        nqInput.prop('testProp', 'test');
        jqInput.prop('testProp', 'test');

        const nqResult = nqInput.removeProp('testProp');
        const jqResult = jqInput.removeProp('testProp');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });
});
