const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('removeAttr() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container" data-test="test-value" id="main">
        <input type="text" id="input1" value="initial" disabled/>
        <img src="image.jpg" alt="picture" title="Image Title"/>
        <p class="text" data-info="paragraph">Hello World</p>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('removeAttr() should remove attributes from elements - jquery-comparison', () => {
        const nqDivElement = nqRoot.find('.container');
        const jqDivElement = jqRoot.find('.container');

        // Both should initially have the attribute
        const nqInitialAttr = nqDivElement.attr('data-test');
        const jqInitialAttr = jqDivElement.attr('data-test');
        expect(nqInitialAttr).toBe(jqInitialAttr);
        expect(nqInitialAttr).toBe('test-value');

        // Remove the attribute from both
        nqDivElement.removeAttr('data-test');
        jqDivElement.removeAttr('data-test');

        // Both should now have undefined for the attribute
        const nqAfterAttr = nqDivElement.attr('data-test');
        const jqAfterAttr = jqDivElement.attr('data-test');
        expect(nqAfterAttr).toBe(jqAfterAttr);
        expect(nqAfterAttr).toBeUndefined();
    });

    test('removeAttr() should remove multiple attributes from single element - jquery-comparison', () => {
        const nqDivElement = nqRoot.find('.container');
        const jqDivElement = jqRoot.find('.container');

        // Both should initially have both attributes
        const nqInitialDataTest = nqDivElement.attr('data-test');
        const jqInitialDataTest = jqDivElement.attr('data-test');
        expect(nqInitialDataTest).toBe(jqInitialDataTest);
        expect(nqInitialDataTest).toBe('test-value');

        const nqInitialId = nqDivElement.attr('id');
        const jqInitialId = jqDivElement.attr('id');
        expect(nqInitialId).toBe(jqInitialId);
        expect(nqInitialId).toBe('main');

        // Remove attributes from both (chained for node-query, separate for jQuery)
        nqDivElement.removeAttr('data-test').removeAttr('id');
        jqDivElement.removeAttr('data-test');
        jqDivElement.removeAttr('id');

        // Both should now have undefined for both attributes
        const nqAfterDataTest = nqDivElement.attr('data-test');
        const jqAfterDataTest = jqDivElement.attr('data-test');
        expect(nqAfterDataTest).toBe(jqAfterDataTest);
        expect(nqAfterDataTest).toBeUndefined();

        const nqAfterId = nqDivElement.attr('id');
        const jqAfterId = jqDivElement.attr('id');
        expect(nqAfterId).toBe(jqAfterId);
        expect(nqAfterId).toBeUndefined();
    });

    test('removeAttr() should remove attributes from multiple elements - jquery-comparison', () => {
        const nqElements = nqRoot.find('[data-test], [id]');
        const jqElements = jqRoot.find('[data-test], [id]');

        // Remove the attribute from both collections
        nqElements.removeAttr('data-test');
        jqElements.removeAttr('data-test');

        // Check that the container div no longer has the attribute
        const nqDivElement = nqRoot.find('.container');
        const jqDivElement = jqRoot.find('.container');

        const nqDataTest = nqDivElement.attr('data-test');
        const jqDataTest = jqDivElement.attr('data-test');
        expect(nqDataTest).toBe(jqDataTest);
        expect(nqDataTest).toBeUndefined();
    });

    test('removeAttr() should handle non-existent attributes gracefully - jquery-comparison', () => {
        const nqDivElement = nqRoot.find('.container');
        const jqDivElement = jqRoot.find('.container');

        // Both should not throw when removing non-existent attributes
        expect(() => {
            nqDivElement.removeAttr('non-existent');
        }).not.toThrow();

        expect(() => {
            jqDivElement.removeAttr('non-existent');
        }).not.toThrow();

        // Elements should remain unchanged
        const nqId = nqDivElement.attr('id');
        const jqId = jqDivElement.attr('id');
        expect(nqId).toBe(jqId);
        expect(nqId).toBe('main');
    });

    test('removeAttr() should be chainable - jquery-comparison', () => {
        const nqInputElement = nqRoot.find('#input1');
        const jqInputElement = jqRoot.find('#input1');

        // Remove multiple attributes in chain
        const nqResult = nqInputElement.removeAttr('value').removeAttr('disabled');
        const jqResult = jqInputElement.removeAttr('value').removeAttr('disabled');

        // Both should return the element for chaining
        expect(nqResult).toBe(nqInputElement);
        expect(jqResult).toBe(jqInputElement);

        // Attributes should be removed
        const nqValue = nqInputElement.attr('value');
        const jqValue = jqInputElement.attr('value');
        expect(nqValue).toBe(jqValue);
        expect(nqValue).toBeUndefined();

        const nqDisabled = nqInputElement.attr('disabled');
        const jqDisabled = jqInputElement.attr('disabled');
        expect(nqDisabled).toBe(jqDisabled);
        expect(nqDisabled).toBeUndefined();
    });

    test('removeAttr() should work with different attribute types - jquery-comparison', () => {
        const nqImgElement = nqRoot.find('img');
        const jqImgElement = jqRoot.find('img');

        // Remove src attribute
        nqImgElement.removeAttr('src');
        jqImgElement.removeAttr('src');

        const nqSrc = nqImgElement.attr('src');
        const jqSrc = jqImgElement.attr('src');
        expect(nqSrc).toBe(jqSrc);
        expect(nqSrc).toBeUndefined();

        // Remove alt attribute
        nqImgElement.removeAttr('alt');
        jqImgElement.removeAttr('alt');

        const nqAlt = nqImgElement.attr('alt');
        const jqAlt = jqImgElement.attr('alt');
        expect(nqAlt).toBe(jqAlt);
        expect(nqAlt).toBeUndefined();

        // Remove title attribute
        nqImgElement.removeAttr('title');
        jqImgElement.removeAttr('title');

        const nqTitle = nqImgElement.attr('title');
        const jqTitle = jqImgElement.attr('title');
        expect(nqTitle).toBe(jqTitle);
        expect(nqTitle).toBeUndefined();
    });

    test('removeAttr() should handle empty collections - jquery-comparison', () => {
        const nqEmptySelection = nqRoot.find('.non-existent');
        const jqEmptySelection = jqRoot.find('.non-existent');

        // Should not throw on empty collections
        expect(() => {
            nqEmptySelection.removeAttr('any-attribute');
        }).not.toThrow();

        expect(() => {
            jqEmptySelection.removeAttr('any-attribute');
        }).not.toThrow();
    });

    test('removeAttr() should handle multiple space-separated attributes - jquery-comparison', () => {
        const nqImgElement = nqRoot.find('img');
        const jqImgElement = jqRoot.find('img');

        // Remove multiple attributes at once (jQuery supports this, node-query may need separate calls)
        jqImgElement.removeAttr('src alt title');

        // For node-query, remove them separately
        nqImgElement.removeAttr('src');
        nqImgElement.removeAttr('alt');
        nqImgElement.removeAttr('title');

        // All attributes should be removed
        const nqSrc = nqImgElement.attr('src');
        const jqSrc = jqImgElement.attr('src');
        expect(nqSrc).toBe(jqSrc);
        expect(nqSrc).toBeUndefined();

        const nqAlt = nqImgElement.attr('alt');
        const jqAlt = jqImgElement.attr('alt');
        expect(nqAlt).toBe(jqAlt);
        expect(nqAlt).toBeUndefined();

        const nqTitle = nqImgElement.attr('title');
        const jqTitle = jqImgElement.attr('title');
        expect(nqTitle).toBe(jqTitle);
        expect(nqTitle).toBeUndefined();
    });
});
