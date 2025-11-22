import $ from '../../../index';

describe('each() method', () => {
    let root;

    beforeEach(() => {
        // Clear global root nodes registry for test isolation
        $.clearRootNodesRegistry();

        const html = `
      <div class="post" id="main">
        <h1 style="color:red">Hello</h1>
        <p data-info='some info'>World</p>
        <img src="image.jpg" alt='pic'/>
      </div>
    `;
        root = $(html);
    });

    test('each() should iterate over all elements in collection', () => {
        const elements = root.find('*'); // All elements
        let count = 0;
        let indices = [];

        elements.each(function (index, element) {
            count++;
            indices.push(index);
            expect(element).toBe(this); // 'this' should be the element
        });

        const elementsNodesCount = elements.nodes.length;
        expect(count).toBe(elementsNodesCount);
        expect(indices).toEqual([0, 1, 2, 3]); // Should be 0, 1, 2, 3
    });

    test('each() should support chaining', () => {
        const elements = root.find('*');
        const result = elements.each(function () {
            // Just iterate without doing anything
        });

        expect(result).toBe(elements); // Should return the same JQ instance
    });

    test('each() should break iteration when callback returns false', () => {
        const elements = root.find('*');
        let count = 0;

        elements.each(function (index) {
            count++;
            if (index === 1) {
                return false; // Break after second element
            }
        });

        expect(count).toBe(2); // Should only iterate twice
    });

    test('each() should work with empty collections', () => {
        const emptyCollection = root.find('nonexistent');
        let count = 0;

        emptyCollection.each(function () {
            count++;
        });

        expect(count).toBe(0);
    });

    test('each() should allow modifying elements during iteration', () => {
        const paragraphs = root.find('p');
        let indices = [];

        paragraphs.each(function (index, element) {
            indices.push(index);
            // Set attribute on the internal node object
            if (element.attributes) {
                element.attributes['data-each-index'] = index.toString();
            }
        });

        expect(indices).toEqual([0]);
        expect(paragraphs.attr('data-each-index')).toBe('0');
    });
});
