const $ = require('../../../index');

describe('slice() method', () => {
    let elements;

    beforeEach(() => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
            <div class="item">Fourth</div>
            <div class="item">Fifth</div>
        `;
        elements = $(html).filter('.item');
    });

    test('slice() should slice from start index to end of array', () => {
        const result = elements.slice(2);
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('ThirdFourthFifth');
    });

    test('slice() should slice from start to end index (exclusive)', () => {
        const result = elements.slice(1, 4);
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('SecondThirdFourth');
    });

    test('slice() should slice from index 0', () => {
        const result = elements.slice(0, 2);
        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('FirstSecond');
    });

    test('slice() should slice single element', () => {
        const result = elements.slice(2, 3);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Third');
    });

    test('slice() should handle negative start indices', () => {
        const result = elements.slice(-2);
        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('FourthFifth');
    });

    test('slice() should handle negative end indices', () => {
        const result = elements.slice(1, -1);
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('SecondThirdFourth');
    });

    test('slice() should handle both negative indices', () => {
        const result = elements.slice(-3, -1);
        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('ThirdFourth');
    });

    test('slice() should return empty result when start >= end', () => {
        const result = elements.slice(3, 3);
        expect(result.nodes).toHaveLength(0);
    });

    test('slice() should return empty result when start is out of bounds', () => {
        const result = elements.slice(10);
        expect(result.nodes).toHaveLength(0);
    });

    test('slice() should return all elements when slicing beyond bounds', () => {
        const result = elements.slice(0, 10);
        expect(result.nodes).toHaveLength(5);
    });

    test('slice() should work with empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.slice(0, 2);
        expect(result.nodes).toHaveLength(0);
    });

    test('slice() should maintain element order', () => {
        const result = elements.slice(1, 4);
        expect(result.nodes).toHaveLength(3);
        const firstResultClass = result.nodes[0].attributes.class;
        expect(firstResultClass).toBe('item');
        const secondResultClass = result.nodes[1].attributes.class;
        expect(secondResultClass).toBe('item');
        const thirdResultClass = result.nodes[2].attributes.class;
        expect(thirdResultClass).toBe('item');
    });

    test('slice() should work with single element collection', () => {
        const single = $(`<div>Single</div>`);
        const result = single.slice(0, 1);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Single');
    });

    test('slice() should work with two element collection', () => {
        const html = `
            <div>A</div>
            <div>B</div>
        `;
        const elements = $(html).filter('div');

        const result = elements.slice(0, 1);
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('A');

        const result2 = elements.slice(1);
        expect(result2.nodes).toHaveLength(1);
        expect(result2.text()).toBe('B');
    });

    test('slice() should allow chaining with other methods', () => {
        const result = elements.slice(1, 4).first();
        expect(result.nodes).toHaveLength(1);
        expect(result.text()).toBe('Second');
    });

    test('slice() should handle undefined end parameter', () => {
        const result = elements.slice(2, undefined);
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('ThirdFourthFifth');
    });

    test('slice() should handle zero start index', () => {
        const result = elements.slice(0);
        expect(result.nodes).toHaveLength(5);
        expect(result.text()).toBe('FirstSecondThirdFourthFifth');
    });

    test('slice() should handle very large start indices', () => {
        const result = elements.slice(100);
        expect(result.nodes).toHaveLength(0);
    });

    test('slice() should handle very large end indices', () => {
        const result = elements.slice(0, 100);
        expect(result.nodes).toHaveLength(5);
        expect(result.text()).toBe('FirstSecondThirdFourthFifth');
    });

    test('slice() should handle fractional indices (truncate towards zero)', () => {
        const result = elements.slice(1.7, 3.9);
        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('SecondThird');
    });

    test('slice() should handle negative fractional indices', () => {
        const result = elements.slice(-2.5);
        expect(result.nodes).toHaveLength(2);
        expect(result.text()).toBe('FourthFifth');
    });

    test('slice() should handle string parameters (convert to numbers)', () => {
        const result = elements.slice('1', '4');
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('SecondThirdFourth');
    });

    test('slice() should handle null start parameter', () => {
        const result = elements.slice(null, 3);
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('FirstSecondThird');
    });

    test('slice() should handle undefined start parameter', () => {
        const result = elements.slice(undefined, 3);
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('FirstSecondThird');
    });

    test('slice() should handle invalid string parameters', () => {
        const result = elements.slice('invalid', 3);
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('FirstSecondThird');
    });

    test('slice() should maintain node attributes after slicing', () => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
        `;
        const elements = $(html).filter('.item');
        const result = elements.slice(1, 3);

        expect(result.nodes).toHaveLength(2);
        const firstResultDataId = result.nodes[0].attributes['data-id'];
        expect(firstResultDataId).toBe('2');
        const secondResultDataId = result.nodes[1].attributes['data-id'];
        expect(secondResultDataId).toBe('3');
    });

    test('slice() should work with chained methods after slicing', () => {
        const result = elements.slice(1, 4).filter('.item');
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('SecondThirdFourth');
    });

    test('slice() should work with different element types', () => {
        const html = `
            <div class="mixed">Div 1</div>
            <span class="mixed">Span 1</span>
            <p class="mixed">P 1</p>
            <div class="mixed">Div 2</div>
            <span class="mixed">Span 2</span>
        `;
        const mixedElements = $(html).find('.mixed');
        const result = mixedElements.slice(1, 4);

        expect(result.nodes).toHaveLength(3);
        const firstResultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(firstResultTag).toBe('span');
        const secondResultTag = result.nodes[1].tagName && result.nodes[1].tagName.toLowerCase();
        expect(secondResultTag).toBe('p');
        const thirdResultTag = result.nodes[2].tagName && result.nodes[2].tagName.toLowerCase();
        expect(thirdResultTag).toBe('div');
        expect(result.text()).toBe('Span 1P 1Div 2');
    });

    test('slice() should handle start index larger than collection length', () => {
        const result = elements.slice(10, 15);
        expect(result.nodes).toHaveLength(0);
    });

    test('slice() should handle negative start index beyond collection length', () => {
        const result = elements.slice(-10, 3);
        expect(result.nodes).toHaveLength(3);
        expect(result.text()).toBe('FirstSecondThird');
    });

    test('slice() should preserve original collection when slicing', () => {
        const originalLength = elements.nodes.length;
        const result = elements.slice(1, 3);

        expect(elements.nodes).toHaveLength(originalLength);
        expect(result.nodes).toHaveLength(2);
    });

    test('slice() should work with collections containing different node types', () => {
        const html = `
            <div>Div</div>
            Text node
            <span>Span</span>
            <!-- Comment -->
            <p>Paragraph</p>
        `;
        const allNodes = $(html).find('*');
        const result = allNodes.slice(0, 2);

        expect(result.nodes).toHaveLength(2);
        const firstResultTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(firstResultTag).toBe('div');
        const secondResultTag = result.nodes[1].tagName && result.nodes[1].tagName.toLowerCase();
        expect(secondResultTag).toBe('span');
    });
});
