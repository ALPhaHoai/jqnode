import $ from '../../../../index';
import JQ from '../../../../jq';

describe('next() method', () => {
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

    test('next() should get the immediately following sibling', () => {
        const secondElement = root.find('.second');
        const nextSibling = secondElement.next();

        expect(nextSibling.nodes).toHaveLength(1);
        const nextSiblingClass = nextSibling.nodes[0].attributes.class;
        expect(nextSiblingClass).toBe('sibling third active');
        const nextSiblingText = nextSibling.text();
        expect(nextSiblingText).toBe('Third Active');
    });

    test('next() should work with selector filter', () => {
        const firstElement = root.find('.first');
        const nextActive = firstElement.next('.active');

        expect(nextActive.nodes).toHaveLength(1);
        const nextActiveClass = nextActive.nodes[0].attributes.class;
        expect(nextActiveClass).toBe('sibling third active');
        const nextActiveText = nextActive.text();
        expect(nextActiveText).toBe('Third Active');
    });

    test('next() should work with class selector', () => {
        const secondElement = root.find('.second');
        const nextSibling = secondElement.next('.sibling');

        expect(nextSibling.nodes).toHaveLength(1);
        const nextSiblingClass = nextSibling.nodes[0].attributes.class;
        expect(nextSiblingClass).toBe('sibling third active');
    });

    test('next() should work with tag selector', () => {
        const fourthElement = root.find('.fourth');
        const nextDiv = fourthElement.next('div');

        expect(nextDiv.nodes).toHaveLength(1);
        const nextDivClass = nextDiv.nodes[0].attributes.class;
        expect(nextDivClass).toBe('sibling fifth');
    });

    test('next() should return empty for last element', () => {
        const fifthElement = root.find('.fifth');
        const nextSibling = fifthElement.next();

        expect(nextSibling.nodes).toHaveLength(0);
    });

    test('next() should work with multiple elements', () => {
        const firstAndFourth = root.find('.first, .fourth');
        const nextSiblings = firstAndFourth.next();

        expect(nextSiblings.nodes).toHaveLength(2);
        const firstNextSiblingClass = nextSiblings.nodes[0].attributes.class;
        expect(firstNextSiblingClass).toBe('sibling second');
        const secondNextSiblingClass = nextSiblings.nodes[1].attributes.class;
        expect(secondNextSiblingClass).toBe('not-sibling');
    });

    test('next() should skip non-element siblings', () => {
        const fourthElement = root.find('.fourth');
        const nextSibling = fourthElement.next();

        expect(nextSibling.nodes).toHaveLength(1);
        const nextSiblingClass = nextSibling.nodes[0].attributes.class;
        expect(nextSiblingClass).toBe('not-sibling');
        // Should return the immediate next element sibling (the span)
    });

    test('next() should return empty when selector matches nothing', () => {
        const secondElement = root.find('.second');
        const noMatch = secondElement.next('.nonexistent');

        expect(noMatch.nodes).toHaveLength(0);
    });

    test('next() should return empty for elements with no next sibling', () => {
        const sixthElement = root.find('.sixth');
        const nextSibling = sixthElement.next();

        expect(nextSibling.nodes).toHaveLength(0);
    });

    test('next() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const nextSibling = empty.next();

        expect(nextSibling.nodes).toHaveLength(0);
    });

    test('next() should work with complex selectors', () => {
        const secondElement = root.find('.second');
        const nextComplex = secondElement.next('[class*="third"]');

        expect(nextComplex.nodes).toHaveLength(1);
        const nextComplexClass = nextComplex.nodes[0].attributes.class;
        expect(nextComplexClass).toBe('sibling third active');
    });

    test('next() should work with attribute selectors', () => {
        const html = `
            <div class="container">
                <div class="sibling" data-type="a">A</div>
                <div class="sibling" data-type="b">B</div>
                <div class="sibling" data-type="c">C</div>
            </div>
        `;
        const testRoot = $(html);
        const bElement = testRoot.find('[data-type="b"]');
        const nextSibling = bElement.next('[data-type="c"]');

        expect(nextSibling.nodes).toHaveLength(1);
        const nextSiblingDataType = nextSibling.nodes[0].attributes?.['data-type'];
        expect(nextSiblingDataType).toBe('c');
        const nextSiblingDataTypeText = nextSibling.text();
        expect(nextSiblingDataTypeText).toBe('C');
    });

    test('next() should work with ID selectors', () => {
        const html = `
            <div class="container">
                <div id="first">First</div>
                <div id="second">Second</div>
                <div id="third">Third</div>
            </div>
        `;
        const testRoot = $(html);
        const firstElement = testRoot.find('#first');
        const nextSibling = firstElement.next('#second');

        expect(nextSibling.nodes).toHaveLength(1);
        const nextSiblingId = nextSibling.nodes[0].attributes?.id;
        expect(nextSiblingId).toBe('second');
    });

    test('next() should handle mixed element types correctly', () => {
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
        const firstDiv = testRoot.find('.item').first();
        const nextSibling = firstDiv.next('.item');

        expect(nextSibling.nodes).toHaveLength(1);
        const nextSiblingItemText = nextSibling.text();
        expect(nextSiblingItemText).toBe('Div 2');
    });

    test('next() should return different results for different elements in same parent', () => {
        const siblings = root.find('.sibling');
        const firstNext = siblings.first().next();
        const secondNext = siblings.eq(1).next(); // Second element's next
        const thirdNext = siblings.eq(2).next(); // Third element's next

        expect(firstNext.nodes).toHaveLength(1);
        const firstNextText = firstNext.text();
        expect(firstNextText).toBe('Second');

        expect(secondNext.nodes).toHaveLength(1);
        const secondNextText = secondNext.text();
        expect(secondNextText).toBe('Third Active');

        expect(thirdNext.nodes).toHaveLength(1);
        const thirdNextText = thirdNext.text();
        expect(thirdNextText).toBe('Fourth');
    });

    test('next() should work with elements that have no parent', () => {
        const html = `<div class="orphan">Orphan</div>`;
        const orphan = $(html).find('.orphan');
        const nextSibling = orphan.next();

        expect(nextSibling.nodes).toHaveLength(0);
    });
});
