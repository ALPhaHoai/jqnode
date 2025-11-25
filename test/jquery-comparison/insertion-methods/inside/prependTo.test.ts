import { createTestDom } from '../../../utils/jquery-comparison-helpers';
import { JQ } from '../../../../index';

describe('prependTo() method - Deep Verification vs jQuery', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

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

    test('prependTo() should prepend elements to target - jquery-comparison', () => {
        const nqSource = nqRoot.find('.source');
        const jqSource = jqRoot.find('.source');

        const nqTarget = nqRoot.find('.target');
        const jqTarget = jqRoot.find('.target');

        const nqResult = nqSource.prependTo(nqTarget);
        const jqResult = jqSource.prependTo(jqTarget);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqTargetContent = nqRoot.find('.target');
        const jqTargetContent = jqRoot.find('.target');

        const nqTargetText = nqTargetContent.text();
        const jqTargetText = jqTargetContent.text();

        expect(nqTargetText).toBe(jqTargetText);
        expect(nqTargetText).toBe('SourceTarget');
    });

    test('prependTo() should clone elements for multiple targets and return new set - jquery-comparison', () => {
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

        // Prepend source to targets
        const nqResult = nqSource.prependTo(nqTargets);
        const jqResult = jqSource.prependTo(jqTargets);

        // Check return value length (should be 2: 1 clone + 1 original)
        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        // Check targets content
        const nqTarget1 = nqTargets.eq(0);
        const jqTarget1 = jqTargets.eq(0);
        expect(nqTarget1.text()).toBe(jqTarget1.text());
        expect(nqTarget1.text()).toBe('SourceTarget 1');

        const nqTarget2 = nqTargets.eq(1);
        const jqTarget2 = jqTargets.eq(1);
        expect(nqTarget2.text()).toBe(jqTarget2.text());
        expect(nqTarget2.text()).toBe('SourceTarget 2');
    });

    test('prependTo() with multiple sources to multiple targets - jquery-comparison', () => {
        const html = `
            <div><div class="t1">T1</div><div class="t2">T2</div></div>
            <span class="s1">S1</span><span class="s2">S2</span>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTargets = nodeQuery.find('.t1, .t2');
        const jqTargets = jquery.find('.t1, .t2');

        const nqSources = nodeQuery.find('.s1, .s2');
        const jqSources = jquery.find('.s1, .s2');

        const nqResult = nqSources.prependTo(nqTargets);
        const jqResult = jqSources.prependTo(jqTargets);

        // Result should contain 4 elements (2 sources × 2 targets)
        expect(nqResult.nodes).toHaveLength(4);
        expect(jqResult.length).toBe(4);

        // Check text content matches
        const nqT1 = nqTargets.eq(0);
        const jqT1 = jqTargets.eq(0);
        expect(nqT1.text()).toBe(jqT1.text());
        expect(nqT1.text()).toBe('S1S2T1');

        const nqT2 = nqTargets.eq(1);
        const jqT2 = jqTargets.eq(1);
        expect(nqT2.text()).toBe(jqT2.text());
        expect(nqT2.text()).toBe('S1S2T2');
    });

    test('prependTo() with empty targets returns empty set - jquery-comparison', () => {
        const html = `<div class="source">Source</div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqSource = nodeQuery.find('.source');
        const jqSource = jquery.find('.source');

        const nqResult = nqSource.prependTo(nodeQuery.find('.nonexistent'));
        const jqResult = jqSource.prependTo(jquery.find('.nonexistent'));

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);

        // Source should still exist
        expect(nqSource.nodes).toHaveLength(1);
        expect(jqSource.length).toBe(1);
    });

    test('prependTo() should perform deep cloning - jquery-comparison', () => {
        const html = `
            <div><div class="t1">T1</div><div class="t2">T2</div></div>
            <div class="src"><span class="child">Child</span></div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTargets = nodeQuery.find('.t1, .t2');
        const jqTargets = jquery.find('.t1, .t2');

        const nqSource = nodeQuery.find('.src');
        const jqSource = jquery.find('.src');

        nqSource.prependTo(nqTargets);
        jqSource.prependTo(jqTargets);

        // Both targets should have the child element
        const nqT1Child = nodeQuery.find('.t1 .src .child');
        const jqT1Child = jquery.find('.t1 .src .child');
        expect(nqT1Child.length).toBe(1);
        expect(jqT1Child.length).toBe(1);
        expect(nqT1Child.text()).toBe(jqT1Child.text());

        const nqT2Child = nodeQuery.find('.t2 .src .child');
        const jqT2Child = jquery.find('.t2 .src .child');
        expect(nqT2Child.length).toBe(1);
        expect(jqT2Child.length).toBe(1);
        expect(nqT2Child.text()).toBe(jqT2Child.text());
    });

    test('prependTo() should maintain order with multiple sources - jquery-comparison', () => {
        const html = `
            <div class="target">Existing</div>
            <span class="s1">S1</span><span class="s2">S2</span>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        const nqSources = nodeQuery.find('.s1, .s2');
        const jqSources = jquery.find('.s1, .s2');

        nqSources.prependTo(nqTarget);
        jqSources.prependTo(jqTarget);

        expect(nqTarget.text()).toBe(jqTarget.text());
        expect(nqTarget.text()).toBe('S1S2Existing');
    });
});
