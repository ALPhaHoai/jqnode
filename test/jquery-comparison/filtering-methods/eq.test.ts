import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('eq() method - Node-Query vs jQuery Comparison', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let elements: any, jqElements: any, root: any;

    beforeEach(() => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
            <div class="item">Fourth</div>
            <div class="item">Fifth</div>
        `;

        // Create a test container to avoid modifying the document body
        const testContainer = document.createElement('div');
        testContainer.innerHTML = html;
        document.body.appendChild(testContainer);

        const jquery = jQuery(testContainer);
        const nodeQuery = $(testContainer);

        jqElements = jquery.find('.item');
        elements = nodeQuery.find('.item');

        // Store reference for cleanup
        root = nodeQuery;
        root._cleanupSandbox = () => {
            if (testContainer && testContainer.parentNode) {
                testContainer.parentNode.removeChild(testContainer);
            }
        };
    });

    afterEach(() => {
        // Clean up the test container
        if (root && typeof root._cleanupSandbox === 'function') {
            root._cleanupSandbox();
        }
    });

    test('eq() should select element at positive index 0 - jquery-comparison', () => {
        const nqResult = elements.eq(0);
        const jqResult = jqElements.eq(0);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('First');
    });

    test('eq() should select element at positive index 1 - jquery-comparison', () => {
        const nqResult = elements.eq(1);
        const jqResult = jqElements.eq(1);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second');
    });

    test('eq() should select element at positive index 2 - jquery-comparison', () => {
        const nqResult = elements.eq(2);
        const jqResult = jqElements.eq(2);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third');
    });

    test('eq() should select element at positive index 3 - jquery-comparison', () => {
        const nqResult = elements.eq(3);
        const jqResult = jqElements.eq(3);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Fourth');
    });

    test('eq() should select element at positive index 4 - jquery-comparison', () => {
        const nqResult = elements.eq(4);
        const jqResult = jqElements.eq(4);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Fifth');
    });

    test('eq() should handle negative index -1 (last element) - jquery-comparison', () => {
        const nqResult = elements.eq(-1);
        const jqResult = jqElements.eq(-1);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Fifth');
    });

    test('eq() should handle negative index -2 - jquery-comparison', () => {
        const nqResult = elements.eq(-2);
        const jqResult = jqElements.eq(-2);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Fourth');
    });

    test('eq() should handle negative index -3 - jquery-comparison', () => {
        const nqResult = elements.eq(-3);
        const jqResult = jqElements.eq(-3);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third');
    });

    test('eq() should return empty result for out-of-bounds positive index - jquery-comparison', () => {
        const nqResult = elements.eq(5);
        const jqResult = jqElements.eq(5);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('eq() should handle negative indices beyond -length (wrap around) - jquery-comparison', () => {
        const nqResult = elements.eq(-6);
        const jqResult = jqElements.eq(-6);

        expect(nqResult.nodes).toHaveLength(0); // jQuery returns empty for indices beyond -length
        expect(jqResult.length).toBe(0);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe(''); // Empty result
    });

    test('eq() should return empty result when called on empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.eq(0);
        const jqResult = jqEmptyCollection.eq(0);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('eq() should work with single element collection - jquery-comparison', () => {
        const { jquery: jqSingle, nodeQuery: nqSingle } = createTestDom('<div>Single</div>');
        const nqResult = nqSingle.eq(0);
        const jqResult = jqSingle.eq(0);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Single');
    });

    test('eq() should handle fractional indices (truncate towards zero) - jquery-comparison', () => {
        const nqResult = elements.eq(2.7);
        const jqResult = jqElements.eq(2.7);

        expect(nqResult.nodes).toHaveLength(1); // jQuery truncates fractional indices
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe(''); // jQuery returns empty text for fractional indices
    });

    test('eq() should handle negative fractional indices - jquery-comparison', () => {
        const nqResult = elements.eq(-1.5);
        const jqResult = jqElements.eq(-1.5);

        expect(nqResult.nodes).toHaveLength(1); // jQuery truncates fractional indices then wraps negative
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe(''); // jQuery returns empty text for fractional indices
    });

    test('eq() should handle string indices (convert to numbers) - jquery-comparison', () => {
        const nqResult = elements.eq('2');
        const jqResult = jqElements.eq('2');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third');
    });

    test('eq() should handle negative string indices - jquery-comparison', () => {
        const nqResult = elements.eq('-2');
        const jqResult = jqElements.eq('-2');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Fourth');
    });

    test('eq() should handle invalid string indices - jquery-comparison', () => {
        const nqResult = elements.eq('invalid');
        const jqResult = jqElements.eq('invalid');

        expect(nqResult.nodes).toHaveLength(0); // Invalid strings become NaN, return empty
        expect(jqResult.length).toBe(0);
    });

    test('eq() should handle null index - jquery-comparison', () => {
        const nqResult = elements.eq(null);
        const jqResult = jqElements.eq(null);

        expect(nqResult.nodes).toHaveLength(1); // null becomes 0, return first element
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('First');
    });

    test('eq() should handle undefined index - jquery-comparison', () => {
        const nqResult = elements.eq(undefined);
        const jqResult = jqElements.eq(undefined);

        expect(nqResult.nodes).toHaveLength(0); // undefined becomes NaN, return empty
        expect(jqResult.length).toBe(0);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('');
    });

    test('eq() should handle very large positive indices - jquery-comparison', () => {
        const nqResult = elements.eq(100);
        const jqResult = jqElements.eq(100);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('eq() should handle very large negative indices - jquery-comparison', () => {
        const nqResult = elements.eq(-100);
        const jqResult = jqElements.eq(-100);

        expect(nqResult.nodes).toHaveLength(0); // Very large negative indices return empty
        expect(jqResult.length).toBe(0);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe(''); // Empty result
    });

    test('eq() should work with chaining - eq() after filter() - jquery-comparison', () => {
        const nqFiltered = elements.filter((index: number) => index % 2 === 0); // indices 0, 2, 4
        const jqFiltered = jqElements.filter((index: number) => index % 2 === 0);

        const nqResult = nqFiltered.eq(1); // Should be index 2 from original (Third)
        const jqResult = jqFiltered.eq(1);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third');
    });

    test('eq() should work with chaining - eq() after slice() - jquery-comparison', () => {
        const nqSliced = elements.slice(1, 4); // Second, Third, Fourth
        const jqSliced = jqElements.slice(1, 4);

        const nqResult = nqSliced.eq(1); // Should be Third
        const jqResult = jqSliced.eq(1);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third');
    });

    test('eq() should preserve element attributes - jquery-comparison', () => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
        `;
        const { jquery: jqElements, nodeQuery: nqElements } = createTestDom(html);
        const nqItems = nqElements.find('.item');
        const jqItems = jqElements.find('.item');

        const nqResult = nqItems.eq(1);
        const jqResult = jqItems.eq(1);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqDataId = nqResult.attr('data-id');
        const jqDataId = jqResult.attr('data-id');
        expect(nqDataId).toBe(jqDataId);
        expect(nqDataId).toBe('2');

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second');
    });

    test('eq() should work with different element types - jquery-comparison', () => {
        const html = `
            <div class="mixed">Div</div>
            <span class="mixed">Span</span>
            <p class="mixed">Paragraph</p>
        `;
        const { jquery: jqMixed, nodeQuery: nqMixed } = createTestDom(html);
        const nqMixedElements = nqMixed.find('.mixed');
        const jqMixedElements = jqMixed.find('.mixed');

        const nqResult = nqMixedElements.eq(1);
        const jqResult = jqMixedElements.eq(1);

        // Handle both node-query and jQuery objects
        const nqLength = nqResult.nodes ? nqResult.nodes.length : nqResult.length;
        expect(nqLength).toBe(1);
        expect(jqResult.length).toBe(1);

        // Get tag name from the element
        let nqTag;
        if (nqResult.nodes) {
            // node-query object
            nqTag = nqResult.nodes[0]?.tagName?.toLowerCase();
        } else {
            // jQuery object
            nqTag = nqResult[0]?.tagName?.toLowerCase();
        }
        const jqTag = jqResult[0].tagName.toLowerCase();
        expect(nqTag).toBe(jqTag);
        expect(nqTag).toBe('span');

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Span');
    });

    test('eq() should handle zero index on empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.eq(0);
        const jqResult = jqEmptyCollection.eq(0);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('eq() should handle negative index on empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.eq(-1);
        const jqResult = jqEmptyCollection.eq(-1);

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('eq() should work with large collections - jquery-comparison', () => {
        const html = Array.from(
            { length: 100 },
            (_, i) => `<div class="item">Item ${i + 1}</div>`,
        ).join('');
        const { jquery: jqLarge, nodeQuery: nqLarge } = createTestDom(html);
        const nqLargeCollection = nqLarge.find('.item');
        const jqLargeCollection = jqLarge.find('.item');

        const nqResult = nqLargeCollection.eq(50);
        const jqResult = jqLargeCollection.eq(50);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Item 51');

        const nqLastResult = nqLargeCollection.eq(-1);
        const jqLastResult = jqLargeCollection.eq(-1);

        expect(nqLastResult.nodes).toHaveLength(1);
        expect(jqLastResult.length).toBe(1);

        const nqLastText = nqLastResult.text();
        const jqLastText = jqLastResult.text();
        expect(nqLastText).toBe(jqLastText);
        expect(nqLastText).toBe('Item 100');
    });

    test('eq() should handle boundary conditions - jquery-comparison', () => {
        // Test with exactly the boundary indices
        const nqResult0 = elements.eq(0);
        const jqResult0 = jqElements.eq(0);
        expect(nqResult0.text()).toBe(jqResult0.text());
        expect(nqResult0.text()).toBe('First');

        const nqResult4 = elements.eq(4);
        const jqResult4 = jqElements.eq(4);
        expect(nqResult4.text()).toBe(jqResult4.text());
        expect(nqResult4.text()).toBe('Fifth');

        const nqResultNeg1 = elements.eq(-1);
        const jqResultNeg1 = jqElements.eq(-1);
        expect(nqResultNeg1.text()).toBe(jqResultNeg1.text());
        expect(nqResultNeg1.text()).toBe('Fifth');

        const nqResultNeg5 = elements.eq(-5);
        const jqResultNeg5 = jqElements.eq(-5);
        expect(nqResultNeg5.text()).toBe(jqResultNeg5.text());
        expect(nqResultNeg5.text()).toBe('First');
    });

    test('eq() should return new collection instance - jquery-comparison', () => {
        const nqResult = elements.eq(2);
        const jqResult = jqElements.eq(2);

        expect(nqResult).not.toBe(elements); // Different instance
        expect(jqResult).not.toBe(jqElements); // Different instance

        // Handle both node-query and jQuery objects
        if (nqResult.nodes) {
            // node-query object
            expect(nqResult.nodes).not.toBe(elements.nodes); // Different node arrays
            expect(nqResult.nodes.length).toBe(1);

            const nqFirstNode = nqResult.nodes[0];
            const nqElementsThirdNode = elements.nodes[2];
            expect(nqFirstNode).toBe(nqElementsThirdNode); // But same node reference
        } else {
            // jQuery object
            expect(nqResult.length).toBe(1);

            const nqFirstNode = nqResult[0];
            const nqElementsThirdNode = elements[2];
            expect(nqFirstNode).toBe(nqElementsThirdNode); // But same node reference
        }

        expect(jqResult.length).toBe(1);

        const jqFirstNode = jqResult[0];
        const jqElementsThirdNode = jqElements[2];
        expect(jqFirstNode).toBe(jqElementsThirdNode); // But same node reference
    });

    test('eq() should work with boolean conversion indices - jquery-comparison', () => {
        const nqResult = elements.eq(true); // true = 1
        const jqResult = jqElements.eq(true);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Second');

        const nqResultFalse = elements.eq(false); // false = 0
        const jqResultFalse = jqElements.eq(false);

        expect(nqResultFalse.nodes).toHaveLength(1);
        expect(jqResultFalse.length).toBe(1);

        const nqFalseText = nqResultFalse.text();
        const jqFalseText = jqResultFalse.text();
        expect(nqFalseText).toBe(jqFalseText);
        expect(nqFalseText).toBe('First');
    });

    test('eq() should handle array-like indices - jquery-comparison', () => {
        const nqResult = elements.eq([2]); // Array with single element
        const jqResult = jqElements.eq([2]);

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third'); // Takes first element of array
    });

    test('eq() should work with complex chaining scenarios - jquery-comparison', () => {
        const html = `
            <div class="item even">Even 1</div>
            <div class="item odd">Odd 1</div>
            <div class="item even">Even 2</div>
            <div class="item odd">Odd 2</div>
            <div class="item even">Even 3</div>
        `;
        const { jquery: jqElements, nodeQuery: nqElements } = createTestDom(html);
        const nqItems = nqElements.find('.item');
        const jqItems = jqElements.find('.item');

        // Chain: filter -> slice -> eq -> first (should be no-op since eq returns single element)
        const nqResult = nqItems.filter('.even').slice(0, 3).eq(1).first();
        const jqResult = jqItems.filter('.even').slice(0, 3).eq(1).first();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Even 2');
    });
});
