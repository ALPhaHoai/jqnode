import { createTestDom } from '../../../utils/jquery-comparison-helpers';
import { JQ } from '../../../../index';

describe('appendTo() method - Deep Verification vs jQuery', () => {
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

    test('appendTo() with multiple sources to multiple targets - jquery-comparison', () => {
        const html = `
            <div><div class="t1">T1</div><div class="t2">T2</div></div>
            <span class="s1">S1</span><span class="s2">S2</span>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTargets = nodeQuery.find('.t1, .t2');
        const jqTargets = jquery.find('.t1, .t2');

        const nqSources = nodeQuery.find('.s1, .s2');
        const jqSources = jquery.find('.s1, .s2');

        const nqResult = nqSources.appendTo(nqTargets);
        const jqResult = jqSources.appendTo(jqTargets);

        // Result should contain 4 elements (2 sources × 2 targets)
        expect(nqResult.nodes).toHaveLength(4);
        expect(jqResult.length).toBe(4);

        // Check text content matches
        const nqT1 = nqTargets.eq(0);
        const jqT1 = jqTargets.eq(0);
        expect(nqT1.text()).toBe(jqT1.text());
        expect(nqT1.text()).toBe('T1S1S2');

        const nqT2 = nqTargets.eq(1);
        const jqT2 = jqTargets.eq(1);
        expect(nqT2.text()).toBe(jqT2.text());
        expect(nqT2.text()).toBe('T2S1S2');
    });

    test('appendTo() with empty targets returns empty set - jquery-comparison', () => {
        const html = `<div class="source">Source</div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqSource = nodeQuery.find('.source');
        const jqSource = jquery.find('.source');

        const nqResult = nqSource.appendTo(nodeQuery.find('.nonexistent'));
        const jqResult = jqSource.appendTo(jquery.find('.nonexistent'));

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);

        // Source should still exist
        expect(nqSource.nodes).toHaveLength(1);
        expect(jqSource.length).toBe(1);
    });

    test('appendTo() should perform deep cloning - jquery-comparison', () => {
        const html = `
            <div><div class="t1">T1</div><div class="t2">T2</div></div>
            <div class="src"><span class="child">Child</span></div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTargets = nodeQuery.find('.t1, .t2');
        const jqTargets = jquery.find('.t1, .t2');

        const nqSource = nodeQuery.find('.src');
        const jqSource = jquery.find('.src');

        nqSource.appendTo(nqTargets);
        jqSource.appendTo(jqTargets);

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
});
