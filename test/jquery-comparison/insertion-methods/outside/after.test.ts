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
        expect(nqContainerText).toBe('\n                TargetInserted\n                Existing\n            ');
    });
});
