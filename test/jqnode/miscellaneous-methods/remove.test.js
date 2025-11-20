const $ = require('../../../index');

describe('remove() method', () => {
    test('remove() should remove elements from the DOM', () => {
        const html = `
            <div class="container">
                <div class="item">Item 1</div>
                <div class="item">Item 2</div>
                <div class="item">Item 3</div>
            </div>
        `;
        const $container = $(html);
        const $items = $container.find('.item');

        // Remove all items
        $items.remove();

        // Items should be removed from container
        expect($container.find('.item').length).toBe(0);
    });

    test('remove() should remove single element', () => {
        const html = `
            <div class="parent">
                <span class="child">Child</span>
            </div>
        `;
        const $parent = $(html);
        const $child = $parent.find('.child');

        $child.remove();

        expect($parent.find('.child').length).toBe(0);
        expect($parent.html()).not.toContain('Child');
    });

    test('remove(selector) should remove only matching elements', () => {
        const html = `
            <div class="container">
                <div class="item keep">Keep 1</div>
                <div class="item remove">Remove 1</div>
                <div class="item keep">Keep 2</div>
                <div class="item remove">Remove 2</div>
            </div>
        `;
        const $container = $(html);
        const $items = $container.find('.item');

        // Remove only items with 'remove' class
        $items.remove('.remove');

        // Should have 2 remaining items (the 'keep' ones)
        expect($container.find('.item').length).toBe(2);
        expect($container.find('.keep').length).toBe(2);
        expect($container.find('.remove').length).toBe(0);
    });

    test('remove() should return the JQ instance for chaining', () => {
        const html = `<div><span>Text</span></div>`;
        const $elem = $(html);
        const $span = $elem.find('span');

        const result = $span.remove();

        expect(result).toBe($span);
    });

    test('remove() should handle empty selection', () => {
        const $empty = $([]);

        expect(() => {
            $empty.remove();
        }).not.toThrow();
    });

    test('remove() should clear associated data', () => {
        const html = `
            <div class="parent">
                <div class="child">Child</div>
            </div>
        `;
        const $parent = $(html);
        const $child = $parent.find('.child');

        // Add data to the element
        $child.data('key', 'value');
        expect($child.data('key')).toBe('value');

        // Remove the element
        $child.remove();

        // Data should be cleared from the node
        expect($child.nodes[0]._jqData).toBeUndefined();
    });

    test('remove() should work with nested elements', () => {
        const html = `
            <div class="outer">
                <div class="middle">
                    <div class="inner">Nested</div>
                </div>
            </div>
        `;
        const $outer = $(html);
        const $middle = $outer.find('.middle');

        $middle.remove();

        expect($outer.find('.middle').length).toBe(0);
        expect($outer.find('.inner').length).toBe(0);
    });

    test('remove() should work with multiple elements', () => {
        const html = `
            <div class="container">
                <p>Paragraph 1</p>
                <p>Paragraph 2</p>
                <p>Paragraph 3</p>
            </div>
        `;
        const $container = $(html);
        const $paragraphs = $container.find('p');

        $paragraphs.remove();

        expect($container.find('p').length).toBe(0);
    });

    test('remove(selector) with no matches should not remove anything', () => {
        const html = `
            <div class="container">
                <div class="item">Item 1</div>
                <div class="item">Item 2</div>
            </div>
        `;
        const $container = $(html);
        const $items = $container.find('.item');

        // Try to remove with a selector that doesn't match
        $items.remove('.nonexistent');

        // All items should still be there
        expect($container.find('.item').length).toBe(2);
    });

    test('remove() should handle text nodes in parent', () => {
        const html = `<div>Text <span>Span</span> More text</div>`;
        const $div = $(html);
        const $span = $div.find('span');

        $span.remove();

        // Span should be removed but text should remain
        expect($div.find('span').length).toBe(0);
        expect($div.text()).toContain('Text');
        expect($div.text()).toContain('More text');
    });

    test('remove() should work after chaining', () => {
        const html = `
            <div class="container">
                <div class="outer">
                    <div class="inner target">Remove Me</div>
                </div>
            </div>
        `;
        const $container = $(html);

        $container.find('.outer').find('.target').remove();

        expect($container.find('.target').length).toBe(0);
        expect($container.find('.outer').length).toBe(1); // Outer should still exist
    });
});
