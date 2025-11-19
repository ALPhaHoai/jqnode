const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom } = require('../../utils/jquery-comparison-helpers');

describe('attr() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="post" id="main">
        <h1 style="color:red">Hello</h1>
        <p data-info='some info'>World</p>
        <img src="image.jpg" alt='pic'/>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('attr() should get attribute values - jquery-comparison', () => {
        const nqPElement = nqRoot.find('p');
        const jqPElement = jqRoot.find('p');

        expect(nqPElement.attr('data-info')).toBe('some info');
        expect(jqPElement.attr('data-info')).toBe('some info');

        const nqImgElement = nqRoot.find('img');
        const jqImgElement = jqRoot.find('img');

        expect(nqImgElement.attr('src')).toBe('image.jpg');
        expect(jqImgElement.attr('src')).toBe('image.jpg');

        expect(nqImgElement.attr('alt')).toBe('pic');
        expect(jqImgElement.attr('alt')).toBe('pic');
    });

    test('attr() should return undefined for non-existent attributes - jquery-comparison', () => {
        const nqDivElement = nqRoot.find('div');
        const jqDivElement = jqRoot.find('div');

        expect(nqDivElement.attr('non-existent')).toBeUndefined();
        expect(jqDivElement.attr('non-existent')).toBeUndefined();
    });

    test('attr() should set attribute values - jquery-comparison', () => {
        const nqPElement = nqRoot.find('p');
        const jqPElement = jqRoot.find('p');

        nqPElement.attr('new-attr', 'new-value');
        jqPElement.attr('new-attr', 'new-value');

        expect(nqPElement.attr('new-attr')).toBe('new-value');
        expect(jqPElement.attr('new-attr')).toBe('new-value');
    });

    test('attr() should handle boolean attributes correctly - jquery-comparison', () => {
        const html = '<input type="checkbox" checked disabled><input type="checkbox">';
        const { nodeQuery: nqInputs, jquery: jqInputs } = createTestDom(html);

        const nqCheckedInput = nqInputs.find('input').eq(0);
        const jqCheckedInput = jqInputs.find('input').eq(0);
        const nqUncheckedInput = nqInputs.find('input').eq(1);
        const jqUncheckedInput = jqInputs.find('input').eq(1);

        // Check boolean attributes that are present
        expect(nqCheckedInput.attr('checked')).toBe('checked');
        expect(jqCheckedInput.attr('checked')).toBe('checked');

        expect(nqCheckedInput.attr('disabled')).toBe('disabled');
        expect(jqCheckedInput.attr('disabled')).toBe('disabled');

        // Check boolean attributes that are not present
        expect(nqUncheckedInput.attr('checked')).toBeUndefined();
        expect(jqUncheckedInput.attr('checked')).toBeUndefined();

        expect(nqUncheckedInput.attr('disabled')).toBeUndefined();
        expect(jqUncheckedInput.attr('disabled')).toBeUndefined();

        // Test setting boolean attributes
        nqUncheckedInput.attr('checked', 'checked');
        jqUncheckedInput.attr('checked', 'checked');

        expect(nqUncheckedInput.attr('checked')).toBe('checked');
        expect(jqUncheckedInput.attr('checked')).toBe('checked');
    });
});
