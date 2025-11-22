import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('before() method - Node-Query vs jQuery Comparison', () => {
    test('before() should insert content before elements - jquery-comparison', () => {
        const html = `<div class="target">Target</div>`;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        nqTarget.before('<div>Before</div>');
        jqTarget.before('<div>Before</div>');

        const nqResult = nodeQuery.text();
        const jqResult = jquery.text();

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe('BeforeTarget');
    });
});
