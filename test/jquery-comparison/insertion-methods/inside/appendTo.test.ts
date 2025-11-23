import { createTestDom } from '../../../utils/jquery-comparison-helpers';

import { JQ } from '../../../../index';

describe('appendTo() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: any;

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

    test('appendTo() should clone elements for multiple targets and return new set - jquery-comparison', () => {
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

        // Append source to targets
        const nqResult = nqSource.appendTo(nqTargets);
        const jqResult = jqSource.appendTo(jqTargets);

        // Check return value length (should be 2: 1 clone + 1 original)
        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        // Check targets content
        const nqTarget1 = nqTargets.eq(0);
        const jqTarget1 = jqTargets.eq(0);
        expect(nqTarget1.text()).toBe(jqTarget1.text());
        expect(nqTarget1.text()).toBe('Target 1Source');

        const nqTarget2 = nqTargets.eq(1);
        const jqTarget2 = jqTargets.eq(1);
        expect(nqTarget2.text()).toBe(jqTarget2.text());
        expect(nqTarget2.text()).toBe('Target 2Source');
    });
});
