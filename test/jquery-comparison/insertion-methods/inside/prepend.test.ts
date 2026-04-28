import { createTestDom } from '../../../utils/jquery-comparison-helpers';
import { JQ } from '../../../../index';

describe('prepend() method - Deep Verification vs jQuery', () => {
    let nqRoot: JQ;
    let jqRoot: any;

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

    test('prepend() should clone content for multiple targets except the last one - jquery-comparison', () => {
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
        nqTargets.prepend(nqSource);
        jqTargets.prepend(jqSource);

        // Check Target 1
        const nqTarget1 = nqTargets.eq(0);
        const jqTarget1 = jqTargets.eq(0);
        expect(nqTarget1.children()).toHaveLength(jqTarget1.children().length);
        expect(nqTarget1.text()).toBe(jqTarget1.text());

        // Check Target 2
        const nqTarget2 = nqTargets.eq(1);
        const jqTarget2 = jqTargets.eq(1);
        expect(nqTarget2.children()).toHaveLength(jqTarget2.children().length);
        expect(nqTarget2.text()).toBe(jqTarget2.text());

        // Check order
        expect(nqTarget1.text()).toBe('SourceTarget 1');
        expect(nqTarget2.text()).toBe('SourceTarget 2');
    });

    test('prepend() should preserve order with multiple arguments - jquery-comparison', () => {
        const html = `<div class="target">Existing</div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        nqTarget.prepend('<span class="s1">S1</span>', '<span class="s2">S2</span>', '<span class="s3">S3</span>');
        jqTarget.prepend('<span class="s1">S1</span>', '<span class="s2">S2</span>', '<span class="s3">S3</span>');

        expect(nqTarget.text()).toBe(jqTarget.text());
        expect(nqTarget.text()).toBe('S1S2S3Existing');

        // Check order of children
        const nqChildren = nqTarget.children();
        const jqChildren = jqTarget.children();

        expect(nqChildren.eq(0).hasClass('s1')).toBe(jqChildren.eq(0).hasClass('s1'));
        expect(nqChildren.eq(1).hasClass('s2')).toBe(jqChildren.eq(1).hasClass('s2'));
        expect(nqChildren.eq(2).hasClass('s3')).toBe(jqChildren.eq(2).hasClass('s3'));
    });

    test('prepend() should return target for chaining - jquery-comparison', () => {
        const html = `<div class="target">Target</div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        const nqResult = nqTarget.prepend('<span>Content</span>');
        const jqResult = jqTarget.prepend('<span>Content</span>');

        // Result should be the same as target (for chaining)
        expect(nqResult.nodes[0]).toBe(nqTarget.nodes[0]);
        expect(jqResult[0]).toBe(jqTarget[0]);
        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('prepend() with multiple sources to multiple targets - jquery-comparison', () => {
        const html = `
            <div><div class="t1">T1</div><div class="t2">T2</div></div>
            <span class="s1">S1</span><span class="s2">S2</span>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTargets = nodeQuery.find('.t1, .t2');
        const jqTargets = jquery.find('.t1, .t2');

        const nqS1 = nodeQuery.find('.s1');
        const jqS1 = jquery.find('.s1');
        const nqS2 = nodeQuery.find('.s2');
        const jqS2 = jquery.find('.s2');

        nqTargets.prepend(nqS1, nqS2);
        jqTargets.prepend(jqS1, jqS2);

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

    test('prepend() should perform deep cloning - jquery-comparison', () => {
        const html = `
            <div><div class="t1">T1</div><div class="t2">T2</div></div>
            <div class="src"><span class="child">Child</span></div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTargets = nodeQuery.find('.t1, .t2');
        const jqTargets = jquery.find('.t1, .t2');

        const nqSource = nodeQuery.find('.src');
        const jqSource = jquery.find('.src');

        nqTargets.prepend(nqSource);
        jqTargets.prepend(jqSource);

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
