import { createTestDom } from '../../../utils/jquery-comparison-helpers';
import type { JQ } from '../../../../types';

describe('next() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="item first">First</div>
                <div class="item second">Second</div>
                <div class="item third special">Third Special</div>
                <div class="item fourth">Fourth</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('next() should get next sibling without selector - jquery-comparison', () => {
        const nqFirst = nqRoot.find('.first');
        const jqFirst = jqRoot.find('.first');

        const nqNext = nqFirst.next();
        const jqNext = jqFirst.next();

        expect(nqNext.nodes).toHaveLength(1);
        expect(jqNext.length).toBe(1);

        const nqText = nqNext.text();
        const jqText = jqNext.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second');
    });

    test('next() with selector should return next sibling only if it matches - jquery-comparison', () => {
        const nqSecond = nqRoot.find('.second');
        const jqSecond = jqRoot.find('.second');

        const nqNextSpecial = nqSecond.next('.special');
        const jqNextSpecial = jqSecond.next('.special');

        expect(nqNextSpecial.nodes).toHaveLength(1);
        expect(jqNextSpecial.length).toBe(1);

        const nqText = nqNextSpecial.text();
        const jqText = jqNextSpecial.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third Special');
    });

    test('next() with non-matching selector should return empty - jquery-comparison', () => {
        const nqFirst = nqRoot.find('.first');
        const jqFirst = jqRoot.find('.first');

        // Next sibling is .second, not .special, so should return empty
        const nqNextSpecial = nqFirst.next('.special');
        const jqNextSpecial = jqFirst.next('.special');

        expect(nqNextSpecial.nodes).toHaveLength(0);
        expect(jqNextSpecial.length).toBe(0);
    });

    test('next() on last element should return empty - jquery-comparison', () => {
        const nqFourth = nqRoot.find('.fourth');
        const jqFourth = jqRoot.find('.fourth');

        const nqNext = nqFourth.next();
        const jqNext = jqFourth.next();

        expect(nqNext.nodes).toHaveLength(0);
        expect(jqNext.length).toBe(0);
    });

    test('next() with selector matching non-immediate sibling should return empty - jquery-comparison', () => {
        const nqFirst = nqRoot.find('.first');
        const jqFirst = jqRoot.find('.first');

        // .special exists but it's not the immediate next sibling
        const nqNextSpecial = nqFirst.next('.special');
        const jqNextSpecial = jqFirst.next('.special');

        expect(nqNextSpecial.nodes).toHaveLength(0);
        expect(jqNextSpecial.length).toBe(0);
    });
});
