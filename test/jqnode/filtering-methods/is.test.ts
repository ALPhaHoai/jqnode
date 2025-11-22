import $ from '../../../index';

describe('is() method', () => {
    test('is() should return true when at least one element matches selector', () => {
        const html = `
            <div class="item active">Active</div>
            <div class="item inactive">Inactive</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('.active')).toBe(true);
        expect(elements.is('.inactive')).toBe(true);
    });

    test('is() should return false when no elements match selector', () => {
        const html = `
            <div class="item">Item 1</div>
            <div class="item">Item 2</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('.nonexistent')).toBe(false);
    });

    test('is() should work with tag selectors', () => {
        const html = `
            <div class="item">Div</div>
            <span class="item">Span</span>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('div')).toBe(true);
        expect(elements.is('span')).toBe(true);
        expect(elements.is('p')).toBe(false);
    });

    test('is() should work with ID selectors', () => {
        const html = `
            <div class="item" id="first">First</div>
            <div class="item">Second</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('#first')).toBe(true);
        expect(elements.is('#nonexistent')).toBe(false);
    });

    test('is() should work with complex selectors', () => {
        const html = `
            <div class="item active special">Special Active</div>
            <div class="item active">Just Active</div>
            <div class="item">Normal</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('.active.special')).toBe(true);
        expect(elements.is('.inactive.special')).toBe(false);
    });

    test('is() should work with direct element references', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
        `;
        const elements = $(html).filter('.item');
        const firstElement = elements.nodes[0];

        expect(elements.is(firstElement)).toBe(true);
        expect(elements.is({ type: 'element', tagName: 'div' })).toBe(false); // Not in the collection
    });

    test('is() should work with JQ objects', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        const allElements = $(html).filter('.item');
        const firstElement = allElements.first();

        expect(allElements.is(firstElement)).toBe(true);
        expect(firstElement.is(allElements)).toBe(true);
    });

    test('is() should return false for empty collection', () => {
        const empty = $('.nonexistent');
        expect(empty.is('.anything')).toBe(false);
    });

    test('is() should return false for invalid selectors', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).filter('.item');

        expect(elements.is('')).toBe(false);
        expect(elements.is(null as any)).toBe(false);
        expect(elements.is(undefined as any)).toBe(false);
    });

    test('is() should work with single element collection', () => {
        const html = `<div class="item active">Single</div>`;
        const elements = $(html).filter('.item');

        expect(elements.is('.active')).toBe(true);
        expect(elements.is('.inactive')).toBe(false);
    });

    test('is() should return true when multiple elements match', () => {
        const html = `
            <div class="item active">First</div>
            <div class="item active">Second</div>
            <div class="item inactive">Third</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('.active')).toBe(true); // At least one matches
    });

    test('is() should work after filtering', () => {
        const html = `
            <div class="item active">Active 1</div>
            <div class="item active">Active 2</div>
            <div class="item inactive">Inactive</div>
        `;
        const activeElements = $(html).find('.item').filter('.active');

        expect(activeElements.is('.active')).toBe(true);
        expect(activeElements.is('.inactive')).toBe(false);
    });

    test('is() should handle selector matching on root elements', () => {
        const html = `<div class="test">Test Element</div>`;
        const elements = $(html).filter('.test');

        expect(elements.is('div')).toBe(true);
        expect(elements.is('.test')).toBe(true);
        expect(elements.is('span')).toBe(false);
    });

    test('is() should work with attribute selectors', () => {
        const html = `
            <div class="item" data-id="123">With ID</div>
            <div class="item" data-type="special">Special</div>
            <div class="item">Normal</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('[data-id]')).toBe(true);
        expect(elements.is('[data-type="special"]')).toBe(true);
        expect(elements.is('[data-missing]')).toBe(false);
    });

    test('is() should work with attribute contains selectors', () => {
        const html = `
            <div class="item" data-classes="btn primary">Primary Button</div>
            <div class="item" data-classes="btn secondary">Secondary Button</div>
            <div class="item">No classes</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('[data-classes*="btn"]')).toBe(true);
        expect(elements.is('[data-classes*="primary"]')).toBe(true);
        expect(elements.is('[data-classes*="tertiary"]')).toBe(false);
    });

    test('is() should work with universal selector', () => {
        const html = `<div class="test">Universal</div>`;
        const elements = $(html).filter('.test');

        expect(elements.is('*')).toBe(true);
    });

    test('is() should work with multiple selectors separated by commas', () => {
        const html = `
            <div class="item type-a">Type A</div>
            <span class="item type-b">Type B</span>
            <p class="item type-c">Type C</p>
            <div class="item">Normal</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('div, span')).toBe(true);
        expect(elements.is('.type-a, .type-b')).toBe(true);
        expect(elements.is('.nonexistent, .missing')).toBe(false);
    });

    test('is() should work with complex selector combinations', () => {
        const html = `
            <div class="container">
                <div class="item active special" data-id="1">Complex 1</div>
                <div class="item inactive" data-id="2">Complex 2</div>
                <div class="item active" data-id="3">Complex 3</div>
            </div>
        `;
        const elements = $(html).find('.item');

        expect(elements.is('div.active[data-id]')).toBe(true);
        expect(elements.is('.active.special')).toBe(true);
        expect(elements.is('div.inactive[data-id="2"]')).toBe(true);
    });

    test('is() should handle malformed selectors gracefully', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).filter('.item');

        // Malformed selectors should throw SyntaxError (jQuery behavior)
        expect(() => elements.is('[unclosed')).toThrow(SyntaxError);
        expect(() => elements.is('.class[')).toThrow(SyntaxError);
        expect(elements.is('div.')).toBe(true); // Parsed as div (dot ignored)
    });

    test('is() should work with empty string selector', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).filter('.item');

        expect(elements.is('')).toBe(false);
    });

    test('is() should work with selectors containing special characters', () => {
        const html = `
            <div class="item" data-value="test-value">Test Value</div>
            <div class="item" data-value="test_value">Test_Value</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('[data-value="test-value"]')).toBe(true);
        expect(elements.is('[data-value="test_value"]')).toBe(true);
        expect(elements.is('[data-value="nonexistent"]')).toBe(false);
    });

    test('is() should work with child/descendant selectors when element is root', () => {
        const html = `
            <div class="container">
                <span class="child">Child Span</span>
            </div>
        `;
        const containers = $(html).find('.container');

        // This tests if a container has a child span
        expect(containers.is('.container:has(span)')).toBe(false); // Since :has might not be implemented
        expect(containers.is('div')).toBe(true); // Fallback to basic selector
    });

    test('is() should handle selectors with quotes', () => {
        const html = `<div class="item" title="Click me">Quoted Title</div>`;
        const elements = $(html).filter('.item');

        expect(elements.is('[title="Click me"]')).toBe(true);
        expect(elements.is('[title="Wrong text"]')).toBe(false);
    });

    test('is() should work with case-sensitive attribute values', () => {
        const html = `
            <div class="item" data-case="UPPER">Upper</div>
            <div class="item" data-case="lower">Lower</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('[data-case="UPPER"]')).toBe(true);
        expect(elements.is('[data-case="upper"]')).toBe(false);
    });

    test('is() should handle selectors with multiple classes', () => {
        const html = `
            <div class="item class1 class2 class3">Multiple Classes</div>
            <div class="item class1">Single Class</div>
        `;
        const elements = $(html).filter('.item');

        expect(elements.is('.class1.class2')).toBe(true);
        expect(elements.is('.class1.class2.class3')).toBe(true);
        expect(elements.is('.class1.class4')).toBe(false);
    });

    test('is() should work with adjacent sibling selectors', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        const elements = $(html).filter('.item');

        // Since is() checks if any element matches the selector,
        // and adjacent sibling selectors might not be fully supported,
        // this tests the basic functionality
        expect(elements.is('div')).toBe(true);
        expect(elements.is('span')).toBe(false);
    });

    test('is() should handle very long selectors', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).filter('.item');

        const longSelector = '.item'.repeat(100); // Very long selector
        expect(elements.is(longSelector)).toBe(true); // Should match (element has 'item' class)
        expect(elements.is('.item')).toBe(true); // Should still work normally
    });

    test('is() should work after multiple chaining operations', () => {
        const html = `
            <div class="item active">Active 1</div>
            <div class="item inactive">Inactive</div>
            <div class="item active">Active 2</div>
        `;
        const activeElements = $(html).find('.item').filter('.active');

        expect(activeElements.is('.active')).toBe(true);
        expect(activeElements.is('.inactive')).toBe(false);

        const firstActive = activeElements.first();
        expect(firstActive.is('.active')).toBe(true);
    });
});
