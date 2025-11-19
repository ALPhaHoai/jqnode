const $ = require('../../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../../utils/jquery-comparison-helpers');

describe('append() method - Node-Query vs jQuery Comparison', () => {
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
});
