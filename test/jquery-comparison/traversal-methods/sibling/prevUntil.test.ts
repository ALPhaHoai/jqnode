import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';
import type { HtmlNode, JQ } from '../../../../types';

describe('prevUntil() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="item first stop">First</div>
                <div class="item second">Second</div>
                <div class="item third">Third</div>
                <div class="item fourth">Fourth</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('prevUntil() should get previous siblings until selector - jquery-comparison', () => {
        const nqFourth = nqRoot.find('.fourth');
        const jqFourth = jqRoot.find('.fourth');

        const nqPrevUntil = nqFourth.prevUntil('.stop');
        const jqPrevUntil = jqFourth.prevUntil('.stop');

        expect(nqPrevUntil.nodes).toHaveLength(2);
        expect(jqPrevUntil.length).toBe(2);

        const nqTexts = nqPrevUntil.nodes.map((node: HtmlNode) => {
            if (node._originalElement) {
                return node._originalElement.textContent;
            }
            return node.children[0]?.value || '';
        });
        const jqTexts = [];
        jqPrevUntil.each((index: number, element: HTMLElement) => {
            jqTexts.push(jQuery(element).text());
        });

        expect(nqTexts).toEqual(jqTexts);
        // jQuery returns siblings in reverse document order (farthest first)
        expect(nqTexts).toEqual(['Third', 'Second']);
    });
});
