import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JqElement } from '../../../types';

import JQ from '../../../jq';

describe('find() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<Document>;

    beforeEach(() => {
        const html = `
            <div class="container" id="main">
                <h1 class="title">Main Title</h1>
                <div class="content">
                    <p class="paragraph">First paragraph</p>
                    <p class="paragraph">Second paragraph</p>
                    <div class="nested">
                        <span class="highlight">Highlighted text</span>
                        <span class="normal">Normal text</span>
                    </div>
                </div>
                <ul class="list">
                    <li class="item">Item 1</li>
                    <li class="item">Item 2</li>
                    <li class="item special">Item 3</li>
                </ul>
                <!-- This is a comment -->
            </div>
        `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('find() should locate elements by tag name - jquery-comparison', () => {
        const nqH1Elements = nqRoot.find('h1');
        const jqH1Elements = jqRoot.find('h1');

        // Both libraries find the h1 element (jQuery finds it as a descendant of the container)
        expect(nqH1Elements.nodes).toHaveLength(1);
        expect(nqH1Elements.nodes[0].tagName && nqH1Elements.nodes[0].tagName.toLowerCase()).toBe(
            'h1',
        );
        expect(jqH1Elements.length).toBe(1);
        expect(jqH1Elements[0].tagName.toLowerCase()).toBe('h1');
        expect(nqH1Elements.text()).toBe(jqH1Elements.text());

        const nqPElements = nqRoot.find('p');
        const jqPElements = jqRoot.find('p');

        expect(nqPElements.nodes).toHaveLength(2);
        expect(
            nqPElements.nodes.every(
                (node: JqElement) => node.tagName && node.tagName.toLowerCase() === 'p',
            ),
        ).toBe(true);
        expect(jqPElements.length).toBe(2);
        expect(
            Array.from(jqPElements).every((el: HTMLElement) => el.tagName.toLowerCase() === 'p'),
        ).toBe(true);

        const nqSpanElements = nqRoot.find('span');
        const jqSpanElements = jqRoot.find('span');

        expect(nqSpanElements.nodes).toHaveLength(2);
        expect(
            nqSpanElements.nodes.every(
                (node: JqElement) => node.tagName && node.tagName.toLowerCase() === 'span',
            ),
        ).toBe(true);
        expect(jqSpanElements.length).toBe(2);
        expect(
            Array.from(jqSpanElements).every(
                (el: HTMLElement) => el.tagName.toLowerCase() === 'span',
            ),
        ).toBe(true);
    });

    test('find() should locate nested elements by class - jquery-comparison', () => {
        const nqHighlights = nqRoot.find('.highlight');
        const jqHighlights = jqRoot.find('.highlight');

        expect(nqHighlights.nodes).toHaveLength(1);
        expect(nqHighlights.nodes[0].getAttribute('class')).toBe('highlight');
        expect(nqHighlights.text()).toBe('Highlighted text');

        expect(jqHighlights.length).toBe(1);
        expect(jqHighlights.hasClass('highlight')).toBe(true);
        expect(jqHighlights.text()).toBe('Highlighted text');
    });

    test('find() should locate nested elements by ID - jquery-comparison', () => {
        // Both libraries find the #main element as a descendant
        const nqMain = nqRoot.find('#main');
        const jqMain = jqRoot.find('#main');

        expect(nqMain.nodes).toHaveLength(1);
        expect(nqMain.nodes[0].getAttribute('id')).toBe('main');

        expect(jqMain.length).toBe(1);
        expect(jqMain.attr('id')).toBe('main');
    });

    test('find() should handle complex selectors - jquery-comparison', () => {
        const nqSpecialItems = nqRoot.find('li.special');
        const jqSpecialItems = jqRoot.find('li.special');

        expect(nqSpecialItems.nodes).toHaveLength(1);
        expect(
            nqSpecialItems.nodes[0].tagName && nqSpecialItems.nodes[0].tagName.toLowerCase(),
        ).toBe('li');
        expect(nqSpecialItems.nodes[0].getAttribute('class')).toBe('item special');

        expect(jqSpecialItems.length).toBe(1);
        expect(jqSpecialItems[0].tagName.toLowerCase()).toBe('li');
        expect(jqSpecialItems.hasClass('item')).toBe(true);
        expect(jqSpecialItems.hasClass('special')).toBe(true);
    });

    test('find() should return all matching descendants - jquery-comparison', () => {
        const nqAllItems = nqRoot.find('.item');
        const jqAllItems = jqRoot.find('.item');

        expect(nqAllItems.nodes).toHaveLength(3);
        expect(
            nqAllItems.nodes.every(
                (node: JqElement) =>
                    node.getAttribute('class') && (node.getAttribute('class') as string).includes('item'),
            ),
        ).toBe(true);

        expect(jqAllItems.length).toBe(3);
        jqAllItems.each(function () {
            expect(jQuery(this).hasClass('item')).toBe(true);
        });
    });

    test('find() should return empty result for non-existent selectors - jquery-comparison', () => {
        const nqNonExistent = nqRoot.find('.non-existent');
        const jqNonExistent = jqRoot.find('.non-existent');

        expect(nqNonExistent.nodes).toHaveLength(0);
        expect(jqNonExistent.length).toBe(0);
    });

    test('find() should work with multiple root elements - jquery-comparison', () => {
        const multipleHtml = `
            <div><p>Root 1</p></div>
            <div><p>Root 2</p></div>
        `;

        // Create multiple roots for both libraries
        const nqMultipleRoots = $(multipleHtml);
        const jqMultipleRoots = jQuery(multipleHtml);

        const nqParagraphs = nqMultipleRoots.find('p');
        const jqParagraphs = jqMultipleRoots.find('p');

        expect(nqParagraphs.nodes).toHaveLength(2);
        expect(jqParagraphs.length).toBe(2);
    });

    test('find() should handle nested structures correctly - jquery-comparison', () => {
        const nqNestedDiv = nqRoot.find('.nested');
        const jqNestedDiv = jqRoot.find('.nested');

        expect(nqNestedDiv.nodes).toHaveLength(1);
        expect(jqNestedDiv.length).toBe(1);

        // Find spans within the nested div
        const nqNestedSpans = nqNestedDiv.find('span');
        const jqNestedSpans = jqNestedDiv.find('span');

        expect(nqNestedSpans.nodes).toHaveLength(2);
        expect(jqNestedSpans.length).toBe(2);

        expect(nqNestedSpans.nodes[0].getAttribute('class')).toBe('highlight');
        expect(nqNestedSpans.nodes[1].getAttribute('class')).toBe('normal');

        expect(jqNestedSpans.eq(0).hasClass('highlight')).toBe(true);
        expect(jqNestedSpans.eq(1).hasClass('normal')).toBe(true);
    });
});

