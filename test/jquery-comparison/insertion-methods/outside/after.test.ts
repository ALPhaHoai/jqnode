import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('after() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="target">Target</div>
                <div class="existing">Existing</div>
            </div>
            <div class="source">Source</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('after() should insert content after elements - jquery-comparison', () => {
        const nqTarget = nqRoot.find('.target');
        const jqTarget = jqRoot.find('.target');

        const nqResult = nqTarget.after('<div class="inserted">Inserted</div>');
        const jqResult = jqTarget.after('<div class="inserted">Inserted</div>');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        // Check DOM structure
        const nqContainer = nqRoot.find('.container');
        const jqContainer = jqRoot.find('.container');

        const nqContainerText = nqContainer.text();
        const jqContainerText = jqContainer.text();

        expect(nqContainerText).toBe(jqContainerText);
        expect(nqContainerText).toBe(
            '\n                TargetInserted\n                Existing\n            ',
        );
    });

    test('after() should clone content for multiple targets except the last one - jquery-comparison', () => {
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

        // Insert source after targets
        nqTargets.after(nqSource);
        jqTargets.after(jqSource);

        // Check Container Text
        const nqContainer = nodeQuery.find('.container');
        const jqContainer = jquery.find('.container');

        expect(nqContainer.text()).toBe(jqContainer.text());
        // Expected: Target 1SourceTarget 2Source
        // Note: text() concatenates all descendants.
        // Structure:
        // Target 1
        // Source (Clone)
        // Target 2
        // Source (Original)

        // Let's check siblings specifically
        const nqTarget1 = nqTargets.eq(0);
        const jqTarget1 = jqTargets.eq(0);

        // Next sibling of Target 1 should be Source
        // In jqnode, nextSibling might need to be accessed via parent children index
        // But we can check text content of container which should be correct

        const nqText = nqContainer.text().replace(/\s+/g, '');
        const jqText = jqContainer.text().replace(/\s+/g, '');
        expect(nqText).toBe('Target1SourceTarget2Source');
        expect(nqText).toBe(jqText);
    });
});
