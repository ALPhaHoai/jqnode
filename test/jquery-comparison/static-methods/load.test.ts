/**
 * Tests for the .load() static method
 */

import $ from '../../../index';
import { HtmlNode } from '../../../types';

describe('$.load()', () => {
    beforeEach(() => {
        $.clearRootNodesRegistry();
    });

    describe('Basic functionality', () => {
        test('should parse HTML string and return JQ instance', () => {
            const html = '<div class="test">Hello</div>';
            const result = $.load(html);

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result.find('.test').text()).toBe('Hello');
        });

        test('should handle complex HTML structures', () => {
            const html = `
                <div class="container">
                    <h1>Title</h1>
                    <p>Paragraph 1</p>
                    <p>Paragraph 2</p>
                </div>
            `;

            const root = $.load(html);

            expect(root.find('h1').text()).toBe('Title');
            expect(root.find('p').length).toBe(2);
            expect(root.find('p').first().text()).toBe('Paragraph 1');
        });

        test('should allow selector queries on loaded HTML', () => {
            const html = `
                <table id="table1">
                    <tr><td>Cell 1</td></tr>
                </table>
                <table id="table2">
                    <tr><td>Cell 2</td></tr>
                </table>
            `;
            const result = $.load(html);
            const tables = result('table');

            expect(tables.length).toBe(2);
            expect(tables.eq(0).attr('id')).toBe('table1');
            expect(tables.eq(1).attr('id')).toBe('table2');
        });
    });

    describe('API response pattern', () => {
        test('should handle API response pattern with optional chaining', () => {
            const result = {
                data: `
                    <div class="product">Product A</div>
                    <div class="product">Product B</div>
                `,
            };

            const root = $.load(result?.data || '');
            const products = root('.product');

            expect(products.length).toBe(2);
            expect(products.first().text()).toBe('Product A');
        });

        test('should handle null or undefined data gracefully', () => {
            const result1 = { data: null };
            const result2 = { data: undefined };
            const result3: { data?: string } = {};

            const root1 = $.load(result1?.data || '');
            const root2 = $.load(result2?.data || '');
            const root3 = $.load(result3?.data || '');

            expect(root1.length).toBe(0);
            expect(root2.length).toBe(0);
            expect(root3.length).toBe(0);
        });

        test('should handle empty string', () => {
            const root = $.load('');
            expect(root.length).toBe(0);
        });
    });

    describe('Table handling', () => {
        test('should find and manipulate tables', () => {
            const html = `
                <table>
                    <thead>
                        <tr><th>Name</th><th>Age</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>John</td><td>30</td></tr>
                        <tr><td>Jane</td><td>25</td></tr>
                    </tbody>
                </table>
            `;

            const root = $.load(html);
            const tables = root('table');
            const headers = tables.find('th');
            const rows = tables.find('tbody tr');

            expect(tables.length).toBe(1);
            expect(headers.length).toBe(2);
            expect(rows.length).toBe(2);
        });

        test('should extract data from multiple tables', () => {
            const html = `
                <table id="users">
                    <tr><td>User 1</td></tr>
                </table>
                <table id="products">
                    <tr><td>Product 1</td></tr>
                </table>
            `;

            const root = $.load(html);
            const userTable = root('#users');
            const productTable = root('#products');

            expect(userTable.attr('id')).toBe('users');
            expect(productTable.attr('id')).toBe('products');
        });
    });

    describe('Equivalence with direct call', () => {
        test('$.load(html) should be equivalent to $(html)', () => {
            const html = '<div class="test">Test</div>';

            const result1 = $.load(html);
            const result2 = $(html);

            expect(result1.length).toBe(result2.length);
            expect(result1.find('.test').text()).toBe(result2.find('.test').text());
        });

        test('should support method chaining', () => {
            const html = '<div><span class="item">A</span><span class="item">B</span></div>';

            const result1 = $.load(html)('.item').first().text();
            const result2 = $(html).find('.item').first().text();

            expect(result1).toBe(result2);
            expect(result1).toBe('A');
        });
    });

    describe('Error handling', () => {
        test('should handle non-string input gracefully', () => {
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result1 = $.load(123 as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result2 = $.load(null as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result3 = $.load(undefined as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result4 = $.load({} as any);

            expect(result1.length).toBe(0);
            expect(result2.length).toBe(0);
            expect(result3.length).toBe(0);
            expect(result4.length).toBe(0);

            expect(consoleWarnSpy).toHaveBeenCalledTimes(4);
            consoleWarnSpy.mockRestore();
        });

        test('should handle malformed HTML', () => {
            const html = '<div><span>Unclosed tags';
            const result = $.load(html);

            // The parser returns empty result for malformed HTML
            expect(result.length).toBe(0);
        });
    });

    describe('Real-world use cases', () => {
        test('should extract table data from HTML response', () => {
            const apiResponse = {
                data: `
                    <html>
                        <body>
                            <table class="data-table">
                                <tr><th>ID</th><th>Name</th></tr>
                                <tr><td>1</td><td>Alice</td></tr>
                                <tr><td>2</td><td>Bob</td></tr>
                            </table>
                        </body>
                    </html>
                `,
            };

            const root = $.load(apiResponse?.data || '');
            const table = root('.data-table');
            const headers = table
                .find('th')
                .map((i: number, th: HtmlNode) => $(th).text())
                .get();
            const rows = table.find('tr:not(:first-child)');

            expect(headers).toEqual(['ID', 'Name']);
            expect(rows.length).toBe(2);
        });

        test('should scrape product information', () => {
            const html = `
                <div class="products">
                    <div class="product" data-id="1" data-price="99.99">
                        <h3>Product A</h3>
                    </div>
                    <div class="product" data-id="2" data-price="149.99">
                        <h3>Product B</h3>
                    </div>
                </div>
            `;

            const root = $.load(html);
            const products = root('.product')
                .map(function (i: number, el: HtmlNode) {
                    const $el = $(el);
                    return {
                        id: $el.attr('data-id'),
                        price: $el.attr('data-price'),
                        name: $el.find('h3').text(),
                    };
                })
                .get();

            expect(products).toEqual([
                { id: '1', price: '99.99', name: 'Product A' },
                { id: '2', price: '149.99', name: 'Product B' },
            ]);
        });
    });
});
