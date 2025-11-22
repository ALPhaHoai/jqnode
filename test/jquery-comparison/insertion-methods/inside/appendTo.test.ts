import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('appendTo() method - Node-Query vs jQuery Comparison', () => {
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

    test('appendTo() should append elements to target - jquery-comparison', () => {
        const nqSource = nqRoot.find('.source');
        const jqSource = jqRoot.find('.source');

        const nqTarget = nqRoot.find('.target');
        const jqTarget = jqRoot.find('.target');

        const nqResult = nqSource.appendTo(nqTarget);
        const jqResult = jqSource.appendTo(jqTarget);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        // Check that source was moved into target
        const nqTargetContent = nqRoot.find('.target');
        const jqTargetContent = jqRoot.find('.target');

        const nqTargetText = nqTargetContent.text();
        const jqTargetText = jqTargetContent.text();

        expect(nqTargetText).toBe(jqTargetText);
        expect(nqTargetText).toBe('TargetSource');
    });
});
