const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('toggleClass() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div id="div1" class="box active">Div 1</div>
        <div id="div2" class="box">Div 2</div>
        <div id="div3" class="circle active highlighted">Div 3</div>
        <span id="span1">Span 1</span>
        <p id="para1" class="text">Paragraph</p>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('toggleClass() should add class when it does not exist - jquery-comparison', () => {
        // Use different class names to avoid interference
        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        // Both should initially not have the 'test' class
        expect(nqDiv2.hasClass('test')).toBe(false);
        expect(jqDiv2.hasClass('test')).toBe(false);

        // Toggle different classes to avoid state conflicts
        nqDiv2.toggleClass('test-nq');
        jqDiv2.toggleClass('test-jq');

        // Both should now have their respective classes
        expect(nqDiv2.hasClass('test-nq')).toBe(true);
        expect(jqDiv2.hasClass('test-jq')).toBe(true);
        expect(document.getElementById('div2').className).toBe('box test-nq test-jq');
    });

    test('toggleClass() should remove class when it exists - jquery-comparison', () => {
        // Use div1 for node-query (has 'active'), div3 for jQuery (also has 'active')
        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv3 = jqRoot.find('#div3');

        // Both should initially have the 'active' class
        expect(nqDiv1.hasClass('active')).toBe(true);
        expect(jqDiv3.hasClass('active')).toBe(true);

        // Toggle the class
        nqDiv1.toggleClass('active');
        jqDiv3.toggleClass('active');

        // Both should now not have the class
        expect(nqDiv1.hasClass('active')).toBe(false);
        expect(jqDiv3.hasClass('active')).toBe(false);
    });

    test('toggleClass() should handle multiple classes - jquery-comparison', () => {
        // Use div2 for node-query, div1 for jQuery (div1 has 'active' initially)
        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv1 = jqRoot.find('#div1');

        // Both should initially not have the 'red' and 'blue' classes
        expect(nqDiv2.hasClass('red')).toBe(false);
        expect(jqDiv1.hasClass('red')).toBe(false);
        expect(nqDiv2.hasClass('blue')).toBe(false);
        expect(jqDiv1.hasClass('blue')).toBe(false);

        // Toggle multiple classes
        nqDiv2.toggleClass('red blue');
        jqDiv1.toggleClass('red blue');

        // Both should now have both classes (plus div1 keeps its 'active')
        expect(nqDiv2.hasClass('red')).toBe(true);
        expect(jqDiv1.hasClass('red')).toBe(true);
        expect(nqDiv2.hasClass('blue')).toBe(true);
        expect(jqDiv1.hasClass('blue')).toBe(true);

        // Toggle again to remove
        nqDiv2.toggleClass('red blue');
        jqDiv1.toggleClass('red blue');

        // Both should no longer have the classes
        expect(nqDiv2.hasClass('red')).toBe(false);
        expect(jqDiv1.hasClass('red')).toBe(false);
        expect(nqDiv2.hasClass('blue')).toBe(false);
        expect(jqDiv1.hasClass('blue')).toBe(false);
    });

    test('toggleClass() should be chainable - jquery-comparison', () => {
        // Use different elements to avoid interference
        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv1 = jqRoot.find('#div1');

        // Chain toggleClass calls with different classes
        const nqResult = nqDiv2.toggleClass('nq-class1').toggleClass('nq-class2');
        const jqResult = jqDiv1.toggleClass('jq-class1').toggleClass('jq-class2');

        // Both should return the element for chaining
        expect(nqResult).toBe(nqDiv2);
        expect(jqResult).toBe(jqDiv1);

        // Both should have their respective classes added
        expect(nqDiv2.hasClass('nq-class1')).toBe(true);
        expect(jqDiv1.hasClass('jq-class1')).toBe(true);
        expect(nqDiv2.hasClass('nq-class2')).toBe(true);
        expect(jqDiv1.hasClass('jq-class2')).toBe(true);
    });

    test('toggleClass() should work with multiple elements - jquery-comparison', () => {
        // Use div1 and div2 for node-query only
        const nqDiv1 = nqRoot.find('#div1');
        const nqDiv2 = nqRoot.find('#div2');

        // Toggle class on boxes (adds class since it doesn't exist)
        nqDiv1.toggleClass('highlight');
        nqDiv2.toggleClass('highlight');

        // After toggle, class should be present
        expect(nqDiv1.hasClass('highlight')).toBe(true);
        expect(nqDiv2.hasClass('highlight')).toBe(true);

        // Toggle again (removes class)
        nqDiv1.toggleClass('highlight');
        nqDiv2.toggleClass('highlight');

        // After two toggles, class should be absent
        expect(nqDiv1.hasClass('highlight')).toBe(false);
        expect(nqDiv2.hasClass('highlight')).toBe(false);
    });

    test('toggleClass() should handle boolean force parameter - jquery-comparison', () => {
        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        // Force add class (true parameter)
        nqDiv2.toggleClass('forced', true);
        jqDiv2.toggleClass('forced', true);

        expect(nqDiv2.hasClass('forced')).toBe(true);
        expect(jqDiv2.hasClass('forced')).toBe(true);

        // Force remove class (false parameter) - should override current state
        nqDiv2.toggleClass('forced', false);
        jqDiv2.toggleClass('forced', false);

        expect(nqDiv2.hasClass('forced')).toBe(false);
        expect(jqDiv2.hasClass('forced')).toBe(false);
    });

    test('toggleClass() should handle function parameter - jquery-comparison', () => {
        const nqDiv1 = nqRoot.find('#div1');
        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv1 = jqRoot.find('#div1');
        const jqDiv2 = jqRoot.find('#div2');

        // Use function to determine class name based on index
        nqDiv1.toggleClass(function(index) {
            return 'nq-dynamic' + index;
        });

        nqDiv2.toggleClass(function(index) {
            return 'nq-dynamic' + (index + 1);
        });

        jqDiv1.toggleClass(function(index) {
            return 'jq-dynamic' + index;
        });

        jqDiv2.toggleClass(function(index) {
            return 'jq-dynamic' + (index + 1);
        });

        // Check that classes were added based on function
        expect(nqDiv1.hasClass('nq-dynamic0')).toBe(true);
        expect(jqDiv1.hasClass('jq-dynamic0')).toBe(true);
        expect(nqDiv2.hasClass('nq-dynamic1')).toBe(true);
        expect(jqDiv2.hasClass('jq-dynamic1')).toBe(true);
    });

    test('toggleClass() should handle elements with no class attribute - jquery-comparison', () => {
        const nqSpan1 = nqRoot.find('#span1');

        // Should not have any classes initially
        expect(nqSpan1.hasClass('anyclass')).toBe(false);

        // Toggle a class
        nqSpan1.toggleClass('newclass');

        // Should now have the class
        expect(nqSpan1.hasClass('newclass')).toBe(true);

        // Check the class attribute was added
        const nqClassAttr = nqSpan1.attr('class');
        expect(nqClassAttr).toBe('newclass');
    });

    test('toggleClass() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        // Should not throw on empty collections
        expect(() => {
            nqEmpty.toggleClass('anyclass');
        }).not.toThrow();

        expect(() => {
            jqEmpty.toggleClass('anyclass');
        }).not.toThrow();
    });

    test('toggleClass() should preserve existing classes when toggling - jquery-comparison', () => {
        // Use div3 for node-query (has 'circle active highlighted')
        const nqDiv3 = nqRoot.find('#div3');

        // Initially has 'circle active highlighted'
        expect(nqDiv3.hasClass('circle')).toBe(true);
        expect(nqDiv3.hasClass('active')).toBe(true);
        expect(nqDiv3.hasClass('highlighted')).toBe(true);

        // Toggle 'active' class (should remove it)
        nqDiv3.toggleClass('active');

        // Should still have 'circle' and 'highlighted', but not 'active'
        expect(nqDiv3.hasClass('circle')).toBe(true);
        expect(nqDiv3.hasClass('active')).toBe(false);
        expect(nqDiv3.hasClass('highlighted')).toBe(true);
    });
});
