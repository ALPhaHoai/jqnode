const $ = require('../../../index');

describe('last() method', () => {
    beforeEach(() => {
        // Clear global root nodes registry to prevent state pollution between tests
        $.clearRootNodesRegistry();
    });
    test('last() should select the last element from multiple elements', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Third');
    });

    test('last() should select the last element from single element', () => {
        const html = `<div class="item">Only One</div>`;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Only One');
    });

    test('last() should return empty result when called on empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.last();
        expect(result.nodes).toHaveLength(0);
    });

    test('last() should work with different element types', () => {
        const html = `
            <h1>Title</h1>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
            <div>Div</div>
        `;
        const elements = $(html).filter('p, h1, div');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        const resultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(resultTag).toBe('div');
        expect(result.text()).toBe('Div');
    });

    test('last() should return last element after filtering', () => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('data-id')).toBe('3');
    });

    test('last() should work with larger collections', () => {
        const html = `
            <div class="item">1</div>
            <div class="item">2</div>
            <div class="item">3</div>
            <div class="item">4</div>
            <div class="item">5</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('5');
    });

    test('last() should work with chaining - last() after filter()', () => {
        const html = `
            <div class="item active">Active 1</div>
            <div class="item inactive">Inactive</div>
            <div class="item active">Active 2</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.filter('.active').last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Active 2');
    });

    test('last() should work with chaining - last() after slice()', () => {
        const html = `
            <div class="item">1</div>
            <div class="item">2</div>
            <div class="item">3</div>
            <div class="item">4</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.slice(0, 2).last(); // Slice gives 1, 2; last() gives 2

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('2');
    });

    test('last() should work with chaining - last() after eq()', () => {
        const html = `<div class="item">Single</div>`;
        const elements = $(html).filter('.item');
        const result = elements.eq(0).last(); // Should be no-op since eq returns single element

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Single');
    });

    test('last() should preserve all element attributes', () => {
        const html = `<div class="item" id="last" data-value="456" title="Test">Content</div>`;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.attr('id')).toBe('last');
        expect(result.attr('data-value')).toBe('456');
        expect(result.attr('title')).toBe('Test');
        expect(result.attr('class')).toBe('item');
    });

    test('last() should work with different element types and preserve tag', () => {
        const html = `
            <h1 class="header">Title</h1>
            <p class="text">Paragraph</p>
            <div class="content">Div</div>
        `;
        const elements = $(html).filter('.header, .text, .content');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        const lastResultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(lastResultTag).toBe('div');
        expect(result.text()).toBe('Div');
    });

    test('last() should work with nested elements', () => {
        const html = `
            <div class="item">Top Level</div>
            <div class="container">
                <div class="item">Nested First</div>
                <div class="item">Nested Last</div>
            </div>
        `;
        const elements = $(html).find('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Nested Last');
    });

    test('last() should work with large collections', () => {
        const html = Array.from({length: 1000}, (_, i) =>
            `<div class="item">Item ${i + 1}</div>`
        ).join('');
        const largeCollection = $(html).find('.item');
        const result = largeCollection.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Item 1000');
    });

    test('last() should return new collection instance', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result).not.toBe(elements);
        expect(result.nodes).not.toBe(elements.nodes);
        const resultFirstNode = result.nodes[0];
        const elementsFirstNode = elements.nodes[0];
        expect(resultFirstNode).toBe(elementsFirstNode);
    });

    test('last() should work after multiple chaining operations', () => {
        const html = `
            <div class="item active priority">Priority 1</div>
            <div class="item inactive priority">Priority 2</div>
            <div class="item active normal">Normal 1</div>
            <div class="item active priority">Priority 3</div>
        `;
        const elements = $(html).filter('.item');

        // Chain: filter -> slice -> last
        const result = elements.filter('.active').slice(1, 3).last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Priority 3');
        expect(result.hasClass('priority')).toBe(true);
    });

    test('last() should work with elements that have complex nested content', () => {
        const html = `
            <div class="item">Simple first</div>
            <div class="item">
                <span>Span in last</span>
                <p>Paragraph in last</p>
            </div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        const resultSpan = result.find('span');
        expect(resultSpan.text()).toBe('Span in last');
        const resultP = result.find('p');
        expect(resultP.text()).toBe('Paragraph in last');
    });

    test('last() should work with self-closing tags', () => {
        const html = `
            <input class="field" type="text" value="first">
            <input class="field" type="text" value="last">
        `;
        const elements = $(html).filter('.field');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('value')).toBe('last');
        expect(result.attr('type')).toBe('text');
    });

    test('last() should work with mixed content (text and elements)', () => {
        const html = `
            <div class="item">First item</div>
            <div class="item">Text <span>span</span> more text</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Text span more text');
        const resultSpan = result.find('span');
        expect(resultSpan.text()).toBe('span');
    });

    test('last() should handle elements with different namespaces', () => {
        const html = `
            <svg class="item">
                <circle cx="50" cy="50" r="40"/>
            </svg>
            <div class="item">Regular div</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        const lastResultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(lastResultTag).toBe('div');
        expect(result.text()).toBe('Regular div');
    });

    test('last() should work with dynamically created elements', () => {
        // Create elements programmatically
        const div1 = $(`<div class="dynamic">First Dynamic</div>`);
        const div2 = $(`<div class="dynamic">Last Dynamic</div>`);

        // Combine them
        const combined = $(div1.nodes.concat(div2.nodes));
        const result = combined.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Last Dynamic');
    });

    test('last() should handle elements with event handlers', () => {
        const html = `<div class="item" onclick="console.log('click')">Clickable</div>`;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('onclick')).toBe("console.log('click')");
        expect(result.text()).toBe('Clickable');
    });

    test('last() should work with elements containing special characters', () => {
        const html = `
            <div class="item">Normal text</div>
            <div class="item">&lt;script&gt;console.log('test')&lt;/script&gt;</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.last();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe("<script>console.log('test')</script>");
    });

    test('last() should work with reverse order chaining', () => {
        const html = `
            <div class="item" data-index="1">First</div>
            <div class="item" data-index="2">Second</div>
            <div class="item" data-index="3">Third</div>
        `;
        const elements = $(html).filter('.item');

        // Get last element and then chain more operations
        const result = elements.last().attr('data-index');

        expect(result).toBe('3');
    });

    test('last() should work with empty filtered results', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.filter('.nonexistent').last();

        expect(result.nodes).toHaveLength(0);
    });
});
