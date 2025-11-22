import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('prevAll() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

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

    test('prevAll() should get all previous siblings - jquery-comparison', () => {
        const nqFourth = nqRoot.find('.fourth');
        const jqFourth = jqRoot.find('.fourth');

        const nqPrevAll = nqFourth.prevAll();
        const jqPrevAll = jqFourth.prevAll();

        expect(nqPrevAll.nodes).toHaveLength(3);
        expect(jqPrevAll.length).toBe(3);

        const nqTexts = nqPrevAll.nodes.map(node => {
            if (node._originalElement) {
                return node._originalElement.textContent;
            }
            return node.children[0]?.value || '';
        });
        const jqTexts = [];
        jqPrevAll.each((index, element) => {
            jqTexts.push(jQuery(element).text());
        });

        expect(nqTexts).toEqual(jqTexts);
        // jQuery returns siblings in reverse document order (farthest first)
        expect(nqTexts).toEqual(['Third', 'Second', 'First']);
    });
});
