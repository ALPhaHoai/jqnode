import $ from '../../../../index';
import JQ from '../../../../jq';

describe('append() method', () => {
    let root: JQ;

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

    test('append() should insert HTML string at the end of each element', () => {
        const paragraphs = root.find('p');
        paragraphs.append('<span>Appended</span>');

        const firstParagraphHtml = root.find('p').eq(0).html();
        expect(firstParagraphHtml).toBe('First paragraph<span>Appended</span>');
        const secondParagraphHtml = root.find('p').eq(1).html();
        expect(secondParagraphHtml).toBe('Second paragraph<span>Appended</span>');
    });

    test('append() should insert multiple content items', () => {
        const container = root.find('.container');
        container.append('<p>Third</p>', '<p>Fourth</p>');

        const allParagraphs = root.find('p');
        const allParagraphsCount = allParagraphs.length;
        expect(allParagraphsCount).toBe(4);
        const thirdParagraphText = allParagraphs.eq(2).text();
        expect(thirdParagraphText).toBe('Third');
        const fourthParagraphText = allParagraphs.eq(3).text();
        expect(fourthParagraphText).toBe('Fourth');
    });

    test('append() should insert node objects', () => {
        const newNode = {
            type: 'element',
            tagName: 'span',
            attributes: {},
            children: [{type: 'text', value: 'New content'}]
        };
        root.find('.container').append(newNode);

        const containerHtml = root.find('.container').html();
        expect(containerHtml).toContain('New content');
    });

    test('append() should insert JQ objects', () => {
        const newElements = $('<em>New</em><strong>Elements</strong>');
        root.find('.container').append(newElements);

        const containerEmText = root.find('.container').find('em').text();
        expect(containerEmText).toBe('New');
        const containerStrongText = root.find('.container').find('strong').text();
        expect(containerStrongText).toBe('Elements');
    });

    test('append() should return the original JQ object for chaining', () => {
        const $p = root.find('p');
        const result = $p.append('<span>test</span>');
        expect(result).toBe($p);
    });

    test('append() should work on empty elements', () => {
        root.find('.empty').append('<p>Added to empty</p>');
        const emptyElementParagraphText = root.find('.empty').find('p').text();
        expect(emptyElementParagraphText).toBe('Added to empty');
    });

    test('append() should handle text nodes', () => {
        const textNode = {type: 'text', value: 'Text content'};
        root.find('.container').append(textNode);

        const container = root.find('.container');
        const containerText = container.text();

        expect(containerText).toContain('Text content');
    });
});
