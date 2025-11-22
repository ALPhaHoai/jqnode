import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('prev() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="item first">First</div>
                <div class="item second">Second</div>
                <div class="item third">Third</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('prev() should get previous sibling - jquery-comparison', () => {
        const nqThird = nqRoot.find('.third');
        const jqThird = jqRoot.find('.third');

        const nqPrev = nqThird.prev();
        const jqPrev = jqThird.prev();

        expect(nqPrev.nodes).toHaveLength(1);
        expect(jqPrev.length).toBe(1);

        const nqText = nqPrev.text();
        const jqText = jqPrev.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second');
    });
});
