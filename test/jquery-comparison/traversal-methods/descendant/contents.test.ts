import { createTestDom } from '../../../utils/jquery-comparison-helpers';
import type { JqElement, JQ } from '../../../../types';

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
        const nqHasComment = nqContents.nodes.some((node: JqElement) => node.internalType === 'comment');
        const jqHasComment = jqContents.toArray().some((node: Node) => node.nodeType === 8); // COMMENT_NODE

        expect(nqHasComment).toBe(jqHasComment);
        expect(nqHasComment).toBe(true);

        // Check for element nodes
        const nqHasH1 = nqContents.nodes.some(
            (node: JqElement) =>
                node.internalType === 'element' && node.tagName && node.tagName.toLowerCase() === 'h1',
        );
        const jqHasH1 = jqContents
            .toArray()
            .some(
                (node: Node) =>
                    node.nodeType === 1 && (node as Element).tagName.toLowerCase() === 'h1',
            );

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
        const nqHasText = nqContents.nodes.some((node: JqElement) => node.internalType === 'text');
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

        const nqText = nqContents.nodes[0].textContent;
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

        const nqText = nqContents.nodes[0].textContent;
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
            .filter((index: number, node: JqElement) => {
                return !!(
                    node.internalType === 'element' &&
                    node.tagName &&
                    node.tagName.toLowerCase() === 'div'
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
        const nqTypes = nqContents.nodes.map((node: JqElement) => node.internalType);
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

    test('contents() should include whitespace text nodes - jquery-comparison', () => {
        const html = `
            <div id="whitespace">

                <span>Element</span>

            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqContents = nodeQuery.find('#whitespace').contents();
        const jqContents = jquery.find('#whitespace').contents();

        expect(nqContents.nodes.length).toBe(jqContents.length);

        // Count text nodes
        const nqTextCount = nqContents.nodes.filter(
            (node: JqElement) => node.internalType === 'text',
        ).length;
        const jqTextCount = jqContents.toArray().filter((node: Node) => node.nodeType === 3).length;

        expect(nqTextCount).toBe(jqTextCount);
        expect(nqTextCount).toBeGreaterThan(0); // Should have whitespace text nodes
    });

    test('contents() should return only comments for comment-only element - jquery-comparison', () => {
        const html = `
            <div id="comments"><!-- Comment 1 --><!-- Comment 2 --><!-- Comment 3 --></div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqContents = nodeQuery.find('#comments').contents();
        const jqContents = jquery.find('#comments').contents();

        expect(nqContents.nodes).toHaveLength(3);
        expect(jqContents.length).toBe(3);

        // All should be comment nodes
        const nqAllComments = nqContents.nodes.every((node: JqElement) => node.internalType === 'comment');
        const jqAllComments = jqContents.toArray().every((node: Node) => node.nodeType === 8);

        expect(nqAllComments).toBe(true);
        expect(jqAllComments).toBe(true);
    });

    test('contents() should work with multiple parent elements - jquery-comparison', () => {
        const html = `
            <div class="multi">
                <div class="parent" id="p1">
                    Text 1
                    <span>Element 1</span>
                    <!-- Comment 1 -->
                </div>
                <div class="parent" id="p2">
                    Text 2
                    <span>Element 2</span>
                </div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqResult = nodeQuery.find('.parent').contents();
        const jqResult = jquery.find('.parent').contents();

        expect(nqResult.nodes.length).toBe(jqResult.length);

        // Should include contents from both parents
        const nqElementCount = nqResult.nodes.filter(
            (node: JqElement) => node.internalType === 'element',
        ).length;
        const jqElementCount = jqResult
            .toArray()
            .filter((node: Node) => node.nodeType === 1).length;

        expect(nqElementCount).toBe(jqElementCount);
        expect(nqElementCount).toBe(2); // 2 span elements total
    });

    test('contents() should return empty for truly empty element - jquery-comparison', () => {
        const html = `<div id="empty"></div>`;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqContents = nodeQuery.find('#empty').contents();
        const jqContents = jquery.find('#empty').contents();

        expect(nqContents.nodes).toHaveLength(0);
        expect(jqContents.length).toBe(0);
    });

    test('contents() should correctly identify all node types - jquery-comparison', () => {
        const html = `
            <div id="mixed-types">
                Text node
                <span>Element</span>
                More text
                <!-- Comment -->
                <div>Another element</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqContents = nodeQuery.find('#mixed-types').contents();
        const jqContents = jquery.find('#mixed-types').contents();

        // Count each type
        const nqCounts = {
            element: nqContents.nodes.filter((n: JqElement) => n.internalType === 'element').length,
            text: nqContents.nodes.filter((n: JqElement) => n.internalType === 'text').length,
            comment: nqContents.nodes.filter((n: JqElement) => n.internalType === 'comment').length,
        };

        const jqCounts = {
            element: jqContents.toArray().filter((n: Node) => n.nodeType === 1).length,
            text: jqContents.toArray().filter((n: Node) => n.nodeType === 3).length,
            comment: jqContents.toArray().filter((n: Node) => n.nodeType === 8).length,
        };

        expect(nqCounts.element).toBe(jqCounts.element);
        expect(nqCounts.text).toBe(jqCounts.text);
        expect(nqCounts.comment).toBe(jqCounts.comment);

        expect(nqCounts.element).toBe(2); // span and div
        expect(nqCounts.comment).toBe(1); // one comment
    });

    test('contents() can be filtered after retrieval - jquery-comparison', () => {
        const html = `
            <div id="filter-test">
                Text 1
                <div class="keep">Keep 1</div>
                Text 2
                <div class="remove">Remove</div>
                <div class="keep">Keep 2</div>
            </div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);

        const nqResult = nodeQuery
            .find('#filter-test')
            .contents()
            .filter((index: number, node: JqElement) => {
                return !!(
                    node.internalType === 'element' &&
                    node.attribs &&
                    node.attribs.class &&
                    node.attribs.class.includes('keep')
                );
            });
        const jqResult = jquery
            .find('#filter-test')
            .contents()
            .filter((index: number, node: Node) => {
                return node.nodeType === 1 && (node as Element).classList.contains('keep');
            });

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);
    });
});

