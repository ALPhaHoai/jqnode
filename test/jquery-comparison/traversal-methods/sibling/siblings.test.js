const $ = require('../../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../../utils/jquery-comparison-helpers');

describe('siblings() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="sibling first">First</div>
                <div class="sibling second">Second</div>
                <div class="sibling third active">Third Active</div>
                <div class="sibling fourth">Fourth</div>
                <span class="not-sibling">Not a sibling</span>
                <div class="sibling fifth">Fifth</div>
            </div>
            <div class="other-container">
                <div class="sibling sixth">Sixth</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('siblings() should get all siblings of elements - jquery-comparison', () => {
        const nqSecondElement = nqRoot.find('.second');
        const jqSecondElement = jqRoot.find('.second');

        const nqSiblings = nqSecondElement.siblings();
        const jqSiblings = jqSecondElement.siblings();

        expect(nqSiblings.nodes).toHaveLength(5); // All sibling elements except itself
        expect(jqSiblings.length).toBe(5);

        // Check that all expected siblings are present
        const nqClasses = nqSiblings.nodes.map(node => node.attributes.class).sort();
        const jqClasses = [];
        jqSiblings.each((index, element) => {
            jqClasses.push(element.className);
        });
        jqClasses.sort();

        expect(nqClasses).toEqual(jqClasses);
        // jQuery returns full class strings, sorted
        expect(nqClasses).toEqual(['not-sibling', 'sibling fifth', 'sibling first', 'sibling fourth', 'sibling third active']);
    });

    test('siblings() should work with selector filter - jquery-comparison', () => {
        const nqSecondElement = nqRoot.find('.second');
        const jqSecondElement = jqRoot.find('.second');

        const nqActiveSiblings = nqSecondElement.siblings('.active');
        const jqActiveSiblings = jqSecondElement.siblings('.active');

        expect(nqActiveSiblings.nodes).toHaveLength(1);
        expect(jqActiveSiblings.length).toBe(1);

        const nqClass = nqActiveSiblings.attr('class');
        const jqClass = jqActiveSiblings.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('sibling third active');
    });

    test('siblings() should work with multiple elements - jquery-comparison', () => {
        const nqMultiple = nqRoot.find('.first, .fifth');
        const jqMultiple = jqRoot.find('.first, .fifth');

        const nqSiblings = nqMultiple.siblings();
        const jqSiblings = jqMultiple.siblings();

        expect(nqSiblings.nodes).toHaveLength(jqSiblings.length); // All siblings of both elements
    });

    test('siblings() should return empty for only child - jquery-comparison', () => {
        const nqOnlyChild = nqRoot.find('.sixth');
        const jqOnlyChild = jqRoot.find('.sixth');

        const nqSiblings = nqOnlyChild.siblings();
        const jqSiblings = jqOnlyChild.siblings();

        expect(nqSiblings.nodes).toHaveLength(0);
        expect(jqSiblings.length).toBe(0);
    });

    test('siblings() should work with complex selectors - jquery-comparison', () => {
        const nqSecondElement = nqRoot.find('.second');
        const jqSecondElement = jqRoot.find('.second');

        const nqComplexSiblings = nqSecondElement.siblings('div.sibling, span');
        const jqComplexSiblings = jqSecondElement.siblings('div.sibling, span');

        expect(nqComplexSiblings.nodes).toHaveLength(5);
        expect(jqComplexSiblings.length).toBe(5);
    });

    test('siblings() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqSiblings = nqEmpty.siblings();
        const jqSiblings = jqEmpty.siblings();

        expect(nqSiblings.nodes).toHaveLength(0);
        expect(jqSiblings.length).toBe(0);
    });

    test('siblings() should work with chaining - jquery-comparison', () => {
        const nqResult = nqRoot.find('.second').siblings().filter('.sibling').first();
        const jqResult = jqRoot.find('.second').siblings().filter('.sibling').first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('First');
    });
});
