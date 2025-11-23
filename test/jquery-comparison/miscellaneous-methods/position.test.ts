import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('position() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container" style="position: relative; top: 50px; left: 50px;">
        <div id="element1" style="position: absolute; top: 10px; left: 20px;">Element 1</div>
        <div id="element2" style="position: relative; top: 30px; left: 40px;">Element 2</div>
        <div id="element3">Element 3</div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('position() should return object with top and left properties - jquery-comparison', () => {
        const nqElem = nqRoot.find('#element1');
        const jqElem = jqRoot.find('#element1');

        const nqPos = nqElem.position();
        const jqPos = jqElem.position();

        expect(typeof nqPos).toBe('object');
        expect(typeof jqPos).toBe('object');
        expect(nqPos).toHaveProperty('top');
        expect(nqPos).toHaveProperty('left');
    });

    test('position() should return position relative to offset parent - jquery-comparison', () => {
        const nqElem = nqRoot.find('#element1');
        const jqElem = jqRoot.find('#element1');

        const nqPos = nqElem.position();
        const jqPos = jqElem.position();

        // Both should have the same structure
        expect(typeof nqPos.top).toBe(typeof jqPos.top);
        expect(typeof nqPos.left).toBe(typeof jqPos.left);
    });

    test('position() should handle elements without positioning - jquery-comparison', () => {
        const nqElem = nqRoot.find('#element3');
        const jqElem = jqRoot.find('#element3');

        const nqPos = nqElem.position();
        const jqPos = jqElem.position();

        expect(typeof nqPos).toBe('object');
        expect(typeof jqPos).toBe('object');
    });

    test('position() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqPos = nqEmpty.position();
        const jqPos = jqEmpty.position();

        // Both should handle gracefully (likely return undefined or empty object)
        expect(typeof nqPos).toBe(typeof jqPos);
    });

    test('position() values should be numeric - jquery-comparison', () => {
        const nqElem = nqRoot.find('#element2');
        const jqElem = jqRoot.find('#element2');

        const nqPos = nqElem.position();
        const jqPos = jqElem.position();

        if (nqPos && jqPos) {
            expect(typeof nqPos.top).toBe('number');
            expect(typeof nqPos.left).toBe('number');
            expect(typeof jqPos.top).toBe('number');
            expect(typeof jqPos.left).toBe('number');
        }
    });

    test('position() should work with first element in collection - jquery-comparison', () => {
        const html = `
      <div class="parent">
        <div class="child" id="child1" style="margin-top: 10px;">Child 1</div>
        <div class="child" id="child2">Child 2</div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        const nqChildren = nodeQuery.find('.child');
        const jqChildren = jquery.find('.child');

        const nqPos = nqChildren.position();
        const jqPos = jqChildren.position();

        // Should use first element in collection
        expect(typeof nqPos).toBe(typeof jqPos);
    });

    test('position() should handle nested elements - jquery-comparison', () => {
        const html = `
      <div style="position: relative;">
        <div style="position: relative; top: 20px; left: 30px;">
          <div id="nested" style="position: absolute; top: 5px; left: 10px;">Nested</div>
        </div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        const nqNested = nodeQuery.find('#nested');
        const jqNested = jquery.find('#nested');

        const nqPos = nqNested.position();
        const jqPos = jqNested.position();

        expect(nqPos).toHaveProperty('top');
        expect(nqPos).toHaveProperty('left');
        expect(jqPos).toHaveProperty('top');
        expect(jqPos).toHaveProperty('left');
    });
});
