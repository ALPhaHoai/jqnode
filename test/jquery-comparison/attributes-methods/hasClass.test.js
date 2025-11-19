const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('hasClass() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item active" id="div1">First</div>
        <div class="item" id="div2">Second</div>
        <div class="item active highlighted" id="div3">Third</div>
        <div class="item multiple classes here" id="div4">Fourth</div>
        <span id="span1">No classes</span>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('hasClass() should return true when element has the specified class - jquery-comparison', () => {
        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqResult1 = nqDiv1.hasClass('active');
        const jqResult1 = jqDiv1.hasClass('active');

        expect(nqResult1).toBe(jqResult1);
        expect(nqResult1).toBe(true);

        const nqDiv3 = nqRoot.find('#div3');
        const jqDiv3 = jqRoot.find('#div3');

        const nqResult3Active = nqDiv3.hasClass('active');
        const jqResult3Active = jqDiv3.hasClass('active');
        expect(nqResult3Active).toBe(jqResult3Active);
        expect(nqResult3Active).toBe(true);

        const nqResult3Highlighted = nqDiv3.hasClass('highlighted');
        const jqResult3Highlighted = jqDiv3.hasClass('highlighted');
        expect(nqResult3Highlighted).toBe(jqResult3Highlighted);
        expect(nqResult3Highlighted).toBe(true);
    });

    test('hasClass() should return false when element does not have the specified class - jquery-comparison', () => {
        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        const nqResultActive = nqDiv2.hasClass('active');
        const jqResultActive = jqDiv2.hasClass('active');
        expect(nqResultActive).toBe(jqResultActive);
        expect(nqResultActive).toBe(false);

        const nqResultHighlighted = nqDiv2.hasClass('highlighted');
        const jqResultHighlighted = jqDiv2.hasClass('highlighted');
        expect(nqResultHighlighted).toBe(jqResultHighlighted);
        expect(nqResultHighlighted).toBe(false);
    });

    test('hasClass() should return false when element has no class attribute - jquery-comparison', () => {
        const nqSpan1 = nqRoot.find('#span1');
        const jqSpan1 = jqRoot.find('#span1');

        const nqResult = nqSpan1.hasClass('anyclass');
        const jqResult = jqSpan1.hasClass('anyclass');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(false);
    });

    test('hasClass() should handle multiple classes correctly - jquery-comparison', () => {
        const nqDiv3 = nqRoot.find('#div3');
        const jqDiv3 = jqRoot.find('#div3');

        const nqResultActive = nqDiv3.hasClass('active');
        const jqResultActive = jqDiv3.hasClass('active');
        expect(nqResultActive).toBe(jqResultActive);
        expect(nqResultActive).toBe(true);

        const nqResultHighlighted = nqDiv3.hasClass('highlighted');
        const jqResultHighlighted = jqDiv3.hasClass('highlighted');
        expect(nqResultHighlighted).toBe(jqResultHighlighted);
        expect(nqResultHighlighted).toBe(true);

        const nqResultNonexistent = nqDiv3.hasClass('nonexistent');
        const jqResultNonexistent = jqDiv3.hasClass('nonexistent');
        expect(nqResultNonexistent).toBe(jqResultNonexistent);
        expect(nqResultNonexistent).toBe(false);
    });

    test('hasClass() should handle elements with multiple space-separated classes - jquery-comparison', () => {
        const nqDiv4 = nqRoot.find('#div4');
        const jqDiv4 = jqRoot.find('#div4');

        const nqResultMultiple = nqDiv4.hasClass('multiple');
        const jqResultMultiple = jqDiv4.hasClass('multiple');
        expect(nqResultMultiple).toBe(jqResultMultiple);
        expect(nqResultMultiple).toBe(true);

        const nqResultClasses = nqDiv4.hasClass('classes');
        const jqResultClasses = jqDiv4.hasClass('classes');
        expect(nqResultClasses).toBe(jqResultClasses);
        expect(nqResultClasses).toBe(true);

        const nqResultHere = nqDiv4.hasClass('here');
        const jqResultHere = jqDiv4.hasClass('here');
        expect(nqResultHere).toBe(jqResultHere);
        expect(nqResultHere).toBe(true);

        const nqResultMissing = nqDiv4.hasClass('missing');
        const jqResultMissing = jqDiv4.hasClass('missing');
        expect(nqResultMissing).toBe(jqResultMissing);
        expect(nqResultMissing).toBe(false);
    });

    test('hasClass() should return false for empty collections - jquery-comparison', () => {
        const nqEmptyCollection = nqRoot.find('.nonexistent');
        const jqEmptyCollection = jqRoot.find('.nonexistent');

        const nqResult = nqEmptyCollection.hasClass('anyclass');
        const jqResult = jqEmptyCollection.hasClass('anyclass');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(false);
    });

    test('hasClass() should only check the first element in the collection - jquery-comparison', () => {
        const nqAllDivs = nqRoot.find('.item');
        const jqAllDivs = jqRoot.find('.item');

        // Both should have 4 elements
        expect(nqAllDivs.nodes).toHaveLength(4);
        expect(jqAllDivs.length).toBe(4);

        // First element has 'active' class
        const nqResult = nqAllDivs.hasClass('active');
        const jqResult = jqAllDivs.hasClass('active');
        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);

        // But second element doesn't have 'active'
        const nqSecondDiv = nqAllDivs.eq(1);
        const jqSecondDiv = jqAllDivs.eq(1);

        const nqSecondResult = nqSecondDiv.hasClass('active');
        const jqSecondResult = jqSecondDiv.hasClass('active');
        expect(nqSecondResult).toBe(jqSecondResult);
        expect(nqSecondResult).toBe(false);
    });

    test('hasClass() should handle class names with special characters - jquery-comparison', () => {
        const html = `<div class="special-class_123 test-class"></div>`;
        const nqElement = $(html);
        const testDomSpecial = createTestDom(html);
        const jqElement = testDomSpecial.jquery.find('div');

        const nqResultSpecial = nqElement.hasClass('special-class_123');
        const jqResultSpecial = jqElement.hasClass('special-class_123');
        expect(nqResultSpecial).toBe(jqResultSpecial);
        expect(nqResultSpecial).toBe(true);

        const nqResultTest = nqElement.hasClass('test-class');
        const jqResultTest = jqElement.hasClass('test-class');
        expect(nqResultTest).toBe(jqResultTest);
        expect(nqResultTest).toBe(true);

        const nqResultNonexistent = nqElement.hasClass('nonexistent');
        const jqResultNonexistent = jqElement.hasClass('nonexistent');
        expect(nqResultNonexistent).toBe(jqResultNonexistent);
        expect(nqResultNonexistent).toBe(false);
    });

    test('hasClass() should handle single class elements - jquery-comparison', () => {
        const html = `<div class="single"></div>`;
        const nqElement = $(html);
        const testDomSingle = createTestDom(html);
        const jqElement = testDomSingle.jquery.find('div');

        const nqResultSingle = nqElement.hasClass('single');
        const jqResultSingle = jqElement.hasClass('single');
        expect(nqResultSingle).toBe(jqResultSingle);
        expect(nqResultSingle).toBe(true);

        const nqResultOther = nqElement.hasClass('other');
        const jqResultOther = jqElement.hasClass('other');
        expect(nqResultOther).toBe(jqResultOther);
        expect(nqResultOther).toBe(false);
    });

    test('hasClass() should handle empty string class names - jquery-comparison', () => {
        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqResult = nqDiv1.hasClass('');
        const jqResult = jqDiv1.hasClass('');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(false);
    });

    test('hasClass() should handle class names with leading/trailing spaces - jquery-comparison', () => {
        const html = `<div class=" spaced-class "></div>`;
        const nqElement = $(html);
        const testDomSpaced = createTestDom(html);
        const jqElement = testDomSpaced.jquery.find('div');

        const nqResultSpaced = nqElement.hasClass('spaced-class');
        const jqResultSpaced = jqElement.hasClass('spaced-class');
        expect(nqResultSpaced).toBe(jqResultSpaced);
        expect(nqResultSpaced).toBe(true);

        const nqResultExact = nqElement.hasClass(' spaced-class ');
        const jqResultExact = jqElement.hasClass(' spaced-class ');
        expect(nqResultExact).toBe(jqResultExact);
        expect(nqResultExact).toBe(false); // Exact match, not trimmed
    });

    test('hasClass() should work with dynamically created elements - jquery-comparison', () => {
        const nqNewElement = $(`<div class="dynamic"></div>`);
        const jqNewElement = jQuery(`<div class="dynamic"></div>`);

        const nqResultDynamic = nqNewElement.hasClass('dynamic');
        const jqResultDynamic = jqNewElement.hasClass('dynamic');
        expect(nqResultDynamic).toBe(jqResultDynamic);
        expect(nqResultDynamic).toBe(true);

        const nqResultStatic = nqNewElement.hasClass('static');
        const jqResultStatic = jqNewElement.hasClass('static');
        expect(nqResultStatic).toBe(jqResultStatic);
        expect(nqResultStatic).toBe(false);
    });

    test('hasClass() should handle elements with only whitespace in class attribute - jquery-comparison', () => {
        const html = `<div class="   "></div>`;
        const nqElement = $(html);
        const testDomWhitespace = createTestDom(html);
        const jqElement = testDomWhitespace.jquery.find('div');

        const nqResult = nqElement.hasClass('anyclass');
        const jqResult = jqElement.hasClass('anyclass');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(false);
    });
});
