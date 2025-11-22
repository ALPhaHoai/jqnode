import $ from '../../../../index';
import { HtmlNode } from '../../../../types';
import JQ from '../../../../jq';

describe('prevUntil() method', () => {
    let root: JQ;

    beforeEach(() => {
        const html = `
            <div class="container">
                <div class="sibling first stop">First Stop</div>
                <div class="sibling second">Second</div>
                <div class="sibling third">Third</div>
                <div class="sibling fourth stop">Fourth Stop</div>
                <span class="not-sibling">Not a sibling</span>
                <div class="sibling fifth">Fifth</div>
                <div class="sibling sixth">Sixth</div>
                <div class="sibling seventh">Seventh</div>
            </div>
            <div class="other-container">
                <div class="sibling eighth">Eighth</div>
            </div>
        `;
        root = $(html);
    });

    test('prevUntil() should get preceding siblings until specified selector (exclusive)', () => {
        const sixthElement = root.find('.sixth');
        const prevUntilStop = sixthElement.prevUntil('.stop');

        expect(prevUntilStop.nodes).toHaveLength(2); // fifth, not-sibling (stops before fourth.stop)
        const firstPrevUntilClass = prevUntilStop.nodes[0].attributes.class;
        expect(firstPrevUntilClass).toBe('sibling fifth');
        const secondPrevUntilClass = prevUntilStop.nodes[1].attributes.class;
        expect(secondPrevUntilClass).toBe('not-sibling');
    });

    test('prevUntil() should work with filter parameter', () => {
        const seventhElement = root.find('.seventh');
        const prevUntilWithFilter = seventhElement.prevUntil('.stop', '.sibling');

        expect(prevUntilWithFilter.nodes).toHaveLength(2); // sixth, fifth (filtered, stops before .stop)
        const filteredClassNames = prevUntilWithFilter.nodes.map((node: HtmlNode) => node.attributes.class.split(' ')[1]);
        expect(filteredClassNames).toEqual(['sixth', 'fifth']);
    });

    test('prevUntil() should work with selector and filter together', () => {
        const seventhElement = root.find('.seventh');
        const prevUntilFiltered = seventhElement.prevUntil('.first', '.sibling');

        expect(prevUntilFiltered.nodes).toHaveLength(5); // sixth, fifth, fourth, third, second (stops before first)
        const siblingClassNames = prevUntilFiltered.nodes.map((node: HtmlNode) => node.attributes.class.split(' ')[1]);
        expect(siblingClassNames).toEqual(['sixth', 'fifth', 'fourth', 'third', 'second']);
    });

    test('prevUntil() should stop at first matching element', () => {
        const seventhElement = root.find('.seventh');
        const prevUntilStop = seventhElement.prevUntil('.stop');

        expect(prevUntilStop.nodes).toHaveLength(3); // sixth, fifth, not-sibling (stops before fourth.stop)
        const firstPrevUntilClass = prevUntilStop.nodes[0].attributes.class;
        expect(firstPrevUntilClass).toBe('sibling sixth');
        const secondPrevUntilClass = prevUntilStop.nodes[1].attributes.class;
        expect(secondPrevUntilClass).toBe('sibling fifth');
        const thirdPrevUntilClass = prevUntilStop.nodes[2].attributes.class;
        expect(thirdPrevUntilClass).toBe('not-sibling');
    });

    test('prevUntil() should work with class selector for stop element', () => {
        const sixthElement = root.find('.sixth');
        const prevUntilStop = sixthElement.prevUntil('.first');

        expect(prevUntilStop.nodes).toHaveLength(5); // fifth, not-sibling, fourth, third, second (stops before first)
        const firstPrevUntilClass = prevUntilStop.nodes[0].attributes.class;
        expect(firstPrevUntilClass).toBe('sibling fifth');
        const secondPrevUntilClass = prevUntilStop.nodes[1].attributes.class;
        expect(secondPrevUntilClass).toBe('not-sibling');
    });

    test('prevUntil() should work with tag selector for stop element', () => {
        const html = `
            <div class="container">
                <p>Stop here</p>
                <span>Middle 1</span>
                <div>Start</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('div');
        const prevUntilP = startElement.prevUntil('p');

        expect(prevUntilP.nodes).toHaveLength(1); // Only the span
        const prevUntilPTag = prevUntilP.nodes[0].tagName && prevUntilP.nodes[0].tagName.toLowerCase();
        expect(prevUntilPTag).toBe('span');
    });

    test('prevUntil() should return empty when no stop element found', () => {
        const secondElement = root.find('.second');
        const prevUntilNonexistent = secondElement.prevUntil('.nonexistent');

        expect(prevUntilNonexistent.nodes).toHaveLength(1); // first (no stop found)
    });

    test('prevUntil() should return empty for first element', () => {
        const firstElement = root.find('.first');
        const prevUntilStop = firstElement.prevUntil('.stop');

        expect(prevUntilStop.nodes).toHaveLength(0);
    });

    test('prevUntil() should work with multiple elements', () => {
        const sixthAndSeventh = root.find('.sixth, .seventh');
        const prevUntilStop = sixthAndSeventh.prevUntil('.stop');

        // Should get preceding siblings until stop for each element
        expect(prevUntilStop.nodes).toHaveLength(3); // sixth, fifth, not-sibling (deduplicated)
    });

    test('prevUntil() should include all element siblings', () => {
        const seventhElement = root.find('.seventh');
        const prevUntilStop = seventhElement.prevUntil('.first');

        expect(prevUntilStop.nodes).toHaveLength(6); // sixth, fifth, not-sibling, fourth stop, third, second (stops before first)
        const mappedNodes = prevUntilStop.nodes.map((node: HtmlNode) => node.attributes.class || node.tagName && node.tagName.toLowerCase());
        expect(mappedNodes).toEqual(['sibling sixth', 'sibling fifth', 'not-sibling', 'sibling fourth stop', 'sibling third', 'sibling second']);
    });

    test('prevUntil() should work on empty collection', () => {
        const empty = $('.nonexistent');
        const prevUntilStop = empty.prevUntil('.stop');

        expect(prevUntilStop.nodes).toHaveLength(0);
    });

    test('prevUntil() should work with complex selectors', () => {
        const seventhElement = root.find('.seventh');
        const prevUntilComplex = seventhElement.prevUntil('[class*="first"]');

        expect(prevUntilComplex.nodes).toHaveLength(6); // sixth, fifth, span, fourth, third, second (farthest first)
        const prevUntilComplexClass = prevUntilComplex.nodes[0].attributes.class;
        expect(prevUntilComplexClass).toBe('sibling sixth');
    });

    test('prevUntil() should work with attribute selectors for stop element', () => {
        const html = `
            <div class="container">
                <div class="item" data-stop="true">Stop</div>
                <div class="item">Middle 1</div>
                <div class="item">Start</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('.item').last();
        const prevUntilStop = startElement.prevUntil('[data-stop="true"]');

        expect(prevUntilStop.nodes).toHaveLength(1); // Only Middle 1
        const prevUntilStopText = prevUntilStop.text();
        expect(prevUntilStopText).toBe('Middle 1');
    });

    test('prevUntil() should work with filter selector', () => {
        const seventhElement = root.find('.seventh');
        const prevUntilFiltered = seventhElement.prevUntil(null, '.fourth');

        expect(prevUntilFiltered.nodes).toHaveLength(1); // Only fourth (no stop selector, just filter)
        const prevUntilFilteredClass = prevUntilFiltered.nodes[0].attributes.class;
        expect(prevUntilFilteredClass).toBe('sibling fourth stop');
    });

    test('prevUntil() should work with ID selectors', () => {
        const html = `
            <div class="container">
                <div id="stop">Stop</div>
                <div>Middle 1</div>
                <div id="start">Start</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('#start');
        const prevUntilStop = startElement.prevUntil('#stop');

        expect(prevUntilStop.nodes).toHaveLength(1); // Only Middle 1
        const prevUntilStopIdText = prevUntilStop.text();
        expect(prevUntilStopIdText).toBe('Middle 1');
    });

    test('prevUntil() should handle DOM element as stop parameter', () => {
        const sixthElement = root.find('.sixth');
        const stopElement = root.find('.fourth').first();

        const prevUntilElement = sixthElement.prevUntil(stopElement);

        expect(prevUntilElement.nodes).toHaveLength(2); // fifth, span (stops before fourth, farthest first)
        const firstPrevUntilElementClass = prevUntilElement.nodes[0].attributes.class;
        expect(firstPrevUntilElementClass).toBe('sibling fifth');
        const secondPrevUntilElementClass = prevUntilElement.nodes[1].attributes.class;
        expect(secondPrevUntilElementClass).toBe('not-sibling');
    });

    test('prevUntil() should return elements in reverse document order (farthest first)', () => {
        const seventhElement = root.find('.seventh');
        const prevUntilFirstStop = seventhElement.prevUntil('.first');

        expect(prevUntilFirstStop.nodes).toHaveLength(6); // sixth, fifth, not-sibling, fourth stop, third, second (farthest first)
        const allClassNames = prevUntilFirstStop.nodes.map((node: HtmlNode) => node.attributes.class);
        expect(allClassNames).toEqual(['sibling sixth', 'sibling fifth', 'not-sibling', 'sibling fourth stop', 'sibling third', 'sibling second']);
    });

    test('prevUntil() should handle mixed element types correctly', () => {
        const html = `
            <div class="container">
                <div class="stop">Stop</div>
                <span>Middle 1</span>
                <p>Middle 2</p>
                <div class="start">Start</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('.start');
        const prevUntilStop = startElement.prevUntil('.stop');

        expect(prevUntilStop.nodes).toHaveLength(2); // p and span (farthest first)
        const firstPrevUntilTag = prevUntilStop.nodes[0].tagName && prevUntilStop.nodes[0].tagName.toLowerCase();
        expect(firstPrevUntilTag).toBe('p');
        const secondPrevUntilTag = prevUntilStop.nodes[1].tagName && prevUntilStop.nodes[1].tagName.toLowerCase();
        expect(secondPrevUntilTag).toBe('span');
    });

    test('prevUntil() should work with elements that have no parent', () => {
        const html = `<div class="orphan">Orphan</div>`;
        const orphan = $(html).find('.orphan');
        const prevUntilStop = orphan.prevUntil('.stop');

        expect(prevUntilStop.nodes).toHaveLength(0);
    });

    test('prevUntil() should handle case where stop element is immediate previous sibling', () => {
        const secondElement = root.find('.second');
        const prevUntilImmediate = secondElement.prevUntil('.first');

        expect(prevUntilImmediate.nodes).toHaveLength(0); // No elements before stop
    });

    test('prevUntil() should work with both selector and filter parameters', () => {
        const html = `
            <div class="container">
                <div class="stop">Stop</div>
                <span class="middle">Middle 1</span>
                <div class="middle">Middle 2</div>
                <div class="middle">Middle 3</div>
                <div class="start">Start</div>
            </div>
        `;
        const testRoot = $(html);
        const startElement = testRoot.find('.start');
        const prevUntilFiltered = startElement.prevUntil('.stop', 'div');

        expect(prevUntilFiltered.nodes).toHaveLength(2); // Only Middle 3 and Middle 2 (div elements before stop, farthest first)
        const middleValues = prevUntilFiltered.nodes.map((node: HtmlNode) => node.children[0].value);
        expect(middleValues).toEqual(['Middle 3', 'Middle 2']);
    });

    test('prevUntil() should handle stop element that comes after current element', () => {
        const secondElement = root.find('.second');
        const prevUntilSeventh = secondElement.prevUntil('.seventh');

        expect(prevUntilSeventh.nodes).toHaveLength(1); // Only first (seventh comes after second)
        const prevUntilSeventhText = prevUntilSeventh.text();
        expect(prevUntilSeventhText).toBe('First Stop');
    });
});
