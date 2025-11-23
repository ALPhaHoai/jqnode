import $, { JQ } from '../../index';
import { HtmlNode } from '../../types';

// Augment JQ interface to include custom methods defined in these tests
declare module '../../types' {
    interface JQ {
        customHighlight(color?: string): this;
        markAsSelected(): this;
        safeOperation(): this;
        yourFunctionName(): this;
        addIndex(): this;
        count(): number;
        setMultipleAttrs(attr1: string, value1: string, attr2: string, value2: string): this;
        getNodeCount(): number;
        getContextType(): string;
        addAndFind(selector: string): JQ;
        mark(): this;
        flag(): this;
        stamp(): this;
        eachWithCallback(callback: (node: HtmlNode, index: number) => void): this;
        addFilterMark(): this;
        createNewInstance(): JQ;
        safeAttr(name?: string | null, value?: string | null): this;
        modifyNodeType(): this;
        addDepth(depth: string): this;
    }
}

describe('$.fn Extension Pattern', () => {
    let root: JQ;

    beforeEach(() => {
        const html = `
      <div class="container">
        <div class="item" id="item1">Item 1</div>
        <div class="item" id="item2">Item 2</div>
        <div class="item" id="item3">Item 3</div>
      </div>
    `;
        root = $(html);
    });

    test('$.fn should be defined and point to JQ prototype', () => {
        expect($.fn).toBeDefined();
        expect($.fn).toBe(JQ.prototype);
    });

    test('should be able to add custom methods using $.fn', () => {
        // Add a custom method
        $.fn.customHighlight = function (color = 'yellow') {
            return this.attr('data-highlight', color);
        };

        // Use the custom method
        const items = root.find('.item');
        const result = items.customHighlight('red');

        // Should return the same JQ instance for chaining
        expect(result).toBe(items);

        // Should have applied the attribute
        const item1DataHighlight = root.find('#item1').attr('data-highlight');
        expect(item1DataHighlight).toBe('red');
        const item2DataHighlight = root.find('#item2').attr('data-highlight');
        expect(item2DataHighlight).toBe('red');
        const item3DataHighlight = root.find('#item3').attr('data-highlight');
        expect(item3DataHighlight).toBe('red');
    });

    test('custom methods should support chaining', () => {
        // Add another custom method
        $.fn.addClass = function (className: string) {
            return this.attr('class', (this.attr('class') || '') + ' ' + className);
        };

        // Chain custom methods with built-in methods
        const items = root.find('.item');
        const result = items
            .customHighlight('blue')
            .addClass('highlighted')
            .attr('data-processed', 'true');

        expect(result).toBe(items);

        const firstItem = root.find('#item1');
        expect(firstItem.attr('data-highlight')).toBe('blue');
        expect(firstItem.attr('class')).toContain('highlighted');
        expect(firstItem.attr('data-processed')).toBe('true');
    });

    test('custom methods should work with different selectors', () => {
        $.fn.markAsSelected = function () {
            return this.attr('data-selected', 'true');
        };

        // Test with ID selector
        root.find('#item1').markAsSelected();

        const item1DataSelected = root.find('#item1').attr('data-selected');
        expect(item1DataSelected).toBe('true');

        // Test with class selector
        root.find('.item').markAsSelected();
        root.find('.item').nodes.forEach((node: HtmlNode) => {
            expect($(node).attr('data-selected')).toBe('true');
        });
    });

    test('custom methods should handle empty collections gracefully', () => {
        $.fn.safeOperation = function () {
            return this.attr('data-safe', 'processed');
        };

        const emptyResult = root.find('.nonexistent').safeOperation();
        expect(emptyResult.nodes).toHaveLength(0);
        // Should not throw an error
    });

    test('yourFunctionName example method should work', () => {
        // Capture console.log output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
        });

        const items = root.find('.item');
        const result = items.yourFunctionName();

        // Should have logged the correct message
        expect(consoleSpy).toHaveBeenCalledWith('Called yourFunctionName on 3 elements.');

        // Should have added the custom attribute
        root.find('.item').nodes.forEach((node: HtmlNode) => {
            expect($(node).attr('data-custom-method-called')).toBe('true');
        });

        // Should return this for chaining
        expect(result).toBe(items);

        consoleSpy.mockRestore();
    });

    test('custom methods should iterate over individual elements when needed', () => {
        $.fn.addIndex = function () {
            this.nodes.forEach((node: HtmlNode, index: number) => {
                $(node).attr('data-index', index.toString());
            });
            return this;
        };

        root.find('.item').addIndex();

        const item1DataIndex = root.find('#item1').attr('data-index');
        expect(item1DataIndex).toBe('0');

        const item2DataIndex = root.find('#item2').attr('data-index');
        expect(item2DataIndex).toBe('1');

        const item3DataIndex = root.find('#item3').attr('data-index');
        expect(item3DataIndex).toBe('2');
    });

    test('custom methods can return values instead of chaining', () => {
        $.fn.count = function () {
            return this.nodes.length;
        };

        const items = root.find('.item');
        const count = items.count();

        expect(count).toBe(3);
        expect(typeof count).toBe('number');
    });

    test('custom methods can accept multiple parameters', () => {
        $.fn.setMultipleAttrs = function (attr1: string, value1: string, attr2: string, value2: string) {
            return this.attr(attr1, value1).attr(attr2, value2);
        };

        const items = root.find('.item');
        const result = items.setMultipleAttrs('data-type', 'test', 'data-status', 'active');

        expect(result).toBe(items);
        const item1DataType = root.find('#item1').attr('data-type');
        expect(item1DataType).toBe('test');
        const item1DataStatus = root.find('#item1').attr('data-status');
        expect(item1DataStatus).toBe('active');
    });

    test('custom methods should maintain proper context binding', () => {
        $.fn.getNodeCount = function () {
            return this.nodes.length;
        };

        const items = root.find('.item');

        // Test that the method is called with correct context
        expect(items.getNodeCount()).toBe(3);

        // Test that 'this' refers to the JQ instance
        $.fn.getContextType = function () {
            return this.constructor.className || this.constructor.name;
        };

        expect(items.getContextType()).toBe('JQ');
    });

    test('custom methods can use built-in JQ methods internally', () => {
        $.fn.addAndFind = function (selector: string) {
            this.attr('data-added', 'true');
            return this.find(selector);
        };

        const container = root.find('.container');
        const items = container.addAndFind('.item');

        const containerDataAdded = container.attr('data-added');
        expect(containerDataAdded).toBe('true');

        const itemsNodeCount = items.nodes.length;
        expect(itemsNodeCount).toBe(3);
    });

    test('multiple custom methods can be added and used together', () => {
        $.fn.mark = function () {
            return this.attr('data-marked', 'true');
        };

        $.fn.flag = function () {
            return this.attr('data-flagged', 'true');
        };

        $.fn.stamp = function () {
            return this.attr('data-stamped', 'true');
        };

        const items = root.find('.item');
        items.mark().flag().stamp();

        const firstItem = root.find('#item1');
        expect(firstItem.attr('data-marked')).toBe('true');
        expect(firstItem.attr('data-flagged')).toBe('true');
        expect(firstItem.attr('data-stamped')).toBe('true');
    });

    test('custom methods can handle callback functions', () => {
        $.fn.eachWithCallback = function (callback: (node: HtmlNode, index: number) => void) {
            this.nodes.forEach((node: HtmlNode, index: number) => {
                callback.call(this, node, index);
            });
            return this;
        };

        let callCount = 0;
        const items = root.find('.item');

        items.eachWithCallback(function (node: HtmlNode, index: number) {
            callCount++;
            $(node).attr('data-callback-index', index.toString());
        });

        expect(callCount).toBe(3);

        const item1DataCallbackIndex = root.find('#item1').attr('data-callback-index');
        expect(item1DataCallbackIndex).toBe('0');

        const item2DataCallbackIndex = root.find('#item2').attr('data-callback-index');
        expect(item2DataCallbackIndex).toBe('1');

        const item3DataCallbackIndex = root.find('#item3').attr('data-callback-index');
        expect(item3DataCallbackIndex).toBe('2');
    });

    test('custom methods should work with filtered collections', () => {
        $.fn.addFilterMark = function () {
            return this.attr('data-filtered', 'true');
        };

        // Add some variety to test filtering
        root.find('#item1').attr('data-priority', 'high');
        root.find('#item2').attr('data-priority', 'low');
        root.find('#item3').attr('data-priority', 'high');

        const highPriority = root.find('[data-priority="high"]');
        highPriority.addFilterMark();

        const item1DataFiltered = root.find('#item1').attr('data-filtered');
        expect(item1DataFiltered).toBe('true');

        const item2DataFiltered = root.find('#item2').attr('data-filtered');
        expect(item2DataFiltered).toBeUndefined();

        const item3DataFiltered = root.find('#item3').attr('data-filtered');
        expect(item3DataFiltered).toBe('true');
    });

    test('custom methods can return new JQ instances', () => {
        $.fn.createNewInstance = function () {
            // Create a new JQ instance with the same nodes
            const newInstance = new JQ(this.nodes.slice());
            return newInstance;
        };

        const items = root.find('.item');
        const newItems = items.createNewInstance();

        // Method should return different instance
        expect(newItems).not.toBe(items);

        // Both should have the same nodes
        const newItemsNodeCount = newItems.nodes.length;
        const itemsNodeCount = items.nodes.length;
        expect(newItemsNodeCount).toBe(itemsNodeCount);

        // Both instances should reference the same node objects
        const newItemFirstNode = newItems.nodes[0];
        expect(newItemFirstNode).toBe(items.nodes[0]);

        const newItemSecondNode = newItems.nodes[1];
        expect(newItemSecondNode).toBe(items.nodes[1]);

        const newItemThirdNode = newItems.nodes[2];
        expect(newItemThirdNode).toBe(items.nodes[2]);

        // Changes to one instance affect both since they share node references
        newItems.attr('data-new', 'true');

        const itemsDataNew = items.attr('data-new');
        expect(itemsDataNew).toBe('true');

        const newItemsDataNew = newItems.attr('data-new');
        expect(newItemsDataNew).toBe('true');
    });

    test('custom methods should handle undefined/null parameters gracefully', () => {
        $.fn.safeAttr = function (name: string | null, value: string | null) {
            if (name && value !== undefined) {
                return this.attr(name, value);
            }
            return this;
        };

        const items = root.find('.item');

        // Should not throw with undefined parameters
        expect(() => items.safeAttr()).not.toThrow();
        expect(() => items.safeAttr('test')).not.toThrow();
        expect(() => items.safeAttr(null, 'value')).not.toThrow();
        expect(() => items.safeAttr('test', null)).not.toThrow();

        // Should work with valid parameters
        items.safeAttr('data-safe', 'true');
        const item1DataSafe = root.find('#item1').attr('data-safe');
        expect(item1DataSafe).toBe('true');
    });

    test('custom methods can access and modify node properties directly', () => {
        $.fn.modifyNodeType = function () {
            this.nodes.forEach((node: HtmlNode) => {
                if (node.type === 'element') {
                    if (!node.properties) {
                        node.properties = {};
                    }
                    node.properties.customProperty = 'modified';
                }
            });
            return this;
        };

        const items = root.find('.item');
        items.modifyNodeType();

        // Verify the custom property was added
        const firstItemCustomProperty = items.nodes[0].properties?.customProperty;
        expect(firstItemCustomProperty).toBe('modified');

        const secondItemCustomProperty = items.nodes[1].properties?.customProperty;
        expect(secondItemCustomProperty).toBe('modified');

        const thirdItemCustomProperty = items.nodes[2].properties?.customProperty;
        expect(thirdItemCustomProperty).toBe('modified');
    });

    test('custom methods should work with nested selections', () => {
        // Create nested structure
        const nestedHtml = `
      <div class="level1">
        <div class="level2">
          <span class="level3">Deep</span>
        </div>
      </div>
    `;
        const nestedRoot = $(nestedHtml);

        $.fn.addDepth = function (depth: string) {
            return this.attr('data-depth', depth);
        };

        const level1 = nestedRoot.find('.level1');
        const level2 = level1.find('.level2');
        const level3 = level2.find('.level3');

        level1.addDepth('1');
        level2.addDepth('2');
        level3.addDepth('3');

        const level1Depth = nestedRoot.find('.level1').attr('data-depth');
        expect(level1Depth).toBe('1');

        const level2Depth = nestedRoot.find('.level2').attr('data-depth');
        expect(level2Depth).toBe('2');

        const level3Depth = nestedRoot.find('.level3').attr('data-depth');
        expect(level3Depth).toBe('3');
    });
});
