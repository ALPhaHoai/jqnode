import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('prepend() method - Node-Query vs jQuery Comparison', () => {
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
});
