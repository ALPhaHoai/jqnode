import { createTestDom } from '../../../utils/jquery-comparison-helpers';

describe('wrapAll() method - Node-Query vs jQuery Comparison', () => {
    test('wrapAll() should wrap all elements together - jquery-comparison', () => {
        const html = `
            <div class="target">Target 1</div>
            <div class="target">Target 2</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqTargets = nodeQuery.find('.target');
        const jqTargets = jquery.find('.target');

        nqTargets.wrapAll('<div class="wrapper"></div>');
        jqTargets.wrapAll('<div class="wrapper"></div>');

        const nqWrapper = nodeQuery.find('.wrapper');
        const jqWrapper = jquery.find('.wrapper');

        expect(nqWrapper.nodes).toHaveLength(1);
        expect(jqWrapper.length).toBe(1);

        const nqWrapperText = nqWrapper.text();
        const jqWrapperText = jqWrapper.text();

        expect(nqWrapperText).toBe(jqWrapperText);
        expect(nqWrapperText).toBe('Target 1Target 2');
    });
});
