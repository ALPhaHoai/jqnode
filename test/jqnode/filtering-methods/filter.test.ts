import $ from '../../../index';
import JQ from '../../../jq';
import { HtmlNode } from '../../../types';

describe('filter() method', () => {
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

    test('filter() should filter elements using CSS selector', () => {
        const result = elements.filter('.active');
        expect(result.nodes).toHaveLength(3);
        const allActive = result.nodes.every((node: HtmlNode) => node.attributes.class.includes('active'));
        expect(allActive).toBe(true);
    });

    test('filter() should filter elements using complex CSS selector', () => {
        const result = elements.filter('.active.special');
        expect(result.nodes).toHaveLength(1);
        const resultClass = result.nodes[0].attributes.class;
        expect(resultClass).toBe('item active special');
        expect(result.text()).toBe('Active Special Item');
    });

    test('filter() should filter elements using function that returns true/false', () => {
        const result = elements.filter(function (index: number, element: HtmlNode) {
            return index % 2 === 0; // Keep even indices (0, 2, 4)
        });
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('Active Item 1Active Item 2Active Special Item');
    });

    test('filter() should filter elements using function that checks element properties', () => {
        const result = elements.filter(function (index: number, element: HtmlNode) {
            return element.attributes.class.includes('special');
        });
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Active Special Item');
    });

    test('filter() should return all elements when function always returns true', () => {
        const result = elements.filter(() => true);
        expect(result.nodes).toHaveLength(5);
    });

    test('filter() should return no elements when function always returns false', () => {
        const result = elements.filter(() => false);
        expect(result.nodes).toHaveLength(0);
    });

    test('filter() should return no elements when selector matches nothing', () => {
        const result = elements.filter('.nonexistent');
        expect(result.nodes).toHaveLength(0);
    });

    test('filter() should work with tag selectors', () => {
        const mixedHtml = `
            <div class="item">Div 1</div>
            <span class="item">Span 1</span>
            <div class="item">Div 2</div>
            <span class="item">Span 2</span>
        `;
        const mixedElements = $(mixedHtml).filter('.item');
        const result = mixedElements.filter('div');

        expect(result.nodes).toHaveLength(2);
        const allDivs = result.nodes.every((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'div');
        expect(allDivs).toBe(true);
    });

    test('filter() should maintain element order', () => {
        const result = elements.filter('.active');
        expect(result.nodes).toHaveLength(3);
        const firstResultClass = result.nodes[0].attributes.class;
        expect(firstResultClass).toBe('item active');
        const secondResultClass = result.nodes[1].attributes.class;
        expect(secondResultClass).toBe('item active');
        const thirdResultClass = result.nodes[2].attributes.class;
        expect(thirdResultClass).toBe('item active special');
    });

    test('filter() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.filter('.anything');
        expect(result.nodes).toHaveLength(0);
    });

    test('filter() should handle invalid selector gracefully', () => {
        const result = elements.filter('');
        expect(result.nodes).toHaveLength(0);
    });

    test('filter() should handle invalid function gracefully', () => {
        const result = elements.filter(null);
        expect(result.nodes).toHaveLength(0);
    });

    test('filter() should allow chaining with other methods', () => {
        const result = elements.filter('.active').first();
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Active Item 1');
    });

    test('filter() should work with function that accesses element properties', () => {
        const html = `
            <div class="item" data-value="10">Ten</div>
            <div class="item" data-value="20">Twenty</div>
            <div class="item" data-value="30">Thirty</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.filter(function (index: number, element: HtmlNode) {
            return parseInt(element.attributes['data-value']) > 15;
        });

        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('TwentyThirty');
    });

    test('filter() should work with function that uses this context', () => {
        const result = elements.filter(function (index: number) {
            return this.attributes.class.includes('special');
        });

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Active Special Item');
    });

    test('filter() should work with complex CSS selectors', () => {
        const html = `
            <div class="item active" data-type="primary">Primary Active</div>
            <div class="item active" data-type="secondary">Secondary Active</div>
            <div class="item inactive" data-type="primary">Primary Inactive</div>
            <div class="item active special">Special Active</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.filter('.active[data-type="primary"], .active.special');
        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('Primary ActiveSpecial Active');
    });

    test('filter() should work with attribute selectors', () => {
        const html = `
            <div class="item" data-id="1">One</div>
            <div class="item" data-id="2" data-type="special">Two Special</div>
            <div class="item" data-id="3">Three</div>
            <div class="item" data-category="featured">Featured</div>
        `;
        const elements = $(html).filter('.item');

        const result1 = elements.filter('[data-id]');
        expect(result1.nodes).toHaveLength(3);

        const result2 = elements.filter('[data-type="special"]');
        expect(result2.nodes).toHaveLength(1);
        expect(result2.text()).toBe('Two Special');

        const result3 = elements.filter('[data-category]');
        expect(result3.nodes).toHaveLength(1);
        expect(result3.text()).toBe('Featured');
    });

    test('filter() should work with attribute contains selectors', () => {
        const html = `
            <div class="item" data-classes="btn primary">Primary Button</div>
            <div class="item" data-classes="btn secondary">Secondary Button</div>
            <div class="item" data-classes="link">Link</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.filter('[data-classes*="btn"]');
        expect(result.nodes).toHaveLength(2);
        const allHaveBtnClass = result.nodes.every(node => node.attributes['data-classes'].includes('btn'));
        expect(allHaveBtnClass).toBe(true);
    });

    test('filter() should handle function that modifies elements during iteration', () => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.filter(function (index: number, element: HtmlNode) {
            // Filter should not be affected by modifications during iteration
            if (index === 1) {
                element.attributes.class = 'item modified';
            }
            return index % 2 === 0;
        });

        expect(result.nodes).toHaveLength(2); // indices 0 and 2
        expect(result.text()).toBe('FirstThird');
    });

    test('filter() should work with large collections and complex functions', () => {
        const html = Array.from({ length: 100 }, (_, i) =>
            `<div class="item" data-index="${i}">Item ${i}</div>`
        ).join('');
        const largeCollection = $(html).filter('.item');

        const result = largeCollection.filter(function (index: number, element: HtmlNode) {
            const numIndex = parseInt(element.attributes['data-index']);
            return numIndex % 3 === 0 && numIndex % 5 === 0; // Multiples of both 3 and 5
        });

        const expectedMultiplesOf15 = Math.floor(99 / 15) + 1; // Multiples of 15 up to 99
        expect(result.nodes).toHaveLength(expectedMultiplesOf15);
        const firstResultDataIndex = result.nodes[0].attributes['data-index'];
        expect(firstResultDataIndex).toBe('0');
        const secondResultDataIndex = result.nodes[1].attributes['data-index'];
        expect(secondResultDataIndex).toBe('15');
    });

    test('filter() should handle function that returns non-boolean values', () => {
        const result = elements.filter(function (index: number) {
            return index || 'truthy'; // 0 || 'truthy' returns 'truthy', others return their index (all truthy)
        });

        expect(result.nodes).toHaveLength(5); // all indices (0 returns 'truthy', 1-4 return their index)
        expect(result.text()).toBe('Active Item 1Inactive ItemActive Item 2Inactive Item 2Active Special Item');
    });

    test('filter() should work with function that accesses parent elements', () => {
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

        const result = elements.filter(function (index: number, element: HtmlNode) {
            // Check if parent has class 'container'
            return element.parent && element.parent.attributes.class === 'container';
        });

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Child of container');
    });

    test('filter() should handle null and undefined function parameters gracefully', () => {
        const result = elements.filter(null);
        expect(result.nodes).toHaveLength(0);

        const result2 = elements.filter(undefined);
        expect(result2.nodes).toHaveLength(0);
    });

    test('filter() should work with mixed element types', () => {
        const html = `
            <div class="item">Div</div>
            <span class="item">Span</span>
            <p class="item">Paragraph</p>
            <div class="item">Another Div</div>
        `;
        const mixedElements = $(html).filter('.item');

        const result = mixedElements.filter('div');
        expect(result.nodes).toHaveLength(2);
        const allDivsSecond = result.nodes.every(node => node.tagName && node.tagName.toLowerCase() === 'div');
        expect(allDivsSecond).toBe(true);
        expect(result.text()).toBe('DivAnother Div');
    });

    test('filter() should preserve element order after complex filtering', () => {
        const html = `
            <div class="item" data-order="1">First</div>
            <div class="item" data-order="2">Second</div>
            <div class="item" data-order="3">Third</div>
            <div class="item" data-order="4">Fourth</div>
            <div class="item" data-order="5">Fifth</div>
        `;
        const elements = $(html).filter('.item');

        const result = elements.filter(function (index: number) {
            return index % 2 === 0; // Even indices: 0, 2, 4
        });

        expect(result.nodes).toHaveLength(3);
        const orderValues = result.nodes.map(node => node.attributes['data-order']);
        expect(orderValues).toEqual(['1', '3', '5']);
    });

    test('filter() should work with nested filtering functions', () => {
        const result = elements.filter(function (index: number, element: HtmlNode) {
            // Nested condition: active AND (index < 3 OR has 'special' class)
            const isActive = element.attributes.class.includes('active');
            const isEarly = index < 3;
            const isSpecial = element.attributes.class.includes('special');

            return isActive && (isEarly || isSpecial);
        });

        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('Active Item 1Active Item 2Active Special Item');
    });

    test('filter() should handle function that throws errors gracefully', () => {
        const result = elements.filter(function (index: number) {
            if (index === 2) {
                throw new Error('Test error');
            }
            return true;
        });

        // Should continue filtering even after error
        expect(result.nodes).toHaveLength(4); // Elements 0, 1, 3, 4 (skipped 2)
        expect(result.text()).toBe('Active Item 1Inactive ItemInactive Item 2Active Special Item');
    });

    test('filter() should work with function that uses external variables', () => {
        const threshold = 2;
        const result = elements.filter(function (index: number) {
            return index >= threshold;
        });

        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('Active Item 2Inactive Item 2Active Special Item');
    });

    test('filter() should handle empty collections with functions', () => {
        const empty = $('.nonexistent');
        const result = empty.filter(() => true);
        expect(result.nodes).toHaveLength(0);

        const result2 = empty.filter(() => false);
        expect(result2.nodes).toHaveLength(0);
    });

    test('filter() should work with complex chaining scenarios', () => {
        const html = `
            <div class="item active priority">High Priority</div>
            <div class="item inactive priority">Low Priority</div>
            <div class="item active normal">Normal Active</div>
            <div class="item inactive normal">Normal Inactive</div>
            <div class="item active priority">Another High Priority</div>
        `;
        const elements = $(html).filter('.item');

        // Chain: filter by active -> filter by priority -> slice -> first
        const result = elements.filter('.active').filter('.priority').slice(0, 2).first();

        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('High Priority');
    });
});
