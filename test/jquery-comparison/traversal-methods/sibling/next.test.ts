import { createTestDom } from '../../../utils/jquery-comparison-helpers';

describe('next() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

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

    test('next() should get next sibling - jquery-comparison', () => {
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
});
