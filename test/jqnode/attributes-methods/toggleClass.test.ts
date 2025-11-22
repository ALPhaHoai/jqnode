import $ from '../../../index';
import JQ from '../../../jq';
import { HtmlNode } from '../../../types';

describe('toggleClass() method', () => {
    let root: JQ;

    beforeEach(() => {
        $.clearRootNodesRegistry();
        const html = `
      <div class="container">
        <div id="div1" class="box active">Div 1</div>
        <div id="div2" class="box">Div 2</div>
        <div id="div3" class="circle active highlighted">Div 3</div>
        <span id="span1">Span 1</span>
        <p id="para1" class="text">Paragraph</p>
      </div>
    `;
        root = $(html);
    });

    test('toggleClass() should add class when it does not exist', () => {
        const div2 = root.find('#div2');
        expect(div2.hasClass('active')).toBe(false);

        div2.toggleClass('active');
        expect(div2.hasClass('active')).toBe(true);
    });

    test('toggleClass() should remove class when it exists', () => {
        const div1 = root.find('#div1');
        expect(div1.hasClass('active')).toBe(true);

        div1.toggleClass('active');
        expect(div1.hasClass('active')).toBe(false);
    });

    test('toggleClass() should handle multiple classes', () => {
        const div2 = root.find('#div2');
        expect(div2.hasClass('red')).toBe(false);
        expect(div2.hasClass('blue')).toBe(false);

        div2.toggleClass('red blue');
        expect(div2.hasClass('red')).toBe(true);
        expect(div2.hasClass('blue')).toBe(true);

        // Toggle again to remove
        div2.toggleClass('red blue');
        expect(div2.hasClass('red')).toBe(false);
        expect(div2.hasClass('blue')).toBe(false);
    });

    test('toggleClass() with true state should force add class', () => {
        const div2 = root.find('#div2');
        expect(div2.hasClass('active')).toBe(false);

        div2.toggleClass('active', true);
        expect(div2.hasClass('active')).toBe(true);

        // Try to toggle again with true - should remain added
        div2.toggleClass('active', true);
        expect(div2.hasClass('active')).toBe(true);
    });

    test('toggleClass() with false state should force remove class', () => {
        const div1 = root.find('#div1');
        expect(div1.hasClass('active')).toBe(true);

        div1.toggleClass('active', false);
        expect(div1.hasClass('active')).toBe(false);

        // Try to toggle again with false - should remain removed
        div1.toggleClass('active', false);
        expect(div1.hasClass('active')).toBe(false);
    });

    test('toggleClass() should work on multiple elements', () => {
        const boxes = root.find('.box');

        const div1HasHighlightBefore = root.find('#div1').hasClass('highlight');
        expect(div1HasHighlightBefore).toBe(false);

        const div2HasHighlightBefore = root.find('#div2').hasClass('highlight');
        expect(div2HasHighlightBefore).toBe(false);

        boxes.toggleClass('highlight');

        const div1HasHighlightAfterAdd = root.find('#div1').hasClass('highlight');
        expect(div1HasHighlightAfterAdd).toBe(true);

        const div2HasHighlightAfterAdd = root.find('#div2').hasClass('highlight');
        expect(div2HasHighlightAfterAdd).toBe(true);

        // Toggle again to remove
        boxes.toggleClass('highlight');

        const div1HasHighlightAfterRemove = root.find('#div1').hasClass('highlight');
        expect(div1HasHighlightAfterRemove).toBe(false);

        const div2HasHighlightAfterRemove = root.find('#div2').hasClass('highlight');
        expect(div2HasHighlightAfterRemove).toBe(false);
    });

    test('toggleClass() should be chainable', () => {
        const div2 = root.find('#div2');
        const result = div2.toggleClass('first').toggleClass('second');
        expect(result).toBe(div2);
        expect(div2.hasClass('first')).toBe(true);
        expect(div2.hasClass('second')).toBe(true);
    });

    test('toggleClass() should handle elements without class attribute', () => {
        const span1 = root.find('#span1');
        expect(span1.hasClass('newclass')).toBe(false);

        span1.toggleClass('newclass');
        expect(span1.hasClass('newclass')).toBe(true);
    });

    test('toggleClass() with function should use function return value', () => {
        const div2 = root.find('#div2');
        const toggleFunc = function (index: number, currentClass: string) {
            return 'dynamic-class';
        };

        div2.toggleClass(toggleFunc);
        expect(div2.hasClass('dynamic-class')).toBe(true);

        // Toggle again - should remove since class now exists
        div2.toggleClass(toggleFunc);
        expect(div2.hasClass('dynamic-class')).toBe(false);
    });

    test('toggleClass() function should receive correct parameters', () => {
        const div3 = root.find('#div3');
        let receivedIndex, receivedClass;

        const testFunc = function (index: number, currentClass: string) {
            receivedIndex = index;
            receivedClass = currentClass;
            return 'test-class';
        };

        div3.toggleClass(testFunc);
        expect(receivedIndex).toBe(0); // First element in selection
        expect(receivedClass).toBe('circle active highlighted');
        expect(div3.hasClass('test-class')).toBe(true);
    });

    test('toggleClass() should handle function returning multiple classes', () => {
        const div2 = root.find('#div2');
        const multiClassFunc = function () {
            return 'class1 class2';
        };

        div2.toggleClass(multiClassFunc);
        expect(div2.hasClass('class1')).toBe(true);
        expect(div2.hasClass('class2')).toBe(true);
    });

    test('toggleClass() should skip invalid function returns', () => {
        const div2 = root.find('#div2');
        const invalidFunc = function () {
            return null; // Invalid return
        };

        const originalClasses = div2.attr('class');
        div2.toggleClass(invalidFunc);
        expect(div2.attr('class')).toBe(originalClasses);
    });

    test('toggleClass() should handle empty class names', () => {
        const div2 = root.find('#div2');
        const originalClasses = div2.attr('class');

        div2.toggleClass('');
        expect(div2.attr('class')).toBe(originalClasses);

        div2.toggleClass('   '); // Only whitespace
        expect(div2.attr('class')).toBe(originalClasses);
    });

    test('toggleClass() should work with mixed existing/non-existing classes', () => {
        const div3 = root.find('#div3');
        // div3 has: circle active highlighted

        div3.toggleClass('circle new-class'); // circle exists, new-class doesn't
        expect(div3.hasClass('circle')).toBe(false); // Should be removed
        expect(div3.hasClass('new-class')).toBe(true); // Should be added
        expect(div3.hasClass('active')).toBe(true); // Should remain
        expect(div3.hasClass('highlighted')).toBe(true); // Should remain
    });

    test('toggleClass() should handle empty selection', () => {
        const empty = root.find('.non-existent');
        expect(() => {
            empty.toggleClass('any-class');
        }).not.toThrow();
    });
});
