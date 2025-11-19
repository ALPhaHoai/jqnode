const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('removeClass() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item active highlighted" id="div1">First</div>
        <div class="item active" id="div2">Second</div>
        <div class="item multiple classes here" id="div3">Third</div>
        <span class="single-class" id="span1">No classes</span>
        <p class="text bold italic" id="p1">Paragraph</p>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('removeClass() should remove a single class from elements - jquery-comparison', () => {
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
        // Use separate DOMs for this test to avoid interference since both modify the DOM
        const html = `
          <div class="container">
            <div class="item active highlighted" id="div1">First</div>
            <div class="item active" id="div2">Second</div>
            <div class="item multiple classes here" id="div3">Third</div>
          </div>
        `;

        // Node-query run
        const { nodeQuery } = createTestDom(html);
        const nqDivs = nodeQuery.find('.item');

        nqDivs.removeClass(function (index, currentClass) {
            // Remove the first class from each element
            const classes = currentClass.split(/\s+/).filter(cls => cls.length > 0);
            return classes[0];
        });

        const nqClass1 = nqDivs.eq(0).attr('class');
        const nqClass2 = nqDivs.eq(1).attr('class');

        // jQuery run (fresh DOM)
        const { jquery } = createTestDom(html);
        const jqDivs = jquery.find('.item');

        jqDivs.removeClass(function (index, currentClass) {
            // Remove the first class from each element
            const classes = currentClass.split(/\s+/).filter(cls => cls.length > 0);
            return classes[0];
        });

        const jqClass1 = jqDivs.eq(0).attr('class');
        const jqClass2 = jqDivs.eq(1).attr('class');

        // Check first element (should remove 'item')
        expect(nqClass1).toBe(jqClass1);
        expect(nqClass1).toBe('active highlighted');

        // Check second element (should remove 'item')
        expect(nqClass2).toBe(jqClass2);
        expect(nqClass2).toBe('active');
    });

    test('removeClass() should remove all classes when no parameter provided - jquery-comparison', () => {
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
        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqOriginalClass = nqDiv1.attr('class');
        const jqOriginalClass = jqDiv1.attr('class');

        nqDiv1.removeClass('');
        jqDiv1.removeClass('');

        const nqNewClass = nqDiv1.attr('class');
        const jqNewClass = jqDiv1.attr('class');

        expect(nqNewClass).toBe(jqNewClass);
        expect(nqNewClass).toBe(nqOriginalClass);
    });

    test('removeClass() should handle whitespace-only string - jquery-comparison', () => {
        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqOriginalClass = nqDiv1.attr('class');
        const jqOriginalClass = jqDiv1.attr('class');

        nqDiv1.removeClass('   ');
        jqDiv1.removeClass('   ');

        const nqNewClass = nqDiv1.attr('class');
        const jqNewClass = jqDiv1.attr('class');

        expect(nqNewClass).toBe(jqNewClass);
        expect(nqNewClass).toBe(nqOriginalClass);
    });

    test('removeClass() should work with multiple elements - jquery-comparison', () => {
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        nqItems.removeClass('item');
        jqItems.removeClass('item');

        // Check each element has 'item' class removed
        nqItems.nodes.forEach((node, index) => {
            const nqClass = node.attributes.class;
            const jqClass = jqItems.eq(index).attr('class');
            expect(nqClass).toBe(jqClass);
            expect(nqClass).not.toContain('item');
        });
    });

    test('removeClass() should return the same collection for chaining - jquery-comparison', () => {
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
        // Create elements with special class names
        const html = `<div class="special-class_123 normal-class"></div>`;
        const nqElement = $(html);
        const testDomSpecial = createTestDom(html);
        const jqElement = testDomSpecial.jquery.find('div');

        nqElement.removeClass('special-class_123');
        jqElement.removeClass('special-class_123');

        const nqClass = nqElement.attr('class');
        const jqClass = jqElement.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('normal-class');
    });
});
