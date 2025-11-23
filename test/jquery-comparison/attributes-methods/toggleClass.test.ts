import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('toggleClass() method - jQuery Comparison', () => {
    const html = `
      <div class="container">
        <div id="div1" class="box active">Div 1</div>
        <div id="div2" class="box">Div 2</div>
      </div>
    `;

    test('toggleClass() should add class when it does not exist - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        expect(nqDiv2.hasClass('active')).toBe(jqDiv2.hasClass('active'));
        expect(nqDiv2.hasClass('active')).toBe(false);

        nqDiv2.toggleClass('active');
        jqDiv2.toggleClass('active');

        expect(nqDiv2.hasClass('active')).toBe(jqDiv2.hasClass('active'));
        expect(nqDiv2.hasClass('active')).toBe(true);
    });

    test('toggleClass() should remove class when it exists - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        expect(nqDiv1.hasClass('active')).toBe(jqDiv1.hasClass('active'));
        expect(nqDiv1.hasClass('active')).toBe(true);

        nqDiv1.toggleClass('active');
        jqDiv1.toggleClass('active');

        expect(nqDiv1.hasClass('active')).toBe(jqDiv1.hasClass('active'));
        expect(nqDiv1.hasClass('active')).toBe(false);
    });

    test('toggleClass() with true state should force add - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        nqDiv2.toggleClass('active', true);
        jqDiv2.toggleClass('active', true);

        expect(nqDiv2.hasClass('active')).toBe(jqDiv2.hasClass('active'));
        expect(nqDiv2.hasClass('active')).toBe(true);
    });

    test('toggleClass() with false state should force remove - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        nqDiv1.toggleClass('active', false);
        jqDiv1.toggleClass('active', false);

        expect(nqDiv1.hasClass('active')).toBe(jqDiv1.hasClass('active'));
        expect(nqDiv1.hasClass('active')).toBe(false);
    });

    test('toggleClass() should be chainable - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        const nqResult = nqDiv2.toggleClass('first').toggleClass('second');
        const jqResult = jqDiv2.toggleClass('first').toggleClass('second');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
        expect(nqDiv2.hasClass('first')).toBe(jqDiv2.hasClass('first'));
        expect(nqDiv2.hasClass('second')).toBe(jqDiv2.hasClass('second'));
    });

    test('toggleClass() should handle multiple classes - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        nqDiv2.toggleClass('first second');
        jqDiv2.toggleClass('first second');

        expect(nqDiv2.hasClass('first')).toBe(jqDiv2.hasClass('first'));
        expect(nqDiv2.hasClass('second')).toBe(jqDiv2.hasClass('second'));
        expect(nqDiv2.hasClass('first')).toBe(true);
        expect(nqDiv2.hasClass('second')).toBe(true);

        // Toggle again to remove
        nqDiv2.toggleClass('first second');
        jqDiv2.toggleClass('first second');

        expect(nqDiv2.hasClass('first')).toBe(false);
        expect(nqDiv2.hasClass('second')).toBe(false);
    });

    test('toggleClass() should handle function parameter - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        nqDiv1.toggleClass(function (_index: number, _className: string, _state: boolean) {
            return 'dynamic-class';
        });
        jqDiv1.toggleClass(function (_index: number, _className: string, _state: boolean) {
            return 'dynamic-class';
        });

        expect(nqDiv1.hasClass('dynamic-class')).toBe(jqDiv1.hasClass('dynamic-class'));
        expect(nqDiv1.hasClass('dynamic-class')).toBe(true);
    });
});
