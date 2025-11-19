const $ = require('../../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../../utils/jquery-comparison-helpers');

describe('nextUntil() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="item first">First</div>
                <div class="item second">Second</div>
                <div class="item third stop">Third</div>
                <div class="item fourth">Fourth</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('nextUntil() should get next siblings until selector - jquery-comparison', () => {
        const nqFirst = nqRoot.find('.first');
        const jqFirst = jqRoot.find('.first');

        const nqNextUntil = nqFirst.nextUntil('.stop');
        const jqNextUntil = jqFirst.nextUntil('.stop');

        expect(nqNextUntil.nodes).toHaveLength(1);
        expect(jqNextUntil.length).toBe(1);

        const nqText = nqNextUntil.text();
        const jqText = jqNextUntil.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second');
    });
});
