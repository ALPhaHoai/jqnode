import $ from '../../../../index';
import JQ from '../../../../jq';
import { HtmlNode } from '../../../../types';

describe('siblings() method', () => {
    let root: JQ;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="sibling first">First</div>
                <div class="sibling second">Second</div>
                <div class="sibling third active">Third Active</div>
                <div class="sibling fourth">Fourth</div>
                <span class="not-sibling">Not a sibling</span>
                <div class="sibling fifth">Fifth</div>
            </div>
            <div class="other-container">
                <div class="sibling sixth">Sixth</div>
            </div>
        `;
        root = $(html);
    });

    test('siblings() should get all siblings of elements', () => {
        const secondElement = root.find('.second');
        const siblings = secondElement.siblings();

        expect(siblings.nodes).toHaveLength(5); // All sibling elements except itself

        const hasFirstSibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.class && (node.attributes.class as string).includes('first'));
        expect(hasFirstSibling).toBe(true);

        const hasThirdSibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.class && (node.attributes.class as string).includes('third'));
        expect(hasThirdSibling).toBe(true);

        const hasFourthSibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.class && (node.attributes.class as string).includes('fourth'));
        expect(hasFourthSibling).toBe(true);

        const hasNotSibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.class && (node.attributes.class as string).includes('not-sibling'));
        expect(hasNotSibling).toBe(true);

        const hasFifthSibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.class && (node.attributes.class as string).includes('fifth'));
        expect(hasFifthSibling).toBe(true);
    });

    test('siblings() should work with selector filter', () => {
        const secondElement = root.find('.second');
        const activeSiblings = secondElement.siblings('.active');

        expect(activeSiblings.nodes).toHaveLength(1);
        const activeSiblingsClass = activeSiblings.nodes[0].attributes?.class;
        expect(activeSiblingsClass).toBe('sibling third active');
        const activeSiblingsText = activeSiblings.text();
        expect(activeSiblingsText).toBe('Third Active');
    });

    test('siblings() should work with class selector', () => {
        const secondElement = root.find('.second');
        const siblingElements = secondElement.siblings('.sibling');

        expect(siblingElements.nodes).toHaveLength(4);
        const allHaveSiblingClass = siblingElements.nodes.every((node: HtmlNode) => node.attributes?.class && (node.attributes.class as string).includes('sibling'));
        expect(allHaveSiblingClass).toBe(true);
    });

    test('siblings() should work with tag selector', () => {
        const secondElement = root.find('.second');
        const divSiblings = secondElement.siblings('div');

        expect(divSiblings.nodes).toHaveLength(4); // All div siblings
        const allAreDivs = divSiblings.nodes.every((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'div');
        expect(allAreDivs).toBe(true);
    });

    test('siblings() should return empty for elements with no siblings', () => {
        const sixthElement = root.find('.sixth');
        const siblings = sixthElement.siblings();

        expect(siblings.nodes).toHaveLength(0);
    });

    test('siblings() should work with multiple elements', () => {
        const firstAndThird = root.find('.first, .third');
        const siblings = firstAndThird.siblings();

        // Should get all unique siblings of both elements
        expect(siblings.nodes).toHaveLength(6); // first, second, third, fourth, span, fifth
    });

    test('siblings() should exclude text nodes and other non-element siblings', () => {
        const html = `
            <div class="container">
                <div class="sibling">Div 1</div>
                Text node
                <span class="sibling">Span</span>
                <!-- Comment -->
                <div class="sibling">Div 2</div>
            </div>
        `;
        const testRoot = $(html);
        const firstDiv = testRoot.find('.sibling').first(); // Find the first .sibling div, not the container
        const siblings = firstDiv.siblings();

        expect(siblings.nodes).toHaveLength(2); // Only the span and second div

        const hasSpanSibling = siblings.nodes.some((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'span');
        expect(hasSpanSibling).toBe(true);

        const hasDivSibling = siblings.nodes.some((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'div');
        expect(hasDivSibling).toBe(true);
    });

    test('siblings() should return empty for root elements', () => {
        const htmlElement = root.find('html');
        const siblings = htmlElement.siblings();

        expect(siblings.nodes).toHaveLength(0);
    });

    test('siblings() should work with complex selectors', () => {
        const secondElement = root.find('.second');
        const complexSiblings = secondElement.siblings('[class*="third"], [class*="fifth"]');

        expect(complexSiblings.nodes).toHaveLength(2);

        const hasThirdComplexSibling = complexSiblings.nodes.some((node: HtmlNode) => node.attributes?.class && (node.attributes.class as string).includes('third'));
        expect(hasThirdComplexSibling).toBe(true);

        const hasFifthComplexSibling = complexSiblings.nodes.some((node: HtmlNode) => node.attributes?.class && (node.attributes.class as string).includes('fifth'));
        expect(hasFifthComplexSibling).toBe(true);
    });

    test('siblings() should return empty when selector matches nothing', () => {
        const secondElement = root.find('.second');
        const noMatches = secondElement.siblings('.nonexistent');

        expect(noMatches.nodes).toHaveLength(0);
    });

    test('siblings() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const siblings = empty.siblings();

        expect(siblings.nodes).toHaveLength(0);
    });

    test('siblings() should work with attribute selectors', () => {
        const html = `
            <div class="container">
                <div class="sibling" data-type="a">A</div>
                <div class="sibling" data-type="b">B</div>
                <div class="sibling" data-type="c">C</div>
            </div>
        `;
        const testRoot = $(html);
        const bElement = testRoot.find('[data-type="b"]');
        const siblings = bElement.siblings('[data-type="a"], [data-type="c"]');

        expect(siblings.nodes).toHaveLength(2);

        const hasTypeASibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.['data-type'] === 'a');
        expect(hasTypeASibling).toBe(true);

        const hasTypeCSibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.['data-type'] === 'c');
        expect(hasTypeCSibling).toBe(true);
    });

    test('siblings() should maintain proper order (document order)', () => {
        const secondElement = root.find('.second');
        const allSiblings = secondElement.siblings();

        expect(allSiblings.nodes).toHaveLength(5);
        // Should be in document order: first, third, fourth, not-sibling, fifth

        const firstSiblingIsFirst = (allSiblings.nodes[0].attributes?.class as string)?.includes('first');
        expect(firstSiblingIsFirst).toBe(true);

        const secondSiblingIsThird = (allSiblings.nodes[1].attributes?.class as string)?.includes('third');
        expect(secondSiblingIsThird).toBe(true);

        const thirdSiblingIsFourth = (allSiblings.nodes[2].attributes?.class as string)?.includes('fourth');
        expect(thirdSiblingIsFourth).toBe(true);

        const fourthSiblingIsNotSibling = (allSiblings.nodes[3].attributes?.class as string)?.includes('not-sibling');
        expect(fourthSiblingIsNotSibling).toBe(true);

        const fifthSiblingIsFifth = (allSiblings.nodes[4].attributes?.class as string)?.includes('fifth');
        expect(fifthSiblingIsFifth).toBe(true);
    });

    test('siblings() should work with ID selectors', () => {
        const html = `
            <div class="container">
                <div id="first">First</div>
                <div id="second">Second</div>
                <div id="third">Third</div>
            </div>
        `;
        const testRoot = $(html);
        const secondElement = testRoot.find('#second');
        const siblings = secondElement.siblings('#first, #third');

        expect(siblings.nodes).toHaveLength(2);

        const hasFirstIdSibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.id === 'first');
        expect(hasFirstIdSibling).toBe(true);

        const hasThirdIdSibling = siblings.nodes.some((node: HtmlNode) => node.attributes?.id === 'third');
        expect(hasThirdIdSibling).toBe(true);
    });

    test('siblings() should handle elements with mixed sibling types', () => {
        const html = `
            <div class="container">
                <h1>Title</h1>
                <div class="content">Content 1</div>
                <p>Paragraph</p>
                <div class="content">Content 2</div>
                <span>Span</span>
                <div class="content">Content 3</div>
            </div>
        `;
        const testRoot = $(html);
        const contentDivs = testRoot.find('.content');
        const siblings = contentDivs.siblings('div');

        expect(siblings.nodes).toHaveLength(3); // All content divs match 'div' selector and are siblings
    });
});
