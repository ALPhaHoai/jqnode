import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';
import type { HtmlNode, JQ } from '../../../../types';

describe('contents() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

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
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('contents() should return all child nodes including text and comments - jquery-comparison', () => {
        const nqMainDiv = nqRoot.find('#main');
        const jqMainDiv = jqRoot.find('#main');

        const nqContents = nqMainDiv.contents();
        const jqContents = jqMainDiv.contents();

        // Should include h1, div.content, ul.list, and comment
        expect(nqContents.nodes.length).toBeGreaterThan(3);
        expect(jqContents.length).toBeGreaterThan(3);

        // Check for comment node
        const nqHasComment = nqContents.nodes.some((node: HtmlNode) => node.type === 'comment');
        const jqHasComment = jqContents.toArray().some((node: Node) => node.nodeType === 8); // COMMENT_NODE

        expect(nqHasComment).toBe(jqHasComment);
        expect(nqHasComment).toBe(true);

        // Check for element nodes
        const nqHasH1 = nqContents.nodes.some(
            (node: HtmlNode) =>
                node.type === 'element' && node.tagName && node.tagName.toLowerCase() === 'h1',
        );
        const jqHasH1 = jqContents
            .toArray()
            .some((node: Node) => node.nodeType === 1 && node.tagName.toLowerCase() === 'h1');

        expect(nqHasH1).toBe(jqHasH1);
        expect(nqHasH1).toBe(true);
    });

    test('contents() should include text nodes - jquery-comparison', () => {
        const nqContentDiv = nqRoot.find('.content');
        const jqContentDiv = jqRoot.find('.content');

        const nqContents = nqContentDiv.contents();
        const jqContents = jqContentDiv.contents();

        // Should include elements and text nodes
        expect(nqContents.nodes.length).toBeGreaterThan(3);
        expect(jqContents.length).toBeGreaterThan(3);

        // Check for text nodes
        const nqHasText = nqContents.nodes.some((node: HtmlNode) => node.type === 'text');
        const jqHasText = jqContents.toArray().some((node: Node) => node.nodeType === 3); // TEXT_NODE

        expect(nqHasText).toBe(jqHasText);
        expect(nqHasText).toBe(true);
    });

    test('contents() should work with elements that have only text content - jquery-comparison', () => {
        const nqTitle = nqRoot.find('.title');
        const jqTitle = jqRoot.find('.title');

        const nqContents = nqTitle.contents();
        const jqContents = jqTitle.contents();

        expect(nqContents.nodes).toHaveLength(1);
        expect(jqContents.length).toBe(1);

        const nqText = nqContents.nodes[0].value;
        const jqText = jqContents[0].textContent;

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Main Title');
    });

    test('contents() should work with elements that have mixed content - jquery-comparison', () => {
        const nqParagraph = nqRoot.find('.paragraph').first();
        const jqParagraph = jqRoot.find('.paragraph').first();

        const nqContents = nqParagraph.contents();
        const jqContents = jqParagraph.contents();

        // Should include text node
        expect(nqContents.nodes).toHaveLength(1);
        expect(jqContents.length).toBe(1);

        const nqText = nqContents.nodes[0].value;
        const jqText = jqContents[0].textContent;

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('First paragraph');
    });

    test('contents() should work with empty elements - jquery-comparison', () => {
        const html = `<div class="empty"></div>`;
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom(html);

        const nqEmptyDiv = nqEmpty.find('.empty');
        const jqEmptyDiv = jqEmpty.find('.empty');

        const nqContents = nqEmptyDiv.contents();
        const jqContents = jqEmptyDiv.contents();

        expect(nqContents.nodes).toHaveLength(0);
        expect(jqContents.length).toBe(0);
    });

    test('contents() should handle elements with comments only - jquery-comparison', () => {
        const html = `<div class="comment-only"><!-- comment --></div>`;
        const { jquery: jqComment, nodeQuery: nqComment } = createTestDom(html);

        const nqCommentDiv = nqComment.find('.comment-only');
        const jqCommentDiv = jqComment.find('.comment-only');

        const nqContents = nqCommentDiv.contents();
        const jqContents = jqCommentDiv.contents();

        expect(nqContents.nodes).toHaveLength(1);
        expect(jqContents.length).toBe(1);

        const nqIsComment = nqContents.nodes[0].type === 'comment';
        const jqIsComment = jqContents[0].nodeType === 8; // COMMENT_NODE

        expect(nqIsComment).toBe(jqIsComment);
        expect(nqIsComment).toBe(true);
    });

    test('contents() should work with chaining - jquery-comparison', () => {
        const nqResult = nqRoot
            .find('#main')
            .contents()
            .filter((index: number, node: HtmlNode) => {
                return (
                    node.type === 'element' && node.tagName && node.tagName.toLowerCase() === 'div'
                );
            });
        const jqResult = jqRoot
            .find('#main')
            .contents()
            .filter((index: number, node: Node) => {
                return node.nodeType === 1 && (node as Element).tagName.toLowerCase() === 'div';
            });

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqClass = nqResult.attr('class');
        const jqClass = jqResult.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('content');
    });

    test('contents() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqContents = nqEmpty.contents();
        const jqContents = jqEmpty.contents();

        expect(nqContents.nodes).toHaveLength(0);
        expect(jqContents.length).toBe(0);
    });

    test('contents() should preserve order of child nodes - jquery-comparison', () => {
        const nqMainDiv = nqRoot.find('#main');
        const jqMainDiv = jqRoot.find('#main');

        const nqContents = nqMainDiv.contents();
        const jqContents = jqMainDiv.contents();

        // Get the types of all child nodes
        const nqTypes = nqContents.nodes.map((node: HtmlNode) => node.type);
        const jqTypes = jqContents.toArray().map((node: Node) => {
            switch (node.nodeType) {
                case 1:
                    return 'element';
                case 3:
                    return 'text';
                case 8:
                    return 'comment';
                default:
                    return 'other';
            }
        });

        expect(nqTypes).toEqual(jqTypes);
        // jQuery includes whitespace text nodes between elements
        // The exact order depends on the HTML formatting
    });
});
