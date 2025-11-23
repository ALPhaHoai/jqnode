import $ from '../../../../index';
import JQ from '../../../../jq';
import { HtmlNode } from '../../../../types';

describe('children() method', () => {
    let root: JQ;

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

    test('children() should return all immediate children elements', () => {
        const mainDiv = root.find('#main');
        const children = mainDiv.children();

        // Should return h1, div.content, ul.list (comments are not elements)
        expect(children.nodes).toHaveLength(3);
        const firstChildTag = children.nodes[0].tagName && children.nodes[0].tagName.toLowerCase();
        expect(firstChildTag).toBe('h1');
        const firstChildClass = children.nodes[0].attributes.class;
        expect(firstChildClass).toBe('title');
        const secondChildTag = children.nodes[1].tagName && children.nodes[1].tagName.toLowerCase();
        expect(secondChildTag).toBe('div');
        const secondChildClass = children.nodes[1].attributes.class;
        expect(secondChildClass).toBe('content');
        const thirdChildTag = children.nodes[2].tagName && children.nodes[2].tagName.toLowerCase();
        expect(thirdChildTag).toBe('ul');
        const thirdChildClass = children.nodes[2].attributes.class;
        expect(thirdChildClass).toBe('list');
    });

    test('children() should return immediate children only, not grandchildren', () => {
        const contentDiv = root.find('.content');
        const children = contentDiv.children();

        // Should return p.paragraph, p.paragraph, div.nested
        expect(children.nodes).toHaveLength(3);

        const allAreParagraphsOrDivs = children.nodes.every((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'p' || node.tagName && node.tagName.toLowerCase() === 'div');
        expect(allAreParagraphsOrDivs).toBe(true);

        const spanChildren = children.nodes.filter((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'span');
        expect(spanChildren).toHaveLength(0);
    });

    test('children() with selector should filter immediate children', () => {
        const mainDiv = root.find('#main');
        const paragraphChildren = mainDiv.children('p');

        // Should return no p elements since they're not immediate children of #main
        expect(paragraphChildren.nodes).toHaveLength(0);
    });

    test('children() with selector should filter by tag name', () => {
        const contentDiv = root.find('.content');
        const paragraphChildren = contentDiv.children('p');

        // Should return both p elements
        expect(paragraphChildren.nodes).toHaveLength(2);
        const allAreParagraphs = paragraphChildren.nodes.every((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'p');
        expect(allAreParagraphs).toBe(true);
        const allHaveParagraphClass = paragraphChildren.nodes.every((node: HtmlNode) => node.attributes?.class === 'paragraph');
        expect(allHaveParagraphClass).toBe(true);
    });

    test('children() with selector should filter by class', () => {
        const contentDiv = root.find('.content');
        const nestedChildren = contentDiv.children('.nested');

        // Should return the div.nested element
        expect(nestedChildren.nodes).toHaveLength(1);
        const nestedChildTag = nestedChildren.nodes[0].tagName && nestedChildren.nodes[0].tagName.toLowerCase();
        expect(nestedChildTag).toBe('div');
        const nestedChildClass = nestedChildren.nodes[0].attributes.class;
        expect(nestedChildClass).toBe('nested');
    });

    test('children() should return empty result when no children exist', () => {
        const spanElement = root.find('span');
        const children = spanElement.children();

        // span elements have no child elements
        expect(children.nodes).toHaveLength(0);
    });

    test('children() should handle multiple parent elements', () => {
        const allParagraphs = root.find('p');
        const children = allParagraphs.children();

        // Paragraphs have no child elements
        expect(children.nodes).toHaveLength(0);
    });

    test('children() should avoid duplicates when multiple parents have same children', () => {
        // Create HTML with multiple similar structures
        const html = `
            <div class="wrapper">
                <div class="section">
                    <span>Text 1</span>
                </div>
                <div class="section">
                    <span>Text 2</span>
                </div>
            </div>
        `;
        const root = $(html);
        const sections = root.find('.section');
        const children = sections.children();

        // Should return both span elements
        expect(children.nodes).toHaveLength(2);
        const allAreSpans = children.nodes.every((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'span');
        expect(allAreSpans).toBe(true);
    });
});
