import $ from '../../../../index';
import JQ from '../../../../jq';

describe('nextUntil() method', () => {
    let root: JQ;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="sibling first">First</div>
                <div class="sibling second">Second</div>
                <div class="sibling third stop">Third Stop</div>
                <div class="sibling fourth">Fourth</div>
                <span class="not-sibling">Not a sibling</span>
                <div class="sibling fifth">Fifth</div>
                <div class="sibling sixth stop">Sixth Stop</div>
                <div class="sibling seventh">Seventh</div>
            </div>
            <div class="other-container">
                <div class="sibling eighth">Eighth</div>
            </div>
        `;
        root = $(html);
    });

    test('nextUntil() should get following siblings until specified selector (exclusive)', () => {
        const secondElement = root.find('.second');
        const nextUntilStop = secondElement.nextUntil('.stop');

        expect(nextUntilStop.nodes).toHaveLength(0); // Stops immediately at third.stop
    });

    test('nextUntil() should work with filter parameter', () => {
        const firstElement = root.find('.first');
        const nextUntilWithFilter = firstElement.nextUntil('.stop', '.sibling');

        const nextUntilWithFilterNodes = nextUntilWithFilter.nodes;
        expect(nextUntilWithFilterNodes).toHaveLength(1); // second (filtered)
        const nextUntilWithFilterClass = nextUntilWithFilter.nodes[0].attributes.class;
        expect(nextUntilWithFilterClass).toBe('sibling second');
    });

    test('nextUntil() should work with selector and filter together', () => {
        const firstElement = root.find('.first');
        const nextUntilFiltered = firstElement.nextUntil('.sixth', '.sibling');

        const nextUntilFilteredNodes = nextUntilFiltered.nodes;
        expect(nextUntilFilteredNodes).toHaveLength(4); // second, third, fourth, fifth (stops before sixth)
        const nextFilteredClassNames = nextUntilFiltered.nodes.map(node => node.attributes.class.split(' ')[1]);
        expect(nextFilteredClassNames).toEqual(['second', 'third', 'fourth', 'fifth']);
    });

    test('nextUntil() should stop at first matching element', () => {
        const firstElement = root.find('.first');
        const nextUntilStop = firstElement.nextUntil('.stop');

        const nextUntilStopNodes = nextUntilStop.nodes;
        expect(nextUntilStopNodes).toHaveLength(1); // Only second (stops before third.stop)
        const nextUntilStopClass = nextUntilStop.nodes[0].attributes.class;
        expect(nextUntilStopClass).toBe('sibling second');
    });

    test('nextUntil() should work with class selector for stop element', () => {
        const fourthElement = root.find('.fourth');
        const nextUntilStop = fourthElement.nextUntil('.sixth');

        const nextUntilStopNodes = nextUntilStop.nodes;
        expect(nextUntilStopNodes).toHaveLength(2); // span and fifth (stops before sixth)
        const firstNextUntilStopClass = nextUntilStop.nodes[0].attributes.class;
        expect(firstNextUntilStopClass).toBe('not-sibling');
        const secondNextUntilStopClass = nextUntilStop.nodes[1].attributes.class;
        expect(secondNextUntilStopClass).toBe('sibling fifth');
    });

    test('nextUntil() should work with tag selector for stop element', () => {
        const html = `
            <div class="container">
                <div class="start">Start</div>
                <span>Middle 1</span>
                <p>Stop here</p>
                <span>Middle 2</span>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('.start');
        const nextUntilP = startElement.nextUntil('p');

        const nextUntilPNodes = nextUntilP.nodes;
        expect(nextUntilPNodes).toHaveLength(1); // Only the span
        const nextUntilPTag = nextUntilP.nodes[0].tagName && nextUntilP.nodes[0].tagName.toLowerCase();
        expect(nextUntilPTag).toBe('span');
    });

    test('nextUntil() should return empty when no stop element found', () => {
        const fifthElement = root.find('.fifth');
        const nextUntilNonexistent = fifthElement.nextUntil('.nonexistent');

        expect(nextUntilNonexistent.nodes).toHaveLength(2); // sixth, seventh (no stop found)
    });

    test('nextUntil() should return empty for last element', () => {
        const seventhElement = root.find('.seventh');
        const nextUntilStop = seventhElement.nextUntil('.stop');

        expect(nextUntilStop.nodes).toHaveLength(0);
    });

    test('nextUntil() should work with multiple elements', () => {
        const firstAndFourth = root.find('.first, .fourth');
        const nextUntilStop = firstAndFourth.nextUntil('.stop');

        // Should get following siblings until stop for each element
        expect(nextUntilStop.nodes).toHaveLength(3); // second (from first), fifth (from fourth)
    });

    test('nextUntil() should include all element siblings until stop', () => {
        const fourthElement = root.find('.fourth');
        const nextUntilStop = fourthElement.nextUntil('.sixth');

        const nextUntilStopNodes = nextUntilStop.nodes;
        expect(nextUntilStopNodes).toHaveLength(2); // span and fifth (stops before sixth)
        const firstNextUntilStopClass = nextUntilStop.nodes[0].attributes.class;
        expect(firstNextUntilStopClass).toBe('not-sibling');
        const secondNextUntilStopClass = nextUntilStop.nodes[1].attributes.class;
        expect(secondNextUntilStopClass).toBe('sibling fifth');
    });

    test('nextUntil() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const nextUntilStop = empty.nextUntil('.stop');

        expect(nextUntilStop.nodes).toHaveLength(0);
    });

    test('nextUntil() should work with complex selectors', () => {
        const firstElement = root.find('.first');
        const nextUntilComplex = firstElement.nextUntil('[class*="sixth"]');

        const nextUntilComplexNodes = nextUntilComplex.nodes;
        expect(nextUntilComplexNodes).toHaveLength(5); // second, third, fourth, fifth
        const nextUntilComplexClass = nextUntilComplex.nodes[4].attributes.class;
        expect(nextUntilComplexClass).toBe('sibling fifth');
    });

    test('nextUntil() should work with attribute selectors for stop element', () => {
        const html = `
            <div class="container">
                <div class="item">Start</div>
                <div class="item">Middle 1</div>
                <div class="item" data-stop="true">Stop</div>
                <div class="item">Middle 2</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('.item').first();
        const nextUntilStop = startElement.nextUntil('[data-stop="true"]');

        expect(nextUntilStop.nodes).toHaveLength(1); // Only Middle 1
        const nextUntilStopText = nextUntilStop.text();
        expect(nextUntilStopText).toBe('Middle 1');
    });

    test('nextUntil() should work with filter selector', () => {
        const firstElement = root.find('.first');
        const nextUntilFiltered = firstElement.nextUntil(null, '.fourth');

        const nextUntilFilteredNodes = nextUntilFiltered.nodes;
        expect(nextUntilFilteredNodes).toHaveLength(1); // Only fourth (no stop selector, just filter)
        const nextUntilFilteredClass = nextUntilFiltered.nodes[0].attributes.class;
        expect(nextUntilFilteredClass).toBe('sibling fourth');
    });

    test('nextUntil() should work with ID selectors', () => {
        const html = `
            <div class="container">
                <div id="start">Start</div>
                <div>Middle 1</div>
                <div id="stop">Stop</div>
                <div>Middle 2</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('#start');
        const nextUntilStop = startElement.nextUntil('#stop');

        expect(nextUntilStop.nodes).toHaveLength(1); // Only Middle 1
        const nextUntilStopIdText = nextUntilStop.text();
        expect(nextUntilStopIdText).toBe('Middle 1');
    });

    test('nextUntil() should handle DOM element as stop parameter', () => {
        const secondElement = root.find('.second');
        const stopElement = root.find('.stop').first(); // third element

        const nextUntilElement = secondElement.nextUntil(stopElement);

        expect(nextUntilElement.nodes).toHaveLength(0); // Should stop immediately (no elements before stop)
    });

    test('nextUntil() should maintain proper order (document order)', () => {
        const firstElement = root.find('.first');
        const nextUntilLastStop = firstElement.nextUntil('.sixth');

        const nextUntilLastStopNodes = nextUntilLastStop.nodes;
        expect(nextUntilLastStopNodes).toHaveLength(5); // second, third, fourth, span, fifth
        const nextUntilClassNames = nextUntilLastStop.nodes.map(node => node.attributes.class);
        expect(nextUntilClassNames).toEqual(['sibling second', 'sibling third stop', 'sibling fourth', 'not-sibling', 'sibling fifth']);
    });

    test('nextUntil() should handle mixed element types correctly', () => {
        const html = `
            <div class="container">
                <div class="start">Start</div>
                <span>Middle 1</span>
                <div class="stop">Stop</div>
                <p>Middle 2</p>
                <div>End</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('.start');
        const nextUntilStop = startElement.nextUntil('.stop');

        const nextUntilStopNodes = nextUntilStop.nodes;
        expect(nextUntilStopNodes).toHaveLength(1); // Only span
        const nextUntilStopTag = nextUntilStop.nodes[0].tagName && nextUntilStop.nodes[0].tagName.toLowerCase();
        expect(nextUntilStopTag).toBe('span');
    });

    test('nextUntil() should work with elements that have no parent', () => {
        const html = `<div class="orphan">Orphan</div>`;
        const orphan = $(html).find('.orphan');
        const nextUntilStop = orphan.nextUntil('.stop');

        expect(nextUntilStop.nodes).toHaveLength(0);
    });

    test('nextUntil() should handle case where stop element is immediate next sibling', () => {
        const firstElement = root.find('.first');
        const nextUntilImmediate = firstElement.nextUntil('.second');

        expect(nextUntilImmediate.nodes).toHaveLength(0); // No elements before stop
    });

    test('nextUntil() should work with both selector and filter parameters', () => {
        const html = `
            <div class="container">
                <div class="start">Start</div>
                <span class="middle">Middle 1</span>
                <div class="middle">Middle 2</div>
                <div class="stop">Stop</div>
                <div class="middle">Middle 3</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('.start');
        const nextUntilFiltered = startElement.nextUntil('.stop', 'div');

        const nextUntilFilteredNodes = nextUntilFiltered.nodes;
        expect(nextUntilFilteredNodes).toHaveLength(1); // Only Middle 2 (div elements before stop)
        const nextUntilFilteredText = nextUntilFiltered.text();
        expect(nextUntilFilteredText).toBe('Middle 2');
    });
});
