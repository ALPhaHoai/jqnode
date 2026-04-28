import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('removeAttr() method - jQuery Comparison', () => {
    const html = `
      <div class="container">
        <div id="div1" data-test="value" title="test">Test</div>
        <input id="input1" type="text" value="test" readonly/>
      </div>
    `;

    test('removeAttr() should remove attributes - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('#div1');
        const jqDiv = jqRoot.find('#div1');

        nqDiv.removeAttr('data-test');
        jqDiv.removeAttr('data-test');

        expect(nqDiv.attr('data-test')).toBe(jqDiv.attr('data-test'));
        expect(nqDiv.attr('data-test')).toBeUndefined();
        expect(nqDiv.attr('title')).toBe(jqDiv.attr('title'));
    });

    test('removeAttr() should handle multiple attributes - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('#div1');
        const jqDiv = jqRoot.find('#div1');

        nqDiv.removeAttr('data-test title');
        jqDiv.removeAttr('data-test title');

        expect(nqDiv.attr('data-test')).toBe(jqDiv.attr('data-test'));
        expect(nqDiv.attr('title')).toBe(jqDiv.attr('title'));
    });

    test('removeAttr() should be chainable - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('#div1');
        const jqDiv = jqRoot.find('#div1');

        const nqResult = nqDiv.removeAttr('data-test');
        const jqResult = jqDiv.removeAttr('data-test');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('removeAttr() should handle boolean attributes - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('#input1');
        const jqInput = jqRoot.find('#input1');

        // Initial state
        expect(nqInput.attr('readonly')).toBe('readonly');
        expect(jqInput.attr('readonly')).toBe('readonly');

        // Remove boolean attribute
        nqInput.removeAttr('readonly');
        jqInput.removeAttr('readonly');

        expect(nqInput.attr('readonly')).toBeUndefined();
        expect(jqInput.attr('readonly')).toBeUndefined();

        // Should also affect property? jQuery removeAttr removes the attribute,
        // but for boolean attributes, it might NOT update the property in older jQuery versions,
        // but in modern jQuery/HTML5, removing the attribute usually affects the property.
        // Let's check consistency.
        expect(nqInput.prop('readonly')).toBe(jqInput.prop('readonly'));
        expect(nqInput.prop('readonly')).toBe(false);
    });
});
