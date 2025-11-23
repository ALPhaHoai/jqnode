import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { HtmlNode } from '../../../types';

import JQ from '../../../jq';

describe('each() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
      <div class="post" id="main">
        <h1 style="color:red">Hello</h1>
        <p data-info='some info'>World</p>
        <img src="image.jpg" alt='pic'/>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('each() should iterate over all elements in collection - jquery-comparison', () => {
        const nqElements = nqRoot.find('*'); // All elements
        const jqElements = jqRoot.find('*');

        let nqCount = 0;
        let jqCount = 0;
        const nqIndices = [];
        const jqIndices = [];

        nqElements.each(function (index: number, element: HtmlNode) {
            nqCount++;
            nqIndices.push(index);
            expect(element).toBe(this); // 'this' should be the element
        });

        jqElements.each(function (index: number, element: HTMLElement) {
            jqCount++;
            jqIndices.push(index);
            expect(element).toBe(this); // 'this' should be the element
        });

        expect(nqCount).toBe(nqElements.nodes.length);
        expect(jqCount).toBe(jqElements.length);
        expect(nqIndices).toEqual(Array.from({ length: nqCount }, (_, i) => i));
        expect(jqIndices).toEqual(Array.from({ length: jqCount }, (_, i) => i));
    });

    test('each() should support chaining - jquery-comparison', () => {
        const nqElements = nqRoot.find('*');
        const jqElements = jqRoot.find('*');

        const nqResult = nqElements.each(function () {
            // Just iterate without doing anything
        });

        const jqResult = jqElements.each(function () {
            // Just iterate without doing anything
        });

        expect(nqResult).toBe(nqElements); // Should return the same JQ instance
        expect(jqResult).toBe(jqElements); // Should return the same jQuery instance
    });

    test('each() should break iteration when callback returns false - jquery-comparison', () => {
        const nqElements = nqRoot.find('*');
        const jqElements = jqRoot.find('*');

        let nqCount = 0;
        let jqCount = 0;

        nqElements.each(function (index: number) {
            nqCount++;
            if (index === 1) {
                return false; // Break at second element
            }
        });

        jqElements.each(function (index: number) {
            jqCount++;
            if (index === 1) {
                return false; // Break at second element
            }
        });

        expect(nqCount).toBe(2); // Should stop at 2
        expect(jqCount).toBe(2); // Should stop at 2
    });

    test('each() should handle empty collections gracefully - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        let nqCount = 0;
        let jqCount = 0;

        nqEmpty.each(function () {
            nqCount++;
        });

        jqEmpty.each(function () {
            jqCount++;
        });

        expect(nqCount).toBe(0);
        expect(jqCount).toBe(0);
    });

    test('each() should provide correct element references - jquery-comparison', () => {
        const nqElements = nqRoot.find('h1, p, img');
        const jqElements = jqRoot.find('h1, p, img');

        const nqTags = [];
        const jqTags = [];

        nqElements.each(function (index: number, element: HtmlNode) {
            nqTags.push(element.tagName && element.tagName.toLowerCase());
        });

        jqElements.each(function (index: number, element: HTMLElement) {
            jqTags.push(element.tagName.toLowerCase());
        });

        expect(nqTags).toEqual(['h1', 'p', 'img']);
        expect(jqTags).toEqual(['h1', 'p', 'img']);
    });

    test('each() should allow modification of elements - jquery-comparison', () => {
        const nqElements = nqRoot.find('h1, p');
        const jqElements = jqRoot.find('h1, p');

        nqElements.each(function (index: number, element: HtmlNode) {
            element.attributes = element.attributes || {};
            element.attributes['data-index'] = index.toString();
        });

        jqElements.each(function (index: number, element: HTMLElement) {
            jQuery(element).attr('data-index', index.toString());
        });

        // Verify modifications
        expect(nqRoot.find('h1').attr('data-index')).toBe('0');
        expect(jqRoot.find('h1').attr('data-index')).toBe('0');

        expect(nqRoot.find('p').attr('data-index')).toBe('1');
        expect(jqRoot.find('p').attr('data-index')).toBe('1');
    });
});
