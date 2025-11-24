import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JqElement } from '../../../types';

describe('removeClass() method - jQuery Comparison', () => {
    const html = `
      <div class="container">
        <div class="item active highlighted" id="div1">First</div>
        <div class="item active" id="div2">Second</div>
        <div class="item multiple classes here" id="div3">Third</div>
        <span class="single-class" id="span1">No classes</span>
        <p class="text bold italic" id="p1">Paragraph</p>
      </div>
    `;

    test('removeClass() should remove a single class from elements - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        nqDiv1.removeClass('active');
        jqDiv1.removeClass('active');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item highlighted');
    });

    test('removeClass() should remove multiple classes from elements - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        nqDiv1.removeClass('active highlighted');
        jqDiv1.removeClass('active highlighted');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item');
    });

    test('removeClass() should handle classes that do not exist - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        nqDiv2.removeClass('nonexistent');
        jqDiv2.removeClass('nonexistent');

        const nqClass = nqDiv2.attr('class');
        const jqClass = jqDiv2.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item active');
    });

    test('removeClass() should handle function parameter - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDivs = nqRoot.find('.item');
        const jqDivs = jqRoot.find('.item');

        nqDivs.removeClass(function (index: number, currentClass: string) {
            const classes = currentClass.split(/\s+/).filter((cls: string) => cls.length > 0);
            return classes[0];
        });
        jqDivs.removeClass(function (index: number, currentClass: string | undefined) {
            const classes = (currentClass || '')
                .split(/\s+/)
                .filter((cls: string) => cls.length > 0);
            return classes[0];
        });

        const nqClass0 = nqDivs.eq(0).attr('class');
        const jqClass0 = jqDivs.eq(0).attr('class');
        expect(nqClass0).toBe(jqClass0);
        expect(nqClass0).toBe('active highlighted');

        const nqClass1 = nqDivs.eq(1).attr('class');
        const jqClass1 = jqDivs.eq(1).attr('class');
        expect(nqClass1).toBe(jqClass1);
        expect(nqClass1).toBe('active');
    });

    test('removeClass() should remove all classes when no parameter provided - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqP1 = nqRoot.find('#p1');
        const jqP1 = jqRoot.find('#p1');

        nqP1.removeClass();
        jqP1.removeClass();

        const nqClass = nqP1.attr('class');
        const jqClass = jqP1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('');
    });

    test('removeClass() should handle empty string - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqOriginal = nqDiv1.attr('class');
        const jqOriginal = jqDiv1.attr('class');

        nqDiv1.removeClass('');
        jqDiv1.removeClass('');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe(nqOriginal);
        expect(jqClass).toBe(jqOriginal);
    });

    test('removeClass() should handle whitespace-only string - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqOriginal = nqDiv1.attr('class');

        nqDiv1.removeClass('   ');
        jqDiv1.removeClass('   ');

        const nqClass = nqDiv1.attr('class');
        const jqClass = jqDiv1.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe(nqOriginal);
    });

    test('removeClass() should work with multiple elements - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        nqItems.removeClass('item');
        jqItems.removeClass('item');

        nqItems.nodes.forEach((node: JqElement, index: number) => {
            const nqClass = node.attributes?.class;
            const jqClass = jqItems.eq(index).attr('class');
            expect(nqClass).not.toContain('item');
            expect(jqClass).not.toContain('item');
        });
    });

    test('removeClass() should return the same collection for chaining - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqResult = nqDiv1.removeClass('active');
        const jqResult = jqDiv1.removeClass('active');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqClass = nqResult.attr('class');
        const jqClass = jqResult.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item highlighted');
    });

    test('removeClass() should handle special characters in class names - jquery-comparison', () => {
        const specialHtml = `<div class="special-class_123 normal-class"></div>`;
        const { jquery: jqElement, nodeQuery: nqElement } = createTestDom(specialHtml);

        const nqDiv = nqElement.find('div');
        const jqDiv = jqElement.find('div');

        nqDiv.removeClass('special-class_123');
        jqDiv.removeClass('special-class_123');

        const nqClass = nqDiv.attr('class');
        const jqClass = jqDiv.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('normal-class');
    });
});
