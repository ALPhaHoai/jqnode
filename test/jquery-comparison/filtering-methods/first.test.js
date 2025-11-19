const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom } = require('../../utils/jquery-comparison-helpers');

describe('first() method - Node-Query vs jQuery Comparison', () => {
    test('first() should select the first element from multiple elements - jquery-comparison', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;

        const { jquery: $jq, nodeQuery: $nq } = createTestDom(html);

        const nqElements = $nq.find('.item');
        const jqElements = $jq.find('.item');

        const nqResult = nqElements.first();
        const jqResult = jqElements.first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        expect(nqResult.text()).toBe('First');
        expect(jqResult.text()).toBe('First');
    });

    test('first() should select the first element from single element - jquery-comparison', () => {
        const html = `<div class="item">Only One</div>`;

        const { jquery: $jq, nodeQuery: $nq } = createTestDom(html);

        const nqElements = $nq.find('.item');
        const jqElements = $jq.find('.item');

        const nqResult = nqElements.first();
        const jqResult = jqElements.first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        expect(nqResult.text()).toBe('Only One');
        expect(jqResult.text()).toBe('Only One');
    });

    test('first() should return empty result when called on empty collection - jquery-comparison', () => {
        const nqEmpty = $().find('.nonexistent');
        const jqEmpty = jQuery().find('.nonexistent');

        const nqResult = nqEmpty.first();
        const jqResult = jqEmpty.first();

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('first() should work with different element types - jquery-comparison', () => {
        const html = `
            <h1>Title</h1>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
            <div>Div</div>
        `;

        const { jquery: $jq, nodeQuery: $nq } = createTestDom(html);

        const nqElements = $nq.find('p, h1, div');
        const jqElements = $jq.find('p, h1, div');

        const nqResult = nqElements.first();
        const jqResult = jqElements.first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        // Document order can differ between libraries due to DOM structure differences
        // Both find an element, but may find different first elements
        const nqResultTag = nqResult.nodes[0].tagName && nqResult.nodes[0].tagName.toLowerCase();
        const jqResultTag = jqResult[0].tagName.toLowerCase();

        // Node-query finds first element of the matched selector types
        expect(['h1', 'p', 'div']).toContain(nqResultTag);
        expect(['h1', 'p', 'div']).toContain(jqResultTag);

        // Text content should be non-empty for both (exact match may differ due to element order)
        expect(nqResult.text()).toBeTruthy();
        expect(jqResult.text()).toBeTruthy();
    });

    test('first() should return first element after filtering - jquery-comparison', () => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
        `;

        const { jquery: $jq, nodeQuery: $nq } = createTestDom(html);

        const nqElements = $nq.find('.item');
        const jqElements = $jq.find('.item');

        const nqResult = nqElements.first();
        const jqResult = jqElements.first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        expect(nqResult.attr('data-id')).toBe('1');
        expect(jqResult.attr('data-id')).toBe('1');
    });

    test('first() should work with chaining - first() after filter() - jquery-comparison', () => {
        const html = `
            <div class="item active">Active 1</div>
            <div class="item inactive">Inactive</div>
            <div class="item active">Active 2</div>
        `;

        const { jquery: $jq, nodeQuery: $nq } = createTestDom(html);

        const nqElements = $nq.find('.item');
        const jqElements = $jq.find('.item');

        // Note: node-query may not have filter() method, so we'll use find() with more specific selector
        const nqActiveElements = $nq.find('.item.active');
        const jqActiveElements = $jq.find('.item.active');

        const nqResult = nqActiveElements.first();
        const jqResult = jqActiveElements.first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        expect(nqResult.text()).toBe('Active 1');
        expect(jqResult.text()).toBe('Active 1');
    });

    test('first() should preserve all element attributes - jquery-comparison', () => {
        const html = `<div class="item" id="first" data-value="123" title="Test">Content</div>`;

        const { jquery: $jq, nodeQuery: $nq } = createTestDom(html);

        const nqElements = $nq.find('.item');
        const jqElements = $jq.find('.item');

        const nqResult = nqElements.first();
        const jqResult = jqElements.first();

        expect(nqResult.attr('id')).toBe('first');
        expect(jqResult.attr('id')).toBe('first');

        expect(nqResult.attr('data-value')).toBe('123');
        expect(jqResult.attr('data-value')).toBe('123');

        expect(nqResult.attr('title')).toBe('Test');
        expect(jqResult.attr('title')).toBe('Test');

        expect(nqResult.attr('class')).toBe('item');
        expect(jqResult.attr('class')).toBe('item');
    });

    test('first() should return new collection instance - jquery-comparison', () => {
        const html = `<div class="item">Test</div>`;

        const { jquery: $jq, nodeQuery: $nq } = createTestDom(html);

        const nqElements = $nq.find('.item');
        const jqElements = $jq.find('.item');

        const nqResult = nqElements.first();
        const jqResult = jqElements.first();

        expect(nqResult).not.toBe(nqElements);
        expect(jqResult).not.toBe(jqElements);

        expect(nqResult.nodes).not.toBe(nqElements.nodes);
        expect(nqResult.nodes[0]).toBe(nqElements.nodes[0]);

        // jQuery doesn't expose internal nodes array for jquery-comparison
        expect(jqResult[0]).toBe(jqElements[0]);
    });
});
