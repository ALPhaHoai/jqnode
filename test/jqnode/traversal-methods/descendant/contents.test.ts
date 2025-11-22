import $ from '../../../../index';
import JQ from '../../../../jq';

describe('contents() method', () => {
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

    test('contents() should return all child nodes including text and comments', () => {
        const mainDiv = root.find('#main');
        const contents = mainDiv.contents();

        // Should include h1, div.content, ul.list, and comment
        const contentsNodesCount = contents.nodes.length;
        expect(contentsNodesCount).toBeGreaterThan(3); // At least 4 nodes

        const hasCommentNode = contents.nodes.some(node => node.type === 'comment');
        expect(hasCommentNode).toBe(true);

        const hasH1Element = contents.nodes.some(node => node.type === 'element' && node.tagName && node.tagName.toLowerCase() === 'h1');
        expect(hasH1Element).toBe(true);

        const hasDivElement = contents.nodes.some(node => node.type === 'element' && node.tagName && node.tagName.toLowerCase() === 'div');
        expect(hasDivElement).toBe(true);

        const hasUlElement = contents.nodes.some(node => node.type === 'element' && node.tagName && node.tagName.toLowerCase() === 'ul');
        expect(hasUlElement).toBe(true);
    });

    test('contents() should include text nodes', () => {
        const titleElement = root.find('h1');
        const contents = titleElement.contents();

        // Should contain the text node "Main Title"
        expect(contents.nodes).toHaveLength(1);
        const firstContentType = contents.nodes[0].type;
        expect(firstContentType).toBe('text');
        const firstContentValue = contents.nodes[0].value;
        expect(firstContentValue).toBe('Main Title');
    });

    test('contents() should include comment nodes', () => {
        const mainDiv = root.find('#main');
        const contents = mainDiv.contents();

        const commentNodes = contents.nodes.filter(node => node.type === 'comment');
        expect(commentNodes).toHaveLength(1);
        const firstCommentValue = commentNodes[0].value;
        expect(firstCommentValue).toBe(' This is a comment ');
    });

    test('contents() should handle elements with mixed content', () => {
        const contentDiv = root.find('.content');
        const contents = contentDiv.contents();

        // Should include text nodes and element nodes
        const contentsNodesCount = contents.nodes.length;
        expect(contentsNodesCount).toBeGreaterThan(3); // Text nodes and element nodes

        const hasElementNode = contents.nodes.some(node => node.type === 'element');
        expect(hasElementNode).toBe(true);

        const hasTextNode = contents.nodes.some(node => node.type === 'text');
        expect(hasTextNode).toBe(true);
    });

    test('contents() should return empty result when no children exist', () => {
        // Create HTML with empty element
        const html = '<div></div>';
        const root = $(html);
        const contents = root.contents();

        expect(contents.nodes).toHaveLength(0);
    });

    test('contents() should handle multiple parent elements', () => {
        const paragraphs = root.find('p');
        const contents = paragraphs.contents();

        // Should contain text nodes from both paragraphs
        const contentsNodesCount = contents.nodes.length;
        expect(contentsNodesCount).toBe(2);

        const allAreTextNodes = contents.nodes.every(node => node.type === 'text');
        expect(allAreTextNodes).toBe(true);

        const hasFirstParagraph = contents.nodes.some(node => node.value.includes('First paragraph'));
        expect(hasFirstParagraph).toBe(true);

        const hasSecondParagraph = contents.nodes.some(node => node.value.includes('Second paragraph'));
        expect(hasSecondParagraph).toBe(true);
    });
});
