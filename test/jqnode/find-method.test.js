const $ = require('../../index');

describe('find() method', () => {
    let root;

    beforeEach(() => {
        const html = `
            <div class="container" id="main">
                <h1 class="title">Main Title</h1>
                <div class="content">
                    <p class="paragraph">First paragraph</p>
                    <p class="paragraph">Second paragraph</p>
                    <div class="nested">
                        <span class="highlight">Highlighted text</span>
                        <span class="normal">Normal text</span>
                    </div>
                </div>
                <ul class="list">
                    <li class="item">Item 1</li>
                    <li class="item">Item 2</li>
                    <li class="item special">Item 3</li>
                </ul>
                <!-- This is a comment -->
            </div>
        `;
        root = $(html);
    });

    test('find() should locate elements by tag name', () => {
        const h1Elements = root.find('h1');
        expect(h1Elements.nodes).toHaveLength(1);
        const h1Tag = h1Elements.nodes[0].tagName && h1Elements.nodes[0].tagName.toLowerCase();
        expect(h1Tag).toBe('h1');

        const pElements = root.find('p');
        expect(pElements.nodes).toHaveLength(2);
        const firstPTag = pElements.nodes[0].tagName && pElements.nodes[0].tagName.toLowerCase();
        expect(firstPTag).toBe('p');
        const secondPTag = pElements.nodes[1].tagName && pElements.nodes[1].tagName.toLowerCase();
        expect(secondPTag).toBe('p');

        const spanElements = root.find('span');
        expect(spanElements.nodes).toHaveLength(2);
        const allAreSpans = spanElements.nodes.every(node => node.tagName && node.tagName.toLowerCase() === 'span');
        expect(allAreSpans).toBe(true);
    });

    test('find() should locate nested elements by class', () => {
        const highlights = root.find('.highlight');
        expect(highlights.nodes).toHaveLength(1);
        const highlightsClass = highlights.nodes[0].attributes.class;
        expect(highlightsClass).toBe('highlight');
        expect(highlights.text()).toBe('Highlighted text');
    });

    test('find() should locate nested elements by ID', () => {
        const main = root.find('#main');
        expect(main.nodes).toHaveLength(1);
        const mainId = main.nodes[0].attributes.id;
        expect(mainId).toBe('main');
    });

    test('find() should handle complex selectors', () => {
        const specialItems = root.find('li.special');
        expect(specialItems.nodes).toHaveLength(1);
        const specialItemTag = specialItems.nodes[0].tagName && specialItems.nodes[0].tagName.toLowerCase();
        expect(specialItemTag).toBe('li');
        const specialItemClass = specialItems.nodes[0].attributes.class;
        expect(specialItemClass).toBe('item special');
    });

    test('find() should return all matching descendants', () => {
        const allItems = root.find('.item');
        expect(allItems.nodes).toHaveLength(3);
        const allHaveItemClass = allItems.nodes.every(node => node.attributes.class.includes('item'));
        expect(allHaveItemClass).toBe(true);
    });

    test('find() should return empty result for non-existent selectors', () => {
        const nonExistent = root.find('.non-existent');
        expect(nonExistent.nodes).toHaveLength(0);
    });

    test('find() should work with multiple root elements', () => {
        const multipleRoots = $(`
            <div><p>Root 1</p></div>
            <div><p>Root 2</p></div>
        `);
        const paragraphs = multipleRoots.find('p');
        expect(paragraphs.nodes).toHaveLength(2);
    });

    test('find() should handle nested structures correctly', () => {
        const nestedDiv = root.find('.nested');
        const nestedSpans = nestedDiv.find('span');
        expect(nestedSpans.nodes).toHaveLength(2);
        const firstNestedSpanClass = nestedSpans.nodes[0].attributes.class;
        expect(firstNestedSpanClass).toBe('highlight');
        const secondNestedSpanClass = nestedSpans.nodes[1].attributes.class;
        expect(secondNestedSpanClass).toBe('normal');
    });
});
