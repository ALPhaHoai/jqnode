import $ from '../../../index';

describe('first() method', () => {
    test('first() should select the first element from multiple elements', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('First');
    });

    test('first() should select the first element from single element', () => {
        const html = `<div class="item">Only One</div>`;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Only One');
    });

    test('first() should return empty result when called on empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.first();
        expect(result.nodes).toHaveLength(0);
    });

    test('first() should work with different element types', () => {
        const html = `
            <h1>Title</h1>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
            <div>Div</div>
        `;
        const elements = $(html).find('p, h1, div');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        const resultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(['h1', 'p', 'div']).toContain(resultTag);
        expect(result.text()).toMatch(/^(Title|Paragraph 1|Div)$/);
    });

    test('first() should return first element after filtering', () => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
        `;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('data-id')).toBe('1');
    });

    test('first() should work with chaining - first() after filter()', () => {
        const html = `
            <div class="item active">Active 1</div>
            <div class="item inactive">Inactive</div>
            <div class="item active">Active 2</div>
        `;
        const elements = $(html).find('.item');
        const result = elements.filter('.active').first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Active 1');
    });

    test('first() should work with chaining - first() after slice()', () => {
        const html = `
            <div class="item">1</div>
            <div class="item">2</div>
            <div class="item">3</div>
            <div class="item">4</div>
        `;
        const elements = $(html).find('.item');
        const result = elements.slice(2, 4).first(); // Slice gives 3, 4; first() gives 3

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('3');
    });

    test('first() should work with chaining - first() after eq()', () => {
        const html = `<div class="item">Single</div>`;
        const elements = $(html).find('.item');
        const result = elements.eq(0).first(); // Should be no-op since eq returns single element

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Single');
    });

    test('first() should preserve all element attributes', () => {
        const html = `<div class="item" id="first" data-value="123" title="Test">Content</div>`;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.attr('id')).toBe('first');
        expect(result.attr('data-value')).toBe('123');
        expect(result.attr('title')).toBe('Test');
        expect(result.attr('class')).toBe('item');
    });

    test('first() should work with different element types and preserve tag', () => {
        const html = `
            <h1 class="header">Title</h1>
            <p class="text">Paragraph</p>
            <div class="content">Div</div>
        `;
        const elements = $(html).filter('.header, .text, .content');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        const resultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(resultTag).toBe('h1');
        expect(result.text()).toBe('Title');
    });

    test('first() should work with nested elements', () => {
        const html = `
            <div class="container">
                <div class="item">Nested First</div>
                <div class="item">Nested Second</div>
            </div>
            <div class="item">Top Level</div>
        `;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Nested First');
    });

    test('first() should work with large collections', () => {
        const html = Array.from({length: 1000}, (_, i) =>
            `<div class="item">Item ${i + 1}</div>`
        ).join('');
        const largeCollection = $(html).find('.item');
        const result = largeCollection.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Item 1');
    });

    test('first() should return new collection instance', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result).not.toBe(elements);
        expect(result.nodes).not.toBe(elements.nodes);
        const resultFirstNode = result.nodes[0];
        const elementsFirstNode = elements.nodes[0];
        expect(resultFirstNode).toBe(elementsFirstNode);
    });

    test('first() should work after multiple chaining operations', () => {
        const html = `
            <div class="item active priority">Priority 1</div>
            <div class="item inactive priority">Priority 2</div>
            <div class="item active normal">Normal 1</div>
            <div class="item active priority">Priority 3</div>
        `;
        const elements = $(html).find('.item');

        // Chain: filter -> slice -> first
        const result = elements.filter('.active').slice(0, 2).first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Priority 1');
        expect(result.hasClass('priority')).toBe(true);
    });

    test('first() should work with elements that have complex nested content', () => {
        const html = `
            <div class="item">
                <span>Span in first</span>
                <p>Paragraph in first</p>
            </div>
            <div class="item">Simple second</div>
        `;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        const resultSpan = result.find('span');
        expect(resultSpan.text()).toBe('Span in first');
        const resultP = result.find('p');
        expect(resultP.text()).toBe('Paragraph in first');
    });

    test('first() should work with self-closing tags', () => {
        const html = `
            <input class="field" type="text" value="first">
            <input class="field" type="text" value="second">
        `;
        const elements = $(html).filter('.field');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('value')).toBe('first');
        expect(result.attr('type')).toBe('text');
    });

    test('first() should work with mixed content (text and elements)', () => {
        const html = `
            <div class="item">Text <span>span</span> more text</div>
            <div class="item">Second item</div>
        `;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Text span more text');
        const resultSpan = result.find('span');
        expect(resultSpan.text()).toBe('span');
    });

    test('first() should handle elements with different namespaces', () => {
        const html = `
            <div class="item">Regular div</div>
            <svg class="item">
                <circle cx="50" cy="50" r="40"/>
            </svg>
        `;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        const resultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(resultTag).toBe('div');
        expect(result.text()).toBe('Regular div');
    });

    test('first() should work with dynamically created elements', () => {
        // Create elements programmatically
        const div1 = $(`<div class="dynamic">First Dynamic</div>`);
        const div2 = $(`<div class="dynamic">Second Dynamic</div>`);

        // Combine them
        const combined = $(div1.nodes.concat(div2.nodes));
        const result = combined.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('First Dynamic');
    });

    test('first() should handle elements with event handlers', () => {
        const html = `<div class="item" onclick="console.log('click')">Clickable</div>`;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('onclick')).toBe("console.log('click')");
        expect(result.text()).toBe('Clickable');
    });

    test('first() should work with elements containing special characters', () => {
        const html = `
            <div class="item">&lt;script&gt;console.log('test')&lt;/script&gt;</div>
            <div class="item">Normal text</div>
        `;
        const elements = $(html).find('.item');
        const result = elements.first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe("<script>console.log('test')</script>");
    });
});
