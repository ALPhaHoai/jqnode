import $ from '../../../index';
import { HtmlNode } from '../../../types';

describe('css() method - jqnode-specific tests', () => {
    describe('Basic functionality', () => {
        test('should get inline style', () => {
            const html = '<div style="color: red; width: 100px">Test</div>';
            const $div = $(html).find('div');

            expect($div.css('color')).toBe('red');
            expect($div.css('width')).toBe('100px');
        });

        test('should set inline style', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css('color', 'blue');
            expect($div.css('color')).toBe('blue');
        });

        test('should return undefined for empty selection', () => {
            const html = '<div>Test</div>';
            const root = $(html);

            expect(root.find('.missing').css('color')).toBeUndefined();
        });
    });

    describe('Property name conversion', () => {
        test('should convert camelCase to hyphenated', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css('backgroundColor', 'red');
            expect($div.css('background-color')).toBe('red');
        });

        test('should convert hyphenated to camelCase', () => {
            const html = '<div style="background-color: blue">Test</div>';
            const $div = $(html).find('div');

            expect($div.css('backgroundColor')).toBe('blue');
        });
    });

    describe('Auto px conversion', () => {
        test('should add px to numeric width', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css('width', 100);
            expect($div.css('width')).toBe('100px');
        });

        test('should add px to numeric height', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css('height', 50);
            expect($div.css('height')).toBe('50px');
        });

        test('should add px to numeric margin', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css('margin', 10);
            expect($div.css('margin')).toBe('10px');
        });

        test('should add px to numeric padding', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css('padding', 15);
            expect($div.css('padding')).toBe('15px');
        });

        test('should not add px to opacity', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css('opacity', 0.5);
            expect($div.css('opacity')).toBe('0.5');
        });

        test('should not add px to z-index', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css('zIndex', 10);
            expect($div.css('z-index')).toBe('10');
        });
    });

    describe('Getting multiple properties', () => {
        test('should return object with multiple properties', () => {
            const html = '<div style="color: red; width: 100px; height: 50px">Test</div>';
            const $div = $(html).find('div');

            const styles = $div.css(['color', 'width', 'height']);
            expect(styles).toEqual({
                color: 'red',
                width: '100px',
                height: '50px'
            });
        });

        test('should handle empty array', () => {
            const html = '<div style="color: red">Test</div>';
            const $div = $(html).find('div');

            const styles = $div.css([]);
            expect(styles).toEqual({});
        });
    });

    describe('Setting multiple properties', () => {
        test('should set multiple properties from object', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css({
                color: 'red',
                width: '100px',
                height: '50px'
            });

            expect($div.css('color')).toBe('red');
            expect($div.css('width')).toBe('100px');
            expect($div.css('height')).toBe('50px');
        });

        test('should handle numeric values in object', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div.css({
                width: 200,
                height: 100,
                opacity: 0.8
            });

            expect($div.css('width')).toBe('200px');
            expect($div.css('height')).toBe('100px');
            expect($div.css('opacity')).toBe('0.8');
        });
    });

    describe('Callback function', () => {
        test('should use callback return value', () => {
            const html = '<div style="width: 100px">Test</div>';
            const $div = $(html).find('div');

            $div.css('width', function (index: number, value: string) {
                return parseInt(value) + 50 + 'px';
            });

            expect($div.css('width')).toBe('150px');
        });

        test('should receive correct index', () => {
            const html = `
                <div class="box" style="width: 100px">Box 1</div>
                <div class="box" style="width: 100px">Box 2</div>
                <div class="box" style="width: 100px">Box 3</div>
            `;

            const $boxes = $(html).find('.box');
            const indices: number[] = [];

            $boxes.css('width', function (index: number, value: string) {
                indices.push(index);
                return value;
            });

            expect(indices).toEqual([0, 1, 2]);
        });

        test('should receive correct current value', () => {
            const html = '<div style="width: 100px">Test</div>';
            const $div = $(html).find('div');

            let receivedValue;
            $div.css('width', function (index: number, value: string) {
                receivedValue = value;
                return value;
            });

            expect(receivedValue).toBe('100px');
        });
    });

    describe('Chaining', () => {
        test('should return this for chaining', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            const result = $div.css('color', 'red');
            expect(result).toBe($div);
        });

        test('should support multiple chained css calls', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            $div
                .css('color', 'red')
                .css('width', 100)
                .css('height', 50);

            expect($div.css('color')).toBe('red');
            expect($div.css('width')).toBe('100px');
            expect($div.css('height')).toBe('50px');
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
            $items.css('color', 'blue');

            $items.each(function (this: HtmlNode) {
                expect($(this).css('color')).toBe('blue');
            });
        });

        test('should get style from first element only', () => {
            const html = `
                <div class="item" style="color: red">Item 1</div>
                <div class="item" style="color: blue">Item 2</div>
            `;

            const $items = $(html).find('.item');
            expect($items.css('color')).toBe('red'); // First element's color
        });
    });

    describe('Edge cases', () => {
        test('should not throw on empty selection', () => {
            const html = '<div>Test</div>';
            const root = $(html);

            expect(() => {
                root.find('.missing').css('color', 'red');
            }).not.toThrow();
        });

        test('should handle elements without style attribute', () => {
            const html = '<div>Test</div>';
            const $div = $(html).find('div');

            expect(() => {
                $div.css('color', 'red');
            }).not.toThrow();

            expect($div.css('color')).toBe('red');
        });
    });
});
