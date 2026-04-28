import { createTestDom } from '../../../utils/jquery-comparison-helpers';
import type { JQ } from '../../../../types';

describe('prev() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="item first">First</div>
                <div class="item second special">Second Special</div>
                <div class="item third">Third</div>
                <div class="item fourth">Fourth</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('prev() should get previous sibling without selector - jquery-comparison', () => {
        const nqThird = nqRoot.find('.third');
        const jqThird = jqRoot.find('.third');

        const nqPrev = nqThird.prev();
        const jqPrev = jqThird.prev();

        expect(nqPrev.nodes).toHaveLength(1);
        expect(jqPrev.length).toBe(1);

        const nqText = nqPrev.text();
        const jqText = jqPrev.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second Special');
    });

    test('prev() with selector should return prev sibling only if it matches - jquery-comparison', () => {
        const nqThird = nqRoot.find('.third');
        const jqThird = jqRoot.find('.third');

        const nqPrevSpecial = nqThird.prev('.special');
        const jqPrevSpecial = jqThird.prev('.special');

        expect(nqPrevSpecial.nodes).toHaveLength(1);
        expect(jqPrevSpecial.length).toBe(1);

        const nqText = nqPrevSpecial.text();
        const jqText = jqPrevSpecial.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second Special');
    });

    test('prev() with non-matching selector should return empty - jquery-comparison', () => {
        const nqFourth = nqRoot.find('.fourth');
        const jqFourth = jqRoot.find('.fourth');

        // Previous sibling is .third, not .special, so should return empty
        const nqPrevSpecial = nqFourth.prev('.special');
        const jqPrevSpecial = jqFourth.prev('.special');

        expect(nqPrevSpecial.nodes).toHaveLength(0);
        expect(jqPrevSpecial.length).toBe(0);
    });

    test('prev() on first element should return empty - jquery-comparison', () => {
        const nqFirst = nqRoot.find('.first');
        const jqFirst = jqRoot.find('.first');

        const nqPrev = nqFirst.prev();
        const jqPrev = jqFirst.prev();

        expect(nqPrev.nodes).toHaveLength(0);
        expect(jqPrev.length).toBe(0);
    });

    test('prev() with selector matching non-immediate sibling should return empty - jquery-comparison', () => {
        const nqFourth = nqRoot.find('.fourth');
        const jqFourth = jqRoot.find('.fourth');

        // .special exists but it's not the immediate previous sibling
        const nqPrevSpecial = nqFourth.prev('.special');
        const jqPrevSpecial = jqFourth.prev('.special');

        expect(nqPrevSpecial.nodes).toHaveLength(0);
        expect(jqPrevSpecial.length).toBe(0);
    });
});
