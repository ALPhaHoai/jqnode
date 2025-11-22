import $ from '../../../../index';
import JQ from '../../../../jq';

describe('prev() method', () => {
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

    test('prev() should get the immediately preceding sibling', () => {
        const fourthElement = root.find('.fourth');
        const prevSibling = fourthElement.prev();

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(1);
        const prevSiblingClass = prevSibling.nodes[0].attributes.class;
        expect(prevSiblingClass).toBe('sibling third active');
        const prevSiblingText = prevSibling.text();
        expect(prevSiblingText).toBe('Third Active');
    });

    test('prev() should work with selector filter', () => {
        const fifthElement = root.find('.fifth');
        const prevActive = fifthElement.prev('.active');

        const prevActiveNodes = prevActive.nodes;
        expect(prevActiveNodes).toHaveLength(1);
        const prevActiveClass = prevActive.nodes[0].attributes.class;
        expect(prevActiveClass).toBe('sibling third active');
        const prevActiveText = prevActive.text();
        expect(prevActiveText).toBe('Third Active');
    });

    test('prev() should work with class selector', () => {
        const fourthElement = root.find('.fourth');
        const prevSibling = fourthElement.prev('.sibling');

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(1);
        const prevSiblingClass = prevSibling.nodes[0].attributes.class;
        expect(prevSiblingClass).toBe('sibling third active');
    });

    test('prev() should work with tag selector', () => {
        const fifthElement = root.find('.fifth');
        const prevDiv = fifthElement.prev('div');

        const prevDivNodes = prevDiv.nodes;
        expect(prevDivNodes).toHaveLength(1);
        const prevDivClass = prevDiv.nodes[0].attributes.class;
        expect(prevDivClass).toBe('sibling fourth');
    });

    test('prev() should return empty for first element', () => {
        const firstElement = root.find('.first');
        const prevSibling = firstElement.prev();

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(0);
    });

    test('prev() should work with multiple elements', () => {
        const thirdAndFifth = root.find('.third, .fifth');
        const prevSiblings = thirdAndFifth.prev();

        const prevSiblingsNodes = prevSiblings.nodes;
        expect(prevSiblingsNodes).toHaveLength(2);
        const firstPrevSiblingClass = prevSiblings.nodes[0].attributes.class;
        expect(firstPrevSiblingClass).toBe('sibling second');
        const secondPrevSiblingClass = prevSiblings.nodes[1].attributes.class;
        expect(secondPrevSiblingClass).toBe('not-sibling');
    });

    test('prev() should skip non-element siblings', () => {
        const fifthElement = root.find('.fifth');
        const prevSibling = fifthElement.prev();

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(1);
        const prevSiblingClass = prevSibling.nodes[0].attributes.class;
        expect(prevSiblingClass).toBe('not-sibling');
        // Should return the immediate previous element sibling (the span)
    });

    test('prev() should return empty when selector matches nothing', () => {
        const fourthElement = root.find('.fourth');
        const noMatch = fourthElement.prev('.nonexistent');

        const noMatchNodes = noMatch.nodes;
        expect(noMatchNodes).toHaveLength(0);
    });

    test('prev() should return empty for elements with no previous sibling', () => {
        const firstElement = root.find('.first');
        const prevSibling = firstElement.prev();

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(0);
    });

    test('prev() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const prevSibling = empty.prev();

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(0);
    });

    test('prev() should work with complex selectors', () => {
        const fourthElement = root.find('.fourth');
        const prevComplex = fourthElement.prev('[class*="third"]');

        const prevComplexNodes = prevComplex.nodes;
        expect(prevComplexNodes).toHaveLength(1);
        const prevComplexClass = prevComplex.nodes[0].attributes.class;
        expect(prevComplexClass).toBe('sibling third active');
    });

    test('prev() should work with attribute selectors', () => {
        const html = `
            <div class="container">
                <div class="sibling" data-type="a">A</div>
                <div class="sibling" data-type="b">B</div>
                <div class="sibling" data-type="c">C</div>
            </div>
        `;
        const testRoot = $(html);
        const cElement = testRoot.find('[data-type="c"]');
        const prevSibling = cElement.prev('[data-type="a"]');

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(1); // A is immediately before C
        const prevSiblingText = prevSibling.text();
        expect(prevSiblingText).toBe('A');
    });

    test('prev() should work with ID selectors', () => {
        const html = `
            <div class="container">
                <div id="first">First</div>
                <div id="second">Second</div>
                <div id="third">Third</div>
            </div>
        `;
        const testRoot = $(html);
        const thirdElement = testRoot.find('#third');
        const prevSibling = thirdElement.prev('#second');

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(1);
        const prevSiblingId = prevSibling.nodes[0].attributes.id;
        expect(prevSiblingId).toBe('second');
    });

    test('prev() should handle mixed element types correctly', () => {
        const html = `
            <div class="container">
                <div class="item">Div 1</div>
                <span class="separator">Span</span>
                <div class="item">Div 2</div>
                <p>Paragraph</p>
                <div class="item">Div 3</div>
            </div>
        `;
        const testRoot = $(html);
        const lastDiv = testRoot.find('.item').last(); // Div 3
        const prevSibling = lastDiv.prev('.item');

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(1);
        const lastDivPrevText = prevSibling.text();
        expect(lastDivPrevText).toBe('Div 2');
    });

    test('prev() should return different results for different elements in same parent', () => {
        const siblings = root.find('.sibling');
        const secondPrev = siblings.eq(1).prev(); // Second element's prev
        const thirdPrev = siblings.eq(2).prev(); // Third element's prev
        const fourthPrev = siblings.eq(3).prev(); // Fourth element's prev

        const secondPrevNodes = secondPrev.nodes;
        expect(secondPrevNodes).toHaveLength(1);
        const secondPrevText = secondPrev.text();
        expect(secondPrevText).toBe('First');

        const thirdPrevNodes = thirdPrev.nodes;
        expect(thirdPrevNodes).toHaveLength(1);
        const thirdPrevText = thirdPrev.text();
        expect(thirdPrevText).toBe('Second');

        const fourthPrevNodes = fourthPrev.nodes;
        expect(fourthPrevNodes).toHaveLength(1);
        const fourthPrevText = fourthPrev.text();
        expect(fourthPrevText).toBe('Third Active');
    });

    test('prev() should work with elements that have no parent', () => {
        const html = `<div class="orphan">Orphan</div>`;
        const orphan = $(html).find('.orphan');
        const prevSibling = orphan.prev();

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(0);
    });

    test('prev() should work with the sixth element (single child)', () => {
        const sixthElement = root.find('.sixth');
        const prevSibling = sixthElement.prev();

        const prevSiblingNodes = prevSibling.nodes;
        expect(prevSiblingNodes).toHaveLength(0); // No previous siblings
    });

    test('prev() should handle selector that matches but is not immediate previous', () => {
        const html = `
            <div class="container">
                <div class="item">First</div>
                <span>Span</span>
                <div class="item">Second</div>
                <div class="item">Third</div>
            </div>
        `;
        const testRoot = $(html);
        const thirdElement = testRoot.find('.item').last();
        const prevItem = thirdElement.prev('.item');

        const prevItemNodes = prevItem.nodes;
        expect(prevItemNodes).toHaveLength(1);
        const thirdElementPrevText = prevItem.text();
        expect(thirdElementPrevText).toBe('Second');
    });
});
