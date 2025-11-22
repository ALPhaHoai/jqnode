import $ from '../../../index';

describe('hasClass() method', () => {
    let root;

    beforeEach(() => {
        $.clearRootNodesRegistry();
        const html = `
      <div class="container">
        <div class="item active" id="div1">First</div>
        <div class="item" id="div2">Second</div>
        <div class="item active highlighted" id="div3">Third</div>
        <div class="item multiple classes here" id="div4">Fourth</div>
        <span id="span1">No classes</span>
      </div>
    `;
        root = $(html);
    });

    test('hasClass() should return true when element has the specified class', () => {
        const div1 = root.find('#div1');
        expect(div1.hasClass('active')).toBe(true);

        const div3 = root.find('#div3');
        expect(div3.hasClass('active')).toBe(true);
        expect(div3.hasClass('highlighted')).toBe(true);
    });

    test('hasClass() should return false when element does not have the specified class', () => {
        const div2 = root.find('#div2');
        expect(div2.hasClass('active')).toBe(false);
        expect(div2.hasClass('highlighted')).toBe(false);
    });

    test('hasClass() should return false when element has no class attribute', () => {
        const span1 = root.find('#span1');
        expect(span1.hasClass('anyclass')).toBe(false);
    });

    test('hasClass() should handle multiple classes correctly', () => {
        const div3 = root.find('#div3');
        expect(div3.hasClass('active')).toBe(true);
        expect(div3.hasClass('highlighted')).toBe(true);
        expect(div3.hasClass('nonexistent')).toBe(false);
    });

    test('hasClass() should handle elements with multiple space-separated classes', () => {
        const div4 = root.find('#div4');
        expect(div4.hasClass('multiple')).toBe(true);
        expect(div4.hasClass('classes')).toBe(true);
        expect(div4.hasClass('here')).toBe(true);
        expect(div4.hasClass('missing')).toBe(false);
    });

    test('hasClass() should return false for empty collections', () => {
        const emptyCollection = root.find('.nonexistent');
        expect(emptyCollection.hasClass('anyclass')).toBe(false);
    });

    test('hasClass() should only check the first element in the collection', () => {
        const allDivs = root.find('.item');
        expect(allDivs.nodes).toHaveLength(4); // Should have 4 elements

        // First element has 'active' class
        expect(allDivs.hasClass('active')).toBe(true);

        // But second element doesn't have 'active'
        const secondDiv = allDivs.eq(1);
        expect(secondDiv.hasClass('active')).toBe(false);
    });

    test('hasClass() should handle class names with special characters', () => {
        const html = `<div class="special-class_123 test-class"></div>`;
        const element = $(html);

        expect(element.hasClass('special-class_123')).toBe(true);
        expect(element.hasClass('test-class')).toBe(true);
        expect(element.hasClass('nonexistent')).toBe(false);
    });

    test('hasClass() should handle single class elements', () => {
        const html = `<div class="single"></div>`;
        const element = $(html);

        expect(element.hasClass('single')).toBe(true);
        expect(element.hasClass('other')).toBe(false);
    });

    test('hasClass() should handle empty string class names', () => {
        const div1 = root.find('#div1');
        expect(div1.hasClass('')).toBe(false);
    });

    test('hasClass() should handle class names with leading/trailing spaces', () => {
        const html = `<div class=" spaced-class "></div>`;
        const element = $(html);

        expect(element.hasClass('spaced-class')).toBe(true);
        expect(element.hasClass(' spaced-class ')).toBe(false); // Exact match, not trimmed
    });

    test('hasClass() should work with dynamically created elements', () => {
        const newElement = $(`<div class="dynamic"></div>`);
        expect(newElement.hasClass('dynamic')).toBe(true);
        expect(newElement.hasClass('static')).toBe(false);
    });

    test('hasClass() should handle elements with only whitespace in class attribute', () => {
        const html = `<div class="   "></div>`;
        const element = $(html);

        expect(element.hasClass('anyclass')).toBe(false);
    });
});
