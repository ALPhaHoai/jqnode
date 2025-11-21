const $ = require('../../../index');

describe('cssCamel() method - jqnode-specific tests', () => {
    describe('Basic functionality', () => {
        test('should get inline style with camelCase key', () => {
            const html = '<div style="color: red; width: 100px">Test</div>';
            const $div = $(html).find('div');

            expect($div.cssCamel('color')).toBe('red');
            expect($div.cssCamel('width')).toBe('100px');
        });

        test('should get kebab-case property and return value', () => {
            const html = '<div style="background-color: blue">Test</div>';
            const $div = $(html).find('div');

            expect($div.cssCamel('background-color')).toBe('blue');
        });

        test('should get camelCase property and return value', () => {
            const html = '<div style="background-color: blue">Test</div>';
            const $div = $(html).find('div');

            expect($div.cssCamel('backgroundColor')).toBe('blue');
        });

        test('should set inline style with kebab-case property', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('background-color', 'green');
            expect($div.cssCamel('backgroundColor')).toBe('green');
        });

        test('should set inline style with camelCase property', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('backgroundColor', 'yellow');
            expect($div.cssCamel('background-color')).toBe('yellow');
        });

        test('should return undefined for empty selection', () => {
            const html = '<div>Test</div>';
            const root = $(html);

            expect(root.find('.missing').cssCamel('color')).toBeUndefined();
        });
    });

    describe('Property name conversion - camelCase output', () => {
        test('should return camelCase keys when getting multiple properties', () => {
            const html = '<div style="background-color: red; font-size: 16px; margin-top: 10px">Test</div>';
            const $div = $(html).find('div');

            const styles = $div.cssCamel(['background-color', 'font-size', 'margin-top']);

            // Keys should be in camelCase
            expect(styles).toHaveProperty('backgroundColor', 'red');
            expect(styles).toHaveProperty('fontSize', '16px');
            expect(styles).toHaveProperty('marginTop', '10px');

            // Keys should NOT be in kebab-case
            expect(styles).not.toHaveProperty('background-color');
            expect(styles).not.toHaveProperty('font-size');
            expect(styles).not.toHaveProperty('margin-top');
        });

        test('should handle mixed camelCase and kebab-case input properties', () => {
            const html = '<div style="background-color: red; font-size: 16px; padding: 5px">Test</div>';
            const $div = $(html).find('div');

            const styles = $div.cssCamel(['backgroundColor', 'font-size', 'padding']);

            expect(styles).toEqual({
                backgroundColor: 'red',
                fontSize: '16px',
                padding: '5px'
            });
        });

        test('should convert all keys to camelCase in returned object', () => {
            const html = '<div style="border-top-width: 2px; border-bottom-color: blue">Test</div>';
            const $div = $(html).find('div');

            const styles = $div.cssCamel(['border-top-width', 'border-bottom-color']);

            expect(Object.keys(styles)).toEqual(['borderTopWidth', 'borderBottomColor']);
        });
    });

    describe('Auto px conversion', () => {
        test('should add px to numeric width', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('width', 100);
            expect($div.cssCamel('width')).toBe('100px');
        });

        test('should add px to numeric height', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('height', 50);
            expect($div.cssCamel('height')).toBe('50px');
        });

        test('should add px to numeric margin', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('margin', 10);
            expect($div.cssCamel('margin')).toBe('10px');
        });

        test('should add px to numeric padding', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('padding', 15);
            expect($div.cssCamel('padding')).toBe('15px');
        });

        test('should not add px to opacity', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('opacity', 0.5);
            expect($div.cssCamel('opacity')).toBe('0.5');
        });

        test('should not add px to z-index', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('zIndex', 10);
            expect($div.cssCamel('z-index')).toBe('10');
        });
    });

    describe('Getting multiple properties', () => {
        test('should return object with camelCase keys for multiple properties', () => {
            const html = '<div style="color: red; width: 100px; height: 50px">Test</div>';
            const $div = $(html).find('div');

            const styles = $div.cssCamel(['color', 'width', 'height']);
            expect(styles).toEqual({
                color: 'red',
                width: '100px',
                height: '50px'
            });
        });

        test('should handle empty array', () => {
            const html = '<div style="color: red">Test</div>';
            const $div = $(html).find('div');

            const styles = $div.cssCamel([]);
            expect(styles).toEqual({});
        });

        test('should convert kebab-case property names to camelCase in result', () => {
            const html = '<div style="background-color: red; font-size: 14px">Test</div>';
            const $div = $(html).find('div');

            const styles = $div.cssCamel(['background-color', 'font-size']);

            expect(styles.backgroundColor).toBe('red');
            expect(styles.fontSize).toBe('14px');
        });
    });

    describe('Setting multiple properties', () => {
        test('should set multiple properties from object with kebab-case keys', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel({
                'background-color': 'red',
                'font-size': '16px',
                'margin-top': '10px'
            });

            expect($div.cssCamel('backgroundColor')).toBe('red');
            expect($div.cssCamel('fontSize')).toBe('16px');
            expect($div.cssCamel('marginTop')).toBe('10px');
        });

        test('should set multiple properties from object with camelCase keys', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel({
                backgroundColor: 'blue',
                fontSize: '18px',
                paddingLeft: '20px'
            });

            expect($div.cssCamel('backgroundColor')).toBe('blue');
            expect($div.cssCamel('fontSize')).toBe('18px');
            expect($div.cssCamel('paddingLeft')).toBe('20px');
        });

        test('should set multiple properties from object with mixed keys', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel({
                'background-color': 'purple',
                fontSize: '20px',
                'border-width': '2px'
            });

            expect($div.cssCamel('backgroundColor')).toBe('purple');
            expect($div.cssCamel('fontSize')).toBe('20px');
            expect($div.cssCamel('borderWidth')).toBe('2px');
        });

        test('should handle numeric values in object', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel({
                width: 200,
                height: 100,
                opacity: 0.8
            });

            expect($div.cssCamel('width')).toBe('200px');
            expect($div.cssCamel('height')).toBe('100px');
            expect($div.cssCamel('opacity')).toBe('0.8');
        });
    });

    describe('Callback function', () => {
        test('should use callback return value', () => {
            const html = '<div style="width: 100px">Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('width', function (index, value) {
                return parseInt(value) + 50 + 'px';
            });

            expect($div.cssCamel('width')).toBe('150px');
        });

        test('should receive correct index', () => {
            const html = `
                <div class="box" style="width: 100px">Box 1</div>
                <div class="box" style="width: 100px">Box 2</div>
                <div class="box" style="width: 100px">Box 3</div>
            `;

            const $boxes = $(html).find('.box');
            const indices = [];

            $boxes.cssCamel('width', function (index, value) {
                indices.push(index);
                return value;
            });

            expect(indices).toEqual([0, 1, 2]);
        });

        test('should receive correct current value', () => {
            const html = '<div style="width: 100px">Test</div>';
            const $div = $(html).find('div');

            let receivedValue;
            $div.cssCamel('width', function (index, value) {
                receivedValue = value;
                return value;
            });

            expect(receivedValue).toBe('100px');
        });

        test('should work with kebab-case property name in callback', () => {
            const html = '<div style="background-color: red">Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('background-color', function (index, value) {
                return value === 'red' ? 'blue' : 'green';
            });

            expect($div.cssCamel('backgroundColor')).toBe('blue');
        });
    });

    describe('Chaining', () => {
        test('should return this for chaining', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            const result = $div.cssCamel('color', 'red');
            expect(result).toBe($div);
        });

        test('should support multiple chained reactStyle calls', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div
                .cssCamel('color', 'red')
                .cssCamel('width', 100)
                .cssCamel('backgroundColor', 'blue');

            expect($div.cssCamel('color')).toBe('red');
            expect($div.cssCamel('width')).toBe('100px');
            expect($div.cssCamel('backgroundColor')).toBe('blue');
        });

        test('should chain with other jqnode methods', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div
                .cssCamel('color', 'green')
                .attr('data-test', 'value')
                .cssCamel('fontSize', '16px');

            expect($div.cssCamel('color')).toBe('green');
            expect($div.attr('data-test')).toBe('value');
            expect($div.cssCamel('fontSize')).toBe('16px');
        });
    });

    describe('Multiple elements', () => {
        test('should set style on all elements', () => {
            const html = `
                <div class="item">Item 1</div>
                <div class="item">Item 2</div>
                <div class="item">Item 3</div>
            `;

            const $items = $(html).find('.item');
            $items.cssCamel('color', 'blue');

            $items.each(function () {
                expect($(this).cssCamel('color')).toBe('blue');
            });
        });

        test('should get style from first element only', () => {
            const html = `
                <div class="item" style="color: red">Item 1</div>
                <div class="item" style="color: blue">Item 2</div>
            `;

            const $items = $(html).find('.item');
            expect($items.cssCamel('color')).toBe('red'); // First element's color
        });

        test('should set multiple styles on all elements', () => {
            const html = `
                <div class="item">Item 1</div>
                <div class="item">Item 2</div>
            `;

            const $items = $(html).find('.item');
            $items.cssCamel({
                backgroundColor: 'yellow',
                fontSize: '14px'
            });

            $items.each(function () {
                expect($(this).cssCamel('backgroundColor')).toBe('yellow');
                expect($(this).cssCamel('fontSize')).toBe('14px');
            });
        });
    });

    describe('Edge cases', () => {
        test('should not throw on empty selection', () => {
            const html = '<div>Test</div>';
            const root = $(html);

            expect(() => {
                root.find('.missing').cssCamel('color', 'red');
            }).not.toThrow();
        });

        test('should handle elements without style attribute', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            expect(() => {
                $div.cssCamel('color', 'red');
            }).not.toThrow();

            expect($div.cssCamel('color')).toBe('red');
        });

        test('should handle undefined property values', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            expect($div.cssCamel('nonExistentProperty')).toBeUndefined();
        });

        test('should handle complex property names', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('borderTopLeftRadius', '5px');
            expect($div.cssCamel('border-top-left-radius')).toBe('5px');
        });
    });

    describe('React inline style compatibility', () => {
        test('should produce object suitable for React inline styles', () => {
            const html = '<div style="background-color: red; font-size: 16px; margin: 10px">Test</div>';
            const $div = $(html).find('div');

            const reactStyles = $div.cssCamel(['background-color', 'font-size', 'margin']);

            // This object should be directly usable as React inline style
            // <div style={reactStyles}>...</div>
            expect(reactStyles).toEqual({
                backgroundColor: 'red',
                fontSize: '16px',
                margin: '10px'
            });
        });

        test('should handle vendor prefixes correctly', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.cssCamel('webkitTransform', 'rotate(45deg)');
            expect($div.cssCamel('webkitTransform')).toBe('rotate(45deg)');
        });
    });
});
