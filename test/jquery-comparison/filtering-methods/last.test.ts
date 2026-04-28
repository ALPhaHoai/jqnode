import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JQ } from '../../../index';

describe('last() method - Node-Query vs jQuery Comparison', () => {
    let elements: JQ, jqElements: JQuery<HTMLElement>;

    beforeEach(() => {
        const html = `
            <div class="item">First</div>
            <div class="item">Second</div>
            <div class="item">Third</div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqElements = jquery.find('.item');
        elements = nodeQuery.find('.item');
    });

    test('last() should select the last element from multiple elements - jquery-comparison', () => {
        const nqResult = elements.last();
        const jqResult = jqElements.last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Third');
    });

    test('last() should select the last element from single element - jquery-comparison', () => {
        const html = `<div class="item">Only One</div>`;
        const { jquery: jqSingle, nodeQuery: nqSingle } = createTestDom(html);
        const nqSingleElement = nqSingle.find('.item');
        const jqSingleElement = jqSingle.find('.item');

        const nqResult = nqSingleElement.last();
        const jqResult = jqSingleElement.last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Only One');
    });

    test('last() should return empty result when called on empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.last();
        const jqResult = jqEmptyCollection.last();

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('last() should work with different element types - jquery-comparison', () => {
        const html = `
            <h1>Title</h1>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
            <div>Div</div>
        `;
        const { jquery: jqMixed, nodeQuery: nqMixed } = createTestDom(html);
        const nqMixedElements = nqMixed.find('p, h1, div');
        const jqMixedElements = jqMixed.find('p, h1, div');

        const nqResult = nqMixedElements.last();
        const jqResult = jqMixedElements.last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqTag = nqResult.nodes[0].tagName && nqResult.nodes[0].tagName.toLowerCase();
        const jqTag = jqResult[0].tagName.toLowerCase();

        expect(nqTag).toBe(jqTag);
        expect(nqTag).toBe('div');

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Div');
    });

    test('last() should return last element after filtering - jquery-comparison', () => {
        const html = `
            <div class="item" data-id="1">First</div>
            <div class="item" data-id="2">Second</div>
            <div class="item" data-id="3">Third</div>
        `;
        const { jquery: jqTest, nodeQuery: nqTest } = createTestDom(html);
        const nqTestElements = nqTest.find('.item');
        const jqTestElements = jqTest.find('.item');

        const nqResult = nqTestElements.last();
        const jqResult = jqTestElements.last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqDataId = nqResult.attr('data-id');
        const jqDataId = jqResult.attr('data-id');

        expect(nqDataId).toBe(jqDataId);
        expect(nqDataId).toBe('3');
    });

    test('last() should work with larger collections - jquery-comparison', () => {
        const html = `
            <div class="item">1</div>
            <div class="item">2</div>
            <div class="item">3</div>
            <div class="item">4</div>
            <div class="item">5</div>
        `;
        const { jquery: jqLarge, nodeQuery: nqLarge } = createTestDom(html);
        const nqLargeElements = nqLarge.find('.item');
        const jqLargeElements = jqLarge.find('.item');

        const nqResult = nqLargeElements.last();
        const jqResult = jqLargeElements.last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('5');
    });

    test('last() should work with chaining - last() after filter() - jquery-comparison', () => {
        const html = `
            <div class="item active">Active 1</div>
            <div class="item inactive">Inactive</div>
            <div class="item active">Active 2</div>
        `;
        const { jquery: jqChain, nodeQuery: nqChain } = createTestDom(html);
        const nqChainElements = nqChain.find('.item');
        const jqChainElements = jqChain.find('.item');

        const nqResult = nqChainElements.filter('.active').last();
        const jqResult = jqChainElements.filter('.active').last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Active 2');
    });

    test('last() should work with chaining - last() after slice() - jquery-comparison', () => {
        const html = `
            <div class="item">1</div>
            <div class="item">2</div>
            <div class="item">3</div>
            <div class="item">4</div>
        `;
        const { jquery: jqSlice, nodeQuery: nqSlice } = createTestDom(html);
        const nqSliceElements = nqSlice.find('.item');
        const jqSliceElements = jqSlice.find('.item');

        const nqResult = nqSliceElements.slice(0, 2).last(); // Slice gives 1, 2; last() gives 2
        const jqResult = jqSliceElements.slice(0, 2).last(); // Slice gives 1, 2; last() gives 2

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('2');
    });

    test('last() should preserve all element attributes - jquery-comparison', () => {
        const html = `<div class="item" id="last" data-value="456" title="Test">Content</div>`;
        const { jquery: jqAttr, nodeQuery: nqAttr } = createTestDom(html);
        const nqAttrElements = nqAttr.find('.item');
        const jqAttrElements = jqAttr.find('.item');

        const nqResult = nqAttrElements.last();
        const jqResult = jqAttrElements.last();

        expect(nqResult.attr('id')).toBe(jqResult.attr('id'));
        expect(nqResult.attr('id')).toBe('last');

        expect(nqResult.attr('data-value')).toBe(jqResult.attr('data-value'));
        expect(nqResult.attr('data-value')).toBe('456');

        expect(nqResult.attr('title')).toBe(jqResult.attr('title'));
        expect(nqResult.attr('title')).toBe('Test');

        expect(nqResult.attr('class')).toBe(jqResult.attr('class'));
        expect(nqResult.attr('class')).toBe('item');
    });

    test('last() should return new collection instance - jquery-comparison', () => {
        const html = `<div class="item">Test</div>`;
        const { jquery: jqInst, nodeQuery: nqInst } = createTestDom(html);
        const nqInstElements = nqInst.find('.item');
        const jqInstElements = jqInst.find('.item');

        const nqResult = nqInstElements.last();
        const jqResult = jqInstElements.last();

        expect(nqResult).not.toBe(nqInstElements);
        expect(jqResult).not.toBe(jqInstElements);

        expect(nqResult.nodes).not.toBe(nqInstElements.nodes);
        expect(nqResult.nodes.length).toBe(1);
        expect(jqResult.length).toBe(1);

        expect(nqResult.nodes[0]).toBe(nqInstElements.nodes[0]);
    });

    test('last() should work after multiple chaining operations - jquery-comparison', () => {
        const html = `
            <div class="item active priority">Priority 1</div>
            <div class="item inactive priority">Priority 2</div>
            <div class="item active normal">Normal 1</div>
            <div class="item active priority">Priority 3</div>
        `;
        const { jquery: jqMulti, nodeQuery: nqMulti } = createTestDom(html);
        const nqMultiElements = nqMulti.find('.item');
        const jqMultiElements = jqMulti.find('.item');

        // Chain: filter -> slice -> last
        const nqResult = nqMultiElements.filter('.active').slice(1, 3).last();
        const jqResult = jqMultiElements.filter('.active').slice(1, 3).last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Priority 3');

        const nqHasPriority = nqResult.hasClass('priority');
        const jqHasPriority = jqResult.hasClass('priority');

        expect(nqHasPriority).toBe(jqHasPriority);
        expect(nqHasPriority).toBe(true);
    });

    test('last() should work with self-closing tags - jquery-comparison', () => {
        const html = `
            <input class="field" type="text" value="first">
            <input class="field" type="text" value="last">
        `;
        const { jquery: jqInput, nodeQuery: nqInput } = createTestDom(html);
        const nqInputElements = nqInput.find('.field');
        const jqInputElements = jqInput.find('.field');

        const nqResult = nqInputElements.last();
        const jqResult = jqInputElements.last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqValue = nqResult.attr('value');
        const jqValue = jqResult.val();

        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBe('last');

        const nqType = nqResult.attr('type');
        const jqType = jqResult.attr('type');

        expect(nqType).toBe(jqType);
        expect(nqType).toBe('text');
    });

    test('last() should work with mixed content (text and elements) - jquery-comparison', () => {
        const html = `
            <div class="item">First item</div>
            <div class="item">Text <span>span</span> more text</div>
        `;
        const { jquery: jqMixedContent, nodeQuery: nqMixedContent } = createTestDom(html);
        const nqMixedElements = nqMixedContent.find('.item');
        const jqMixedElements = jqMixedContent.find('.item');

        const nqResult = nqMixedElements.last();
        const jqResult = jqMixedElements.last();

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text();
        const jqText = jqResult.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Text span more text');

        const nqSpan = nqResult.find('span');
        const jqSpan = jqResult.find('span');

        const nqSpanText = nqSpan.text();
        const jqSpanText = jqSpan.text();

        expect(nqSpanText).toBe(jqSpanText);
        expect(nqSpanText).toBe('span');
    });
});
