import $ from '../../../index';
import JQ from '../../../jq';
import { HtmlNode } from '../../../types';

describe('not() method', () => {
    let elements: JQ;

    beforeEach(() => {
        const html = `
            <div class="item active">Active Item 1</div>
            <div class="item">Inactive Item</div>
            <div class="item active">Active Item 2</div>
            <div class="item">Inactive Item 2</div>
            <div class="item active special">Active Special Item</div>
        `;
        elements = $(html).filter('.item');
    });

    test('not() should exclude elements matching CSS selector', () => {
        const result = elements.not('.active');
        expect(result.nodes).toHaveLength(2);
        const allInactive = result.nodes.every((node: HtmlNode) => !((node.attributes?.class as string) || '').includes('active'));
        expect(allInactive).toBe(true);
        expect(result.text()).toBe('Inactive ItemInactive Item 2');
    });

    test('not() should exclude elements matching complex CSS selector', () => {
        const result = elements.not('.active.special');
        expect(result.nodes).toHaveLength(4);
        const noneHaveSpecialClass = result.nodes.every((node: HtmlNode) => !((node.attributes?.class as string) || '').includes('special'));
        expect(noneHaveSpecialClass).toBe(true);
    });

    test('not() should exclude elements using function that returns true/false', () => {
        const result = elements.not(function (index: number, element: HtmlNode) {
            return index % 2 === 0; // Exclude even indices (0, 2, 4)
        });
        expect(result.nodes).toHaveLength(2); // Should keep indices 1 and 3
        expect(result.text()).toBe('Inactive ItemInactive Item 2');
    });

    test('not() should exclude elements using function that checks element properties', () => {
        const result = elements.not(function (index: number, element: HtmlNode) {
            return (element.attributes?.class as string || '').includes('special');
        });
        expect(result.nodes).toHaveLength(4);
        const noSpecialElements = result.nodes.every((node: HtmlNode) => !((node.attributes?.class as string) || '').includes('special'));
        expect(noSpecialElements).toBe(true);
    });

    test('not() should return no elements when function always returns true', () => {
        const result = elements.not(() => true);
        expect(result.nodes).toHaveLength(0);
    });

    test('not() should return all elements when function always returns false', () => {
        const result = elements.not(() => false);
        expect(result.nodes).toHaveLength(5);
    });

    test('not() should return all elements when selector matches nothing', () => {
        const result = elements.not('.nonexistent');
        expect(result.nodes).toHaveLength(5);
    });

    test('not() should work with tag selectors', () => {
        const mixedHtml = `
            <div class="item">Div 1</div>
            <span class="item">Span 1</span>
            <div class="item">Div 2</div>
            <span class="item">Span 2</span>
        `;
        const mixedElements = $(mixedHtml).find('.item');
        const result = mixedElements.not('div');

        expect(result.nodes).toHaveLength(2);
        const allSpans = result.nodes.every((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'span');
        expect(allSpans).toBe(true);
        expect(result.text()).toBe('Span 1Span 2');
    });

    test('not() should maintain element order', () => {
        const result = elements.not('.active');
        expect(result.nodes).toHaveLength(2);
        const firstResultClass = result.nodes[0].attributes?.class;
        expect(firstResultClass).toBe('item');
        const secondResultClass = result.nodes[1].attributes?.class;
        expect(secondResultClass).toBe('item');
    });

    test('not() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.not('.anything');
        expect(result.nodes).toHaveLength(0);
    });

    test('not() should handle invalid selector gracefully', () => {
        const result = elements.not('');
        expect(result.nodes).toHaveLength(5); // Should return all elements
    });

    test('not() should handle invalid function gracefully', () => {
        const result = elements.not(null);
        expect(result.nodes).toHaveLength(5); // Should return all elements
    });

    test('not() should allow chaining with other methods', () => {
        const result = elements.not('.active').first();
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Inactive Item');
    });

    test('not() should work as inverse of filter()', () => {
        const filtered = elements.filter('.active');
        const notFiltered = elements.not('.active');

        const filteredNodesCount = filtered.nodes.length;
        const notFilteredNodesCount = notFiltered.nodes.length;
        const totalFilteredElements = filteredNodesCount + notFilteredNodesCount;
        const elementsNodesCount = elements.nodes.length;
        expect(totalFilteredElements).toBe(elementsNodesCount);

        // Check that combined they cover all original elements
        const combined = [...filtered.nodes, ...notFiltered.nodes];
        expect(combined).toHaveLength(elementsNodesCount);
    });

    test('not() should work with function that accesses element properties', () => {
        const html = `
            <div class="item" data-value="10">Ten</div>
            <div class="item" data-value="20">Twenty</div>
            <div class="item" data-value="30">Thirty</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.not(function (index: number, element: HtmlNode) {
            return parseInt(element.attributes?.['data-value'] as string) <= 15;
        });

        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('TwentyThirty');
    });

    test('not() should work with function that uses this context', () => {
        const result = elements.not(function (index: number) {
            // Exclude elements that have exactly 'Inactive Item' as text content
            const textContent = this.children.map((child: HtmlNode) => child.data || '').join('');
            return textContent === 'Inactive Item';
        });

        expect(result.nodes).toHaveLength(4);
        expect(result.text()).toBe('Active Item 1Active Item 2Inactive Item 2Active Special Item');
    });

    test('not() should work with complex CSS selectors', () => {
        const html = `
            <div class="item active" data-type="primary">Primary Active</div>
            <div class="item active" data-type="secondary">Secondary Active</div>
            <div class="item inactive" data-type="primary">Primary Inactive</div>
            <div class="item active special">Special Active</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.not('.active[data-type="primary"], .inactive');
        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('Secondary ActiveSpecial Active');
    });

    test('not() should work with attribute selectors', () => {
        const html = `
            <div class="item" data-id="1">One</div>
            <div class="item" data-id="2" data-type="special">Two Special</div>
            <div class="item" data-id="3">Three</div>
            <div class="item" data-category="featured">Featured</div>
        `;
        const elements = $(html).filter('.item');

        const result1 = elements.not('[data-id]');
        expect(result1.nodes).toHaveLength(1);
        expect(result1.text()).toBe('Featured');

        const result2 = elements.not('[data-type="special"]');
        expect(result2.nodes).toHaveLength(3);
    });

    test('not() should work with attribute contains selectors', () => {
        const html = `
            <div class="item" data-classes="btn primary">Primary Button</div>
            <div class="item" data-classes="btn secondary">Secondary Button</div>
            <div class="item" data-classes="link">Link</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.not('[data-classes*="btn"]');
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Link');
    });

    test('not() should handle function that returns non-boolean values', () => {
        const result = elements.not(function (index: number) {
            // Return falsy for indices 1 and 2, truthy for others
            // This tests that non-boolean return values are properly coerced
            return index === 1 || index === 2 ? false : 'truthy';
        });

        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('Inactive ItemActive Item 2');
    });

    test('not() should work with function that accesses parent elements', () => {
        const html = `
            <div class="container">
                <div class="item">Child of container</div>
            </div>
            <div class="wrapper">
                <div class="item">Child of wrapper</div>
            </div>
            <div class="item">Direct item</div>
        `;
        const elements = $(html).find('.item');

        const result = elements.not(function (index: number, element: HtmlNode) {
            // Exclude elements that are children of containers with class 'container'
            return !!(element.parent && element.parent.attributes?.class === 'container');
        });

        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('Child of wrapperDirect item');
    });

    test('not() should handle null and undefined function parameters gracefully', () => {
        const result = elements.not(null);
        expect(result.nodes).toHaveLength(5); // Should return all elements

        const result2 = elements.not(undefined);
        expect(result2.nodes).toHaveLength(5); // Should return all elements
    });

    test('not() should work with mixed element types', () => {
        const html = `
            <div class="item">Div</div>
            <span class="item">Span</span>
            <p class="item">Paragraph</p>
            <div class="item">Another Div</div>
        `;
        const mixedElements = $(html).find('.item');

        const result = mixedElements.not('div');
        expect(result.nodes).toHaveLength(2);
        const noDivElements = result.nodes.every((node: HtmlNode) => !node.tagName || node.tagName.toLowerCase() !== 'div');
        expect(noDivElements).toBe(true);
        expect(result.text()).toBe('SpanParagraph');
    });

    test('not() should preserve element order after complex exclusions', () => {
        const html = `
            <div class="item" data-order="1">First</div>
            <div class="item" data-order="2">Second</div>
            <div class="item" data-order="3">Third</div>
            <div class="item" data-order="4">Fourth</div>
            <div class="item" data-order="5">Fifth</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.not(function (index: number) {
            return index % 2 === 0; // Exclude even indices: 0, 2, 4
        });

        expect(result.nodes).toHaveLength(2);
        const dataOrderValues = result.nodes.map((node: HtmlNode) => node.attributes?.['data-order']);
        expect(dataOrderValues).toEqual(['2', '4']);
    });

    test('not() should work with nested exclusion functions', () => {
        const result = elements.not(function (index: number, element: HtmlNode) {
            // Nested condition: exclude active elements OR (index >= 3 AND has 'special' class)
            const isActive = (element.attributes?.class as string || '').includes('active');
            const isLateAndSpecial = index >= 3 && (element.attributes?.class as string || '').includes('special');

            return isActive || isLateAndSpecial;
        });

        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('Inactive ItemInactive Item 2');
    });

    test('not() should handle function that throws errors gracefully', () => {
        const result = elements.not(function (index: number) {
            if (index === 2) {
                throw new Error('Test error');
            }
            return index % 2 === 0;
        });

        // Should continue processing even after error (error at index 2 is treated as falsy, so element is kept)
        expect(result.nodes).toHaveLength(3); // Elements 1, 2, 3 (excluded 0, 4)
        expect(result.text()).toBe('Inactive ItemActive Item 2Inactive Item 2');
    });

    test('not() should work with function that uses external variables', () => {
        const excludeThreshold = 2;
        const result = elements.not(function (index: number) {
            return index < excludeThreshold;
        });

        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('Active Item 2Inactive Item 2Active Special Item');
    });

    test('not() should handle empty collections with functions', () => {
        const empty = $('.nonexistent');
        const result = empty.not(() => true);
        expect(result.nodes).toHaveLength(0);

        const result2 = empty.not(() => false);
        expect(result2.nodes).toHaveLength(0);
    });

    test('not() should work with complex chaining scenarios', () => {
        const html = `
            <div class="item active priority">Priority 1</div>
            <div class="item inactive priority">Priority 2</div>
            <div class="item active normal">Normal 1</div>
            <div class="item inactive normal">Normal 2</div>
            <div class="item active priority">Priority 3</div>
        `;
        const elements = $(html).filter('.item');

        // Chain: filter by active -> not priority -> slice -> first
        const result = elements.filter('.active').not('.priority').slice(0, 2).first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Normal 1');
        const hasNormalClass = result.attr('class').includes('normal');
        expect(hasNormalClass).toBe(true);
    });

    test('not() should work with universal selector', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).filter('.item');

        const result = elements.not('*');
        expect(result.nodes).toHaveLength(0);
    });

    test('not() should work with empty string selector', () => {
        const result = elements.not('');
        expect(result.nodes).toHaveLength(5); // Should return all elements
    });

    test('not() should work with multiple selectors separated by commas', () => {
        const html = `
            <div class="item type-a">Type A</div>
            <div class="item type-b">Type B</div>
            <div class="item type-c">Type C</div>
            <div class="item">Normal</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.not('.type-a, .type-c');
        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('Type BNormal');
    });

    test('not() should handle malformed selectors gracefully', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).filter('.item');

        // Malformed selectors should throw SyntaxError (jQuery behavior)
        expect(() => elements.not('[unclosed')).toThrow(SyntaxError);
        expect(() => elements.not('.class[')).toThrow(SyntaxError);
    });

    test('not() should work with very long selectors', () => {
        const html = `<div class="item">Test</div>`;
        const elements = $(html).filter('.item');

        // Use a selector that definitely won't match
        const longSelector = '.nonexistent-class';
        const result = elements.not(longSelector);
        expect(result.nodes).toHaveLength(1); // Should not match and return all elements
    });

    test('not() should work with large collections and complex functions', () => {
        const html = Array.from({ length: 100 }, (_, i) =>
            `<div class="item" data-index="${i}">Item ${i}</div>`
        ).join('');
        const largeCollection = $(html).find('.item');

        const result = largeCollection.not(function (index: number, element: HtmlNode) {
            const numIndex = parseInt(element.attributes?.['data-index'] as string);
            return numIndex % 3 === 0; // Exclude multiples of 3
        });

        // Should exclude indices 0, 3, 6, ..., 99 (which is 34 elements)
        expect(result.nodes).toHaveLength(66); // 100 - 34 = 66
    });

    test('not() should handle function that modifies elements during iteration', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.not(function (index: number, element: HtmlNode) {
            // Modify element during iteration
            if (index === 1) {
                if (element.attributes) {
                    element.attributes.class = 'item modified';
                }
            }
            return index % 2 === 0; // Exclude even indices
        });

        expect(result.nodes).toHaveLength(1); // Should only keep index 1 (odd)
        expect(result.text()).toBe('Second');
    });
});
