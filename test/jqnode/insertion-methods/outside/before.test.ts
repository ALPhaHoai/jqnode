import $ from '../../../../index';
import JQ from '../../../../jq';
const {getTextContent} = require('../../../../utils');

describe('before() method', () => {
    let root: JQ;

    beforeEach(() => {
        const html = `
      <div class="container">
        <p>First</p>
        <p>Second</p>
        <p>Third</p>
      </div>
    `;
        root = $(html);
    });

    test('before() should insert content before each element as a sibling', () => {
        const middleParagraph = root.find('p').eq(1); // Second paragraph
        middleParagraph.before('<span>Before second</span>');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(4); // p, span, p, p
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Before second');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Second');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('Third');
    });

    test('before() should insert content before multiple elements', () => {
        root.find('p').before('<hr/>');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(6); // hr, p, hr, p, hr, p

        // Check that hr elements are before each p
        const firstChildTag = containerChildren.eq(0).nodes[0].tagName && containerChildren.eq(0).nodes[0].tagName.toLowerCase();
        expect(firstChildTag).toBe('hr');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('First');
        const thirdChildTag = containerChildren.eq(2).nodes[0].tagName && containerChildren.eq(2).nodes[0].tagName.toLowerCase();
        expect(thirdChildTag).toBe('hr');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('Second');
        const fifthChildTag = containerChildren.eq(4).nodes[0].tagName && containerChildren.eq(4).nodes[0].tagName.toLowerCase();
        expect(fifthChildTag).toBe('hr');
        const sixthChildText = containerChildren.eq(5).text();
        expect(sixthChildText).toBe('Third');
    });

    test('before() should insert multiple content items', () => {
        const firstParagraph = root.find('p').first();
        firstParagraph.before('<em>Italic</em>', '<strong>Bold</strong>');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(5); // em, strong, p, p, p
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('Italic');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Bold');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('First');
    });

    test('before() should insert node objects', () => {
        const newNode = {
            type: 'element',
            tagName: 'span',
            attributes: {class: 'inserted'},
            children: [{type: 'text', value: 'Node content'}]
        };
        root.find('p').first().before(newNode);

        const containerChildren = root.find('.container').children();
        const firstChildHasInsertedClass = containerChildren.eq(0).hasClass('inserted');
        expect(firstChildHasInsertedClass).toBe(true);
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('Node content');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('First');
    });

    test('before() should insert JQ objects', () => {
        const newElements = $('<div>Wrapper</div><span>Inline</span>');
        root.find('p').first().before(newElements);

        const containerChildren = root.find('.container').children();
        const firstChildTag = containerChildren.eq(0).nodes[0].tagName && containerChildren.eq(0).nodes[0].tagName.toLowerCase();
        expect(firstChildTag).toBe('div');
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('Wrapper');
        const secondChildTag = containerChildren.eq(1).nodes[0].tagName && containerChildren.eq(1).nodes[0].tagName.toLowerCase();
        expect(secondChildTag).toBe('span');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Inline');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('First');
    });

    test('before() should return the original JQ object for chaining', () => {
        const paragraphs = root.find('p');
        const result = paragraphs.before('<br/>');

        expect(result).toBe(paragraphs);
    });

    test('before() should handle text nodes', () => {
        const textNode = {type: 'text', value: 'Text sibling'};
        root.find('p').first().before(textNode);

        const container = root.find('.container');
        const children = container.nodes[0].children;
        const secondChildType = children[1].type;
        expect(secondChildType).toBe('text');
        const secondChildValue = children[1].value;
        expect(secondChildValue).toBe('Text sibling');
        const thirdChildText = getTextContent(children[2]);
        expect(thirdChildText).toBe('First');
    });

    test('before() should work when element has no parent', () => {
        const detachedElement = $('<p>Detached</p>');
        // This should not throw an error
        expect(() => detachedElement.before('<span>Before</span>')).not.toThrow();
    });
});
