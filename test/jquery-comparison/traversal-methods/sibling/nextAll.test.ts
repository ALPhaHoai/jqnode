import jQuery from 'jquery';
import { createTestDom } from '../../../utils/jquery-comparison-helpers';
import type { JqElement, JQ } from '../../../../types';

describe('nextAll() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="item first">First</div>
                <div class="item second">Second</div>
                <div class="item third">Third</div>
                <div class="item fourth">Fourth</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('nextAll() should get all next siblings - jquery-comparison', () => {
        const nqFirst = nqRoot.find('.first');
        const jqFirst = jqRoot.find('.first');

        const nqNextAll = nqFirst.nextAll();
        const jqNextAll = jqFirst.nextAll();

        expect(nqNextAll.nodes).toHaveLength(3);
        expect(jqNextAll.length).toBe(3);

        const nqTexts = nqNextAll.nodes.map((node: JqElement) => node.children[0]?.value || '');
        const jqTexts = [];
        jqNextAll.each((index: number, element: HTMLElement) => {
            jqTexts.push(jQuery(element).text());
        });

        expect(nqTexts).toEqual(jqTexts);
        expect(nqTexts).toEqual(['Second', 'Third', 'Fourth']);
    });
});
