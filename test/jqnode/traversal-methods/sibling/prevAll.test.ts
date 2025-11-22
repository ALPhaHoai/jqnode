import $ from '../../../../index';
import { HtmlNode } from '../../../../types';
import JQ from '../../../../jq';

describe('prevAll() method', () => {
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
                <div class="sibling sixth">Sixth</div>
            </div>
            <div class="other-container">
                <div class="sibling seventh">Seventh</div>
            </div>
        `;
        root = $(html);
    });

    test('prevAll() should get all preceding siblings', () => {
        const fifthElement = root.find('.fifth');
        const prevSiblings = fifthElement.prevAll();

        expect(prevSiblings.nodes).toHaveLength(5); // first, second, third, fourth, span
        const firstPrevSiblingClass = prevSiblings.nodes[0].attributes.class;
        expect(firstPrevSiblingClass).toBe('sibling first');
        const secondPrevSiblingClass = prevSiblings.nodes[1].attributes.class;
        expect(secondPrevSiblingClass).toBe('sibling second');
        const thirdPrevSiblingClass = prevSiblings.nodes[2].attributes.class;
        expect(thirdPrevSiblingClass).toBe('sibling third active');
        const fourthPrevSiblingClass = prevSiblings.nodes[3].attributes.class;
        expect(fourthPrevSiblingClass).toBe('sibling fourth');
        const fifthPrevSiblingClass = prevSiblings.nodes[4].attributes.class;
        expect(fifthPrevSiblingClass).toBe('not-sibling');
    });

    test('prevAll() should work with selector filter', () => {
        const sixthElement = root.find('.sixth');
        const prevActive = sixthElement.prevAll('.active');

        expect(prevActive.nodes).toHaveLength(1);
        const prevActiveClass = prevActive.nodes[0].attributes.class;
        expect(prevActiveClass).toBe('sibling third active');
        const prevActiveText = prevActive.text();
        expect(prevActiveText).toBe('Third Active');
    });

    test('prevAll() should work with class selector', () => {
        const fifthElement = root.find('.fifth');
        const prevSiblings = fifthElement.prevAll('.sibling');

        expect(prevSiblings.nodes).toHaveLength(4);
        const allPrevHaveSiblingClass = prevSiblings.nodes.every((node: HtmlNode) => node.attributes.class.includes('sibling'));
        expect(allPrevHaveSiblingClass).toBe(true);
    });

    test('prevAll() should work with tag selector', () => {
        const sixthElement = root.find('.sixth');
        const prevDivs = sixthElement.prevAll('div');

        expect(prevDivs.nodes).toHaveLength(5); // first, second, third, fourth, fifth
        const allPrevAreDivs = prevDivs.nodes.every((node: HtmlNode) => node.tagName && node.tagName.toLowerCase() === 'div');
        expect(allPrevAreDivs).toBe(true);
    });

    test('prevAll() should return empty for first element', () => {
        const firstElement = root.find('.first');
        const prevSiblings = firstElement.prevAll();

        expect(prevSiblings.nodes).toHaveLength(0);
    });

    test('prevAll() should work with multiple elements', () => {
        const thirdAndSixth = root.find('.third, .sixth');
        const prevSiblings = thirdAndSixth.prevAll();

        // Should get all unique preceding siblings of both elements
        expect(prevSiblings.nodes).toHaveLength(6); // first, second, third, fourth, span, fifth (no duplicates)
    });

    test('prevAll() should skip non-element siblings', () => {
        const sixthElement = root.find('.sixth');
        const prevSiblings = sixthElement.prevAll();

        expect(prevSiblings.nodes).toHaveLength(6); // first, second, third, fourth, span, fifth
        const fourthPrevSiblingClass = prevSiblings.nodes[3].attributes.class;
        expect(fourthPrevSiblingClass).toBe('sibling fourth');
        const fifthPrevSiblingClass = prevSiblings.nodes[4].attributes.class;
        expect(fifthPrevSiblingClass).toBe('not-sibling');
        const sixthPrevSiblingClass = prevSiblings.nodes[5].attributes.class;
        expect(sixthPrevSiblingClass).toBe('sibling fifth');
    });

    test('prevAll() should return empty when selector matches nothing', () => {
        const fifthElement = root.find('.fifth');
        const noMatch = fifthElement.prevAll('.nonexistent');

        expect(noMatch.nodes).toHaveLength(0);
    });

    test('prevAll() should return empty for elements with no preceding siblings', () => {
        const firstElement = root.find('.first');
        const prevSiblings = firstElement.prevAll();

        expect(prevSiblings.nodes).toHaveLength(0);
    });

    test('prevAll() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const prevSiblings = empty.prevAll();

        expect(prevSiblings.nodes).toHaveLength(0);
    });

    test('prevAll() should work with complex selectors', () => {
        const sixthElement = root.find('.sixth');
        const prevComplex = sixthElement.prevAll('[class*="first"], [class*="fourth"]');

        expect(prevComplex.nodes).toHaveLength(2);
        const firstPrevClass = prevComplex.nodes[0].attributes.class;
        expect(firstPrevClass).toBe('sibling first');
        const secondPrevClass = prevComplex.nodes[1].attributes.class;
        expect(secondPrevClass).toBe('sibling fourth');
    });

    test('prevAll() should work with attribute selectors', () => {
        const html = `
            <div class="container">
                <div class="sibling" data-type="a">A</div>
                <div class="sibling" data-type="b">B</div>
                <div class="sibling" data-type="c">C</div>
                <div class="sibling" data-type="d">D</div>
            </div>
        `;
        const testRoot = $(html);
        const dElement = testRoot.find('[data-type="d"]');
        const prevSiblings = dElement.prevAll('[data-type]');

        expect(prevSiblings.nodes).toHaveLength(3);
        const firstDataType = prevSiblings.nodes[0].attributes['data-type'];
        expect(firstDataType).toBe('a');
        const secondDataType = prevSiblings.nodes[1].attributes['data-type'];
        expect(secondDataType).toBe('b');
        const thirdDataType = prevSiblings.nodes[2].attributes['data-type'];
        expect(thirdDataType).toBe('c');
    });

    test('prevAll() should work with ID selectors', () => {
        const html = `
            <div class="container">
                <div id="first">First</div>
                <div id="second">Second</div>
                <div id="third">Third</div>
                <div id="fourth">Fourth</div>
            </div>
        `;
        const testRoot = $(html);
        const fourthElement = testRoot.find('#fourth');
        const prevSiblings = fourthElement.prevAll('#first, #third');

        expect(prevSiblings.nodes).toHaveLength(2);
        const firstPrevId = prevSiblings.nodes[0].attributes.id;
        expect(firstPrevId).toBe('first');
        const secondPrevId = prevSiblings.nodes[1].attributes.id;
        expect(secondPrevId).toBe('third');
    });

    test('prevAll() should maintain proper order (document order)', () => {
        const fifthElement = root.find('.fifth');
        const allPrev = fifthElement.prevAll();

        expect(allPrev.nodes).toHaveLength(5); // first, second, third, fourth, span
        const prevClassNames = allPrev.nodes.map((node: HtmlNode) => node.attributes.class.split(' ')[1] || node.attributes.class);
        expect(prevClassNames).toEqual(
            ['first', 'second', 'third', 'fourth', 'not-sibling']
        );
    });

    test('prevAll() should handle mixed element types correctly', () => {
        const html = `
            <div class="container">
                <div class="item">Div 1</div>
                <span class="separator">Span</span>
                <div class="item">Div 2</div>
                <p>Paragraph</p>
                <div class="item">Div 3</div>
                <h1>Title</h1>
                <div class="item">Div 4</div>
            </div>
        `;
        const testRoot = $(html);
        const lastDiv = testRoot.find('.item').last(); // Div 4
        const prevSiblings = lastDiv.prevAll('.item');

        expect(prevSiblings.nodes).toHaveLength(3);
        const divValues = prevSiblings.nodes.map((node: HtmlNode) => node.children[0].value);
        expect(divValues).toEqual(['Div 1', 'Div 2', 'Div 3']);
    });

    test('prevAll() should return different results for different starting positions', () => {
        const thirdElement = root.find('.third');
        const sixthElement = root.find('.sixth');

        const thirdPrevAll = thirdElement.prevAll();
        const sixthPrevAll = sixthElement.prevAll();

        expect(thirdPrevAll.nodes).toHaveLength(2); // first, second
        expect(sixthPrevAll.nodes).toHaveLength(6); // first, second, third, fourth, span, fifth
    });

    test('prevAll() should work with elements that have no parent', () => {
        const html = `<div class="orphan">Orphan</div>`;
        const orphan = $(html).find('.orphan');
        const prevSiblings = orphan.prevAll();

        expect(prevSiblings.nodes).toHaveLength(0);
    });

    test('prevAll() should work with multiple selectors in filter', () => {
        const fifthElement = root.find('.fifth');
        const filteredPrev = fifthElement.prevAll('.first, .third');

        expect(filteredPrev.nodes).toHaveLength(2);
        const firstFilteredClass = filteredPrev.nodes[0].attributes.class;
        expect(firstFilteredClass).toBe('sibling first');
        const secondFilteredClass = filteredPrev.nodes[1].attributes.class;
        expect(secondFilteredClass).toBe('sibling third active');
    });

    test('prevAll() should work with the seventh element (single child in different container)', () => {
        const seventhElement = root.find('.seventh');
        const prevSiblings = seventhElement.prevAll();

        expect(prevSiblings.nodes).toHaveLength(0); // No previous siblings in its container
    });

    test('prevAll() should handle elements with same parent correctly', () => {
        const html = `
            <div class="container">
                <div class="shared-parent">
                    <div class="child">Child 1</div>
                    <div class="child">Child 2</div>
                    <div class="child">Child 3</div>
                </div>
                <div class="other">Other</div>
            </div>
        `;
        const testRoot = $(html);
        const child3 = testRoot.find('.child').last();
        const prevSiblings = child3.prevAll('.child');

        expect(prevSiblings.nodes).toHaveLength(2);
        const childValues = prevSiblings.nodes.map((node: HtmlNode) => node.children[0].value);
        expect(childValues).toEqual(['Child 1', 'Child 2']);
    });
});
