import { createTestDom } from '../../../utils/jquery-comparison-helpers';

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

    test('insertBefore() should clone elements for multiple targets and return new set - jquery-comparison', () => {
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
        const nqResult = nqSource.insertBefore(nqTargets);
        const jqResult = jqSource.insertBefore(jqTargets);

        // Check return value length (should be 2: 1 clone + 1 original)
        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        // Check targets content
        const nqContainer = nodeQuery.find('.container');
        const jqContainer = jquery.find('.container');

        const nqText = nqContainer.text().replace(/\s+/g, '');
        const jqText = jqContainer.text().replace(/\s+/g, '');
        expect(nqText).toBe('SourceTarget1SourceTarget2');
        expect(nqText).toBe(jqText);
    });
});
