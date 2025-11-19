const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('is() method - Node-Query vs jQuery Comparison', () => {
    let elements, jqElements;

    beforeEach(() => {
        const html = `
            <div class="item active">Active Item 1</div>
            <div class="item">Inactive Item</div>
            <div class="item active">Active Item 2</div>
            <div class="item inactive">Inactive Item 2</div>
            <div class="item active special">Active Special Item</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqElements = jquery.find('.item');
        elements = nodeQuery.find('.item');
    });

    test('is() should return true when at least one element matches selector - jquery-comparison', () => {
        const nqResult = elements.is('.active');
        const jqResult = jqElements.is('.active');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);
    });

    test('is() should return false when no elements match selector - jquery-comparison', () => {
        const nqResult = elements.is('.nonexistent');
        const jqResult = jqElements.is('.nonexistent');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(false);
    });

    test('is() should work with tag selectors - jquery-comparison', () => {
        const nqResult = elements.is('div');
        const jqResult = jqElements.is('div');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);

        const nqResult2 = elements.is('span');
        const jqResult2 = jqElements.is('span');

        expect(nqResult2).toBe(jqResult2);
        expect(nqResult2).toBe(false);
    });

    test('is() should work with ID selectors - jquery-comparison', () => {
        const html = `
            <div class="item" id="first">First</div>
            <div class="item">Second</div>
        `;
        const { jquery: jqTest, nodeQuery: nqTest } = createTestDom(html);
        const nqTestElements = nqTest.find('.item');
        const jqTestElements = jqTest.find('.item');

        const nqResult = nqTestElements.is('#first');
        const jqResult = jqTestElements.is('#first');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);

        const nqResult2 = nqTestElements.is('#nonexistent');
        const jqResult2 = jqTestElements.is('#nonexistent');

        expect(nqResult2).toBe(jqResult2);
        expect(nqResult2).toBe(false);
    });

    test('is() should work with complex selectors - jquery-comparison', () => {
        const nqResult = elements.is('.active.special');
        const jqResult = jqElements.is('.active.special');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);

        const nqResult2 = elements.is('.inactive.special');
        const jqResult2 = jqElements.is('.inactive.special');

        expect(nqResult2).toBe(jqResult2);
        expect(nqResult2).toBe(false);
    });

    test('is() should work with direct element references - jquery-comparison', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
        `;
        const { jquery: jqTest, nodeQuery: nqTest } = createTestDom(html);
        const nqTestElements = nqTest.find('.item');
        const jqTestElements = jqTest.find('.item');

        // Get first element from each collection
        const nqFirstElement = nqTestElements.nodes[0];
        const jqFirstElement = jqTestElements[0];

        const nqResult = nqTestElements.is(nqFirstElement);
        const jqResult = jqTestElements.is(jqFirstElement);

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);
    });

    test('is() should work with JQ objects - jquery-comparison', () => {
        const nqFirstElement = elements.first();
        const jqFirstElement = jqElements.first();

        const nqResult = elements.is(nqFirstElement);
        const jqResult = jqElements.is(jqFirstElement);

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);
    });

    test('is() should return false for empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.is('.anything');
        const jqResult = jqEmptyCollection.is('.anything');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(false);
    });

    test('is() should return false for invalid selectors - jquery-comparison', () => {
        const nqResult = elements.is('');
        const jqResult = jqElements.is('');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(false);

        const nqResult2 = elements.is(null);
        const jqResult2 = jqElements.is(null);

        expect(nqResult2).toBe(jqResult2);
        expect(nqResult2).toBe(false);

        const nqResult3 = elements.is(undefined);
        const jqResult3 = jqElements.is(undefined);

        expect(nqResult3).toBe(jqResult3);
        expect(nqResult3).toBe(false);
    });

    test('is() should work with single element collection - jquery-comparison', () => {
        const nqSingleElement = elements.first();
        const jqSingleElement = jqElements.first();

        const nqResult = nqSingleElement.is('.active');
        const jqResult = jqSingleElement.is('.active');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);

        const nqResult2 = nqSingleElement.is('.inactive');
        const jqResult2 = jqSingleElement.is('.inactive');

        expect(nqResult2).toBe(jqResult2);
        expect(nqResult2).toBe(false);
    });

    test('is() should return true when multiple elements match - jquery-comparison', () => {
        const nqResult = elements.is('.active');
        const jqResult = jqElements.is('.active');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true); // At least one matches
    });

    test('is() should work after filtering - jquery-comparison', () => {
        const nqFiltered = elements.filter('.active');
        const jqFiltered = jqElements.filter('.active');

        const nqResult = nqFiltered.is('.active');
        const jqResult = jqFiltered.is('.active');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);

        const nqResult2 = nqFiltered.is('.inactive');
        const jqResult2 = jqFiltered.is('.inactive');

        expect(nqResult2).toBe(jqResult2);
        expect(nqResult2).toBe(false);
    });

    test('is() should work with attribute selectors - jquery-comparison', () => {
        const html = `
            <div class="item" data-id="123">With ID</div>
            <div class="item" data-type="special">Special</div>
            <div class="item">Normal</div>
        `;
        const { jquery: jqTest, nodeQuery: nqTest } = createTestDom(html);
        const nqTestElements = nqTest.find('.item');
        const jqTestElements = jqTest.find('.item');

        const nqResult1 = nqTestElements.is('[data-id]');
        const jqResult1 = jqTestElements.is('[data-id]');

        expect(nqResult1).toBe(jqResult1);
        expect(nqResult1).toBe(true);

        const nqResult2 = nqTestElements.is('[data-type="special"]');
        const jqResult2 = jqTestElements.is('[data-type="special"]');

        expect(nqResult2).toBe(jqResult2);
        expect(nqResult2).toBe(true);

        const nqResult3 = nqTestElements.is('[data-missing]');
        const jqResult3 = jqTestElements.is('[data-missing]');

        expect(nqResult3).toBe(jqResult3);
        expect(nqResult3).toBe(false);
    });

    test('is() should work with universal selector - jquery-comparison', () => {
        const nqResult = elements.is('*');
        const jqResult = jqElements.is('*');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(true);
    });

    test('is() should work with multiple selectors separated by commas - jquery-comparison', () => {
        const html = `
            <div class="item type-a">Type A</div>
            <span class="item type-b">Type B</span>
            <p class="item type-c">Type C</p>
            <div class="item">Normal</div>
        `;
        const { jquery: jqTest, nodeQuery: nqTest } = createTestDom(html);
        const nqTestElements = nqTest.find('.item');
        const jqTestElements = jqTest.find('.item');

        const nqResult1 = nqTestElements.is('div, span');
        const jqResult1 = jqTestElements.is('div, span');

        expect(nqResult1).toBe(jqResult1);
        expect(nqResult1).toBe(true);

        const nqResult2 = nqTestElements.is('.type-a, .type-b');
        const jqResult2 = jqTestElements.is('.type-a, .type-b');

        expect(nqResult2).toBe(jqResult2);
        expect(nqResult2).toBe(true);

        const nqResult3 = nqTestElements.is('.nonexistent, .missing');
        const jqResult3 = jqTestElements.is('.nonexistent, .missing');

        expect(nqResult3).toBe(jqResult3);
        expect(nqResult3).toBe(false);
    });

    test('is() should work with empty string selector - jquery-comparison', () => {
        const nqResult = elements.is('');
        const jqResult = jqElements.is('');

        expect(nqResult).toBe(jqResult);
        expect(nqResult).toBe(false);
    });
});
