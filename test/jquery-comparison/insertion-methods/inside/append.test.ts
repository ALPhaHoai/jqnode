import { createTestDom } from '../../../utils/jquery-comparison-helpers';

describe('append() method - Node-Query vs jQuery Comparison', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nqRoot: JQ, jqRoot: JQuery<any>;

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

    test('append() should append content to elements - jquery-comparison', () => {
        const nqTarget = nqRoot.find('.target');
        const jqTarget = jqRoot.find('.target');

        const nqSource = nqRoot.find('.source');
        const jqSource = jqRoot.find('.source');

        const nqResult = nqTarget.append(nqSource);
        const jqResult = jqTarget.append(jqSource);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        // Check that source was moved into target
        const nqTargetContent = nqRoot.find('.target');
        const jqTargetContent = jqRoot.find('.target');

        const nqTargetText = nqTargetContent.text();
        const jqTargetText = jqTargetContent.text();

        expect(nqTargetText).toBe(jqTargetText);
        expect(nqTargetText).toBe('TargetSource');

        // Check that source was moved but is still findable (jQuery moves, doesn't clone)
        const nqRemainingSource = nqRoot.find('.source');
        const jqRemainingSource = jqRoot.find('.source');

        expect(nqRemainingSource.nodes).toHaveLength(1);
        expect(jqRemainingSource.length).toBe(1);
    });

    test('append() should append HTML string - jquery-comparison', () => {
        const nqTarget = nqRoot.find('.target');
        const jqTarget = jqRoot.find('.target');

        const nqResult = nqTarget.append('<span>Appended</span>');
        const jqResult = jqTarget.append('<span>Appended</span>');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqTargetContent = nqRoot.find('.target');
        const jqTargetContent = jqRoot.find('.target');

        const nqTargetText = nqTargetContent.text();
        const jqTargetText = jqTargetContent.text();

        expect(nqTargetText).toBe(jqTargetText);
        expect(nqTargetText).toBe('TargetAppended');
    });

    test('append() should clone content for multiple targets except the last one - jquery-comparison', () => {
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
        nqTargets.append(nqSource);
        jqTargets.append(jqSource);

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
    });

    test('append() should return target for chaining - jquery-comparison', () => {
        const html = `
            <div class="target">Target</div>
            <div class="source">Source</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');
        const nqSource = nodeQuery.find('.source');
        const jqSource = jquery.find('.source');

        const nqResult = nqTarget.append(nqSource);
        const jqResult = jqTarget.append(jqSource);

        // Result should be the same as target (for chaining)
        expect(nqResult.nodes[0]).toBe(nqTarget.nodes[0]);
        expect(jqResult[0]).toBe(jqTarget[0]);
        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('append() with empty source should be no-op - jquery-comparison', () => {
        const html = `<div class="target">Target</div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        const nqChildrenBefore = nqTarget.children().length;
        const jqChildrenBefore = jqTarget.children().length;

        const nqResult = nqTarget.append(nodeQuery.find('.nonexistent'));
        const jqResult = jqTarget.append(jquery.find('.nonexistent'));

        const nqChildrenAfter = nqTarget.children().length;
        const jqChildrenAfter = jqTarget.children().length;

        expect(nqChildrenBefore).toBe(jqChildrenBefore);
        expect(nqChildrenAfter).toBe(jqChildrenAfter);
        expect(nqResult.nodes[0]).toBe(nqTarget.nodes[0]);
        expect(jqResult[0]).toBe(jqTarget[0]);
    });

    test('append() with multiple arguments should preserve order - jquery-comparison', () => {
        const html = `<div class="target"></div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTarget = nodeQuery.find('.target');
        const jqTarget = jquery.find('.target');

        nqTarget.append('<span>1</span>', '<span>2</span>', '<span>3</span>');
        jqTarget.append('<span>1</span>', '<span>2</span>', '<span>3</span>');

        expect(nqTarget.text()).toBe(jqTarget.text());
        expect(nqTarget.text()).toBe('123');
        expect(nqTarget.children().length).toBe(jqTarget.children().length);
        expect(nqTarget.children().length).toBe(3);
    });

    test('append() should move original to LAST target - jquery-comparison', () => {
        const html = `
            <div><div class="t1">T1</div><div class="t2">T2</div><div class="t3">T3</div></div>
            <div class="source" data-original="true">Source</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqTargets = nodeQuery.find('.t1, .t2, .t3');
        const jqTargets = jquery.find('.t1, .t2, .t3');
        const nqSource = nodeQuery.find('.source');
        const jqSource = jquery.find('.source');

        nqTargets.append(nqSource);
        jqTargets.append(jqSource);

        // Check that all targets have the source
        expect(nodeQuery.find('.t1 .source').length).toBe(jquery.find('.t1 .source').length);
        expect(nodeQuery.find('.t2 .source').length).toBe(jquery.find('.t2 .source').length);
        expect(nodeQuery.find('.t3 .source').length).toBe(jquery.find('.t3 .source').length);

        // Total source elements
        expect(nodeQuery.find('.source').length).toBe(jquery.find('.source').length);
        expect(nodeQuery.find('.source').length).toBe(3); // 2 clones + 1 original
    });
});
