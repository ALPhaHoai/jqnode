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

    test('before() should clone content for multiple targets except the last one - jquery-comparison', () => {
        const html = `
            <div class="container">
                <div class="target1">Target 1</div>
                <div class="target2">Target 2</div>
            </div>
            <div class="source">Source</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTargets = nodeQuery.find('.container').children();
        const jqTargets = jquery.find('.container').children();

        const nqSource = nodeQuery.find('.source');
        const jqSource = jquery.find('.source');

        // Insert source before targets
        nqTargets.before(nqSource);
        jqTargets.before(jqSource);

        // Check Container Text
        const nqContainer = nodeQuery.find('.container');
        const jqContainer = jquery.find('.container');

        expect(nqContainer.text()).toBe(jqContainer.text());

        const nqText = nqContainer.text().replace(/\s+/g, '');
        const jqText = jqContainer.text().replace(/\s+/g, '');
        expect(nqText).toBe('SourceTarget1SourceTarget2');
        expect(nqText).toBe(jqText);
    });
});
