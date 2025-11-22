import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('insertBefore() method - Node-Query vs jQuery Comparison', () => {
    test('insertBefore() should insert elements before target - jquery-comparison', () => {
        const html = `
            <div class="target">Target</div>
            <div class="source">Source</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqSource = nodeQuery.find('.source');
        const jqSource = jquery.find('.source');
        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        nqSource.insertBefore(nqTarget);
        jqSource.insertBefore(jqTarget);

        const nqResult = nodeQuery.text();
        const jqResult = jquery.text();

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe('\n            SourceTarget\n            \n        ');
    });
});
