import $ from '../../../index';

describe('Performance and large document handling', () => {
    test('should handle deeply nested structures', () => {
        // Create a deeply nested HTML structure
        let nestedHtml = '<div class="level-1">';
        for (let i = 2; i <= 10; i++) {
            nestedHtml += `<div class="level-${i}">`;
        }
        nestedHtml += '<span class="deep">Deep content</span>';
        for (let i = 10; i >= 2; i--) {
            nestedHtml += '</div>';
        }
        nestedHtml += '</div>';

        const nestedRoot = $(nestedHtml);
        const deepElement = nestedRoot.find('.deep');
        expect(deepElement.nodes).toHaveLength(1);
        const deepElementClass = deepElement.nodes[0]?.attributes?.class;
        expect(deepElementClass).toBe('deep');
    });

    test('should handle many elements with same class', () => {
        // Create HTML with many elements of same class
        let manyHtml = '<div>';
        for (let i = 1; i <= 100; i++) {
            manyHtml += `<span class="item" data-id="${i}">Item ${i}</span>`;
        }
        manyHtml += '</div>';

        const manyRoot = $(manyHtml);
        const allItems = manyRoot.find('.item');
        expect(allItems.nodes).toHaveLength(100);
        const allHaveItemClass = allItems.nodes.every(node => node.attributes?.class === 'item');
        expect(allHaveItemClass).toBe(true);
    });
});
