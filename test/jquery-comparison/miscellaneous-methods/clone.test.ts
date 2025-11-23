import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('clone() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div id="original" class="cloneable" data-value="test">
          <span class="inner">Inner Text</span>
          <p>Paragraph</p>
        </div>
        <div id="simple">Simple Element</div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('clone() should create a deep copy of elements - jquery-comparison', () => {
        const nqOriginal = nqRoot.find('#original');
        const jqOriginal = jqRoot.find('#original');

        const nqClone = nqOriginal.clone();
        const jqClone = jqOriginal.clone();

        // Check that clones are not the same reference
        expect(nqClone.get(0)).not.toBe(nqOriginal.get(0));
        expect(jqClone.get(0)).not.toBe(jqOriginal.get(0));

        // Check that structure is preserved
        expect(nqClone.find('.inner').length).toBe(jqClone.find('.inner').length);
        expect(nqClone.find('p').length).toBe(jqClone.find('p').length);
    });

    test('clone() should preserve attributes - jquery-comparison', () => {
        const nqOriginal = nqRoot.find('#original');
        const jqOriginal = jqRoot.find('#original');

        const nqClone = nqOriginal.clone();
        const jqClone = jqOriginal.clone();

        expect(nqClone.attr('id')).toBe(jqClone.attr('id'));
        expect(nqClone.attr('class')).toBe(jqClone.attr('class'));
        expect(nqClone.attr('data-value')).toBe(jqClone.attr('data-value'));
    });

    test('clone() should preserve text content - jquery-comparison', () => {
        const nqOriginal = nqRoot.find('#original .inner');
        const jqOriginal = jqRoot.find('#original .inner');

        const nqClone = nqOriginal.clone();
        const jqClone = jqOriginal.clone();

        expect(nqClone.text()).toBe(jqClone.text());
        expect(nqClone.text()).toBe('Inner Text');
    });

    test('clone() should clone all children - jquery-comparison', () => {
        const nqOriginal = nqRoot.find('#original');
        const jqOriginal = jqRoot.find('#original');

        const nqClone = nqOriginal.clone();
        const jqClone = jqOriginal.clone();

        // Count children
        const nqChildCount = nqClone.children().length;
        const jqChildCount = jqClone.children().length;

        expect(nqChildCount).toBe(jqChildCount);
        expect(nqChildCount).toBeGreaterThan(0);
    });

    test('clone() should handle simple elements - jquery-comparison', () => {
        const nqSimple = nqRoot.find('#simple');
        const jqSimple = jqRoot.find('#simple');

        const nqClone = nqSimple.clone();
        const jqClone = jqSimple.clone();

        expect(nqClone.attr('id')).toBe(jqClone.attr('id'));
        expect(nqClone.text()).toBe(jqClone.text());
    });

    test('clone() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqClone = nqEmpty.clone();
        const jqClone = jqEmpty.clone();

        expect(nqClone.length).toBe(jqClone.length);
        expect(nqClone.length).toBe(0);
    });

    test('clone() should allow modifications without affecting original - jquery-comparison', () => {
        const nqOriginal = nqRoot.find('#simple');
        const jqOriginal = jqRoot.find('#simple');

        const nqClone = nqOriginal.clone();
        const jqClone = jqOriginal.clone();

        // Modify clones
        nqClone.attr('data-modified', 'true');
        jqClone.attr('data-modified', 'true');

        // Verify originals are not affected
        expect(nqOriginal.attr('data-modified')).toBeUndefined();
        expect(jqOriginal.attr('data-modified')).toBeUndefined();
    });

    test('clone() should clone multiple elements - jquery-comparison', () => {
        const html = `
      <div class="items">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        const nqItems = nodeQuery.find('.item');
        const jqItems = jquery.find('.item');

        const nqClones = nqItems.clone();
        const jqClones = jqItems.clone();

        expect(nqClones.length).toBe(jqClones.length);
        expect(nqClones.length).toBe(3);
    });

    test('clone() should preserve nested structure - jquery-comparison', () => {
        const html = `
      <div class="outer">
        <div class="middle">
          <div class="inner">Nested</div>
        </div>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);

        const nqOuter = nodeQuery.find('.outer');
        const jqOuter = jquery.find('.outer');

        const nqClone = nqOuter.clone();
        const jqClone = jqOuter.clone();

        expect(nqClone.find('.middle .inner').text()).toBe(jqClone.find('.middle .inner').text());
        expect(nqClone.find('.middle .inner').text()).toBe('Nested');
    });
});
