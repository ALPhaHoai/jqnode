const $ = require('../../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../../utils/jquery-comparison-helpers');

describe('wrap() method - Node-Query vs jQuery Comparison', () => {
    test('wrap() should wrap elements - jquery-comparison', () => {
        const html = `<div class="target">Target</div>`;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        nqTarget.wrap('<div class="wrapper"></div>');
        jqTarget.wrap('<div class="wrapper"></div>');

        // Check that target is now inside wrapper
        const nqWrapper = nodeQuery.find('.wrapper');
        const jqWrapper = jquery.find('.wrapper');

        expect(nqWrapper.nodes).toHaveLength(1);
        expect(jqWrapper.length).toBe(1);

        const nqWrapperText = nqWrapper.text();
        const jqWrapperText = jqWrapper.text();

        expect(nqWrapperText).toBe(jqWrapperText);
        expect(nqWrapperText).toBe('Target');
    });
});
