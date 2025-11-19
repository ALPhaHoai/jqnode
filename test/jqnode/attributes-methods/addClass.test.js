const $ = require('../../../index');

describe('addClass() method', () => {
    let root;

    beforeEach(() => {
        $.clearRootNodesRegistry();
        const html = `
      <div class="container">
        <div class="item" id="div1">First</div>
        <div class="item active" id="div2">Second</div>
        <div class="item multiple classes" id="div3">Third</div>
        <span id="span1">No classes</span>
        <p class="text" id="p1">Paragraph</p>
      </div>
    `;
        root = $(html);
    });

    test('addClass() should add a single class to elements', () => {
        const div1 = root.find('#div1');
        div1.addClass('new-class');
        expect(div1.attr('class')).toBe('item new-class');
    });

    test('addClass() should add multiple classes to elements', () => {
        const div1 = root.find('#div1');
        div1.addClass('class1 class2 class3');
        expect(div1.attr('class')).toBe('item class1 class2 class3');
    });

    test('addClass() should not duplicate existing classes', () => {
        const div2 = root.find('#div2');
        div2.addClass('active new-class');
        expect(div2.attr('class')).toBe('item active new-class');
    });

    test('addClass() should handle elements without class attribute', () => {
        const span1 = root.find('#span1');
        span1.addClass('first-class');
        expect(span1.attr('class')).toBe('first-class');
    });

    test('addClass() should handle function parameter', () => {
        const divs = root.find('.item');

        divs.addClass(function(index, currentClass) {
            return 'dynamic-' + index;
        });

        // Check first element
        expect(divs.eq(0).attr('class')).toBe('item dynamic-0');

        // Check second element
        expect(divs.eq(1).attr('class')).toBe('item active dynamic-1');
    });

    test('addClass() should handle empty string', () => {
        const div1 = root.find('#div1');
        const originalClass = div1.attr('class');

        div1.addClass('');
        expect(div1.attr('class')).toBe(originalClass);
    });

    test('addClass() should handle whitespace-only string', () => {
        const div1 = root.find('#div1');
        const originalClass = div1.attr('class');

        div1.addClass('   ');
        expect(div1.attr('class')).toBe(originalClass);
    });

    test('addClass() should work with multiple elements', () => {
        const divs = root.find('.item');
        divs.addClass('bulk-add');

        // Check each element has the new class
        divs.nodes.forEach(node => {
            expect(node.attributes.class).toContain('bulk-add');
        });
    });

    test('addClass() should return the same collection for chaining', () => {
        const div1 = root.find('#div1');
        const result = div1.addClass('chain-test');

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('class')).toBe('item chain-test');
    });

    test('addClass() should handle special characters in class names', () => {
        const div1 = root.find('#div1');
        div1.addClass('special-class_123');
        expect(div1.attr('class')).toBe('item special-class_123');
    });
});
