import $ from '../../../index';

describe('removeClass() method', () => {
    let root;

    beforeEach(() => {
        $.clearRootNodesRegistry();
        const html = `
      <div class="container">
        <div class="item active highlighted" id="div1">First</div>
        <div class="item active" id="div2">Second</div>
        <div class="item multiple classes here" id="div3">Third</div>
        <span class="single-class" id="span1">No classes</span>
        <p class="text bold italic" id="p1">Paragraph</p>
      </div>
    `;
        root = $(html);
    });

    test('removeClass() should remove a single class from elements', () => {
        const div1 = root.find('#div1');
        div1.removeClass('active');
        expect(div1.attr('class')).toBe('item highlighted');
    });

    test('removeClass() should remove multiple classes from elements', () => {
        const div1 = root.find('#div1');
        div1.removeClass('active highlighted');
        expect(div1.attr('class')).toBe('item');
    });

    test('removeClass() should handle classes that do not exist', () => {
        const div2 = root.find('#div2');
        div2.removeClass('nonexistent');
        expect(div2.attr('class')).toBe('item active');
    });

    test('removeClass() should handle function parameter', () => {
        const divs = root.find('.item');

        divs.removeClass(function(index, currentClass) {
            // Remove the first class from each element
            const classes = currentClass.split(/\s+/).filter(cls => cls.length > 0);
            return classes[0];
        });

        // Check first element (should remove 'item')
        expect(divs.eq(0).attr('class')).toBe('active highlighted');

        // Check second element (should remove 'item')
        expect(divs.eq(1).attr('class')).toBe('active');
    });

    test('removeClass() should remove all classes when no parameter provided', () => {
        const p1 = root.find('#p1');
        p1.removeClass();
        expect(p1.attr('class')).toBe('');
    });

    test('removeClass() should handle empty string', () => {
        const div1 = root.find('#div1');
        const originalClass = div1.attr('class');

        div1.removeClass('');
        expect(div1.attr('class')).toBe(originalClass);
    });

    test('removeClass() should handle whitespace-only string', () => {
        const div1 = root.find('#div1');
        const originalClass = div1.attr('class');

        div1.removeClass('   ');
        expect(div1.attr('class')).toBe(originalClass);
    });

    test('removeClass() should work with multiple elements', () => {
        const items = root.find('.item');
        items.removeClass('item');

        // Check each element has 'item' class removed
        items.nodes.forEach(node => {
            expect(node.attributes.class).not.toContain('item');
        });
    });

    test('removeClass() should return the same collection for chaining', () => {
        const div1 = root.find('#div1');
        const result = div1.removeClass('active');

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('class')).toBe('item highlighted');
    });

    test('removeClass() should handle special characters in class names', () => {
        // Create elements with special class names
        const html = `<div class="special-class_123 normal-class"></div>`;
        const element = $(html);

        element.removeClass('special-class_123');
        expect(element.attr('class')).toBe('normal-class');
    });
});
