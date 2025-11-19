const $ = require('../../index');
const jQuery = require('jquery');
const { createTestDom } = require('../utils/jquery-comparison-helpers');

describe('$.fn Extension Pattern - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot, cleanup;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item" id="item1">Item 1</div>
        <div class="item" id="item2">Item 2</div>
        <div class="item" id="item3">Item 3</div>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery, cleanup: cleanupFn } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
        cleanup = cleanupFn;
    });

    afterEach(() => {
        if (cleanup) cleanup();
    });

    test('$.fn should be defined and point to JQ prototype - jquery-comparison', () => {
        expect($.fn).toBeDefined();
        expect($.fn).toBe(require('../../jq').prototype);

        // jQuery also has $.fn
        expect(jQuery.fn).toBeDefined();
        expect(jQuery.fn).toBe(jQuery.prototype);
    });

    test('should be able to add custom methods using $.fn - jquery-comparison', () => {
        // Add a custom method to both libraries
        $.fn.customHighlight = function (color = 'yellow') {
            return this.attr('data-highlight', color);
        };

        jQuery.fn.customHighlight = function (color = 'yellow') {
            return this.attr('data-highlight', color);
        };

        // Use the custom method
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqResult = nqItems.customHighlight('red');
        const jqResult = jqItems.customHighlight('red');

        // Should return the same instance for chaining
        expect(nqResult).toBe(nqItems);
        expect(jqResult).toBe(jqItems);

        // Should have applied the attribute
        expect(nqRoot.find('#item1').attr('data-highlight')).toBe('red');
        expect(jqRoot.find('#item1').attr('data-highlight')).toBe('red');

        expect(nqRoot.find('#item2').attr('data-highlight')).toBe('red');
        expect(jqRoot.find('#item2').attr('data-highlight')).toBe('red');

        expect(nqRoot.find('#item3').attr('data-highlight')).toBe('red');
        expect(jqRoot.find('#item3').attr('data-highlight')).toBe('red');
    });

    test('custom methods should support chaining - jquery-comparison', () => {
        // Add custom methods to both libraries
        $.fn.addClass = function (className) {
            return this.attr('class', (this.attr('class') || '') + ' ' + className);
        };

        jQuery.fn.addClass = function (className) {
            return this.attr('class', (this.attr('class') || '') + ' ' + className);
        };

        // Chain custom methods with built-in methods
        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqResult = nqItems
            .customHighlight('blue')
            .addClass('highlighted')
            .attr('data-processed', 'true');

        const jqResult = jqItems
            .customHighlight('blue')
            .addClass('highlighted')
            .attr('data-processed', 'true');

        expect(nqResult).toBe(nqItems);
        expect(jqResult).toBe(jqItems);

        // Check results
        const nqFirstItem = nqRoot.find('#item1');
        expect(nqFirstItem.attr('data-highlight')).toBe('blue');
        expect(nqFirstItem.attr('class')).toContain('highlighted');
        expect(nqFirstItem.attr('data-processed')).toBe('true');

        const jqFirstItem = jqRoot.find('#item1');
        expect(jqFirstItem.attr('data-highlight')).toBe('blue');
        expect(jqFirstItem.hasClass('highlighted')).toBe(true);
        expect(jqFirstItem.attr('data-processed')).toBe('true');
    });

    test('custom methods should work with different selectors - jquery-comparison', () => {
        $.fn.markAsSelected = function () {
            return this.attr('data-selected', 'true');
        };

        jQuery.fn.markAsSelected = function () {
            return this.attr('data-selected', 'true');
        };

        // Test with ID selector
        nqRoot.find('#item1').markAsSelected();
        jqRoot.find('#item1').markAsSelected();

        expect(nqRoot.find('#item1').attr('data-selected')).toBe('true');
        expect(jqRoot.find('#item1').attr('data-selected')).toBe('true');

        // Test with class selector
        nqRoot.find('.item').markAsSelected();
        jqRoot.find('.item').markAsSelected();

        // Node-query: check all nodes have the attribute
        nqRoot.find('.item').nodes.forEach(node => {
            expect(node.attributes['data-selected']).toBe('true');
        });

        // jQuery: check all elements have the attribute
        jqRoot.find('.item').each(function() {
            expect(jQuery(this).attr('data-selected')).toBe('true');
        });
    });

    test('custom methods should handle empty collections gracefully - jquery-comparison', () => {
        $.fn.safeOperation = function () {
            return this.attr('data-safe', 'processed');
        };

        jQuery.fn.safeOperation = function () {
            return this.attr('data-safe', 'processed');
        };

        const nqEmptyResult = nqRoot.find('.nonexistent').safeOperation();
        const jqEmptyResult = jqRoot.find('.nonexistent').safeOperation();

        expect(nqEmptyResult.nodes).toHaveLength(0);
        expect(jqEmptyResult.length).toBe(0);
        // Should not throw an error
    });

    test('custom methods should iterate over individual elements when needed - jquery-comparison', () => {
        $.fn.addIndex = function () {
            this.nodes.forEach((node, index) => {
                if (node.attributes) {
                    node.attributes['data-index'] = index.toString();
                }
            });
            return this;
        };

        jQuery.fn.addIndex = function () {
            return this.each(function(index) {
                jQuery(this).attr('data-index', index.toString());
            });
        };

        nqRoot.find('.item').addIndex();
        jqRoot.find('.item').addIndex();

        expect(nqRoot.find('#item1').attr('data-index')).toBe('0');
        expect(jqRoot.find('#item1').attr('data-index')).toBe('0');

        expect(nqRoot.find('#item2').attr('data-index')).toBe('1');
        expect(jqRoot.find('#item2').attr('data-index')).toBe('1');

        expect(nqRoot.find('#item3').attr('data-index')).toBe('2');
        expect(jqRoot.find('#item3').attr('data-index')).toBe('2');
    });

    test('custom methods can return values instead of chaining - jquery-comparison', () => {
        $.fn.count = function () {
            return this.nodes.length;
        };

        jQuery.fn.count = function () {
            return this.length;
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqCount = nqItems.count();
        const jqCount = jqItems.count();

        expect(nqCount).toBe(3);
        expect(jqCount).toBe(3);
        expect(typeof nqCount).toBe('number');
        expect(typeof jqCount).toBe('number');
    });

    test('custom methods can accept multiple parameters - jquery-comparison', () => {
        $.fn.setMultipleAttrs = function (attr1, value1, attr2, value2) {
            return this.attr(attr1, value1).attr(attr2, value2);
        };

        jQuery.fn.setMultipleAttrs = function (attr1, value1, attr2, value2) {
            return this.attr(attr1, value1).attr(attr2, value2);
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqResult = nqItems.setMultipleAttrs('data-type', 'test', 'data-status', 'active');
        const jqResult = jqItems.setMultipleAttrs('data-type', 'test', 'data-status', 'active');

        expect(nqResult).toBe(nqItems);
        expect(jqResult).toBe(jqItems);

        expect(nqRoot.find('#item1').attr('data-type')).toBe('test');
        expect(jqRoot.find('#item1').attr('data-type')).toBe('test');

        expect(nqRoot.find('#item1').attr('data-status')).toBe('active');
        expect(jqRoot.find('#item1').attr('data-status')).toBe('active');
    });

    test('custom methods should maintain proper context binding - jquery-comparison', () => {
        $.fn.getNodeCount = function () {
            return this.nodes.length;
        };

        jQuery.fn.getNodeCount = function () {
            return this.length;
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        // Test that the method is called with correct context
        expect(nqItems.getNodeCount()).toBe(3);
        expect(jqItems.getNodeCount()).toBe(3);

        // Test that 'this' refers to the correct instance
        $.fn.getContextType = function () {
            return this.constructor.className || this.constructor.name;
        };

        jQuery.fn.getContextType = function () {
            return this.constructor.name;
        };

        expect(nqItems.getContextType()).toBe('JQ');
        expect(jqItems.getContextType()).toBe('jQuery'); // jQuery constructor name
    });

    test('custom methods can use built-in JQ methods internally - jquery-comparison', () => {
        $.fn.addAndFind = function (selector) {
            this.attr('data-added', 'true');
            return this.find(selector);
        };

        jQuery.fn.addAndFind = function (selector) {
            this.attr('data-added', 'true');
            return this.find(selector);
        };

        const nqContainer = nqRoot.find('.container');
        const jqContainer = jqRoot.find('.container');

        const nqItems = nqContainer.addAndFind('.item');
        const jqItems = jqContainer.addAndFind('.item');

        expect(nqContainer.attr('data-added')).toBe('true');
        expect(jqContainer.attr('data-added')).toBe('true');

        expect(nqItems.nodes.length).toBe(3);
        expect(jqItems.length).toBe(3);
    });

    test('multiple custom methods can be added and used together - jquery-comparison', () => {
        $.fn.mark = function () {
            return this.attr('data-marked', 'true');
        };

        $.fn.flag = function () {
            return this.attr('data-flagged', 'true');
        };

        $.fn.stamp = function () {
            return this.attr('data-stamped', 'true');
        };

        jQuery.fn.mark = function () {
            return this.attr('data-marked', 'true');
        };

        jQuery.fn.flag = function () {
            return this.attr('data-flagged', 'true');
        };

        jQuery.fn.stamp = function () {
            return this.attr('data-stamped', 'true');
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        nqItems.mark().flag().stamp();
        jqItems.mark().flag().stamp();

        const nqFirstItem = nqRoot.find('#item1');
        const jqFirstItem = jqRoot.find('#item1');

        expect(nqFirstItem.attr('data-marked')).toBe('true');
        expect(jqFirstItem.attr('data-marked')).toBe('true');

        expect(nqFirstItem.attr('data-flagged')).toBe('true');
        expect(jqFirstItem.attr('data-flagged')).toBe('true');

        expect(nqFirstItem.attr('data-stamped')).toBe('true');
        expect(jqFirstItem.attr('data-stamped')).toBe('true');
    });

    test('custom methods can handle callback functions - jquery-comparison', () => {
        $.fn.eachWithCallback = function (callback) {
            this.nodes.forEach((node, index) => {
                callback.call(this, node, index);
            });
            return this;
        };

        jQuery.fn.eachWithCallback = function (callback) {
            this.each(function(index, element) {
                callback.call(this, element, index);
            });
            return this;
        };

        let nqCallCount = 0;
        let jqCallCount = 0;

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        nqItems.eachWithCallback(function (node, index) {
            nqCallCount++;
            if (node.attributes) {
                node.attributes['data-callback-index'] = index.toString();
            }
        });

        jqItems.eachWithCallback(function (element, index) {
            jqCallCount++;
            jQuery(element).attr('data-callback-index', index.toString());
        });

        expect(nqCallCount).toBe(3);
        expect(jqCallCount).toBe(3);

        expect(nqRoot.find('#item1').attr('data-callback-index')).toBe('0');
        expect(jqRoot.find('#item1').attr('data-callback-index')).toBe('0');

        expect(nqRoot.find('#item2').attr('data-callback-index')).toBe('1');
        expect(jqRoot.find('#item2').attr('data-callback-index')).toBe('1');

        expect(nqRoot.find('#item3').attr('data-callback-index')).toBe('2');
        expect(jqRoot.find('#item3').attr('data-callback-index')).toBe('2');
    });

    test('custom methods should work with filtered collections - jquery-comparison', () => {
        $.fn.addFilterMark = function () {
            return this.attr('data-filtered', 'true');
        };

        jQuery.fn.addFilterMark = function () {
            return this.attr('data-filtered', 'true');
        };

        // Add some variety to test filtering
        nqRoot.find('#item1').attr('data-priority', 'high');
        jqRoot.find('#item1').attr('data-priority', 'high');

        nqRoot.find('#item2').attr('data-priority', 'low');
        jqRoot.find('#item2').attr('data-priority', 'low');

        nqRoot.find('#item3').attr('data-priority', 'high');
        jqRoot.find('#item3').attr('data-priority', 'high');

        const nqHighPriority = nqRoot.find('[data-priority="high"]');
        const jqHighPriority = jqRoot.find('[data-priority="high"]');

        nqHighPriority.addFilterMark();
        jqHighPriority.addFilterMark();

        expect(nqRoot.find('#item1').attr('data-filtered')).toBe('true');
        expect(jqRoot.find('#item1').attr('data-filtered')).toBe('true');

        expect(nqRoot.find('#item2').attr('data-filtered')).toBeUndefined();
        expect(jqRoot.find('#item2').attr('data-filtered')).toBeUndefined();

        expect(nqRoot.find('#item3').attr('data-filtered')).toBe('true');
        expect(jqRoot.find('#item3').attr('data-filtered')).toBe('true');
    });

    test('custom methods can return new JQ instances - jquery-comparison', () => {
        $.fn.createNewInstance = function () {
            // Create a new JQ instance with the same nodes
            const newInstance = new (require('../../jq'))(this.nodes.slice());
            return newInstance;
        };

        jQuery.fn.createNewInstance = function () {
            // Create a new jQuery instance with the same elements
            return jQuery(this.get());
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        const nqNewItems = nqItems.createNewInstance();
        const jqNewItems = jqItems.createNewInstance();

        // Method should return different instance
        expect(nqNewItems).not.toBe(nqItems);
        expect(jqNewItems).not.toBe(jqItems);

        // Both should have the same number of elements
        expect(nqNewItems.nodes.length).toBe(nqItems.nodes.length);
        expect(jqNewItems.length).toBe(jqItems.length);

        // Changes to one instance affect both since they share node references (for node-query)
        // and element references (for jQuery)
        nqNewItems.attr('data-new', 'true');
        jqNewItems.attr('data-new', 'true');

        expect(nqItems.attr('data-new')).toBe('true');
        expect(jqItems.attr('data-new')).toBe('true');

        expect(nqNewItems.attr('data-new')).toBe('true');
        expect(jqNewItems.attr('data-new')).toBe('true');
    });

    test('custom methods should handle undefined/null parameters gracefully - jquery-comparison', () => {
        $.fn.safeAttr = function (name, value) {
            if (name && value !== undefined) {
                return this.attr(name, value);
            }
            return this;
        };

        jQuery.fn.safeAttr = function (name, value) {
            if (name && value !== undefined) {
                return this.attr(name, value);
            }
            return this;
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        // Should not throw with undefined parameters
        expect(() => nqItems.safeAttr()).not.toThrow();
        expect(() => jqItems.safeAttr()).not.toThrow();

        expect(() => nqItems.safeAttr('test')).not.toThrow();
        expect(() => jqItems.safeAttr('test')).not.toThrow();

        expect(() => nqItems.safeAttr(null, 'value')).not.toThrow();
        expect(() => jqItems.safeAttr(null, 'value')).not.toThrow();

        expect(() => nqItems.safeAttr('test', null)).not.toThrow();
        expect(() => jqItems.safeAttr('test', null)).not.toThrow();

        // Should work with valid parameters
        nqItems.safeAttr('data-safe', 'true');
        jqItems.safeAttr('data-safe', 'true');

        expect(nqRoot.find('#item1').attr('data-safe')).toBe('true');
        expect(jqRoot.find('#item1').attr('data-safe')).toBe('true');
    });

    test('custom methods can access and modify node properties directly - jquery-comparison', () => {
        $.fn.modifyNodeType = function () {
            this.nodes.forEach(node => {
                if (node.type === 'element') {
                    node.customProperty = 'modified';
                }
            });
            return this;
        };

        jQuery.fn.modifyNodeType = function () {
            return this.each(function() {
                this.customProperty = 'modified';
            });
        };

        const nqItems = nqRoot.find('.item');
        const jqItems = jqRoot.find('.item');

        nqItems.modifyNodeType();
        jqItems.modifyNodeType();

        // Verify the custom property was added to DOM elements
        // For node-query, this modifies the custom node structure
        // For jQuery, this modifies the actual DOM elements
        expect(nqItems.nodes[0].customProperty).toBe('modified');
        expect(jqItems[0].customProperty).toBe('modified');

        expect(nqItems.nodes[1].customProperty).toBe('modified');
        expect(jqItems[1].customProperty).toBe('modified');

        expect(nqItems.nodes[2].customProperty).toBe('modified');
        expect(jqItems[2].customProperty).toBe('modified');
    });

    test('custom methods should work with nested selections - jquery-comparison', () => {
        // Create nested structure within the existing test DOM
        const nestedHtml = `
      <div class="nested-container">
        <div class="level1">
          <div class="level2">
            <span class="level3">Deep</span>
          </div>
        </div>
      </div>
    `;

        // Add to existing root instead of creating new DOM
        nqRoot.find('.container').append($(nestedHtml));
        jqRoot.find('.container').append(jQuery(nestedHtml));

        $.fn.addDepth = function (depth) {
            return this.attr('data-depth', depth);
        };

        jQuery.fn.addDepth = function (depth) {
            return this.attr('data-depth', depth);
        };

        const nqLevel1 = nqRoot.find('.level1');
        const jqLevel1 = jqRoot.find('.level1');

        const nqLevel2 = nqLevel1.find('.level2');
        const jqLevel2 = jqLevel1.find('.level2');

        const nqLevel3 = nqLevel2.find('.level3');
        const jqLevel3 = jqLevel2.find('.level3');

        nqLevel1.addDepth('1');
        jqLevel1.addDepth('1');

        nqLevel2.addDepth('2');
        jqLevel2.addDepth('2');

        nqLevel3.addDepth('3');
        jqLevel3.addDepth('3');

        expect(nqRoot.find('.level1').attr('data-depth')).toBe('1');
        expect(jqRoot.find('.level1').attr('data-depth')).toBe('1');

        expect(nqRoot.find('.level2').attr('data-depth')).toBe('2');
        expect(jqRoot.find('.level2').attr('data-depth')).toBe('2');

        expect(nqRoot.find('.level3').attr('data-depth')).toBe('3');
        expect(jqRoot.find('.level3').attr('data-depth')).toBe('3');
    });

    test('yourFunctionName example method should work for node-query - comparison note', () => {
        // This method only exists in node-query, not in jQuery
        // Capture console.log output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const nqItems = nqRoot.find('.item');
        const nqResult = nqItems.yourFunctionName();

        // Should have logged the correct message
        expect(consoleSpy).toHaveBeenCalledWith('Called yourFunctionName on 3 elements.');

        // Should have added the custom attribute
        nqRoot.find('.item').nodes.forEach(node => {
            expect(node.attributes['data-custom-method-called']).toBe('true');
        });

        // Should return this for chaining
        expect(nqResult).toBe(nqItems);

        consoleSpy.mockRestore();

        // Note: jQuery doesn't have this method - it's node-query specific
        expect(jqRoot.find('.item').yourFunctionName).toBeUndefined();
    });
});
