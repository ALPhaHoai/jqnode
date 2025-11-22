import $ from '../../../../index';
const {getTextContent} = require('../../../../utils');

describe('after() method', () => {
    let root;

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

    test('after() should insert content after each element as a sibling', () => {
        const middleParagraph = root.find('p').eq(1); // Second paragraph
        middleParagraph.after('<span>After second</span>');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(4); // p, p, span, p
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Second');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('After second');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('Third');
    });

    test('after() should insert content after multiple elements', () => {
        root.find('p').after('<hr/>');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(6); // p, hr, p, hr, p, hr

        // Check that hr elements are after each p
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const firstHrTag = containerChildren.eq(1).nodes[0].tagName && containerChildren.eq(1).nodes[0].tagName.toLowerCase();
        expect(firstHrTag).toBe('hr');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Second');
        const secondHrTag = containerChildren.eq(3).nodes[0].tagName && containerChildren.eq(3).nodes[0].tagName.toLowerCase();
        expect(secondHrTag).toBe('hr');
        const fifthChildText = containerChildren.eq(4).text();
        expect(fifthChildText).toBe('Third');
        const thirdHrTag = containerChildren.eq(5).nodes[0].tagName && containerChildren.eq(5).nodes[0].tagName.toLowerCase();
        expect(thirdHrTag).toBe('hr');
    });

    test('after() should insert multiple content items', () => {
        const firstParagraph = root.find('p').first();
        firstParagraph.after('<em>Italic</em>', '<strong>Bold</strong>');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(5); // p, em, strong, p, p
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Italic');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Bold');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('Second');
    });

    test('after() should insert node objects', () => {
        const newNode = {
            type: 'element',
            tagName: 'span',
            attributes: {class: 'inserted'},
            children: [{type: 'text', value: 'Node content'}]
        };
        root.find('p').first().after(newNode);

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const secondChildHasClass = containerChildren.eq(1).hasClass('inserted');
        expect(secondChildHasClass).toBe(true);
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Node content');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Second');
    });

    test('after() should insert JQ objects', () => {
        const newElements = $('<div>Wrapper</div><span>Inline</span>');
        root.find('p').first().after(newElements);

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const firstInsertedTag = containerChildren.eq(1).nodes[0].tagName && containerChildren.eq(1).nodes[0].tagName.toLowerCase();
        expect(firstInsertedTag).toBe('div');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Wrapper');
        const secondInsertedTag = containerChildren.eq(2).nodes[0].tagName && containerChildren.eq(2).nodes[0].tagName.toLowerCase();
        expect(secondInsertedTag).toBe('span');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Inline');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('Second');
    });

    test('after() should return the original JQ object for chaining', () => {
        const paragraphs = root.find('p');
        const result = paragraphs.after('<br/>');

        expect(result).toBe(paragraphs);
    });

    test('after() should handle text nodes', () => {
        const textNode = {type: 'text', value: 'Text sibling'};
        root.find('p').first().after(textNode);

        const container = root.find('.container');
        const children = container.nodes[0].children;
        // Skip whitespace text nodes and find the actual elements
        const pElements = children.filter(child => child.type === 'element' && child.tagName && child.tagName.toLowerCase() === 'p');
        const firstPElementText = getTextContent(pElements[0]);
        expect(firstPElementText).toBe('First');
        const secondPElementText = getTextContent(pElements[1]);
        expect(secondPElementText).toBe('Second');

        // Find the inserted text node
        const textNodes = children.filter(child => child.type === 'text' && child.value === 'Text sibling');
        const textNodesCount = textNodes.length;
        expect(textNodesCount).toBe(1);
        const firstTextNodeValue = textNodes[0].value;
        expect(firstTextNodeValue).toBe('Text sibling');
    });

    test('after() should work when element has no parent', () => {
        const detachedElement = $('<p>Detached</p>');
        // This should not throw an error
        const afterOperation = () => detachedElement.after('<span>After</span>');
        expect(afterOperation).not.toThrow();
    });
});
