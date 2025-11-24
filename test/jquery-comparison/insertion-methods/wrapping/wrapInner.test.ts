import { createTestDom } from '../../../utils/jquery-comparison-helpers';

describe('wrapInner() method - Node-Query vs jQuery Comparison', () => {
    test('wrapInner() should wrap inner content - jquery-comparison', () => {
        const html = `<div class="target">Inner Content</div>`;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        nqTarget.wrapInner('<span class="wrapper"></span>');
        jqTarget.wrapInner('<span class="wrapper"></span>');

        const nqWrapper = nodeQuery.find('.wrapper');
        const jqWrapper = jquery.find('.wrapper');

        expect(nqWrapper.nodes).toHaveLength(1);
        expect(jqWrapper.length).toBe(1);

        const nqWrapperText = nqWrapper.text();
        const jqWrapperText = jqWrapper.text();

        expect(nqWrapperText).toBe(jqWrapperText);
        expect(nqWrapperText).toBe('Inner Content');
    });
});
