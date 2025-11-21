const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom } = require('../../utils/jquery-comparison-helpers');

describe('css() method - jqnode vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="container" style="padding: 20px">
        <h1 id="title" style="color: red; font-size: 24px">Hello</h1>
        <div class="box" style="width: 100px; height: 100px; background-color: blue">Box</div>
        <p style="font-family: Arial; line-height: 1.5">Text</p>
      </div>
    `;

        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    describe('Getting single CSS property', () => {
        test('should get computed CSS property value - jquery-comparison', () => {
            const nqTitle = nqRoot.find('#title');
            const jqTitle = jqRoot.find('#title');

            // Color property
            expect(nqTitle.css('color')).toBe(jqTitle.css('color'));

            // Font size property
            expect(nqTitle.css('font-size')).toBe(jqTitle.css('font-size'));
        });

        test('should support camelCase property names - jquery-comparison', () => {
            const nqTitle = nqRoot.find('#title');
            const jqTitle = jqRoot.find('#title');

            expect(nqTitle.css('fontSize')).toBe(jqTitle.css('fontSize'));
        });

        test('should support hyphenated property names - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            expect(nqBox.css('background-color')).toBe(jqBox.css('background-color'));
        });

        test('should return undefined for empty selection - jquery-comparison', () => {
            const nqMissing = nqRoot.find('.nonexistent');
            const jqMissing = jqRoot.find('.nonexistent');

            expect(nqMissing.css('color')).toBe(jqMissing.css('color'));
        });
    });

    describe('Getting multiple CSS properties', () => {
        test('should return object for array of properties - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            const nqStyles = nqBox.css(['width', 'height', 'background-color']);
            const jqStyles = jqBox.css(['width', 'height', 'background-color']);

            expect(nqStyles).toEqual(jqStyles);
        });

        test('should handle mixed camelCase and hyphenated names - jquery-comparison', () => {
            const nqPara = nqRoot.find('p');
            const jqPara = jqRoot.find('p');

            const nqStyles = nqPara.css(['font-family', 'lineHeight']);
            const jqStyles = jqPara.css(['font-family', 'lineHeight']);

            expect(nqStyles).toEqual(jqStyles);
        });
    });

    describe('Setting single CSS property', () => {
        test('should set CSS property with string value - jquery-comparison', () => {
            const nqTitle = nqRoot.find('#title');
            const jqTitle = jqRoot.find('#title');

            nqTitle.css('color', 'blue');
            jqTitle.css('color', 'blue');

            expect(nqTitle.css('color')).toBe(jqTitle.css('color'));
        });

        test('should set CSS property with numeric value and add px - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            nqBox.css('width', 200);
            jqBox.css('width', 200);

            expect(nqBox.css('width')).toBe(jqBox.css('width'));
        });

        test('should support camelCase when setting - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            nqBox.css('backgroundColor', 'green');
            jqBox.css('backgroundColor', 'green');

            expect(nqBox.css('background-color')).toBe(jqBox.css('background-color'));
        });

        test('should return JQ instance for chaining - jquery-comparison', () => {
            const nqTitle = nqRoot.find('#title');
            const jqTitle = jqRoot.find('#title');

            const nqResult = nqTitle.css('color', 'purple');
            const jqResult = jqTitle.css('color', 'purple');

            expect(nqResult).toBe(nqTitle);
            expect(jqResult).toBe(jqTitle);
        });
    });

    describe('Setting multiple CSS properties', () => {
        test('should set multiple properties from object - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            nqBox.css({
                width: '150px',
                height: '150px',
                backgroundColor: 'yellow'
            });

            jqBox.css({
                width: '150px',
                height: '150px',
                backgroundColor: 'yellow'
            });

            expect(nqBox.css('width')).toBe(jqBox.css('width'));
            expect(nqBox.css('height')).toBe(jqBox.css('height'));
            expect(nqBox.css('background-color')).toBe(jqBox.css('background-color'));
        });

        test('should support hyphenated names in object - jquery-comparison', () => {
            const nqPara = nqRoot.find('p');
            const jqPara = jqRoot.find('p');

            nqPara.css({
                'font-size': '16px',
                'line-height': '2'
            });

            jqPara.css({
                'font-size': '16px',
                'line-height': '2'
            });

            expect(nqPara.css('font-size')).toBe(jqPara.css('font-size'));
            expect(nqPara.css('line-height')).toBe(jqPara.css('line-height'));
        });

        test('should handle numeric values with auto px - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            nqBox.css({
                width: 250,
                padding: 15,
                margin: 10
            });

            jqBox.css({
                width: 250,
                padding: 15,
                margin: 10
            });

            expect(nqBox.css('width')).toBe(jqBox.css('width'));
            expect(nqBox.css('padding')).toBe(jqBox.css('padding'));
            expect(nqBox.css('margin')).toBe(jqBox.css('margin'));
        });
    });

    describe('Setting with callback function', () => {
        test('should set CSS using callback function - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            nqBox.css('width', function (index, value) {
                return parseInt(value) + 50 + 'px';
            });

            jqBox.css('width', function (index, value) {
                return parseInt(value) + 50 + 'px';
            });

            expect(nqBox.css('width')).toBe(jqBox.css('width'));
        });

        test('should receive correct index in callback - jquery-comparison', () => {
            const html = `
                <div class="item" style="width: 100px">Item 1</div>
                <div class="item" style="width: 100px">Item 2</div>
                <div class="item" style="width: 100px">Item 3</div>
            `;

            const { nodeQuery: nqItems, jquery: jqItems } = createTestDom(html);

            const nqWidths = [];
            const jqWidths = [];

            nqItems.find('.item').css('width', function (index, value) {
                nqWidths.push(index);
                return (parseInt(value) + index * 10) + 'px';
            });

            jqItems.find('.item').css('width', function (index, value) {
                jqWidths.push(index);
                return (parseInt(value) + index * 10) + 'px';
            });

            expect(nqWidths).toEqual(jqWidths);
        });
    });

    describe('Chaining', () => {
        test('should support method chaining - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            const nqResult = nqBox
                .css('width', 200)
                .css('height', 200)
                .css('background-color', 'purple');

            const jqResult = jqBox
                .css('width', 200)
                .css('height', 200)
                .css('background-color', 'purple');

            expect(nqBox.css('width')).toBe(jqBox.css('width'));
            expect(nqBox.css('height')).toBe(jqBox.css('height'));
            expect(nqBox.css('background-color')).toBe(jqBox.css('background-color'));
            expect(nqResult).toBe(nqBox);
            expect(jqResult).toBe(jqBox);
        });
    });

    describe('Setting on multiple elements', () => {
        test('should set style on all matched elements - jquery-comparison', () => {
            const html = `
                <div class="card">Card 1</div>
                <div class="card">Card 2</div>
                <div class="card">Card 3</div>
            `;

            const { nodeQuery: nqCards, jquery: jqCards } = createTestDom(html);

            nqCards.find('.card').css('color', 'red');
            jqCards.find('.card').css('color', 'red');

            nqCards.find('.card').each(function (i) {
                const nqColor = $(this).css('color');
                const jqColor = jqCards.find('.card').eq(i).css('color');
                expect(nqColor).toBe(jqColor);
            });
        });
    });

    describe('Edge cases', () => {
        test('should handle setting on empty selection without error - jquery-comparison', () => {
            const nqMissing = nqRoot.find('.nonexistent');
            const jqMissing = jqRoot.find('.nonexistent');

            expect(() => {
                nqMissing.css('color', 'red');
            }).not.toThrow();

            expect(() => {
                jqMissing.css('color', 'red');
            }).not.toThrow();
        });

        test('should handle opacity (non-px property) - jquery-comparison', () => {
            const nqBox = nqRoot.find('.box');
            const jqBox = jqRoot.find('.box');

            nqBox.css('opacity', 0.5);
            jqBox.css('opacity', 0.5);

            expect(nqBox.css('opacity')).toBe(jqBox.css('opacity'));
        });
    });
});
