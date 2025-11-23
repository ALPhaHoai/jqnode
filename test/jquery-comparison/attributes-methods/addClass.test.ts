import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { HtmlNode } from '../../../types';

describe('addClass() method - jQuery Comparison', () => {
    const html = `
      <div class="container">
        <div class="item" id="div1">First</div>
        <div class="item active" id="div2">Second</div>
        <div class="item multiple classes" id="div3">Third</div>
        <span id="span1">No classes</span>
        <p class="text" id="p1">Paragraph</p>
      </div>
    `;

    test('addClass() should add a single class to elements - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        nqDiv1.addClass('new-class');
        jqDiv1.addClass('new-class');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item new-class');
    });

    test('addClass() should add multiple classes to elements - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        nqDiv1.addClass('class1 class2 class3');
        jqDiv1.addClass('class1 class2 class3');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item class1 class2 class3');
    });

    test('addClass() should not duplicate existing classes - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        nqDiv2.addClass('active new-class');
        jqDiv2.addClass('active new-class');

        const nqClass = nqDiv2.attr('class');
        const jqClass = jqDiv2.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item active new-class');
    });

    test('addClass() should handle elements without class attribute - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqSpan1 = nqRoot.find('#span1');
        const jqSpan1 = jqRoot.find('#span1');

        nqSpan1.addClass('first-class');
        jqSpan1.addClass('first-class');

        const nqClass = nqSpan1.attr('class');
        const jqClass = jqSpan1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('first-class');
    });

    test('addClass() should handle function parameter - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDivs = nqRoot.find('.item');
        const jqDivs = jqRoot.find('.item');

        nqDivs.addClass(function (index: number, _currentClass: string) {
            return 'dynamic-' + index;
        });
        jqDivs.addClass(function (index: number, _currentClass: string | undefined) {
            return 'dynamic-' + index;
        });

        const nqClass0 = nqDivs.eq(0).attr('class');
        const jqClass0 = jqDivs.eq(0).attr('class');
        expect(nqClass0).toBe(jqClass0);
        expect(nqClass0).toBe('item dynamic-0');

        const nqClass1 = nqDivs.eq(1).attr('class');
        const jqClass1 = jqDivs.eq(1).attr('class');
        expect(nqClass1).toBe(jqClass1);
        expect(nqClass1).toBe('item active dynamic-1');
    });

    test('addClass() should handle empty string - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqOriginal = nqDiv1.attr('class');
        const jqOriginal = jqDiv1.attr('class');

        nqDiv1.addClass('');
        jqDiv1.addClass('');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe(nqOriginal);
        expect(jqClass).toBe(jqOriginal);
    });

    test('addClass() should handle whitespace-only string - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqOriginal = nqDiv1.attr('class');
        const jqOriginal = jqDiv1.attr('class');

        nqDiv1.addClass('   ');
        jqDiv1.addClass('   ');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe(nqOriginal);
        expect(jqClass).toBe(jqOriginal);
    });

    test('addClass() should work with multiple elements - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDivs = nqRoot.find('.item');
        const jqDivs = jqRoot.find('.item');

        nqDivs.addClass('bulk-add');
        jqDivs.addClass('bulk-add');

        // Check each element has the new class
        nqDivs.nodes.forEach((node: HtmlNode, index: number) => {
            const nqClass = node.attributes?.class;
            const jqClass = jqDivs.eq(index).attr('class');
            expect(nqClass).toContain('bulk-add');
            expect(jqClass).toContain('bulk-add');
        });
    });

    test('addClass() should return the same collection for chaining - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqResult = nqDiv1.addClass('chain-test');
        const jqResult = jqDiv1.addClass('chain-test');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqClass = nqResult.attr('class');
        const jqClass = jqResult.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item chain-test');
    });

    test('addClass() should handle special characters in class names - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        nqDiv1.addClass('special-class_123');
        jqDiv1.addClass('special-class_123');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item special-class_123');
    });
});
