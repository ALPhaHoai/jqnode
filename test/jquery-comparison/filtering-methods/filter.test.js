const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('filter() method - Node-Query vs jQuery Comparison', () => {
    let elements, jqElements;

    beforeEach(() => {
        const html = `
            <div class="item active">Active Item 1</div>
            <div class="item">Inactive Item</div>
            <div class="item active">Active Item 2</div>
            <div class="item">Inactive Item 2</div>
            <div class="item active special">Active Special Item</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqElements = jquery.find('.item');
        elements = nodeQuery.find('.item');
    });

    test('filter() should filter elements using CSS selector - jquery-comparison', () => {
        const nqResult = elements.filter('.active');
        const jqResult = jqElements.filter('.active');

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        // Verify all filtered elements have the active class
        nqResult.each((index, element) => {
            const nqElement = $(element);
            const jqElement = jqResult.eq(index);
            expect(nqElement.hasClass('active')).toBe(true);
            expect(jqElement.hasClass('active')).toBe(true);
        });
    });

    test('filter() should filter elements using complex CSS selector - jquery-comparison', () => {
        const nqResult = elements.filter('.active.special');
        const jqResult = jqElements.filter('.active.special');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqClass = nqResult.attr('class');
        const jqClass = jqResult.attr('class');
        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('item active special');

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Active Special Item');
    });

    test('filter() should filter elements using function that returns true/false - jquery-comparison', () => {
        const nqResult = elements.filter(function (index, element) {
            return index % 2 === 0; // Keep even indices (0, 2, 4)
        });
        const jqResult = jqElements.filter(function (index, element) {
            return index % 2 === 0; // Keep even indices (0, 2, 4)
        });

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Active Item 1Active Item 2Active Special Item');
    });

    test('filter() should filter elements using function that checks element properties - jquery-comparison', () => {
        const nqResult = elements.filter(function (index, element) {
            return element.attributes.class.includes('special');
        });
        const jqResult = jqElements.filter(function (index, element) {
            return $(element).hasClass('special');
        });

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Active Special Item');
    });

    test('filter() should return all elements when function always returns true - jquery-comparison', () => {
        const nqResult = elements.filter(() => true);
        const jqResult = jqElements.filter(() => true);

        expect(nqResult.nodes).toHaveLength(5);
        expect(jqResult.length).toBe(5);
    });

    test('filter() should return empty collection when function always returns false - jquery-comparison', () => {
        const nqResult = elements.filter(() => false);
        const jqResult = jqElements.filter(() => false);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('filter() should handle empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.filter('.anything');
        const jqResult = jqEmptyCollection.filter('.anything');

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('filter() should work with jQuery object parameter - jquery-comparison', () => {
        // Create another collection to filter against
        const html2 = '<div class="filter-item">Filter 1</div><div class="filter-item">Filter 2</div>';
        const { jquery: jqFilter, nodeQuery: nqFilter } = createTestDom(html2);
        const nqFilterItems = nqFilter.find('.filter-item');
        const jqFilterItems = jqFilter.find('.filter-item');

        const nqResult = elements.filter(nqFilterItems);
        const jqResult = jqElements.filter(jqFilterItems);

        // Should match elements that exist in both collections (none in this case)
        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('filter() should preserve element order - jquery-comparison', () => {
        const nqResult = elements.filter('.active');
        const jqResult = jqElements.filter('.active');

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        // Check that order is preserved
        const nqTexts = [];
        const jqTexts = [];

        nqResult.each((index, element) => {
            nqTexts.push($(element).text());
        });

        jqResult.each((index, element) => {
            jqTexts.push(jQuery(element).text());
        });

        expect(nqTexts).toEqual(jqTexts);
        expect(nqTexts).toEqual(['Active Item 1', 'Active Item 2', 'Active Special Item']);
    });

    test('filter() should handle function with different contexts - jquery-comparison', () => {
        const nqResult = elements.filter(function (index, element) {
            return index < 3; // keep 0,1,2
        });

        const jqResult = jqElements.filter(function (index, element) {
            return index < 3;
        });

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Active Item 1Inactive ItemActive Item 2');
    });

    test('filter() should work with chaining - jquery-comparison', () => {
        // Chain: find -> filter -> attr
        const nqResult = elements.filter('.active').attr('data-filtered', 'true');
        const jqResult = jqElements.filter('.active').attr('data-filtered', 'true');

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        // Verify all filtered elements got the attribute
        nqResult.each((index, element) => {
            const nqElement = $(element);
            const jqElement = jqResult.eq(index);
            expect(nqElement.attr('data-filtered')).toBe('true');
            expect(jqElement.attr('data-filtered')).toBe('true');
        });
    });

    test('filter() should handle complex function logic - jquery-comparison', () => {
        const nqResult = elements.filter(function (index, element) {
            const text = $(element).text();
            const hasActive = $(element).hasClass('active');
            const hasSpecial = $(element).hasClass('special');
            return hasActive && (index < 3 || hasSpecial);
        });

        const jqResult = jqElements.filter(function (index, element) {
            const text = jQuery(element).text();
            const hasActive = jQuery(element).hasClass('active');
            const hasSpecial = jQuery(element).hasClass('special');
            return hasActive && (index < 3 || hasSpecial);
        });

        expect(nqResult.nodes).toHaveLength(3);
        expect(jqResult.length).toBe(3);

        const nqTexts = [];
        const jqTexts = [];

        nqResult.each((index, element) => {
            nqTexts.push($(element).text());
        });

        jqResult.each((index, element) => {
            jqTexts.push(jQuery(element).text());
        });

        expect(nqTexts).toEqual(jqTexts);
        expect(nqTexts).toEqual(['Active Item 1', 'Active Item 2', 'Active Special Item']);
    });

    test('filter() should return new collection instance - jquery-comparison', () => {
        const nqResult = elements.filter('.active');
        const jqResult = jqElements.filter('.active');

        expect(nqResult).not.toBe(elements);
        expect(jqResult).not.toBe(jqElements);

        expect(nqResult.nodes).not.toBe(elements.nodes);
        expect(nqResult.nodes.length).toBe(3);
        expect(jqResult.length).toBe(3);
    });

    test('filter() should handle null and undefined parameters - jquery-comparison', () => {
        // Filter with null should return empty collection
        const nqNullResult = elements.filter(null);
        const jqNullResult = jqElements.filter(null);

        expect(nqNullResult.nodes).toHaveLength(0);
        expect(jqNullResult.length).toBe(0);

        // Filter with undefined should return empty collection
        const nqUndefinedResult = elements.filter(undefined);
        const jqUndefinedResult = jqElements.filter(undefined);

        expect(nqUndefinedResult.nodes).toHaveLength(0);
        expect(jqUndefinedResult.length).toBe(0);
    });

    test('filter() should work with different element types - jquery-comparison', () => {
        const html = `
            <div class="test">Div</div>
            <span class="test">Span</span>
            <p class="test">Paragraph</p>
            <section class="test">Section</section>
        `;
        const { jquery: jqMixed, nodeQuery: nqMixed } = createTestDom(html);
        const nqMixedElements = nqMixed.find('.test');
        const jqMixedElements = jqMixed.find('.test');

        const nqResult = nqMixedElements.filter('span, p');
        const jqResult = jqMixedElements.filter('span, p');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqTags = nqResult.nodes.map(node => node.tagName && node.tagName.toLowerCase());
        const jqTags = [];
        jqResult.each((index, element) => {
            jqTags.push(element.tagName.toLowerCase());
        });

        expect(nqTags.sort()).toEqual(jqTags.sort());
        expect(nqTags).toEqual(['p', 'span']);
    });

    test('filter() should handle function that modifies elements during filtering - jquery-comparison', () => {
        const nqResult = elements.filter(function (index, element) {
            // Modify element during filtering
            $(element).attr('data-processed', 'true');
            return index < 2; // Only keep first 2 elements
        });

        const jqResult = jqElements.filter(function (index, element) {
            // Modify element during filtering
            jQuery(element).attr('data-processed', 'true');
            return index < 2; // Only keep first 2 elements
        });

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        // Check that all elements (not just filtered ones) got the attribute
        elements.each((index, element) => {
            const nqElement = $(element);
            expect(nqElement.attr('data-processed')).toBe('true');
        });

        jqElements.each((index, element) => {
            const jqElement = jQuery(element);
            expect(jqElement.attr('data-processed')).toBe('true');
        });
    });
});
