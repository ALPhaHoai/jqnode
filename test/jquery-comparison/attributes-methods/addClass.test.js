const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('addClass() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item" id="div1">First</div>
        <div class="item active" id="div2">Second</div>
        <div class="item multiple classes" id="div3">Third</div>
        <span id="span1">No classes</span>
        <p class="text" id="p1">Paragraph</p>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('addClass() should add a single class to elements - jquery-comparison', () => {
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
        const nqDivs = nqRoot.find('.item');
        const jqDivs = jqRoot.find('.item');

        nqDivs.addClass(function(index, currentClass) {
            return 'dynamic-' + index;
        });
        jqDivs.addClass(function(index, currentClass) {
            return 'dynamic-' + index;
        });

        // Check first element
        const nqClass1 = nqDivs.eq(0).attr('class');
        const jqClass1 = jqDivs.eq(0).attr('class');
        expect(nqClass1).toBe(jqClass1);
        expect(nqClass1).toBe('item dynamic-0');

        // Check second element
        const nqClass2 = nqDivs.eq(1).attr('class');
        const jqClass2 = jqDivs.eq(1).attr('class');
        expect(nqClass2).toBe(jqClass2);
        expect(nqClass2).toBe('item active dynamic-1');
    });

    test('addClass() should handle empty string - jquery-comparison', () => {
        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqOriginalClass = nqDiv1.attr('class');
        const jqOriginalClass = jqDiv1.attr('class');

        nqDiv1.addClass('');
        jqDiv1.addClass('');

        const nqNewClass = nqDiv1.attr('class');
        const jqNewClass = jqDiv1.attr('class');

        expect(nqNewClass).toBe(jqNewClass);
        expect(nqNewClass).toBe(nqOriginalClass);
    });

    test('addClass() should handle whitespace-only string - jquery-comparison', () => {
        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqOriginalClass = nqDiv1.attr('class');
        const jqOriginalClass = jqDiv1.attr('class');

        nqDiv1.addClass('   ');
        jqDiv1.addClass('   ');

        const nqNewClass = nqDiv1.attr('class');
        const jqNewClass = jqDiv1.attr('class');

        expect(nqNewClass).toBe(jqNewClass);
        expect(nqNewClass).toBe(nqOriginalClass);
    });

    test('addClass() should work with multiple elements - jquery-comparison', () => {
        const nqDivs = nqRoot.find('.item');
        const jqDivs = jqRoot.find('.item');

        nqDivs.addClass('bulk-add');
        jqDivs.addClass('bulk-add');

        // Check each element
        nqDivs.nodes.forEach((node, index) => {
            const nqClass = node.attributes.class;
            const jqClass = jqDivs.eq(index).attr('class');
            expect(nqClass).toBe(jqClass);
            expect(nqClass).toContain('bulk-add');
        });
    });

    test('addClass() should return the same collection for chaining - jquery-comparison', () => {
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
