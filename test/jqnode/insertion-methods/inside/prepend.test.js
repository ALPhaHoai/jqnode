const $ = require('../../../../index');

describe('prepend() method', () => {
    let root;

    beforeEach(() => {
        const html = `
      <div class="container">
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </div>
      <div class="empty"></div>
    `;
        root = $(html);
    });

    test('prepend() should insert HTML string at the beginning of each element', () => {
        const paragraphs = root.find('p');
        paragraphs.prepend('<span>Prepended</span>');

        const firstParagraphHtml = root.find('p').eq(0).html();
        expect(firstParagraphHtml).toBe('<span>Prepended</span>First paragraph');
        const secondParagraphHtml = root.find('p').eq(1).html();
        expect(secondParagraphHtml).toBe('<span>Prepended</span>Second paragraph');
    });

    test('prepend() should insert multiple content items', () => {
        const container = root.find('.container');
        container.prepend('<p>Zero</p>', '<p>Negative one</p>');

        const allParagraphs = root.find('p');
        const allParagraphsCount = allParagraphs.length;
        expect(allParagraphsCount).toBe(4);
        const firstParagraphText = allParagraphs.eq(0).text();
        expect(firstParagraphText).toBe('Zero');
        const secondParagraphText = allParagraphs.eq(1).text();
        expect(secondParagraphText).toBe('Negative one');
        const thirdParagraphText = allParagraphs.eq(2).text();
        expect(thirdParagraphText).toBe('First paragraph');
        const fourthParagraphText = allParagraphs.eq(3).text();
        expect(fourthParagraphText).toBe('Second paragraph');
    });

    test('prepend() should insert node objects', () => {
        const newNode = {
            type: 'element',
            tagName: 'span',
            attributes: {},
            children: [{type: 'text', value: 'Prepended content'}]
        };
        root.find('.container').prepend(newNode);

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('Prepended content');
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(3); // span + 2 original p elements
    });

    test('prepend() should insert JQ objects', () => {
        const newElements = $('<em>Prepended</em><strong>Elements</strong>');
        root.find('.container').prepend(newElements);

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('Prepended');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Elements');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('First paragraph');
    });

    test('prepend() should return the original JQ object for chaining', () => {
        const $p = root.find('p');
        const result = $p.prepend('<span>test</span>');
        expect(result).toBe($p);
    });

    test('prepend() should work on empty elements', () => {
        root.find('.empty').prepend('<p>Added to empty</p>');
        const emptyElementParagraphText = root.find('.empty').find('p').text();
        expect(emptyElementParagraphText).toBe('Added to empty');
    });

    test('prepend() should handle text nodes', () => {
        const textNode = {type: 'text', value: 'Text content'};
        root.find('.container').prepend(textNode);

        const container = root.find('.container');
        const children = container.nodes[0].children;
        const firstChildType = children[0].type;
        expect(firstChildType).toBe('text');
        const firstChildValue = children[0].value;
        expect(firstChildValue).toBe('Text content');
    });
});
