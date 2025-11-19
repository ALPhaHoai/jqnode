const $ = require('../../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../../utils/jquery-comparison-helpers');

describe('prepend() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="target">Target</div>
            </div>
            <div class="source">Source</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('prepend() should prepend content to elements - jquery-comparison', () => {
        const nqTarget = nqRoot.find('.target');
        const jqTarget = jqRoot.find('.target');

        const nqResult = nqTarget.prepend('<span>Prepended</span>');
        const jqResult = jqTarget.prepend('<span>Prepended</span>');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqTargetContent = nqRoot.find('.target');
        const jqTargetContent = jqRoot.find('.target');

        const nqTargetText = nqTargetContent.text();
        const jqTargetText = jqTargetContent.text();

        expect(nqTargetText).toBe(jqTargetText);
        expect(nqTargetText).toBe('PrependedTarget');
    });
});
