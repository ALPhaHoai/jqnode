import $ from '../../../../index';
import JQ from '../../../../jq';

describe('nextAll() method', () => {
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

    test('nextAll() should get all following siblings', () => {
        const secondElement = root.find('.second');
        const nextSiblings = secondElement.nextAll();

        const nextSiblingsNodes = nextSiblings.nodes;
        expect(nextSiblingsNodes).toHaveLength(5); // third, fourth, span, fifth, sixth
        const firstNextSiblingClass = nextSiblings.nodes[0].attributes.class;
        expect(firstNextSiblingClass).toBe('sibling third active');
        const secondNextSiblingClass = nextSiblings.nodes[1].attributes.class;
        expect(secondNextSiblingClass).toBe('sibling fourth');
        const thirdNextSiblingClass = nextSiblings.nodes[2].attributes.class;
        expect(thirdNextSiblingClass).toBe('not-sibling');
        const fourthNextSiblingClass = nextSiblings.nodes[3].attributes.class;
        expect(fourthNextSiblingClass).toBe('sibling fifth');
        const fifthNextSiblingClass = nextSiblings.nodes[4].attributes.class;
        expect(fifthNextSiblingClass).toBe('sibling sixth');
    });

    test('nextAll() should work with selector filter', () => {
        const firstElement = root.find('.first');
        const nextActive = firstElement.nextAll('.active');

        const nextActiveNodes = nextActive.nodes;
        expect(nextActiveNodes).toHaveLength(1);
        const nextActiveClass = nextActive.nodes[0].attributes.class;
        expect(nextActiveClass).toBe('sibling third active');
        const nextActiveText = nextActive.text();
        expect(nextActiveText).toBe('Third Active');
    });

    test('nextAll() should work with class selector', () => {
        const secondElement = root.find('.second');
        const nextSiblings = secondElement.nextAll('.sibling');

        expect(nextSiblings.nodes).toHaveLength(4);
        const allHaveSiblingClass = nextSiblings.nodes.every(node => node.attributes.class.includes('sibling'));
        expect(allHaveSiblingClass).toBe(true);
    });

    test('nextAll() should work with tag selector', () => {
        const thirdElement = root.find('.third');
        const nextDivs = thirdElement.nextAll('div');

        expect(nextDivs.nodes).toHaveLength(3); // fourth, fifth, sixth
        const allAreDivs = nextDivs.nodes.every(node => node.tagName && node.tagName.toLowerCase() === 'div');
        expect(allAreDivs).toBe(true);
    });

    test('nextAll() should return empty for last element', () => {
        const sixthElement = root.find('.sixth');
        const nextSiblings = sixthElement.nextAll();

        expect(nextSiblings.nodes).toHaveLength(0);
    });

    test('nextAll() should work with multiple elements', () => {
        const firstAndThird = root.find('.first, .third');
        const nextSiblings = firstAndThird.nextAll();

        // Should get all unique following siblings of both elements
        expect(nextSiblings.nodes).toHaveLength(6); // second, third, fourth, span, fifth, sixth (no duplicates)
    });

    test('nextAll() should skip non-element siblings', () => {
        const fourthElement = root.find('.fourth');
        const nextSiblings = fourthElement.nextAll();

        const nextSiblingsNodes = nextSiblings.nodes;
        expect(nextSiblingsNodes).toHaveLength(3); // span, fifth, sixth
        const firstNextSiblingClass = nextSiblings.nodes[0].attributes.class;
        expect(firstNextSiblingClass).toBe('not-sibling');
        const secondNextSiblingClass = nextSiblings.nodes[1].attributes.class;
        expect(secondNextSiblingClass).toBe('sibling fifth');
        const thirdNextSiblingClass = nextSiblings.nodes[2].attributes.class;
        expect(thirdNextSiblingClass).toBe('sibling sixth');
    });

    test('nextAll() should return empty when selector matches nothing', () => {
        const secondElement = root.find('.second');
        const noMatch = secondElement.nextAll('.nonexistent');

        expect(noMatch.nodes).toHaveLength(0);
    });

    test('nextAll() should return empty for elements with no following siblings', () => {
        const seventhElement = root.find('.seventh');
        const nextSiblings = seventhElement.nextAll();

        expect(nextSiblings.nodes).toHaveLength(0);
    });

    test('nextAll() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const nextSiblings = empty.nextAll();

        expect(nextSiblings.nodes).toHaveLength(0);
    });

    test('nextAll() should work with complex selectors', () => {
        const firstElement = root.find('.first');
        const nextComplex = firstElement.nextAll('[class*="fourth"], [class*="sixth"]');

        const nextComplexNodes = nextComplex.nodes;
        expect(nextComplexNodes).toHaveLength(2);
        const firstNextComplexClass = nextComplex.nodes[0].attributes.class;
        expect(firstNextComplexClass).toBe('sibling fourth');
        const secondNextComplexClass = nextComplex.nodes[1].attributes.class;
        expect(secondNextComplexClass).toBe('sibling sixth');
    });

    test('nextAll() should work with attribute selectors', () => {
        const html = `
            <div class="container">
                <div class="sibling" data-type="a">A</div>
                <div class="sibling" data-type="b">B</div>
                <div class="sibling" data-type="c">C</div>
                <div class="sibling" data-type="d">D</div>
            </div>
        `;
        const testRoot = $(html);
        const bElement = testRoot.find('[data-type="b"]');
        const nextSiblings = bElement.nextAll('[data-type]');

        const nextSiblingsNodes = nextSiblings.nodes;
        expect(nextSiblingsNodes).toHaveLength(2);
        const firstNextSiblingDataType = nextSiblings.nodes[0].attributes['data-type'];
        expect(firstNextSiblingDataType).toBe('c');
        const secondNextSiblingDataType = nextSiblings.nodes[1].attributes['data-type'];
        expect(secondNextSiblingDataType).toBe('d');
    });

    test('nextAll() should work with ID selectors', () => {
        const html = `
            <div class="container">
                <div id="first">First</div>
                <div id="second">Second</div>
                <div id="third">Third</div>
                <div id="fourth">Fourth</div>
            </div>
        `;
        const testRoot = $(html);
        const firstElement = testRoot.find('#first');
        const nextSiblings = firstElement.nextAll('#second, #fourth');

        const nextSiblingsNodes = nextSiblings.nodes;
        expect(nextSiblingsNodes).toHaveLength(2);
        const firstNextSiblingId = nextSiblings.nodes[0].attributes.id;
        expect(firstNextSiblingId).toBe('second');
        const secondNextSiblingId = nextSiblings.nodes[1].attributes.id;
        expect(secondNextSiblingId).toBe('fourth');
    });

    test('nextAll() should maintain proper order (document order)', () => {
        const firstElement = root.find('.first');
        const allNext = firstElement.nextAll();

        expect(allNext.nodes).toHaveLength(6); // second, third, fourth, span, fifth, sixth
        const nextTags = allNext.nodes.map(node => node.tagName && node.tagName.toLowerCase());
        expect(nextTags).toEqual(
            ['div', 'div', 'div', 'span', 'div', 'div']
        );
        const nextClassNames = allNext.nodes.map(node => node.attributes.class.split(' ')[1] || node.attributes.class.split(' ')[0]);
        expect(nextClassNames).toEqual(
            ['second', 'third', 'fourth', 'not-sibling', 'fifth', 'sixth']
        );
    });

    test('nextAll() should handle mixed element types correctly', () => {
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
        const firstDiv = testRoot.find('.item').first();
        const nextSiblings = firstDiv.nextAll('.item');

        expect(nextSiblings.nodes).toHaveLength(3);
        const nextDivValues = nextSiblings.nodes.map(node => node.children[0].value);
        expect(nextDivValues).toEqual(['Div 2', 'Div 3', 'Div 4']);
    });

    test('nextAll() should return different results for different starting positions', () => {
        const secondElement = root.find('.second');
        const thirdElement = root.find('.third');

        const secondNextAll = secondElement.nextAll();
        const thirdNextAll = thirdElement.nextAll();

        expect(secondNextAll.nodes).toHaveLength(5); // third, fourth, span, fifth, sixth
        expect(thirdNextAll.nodes).toHaveLength(4); // fourth, span, fifth, sixth
    });

    test('nextAll() should work with elements that have no parent', () => {
        const html = `<div class="orphan">Orphan</div>`;
        const orphan = $(html).find('.orphan');
        const nextSiblings = orphan.nextAll();

        expect(nextSiblings.nodes).toHaveLength(0);
    });

    test('nextAll() should work with multiple selectors in filter', () => {
        const secondElement = root.find('.second');
        const filteredNext = secondElement.nextAll('.active, .fifth');

        const filteredNextNodes = filteredNext.nodes;
        expect(filteredNextNodes).toHaveLength(2);
        const firstFilteredNextClass = filteredNext.nodes[0].attributes.class;
        expect(firstFilteredNextClass).toBe('sibling third active');
        const secondFilteredNextClass = filteredNext.nodes[1].attributes.class;
        expect(secondFilteredNextClass).toBe('sibling fifth');
    });
});
