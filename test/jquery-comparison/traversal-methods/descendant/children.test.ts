import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';
import type { HtmlNode, JQ } from '../../../../types';

describe('children() method - Node-Query vs jQuery Comparison', () => {
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
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('children() should return all immediate children elements - jquery-comparison', () => {
        const nqMainDiv = nqRoot.find('#main');
        const jqMainDiv = jqRoot.find('#main');

        const nqChildren = nqMainDiv.children();
        const jqChildren = jqMainDiv.children();

        // Should return h1, div.content, ul.list (comments are not elements)
        expect(nqChildren.nodes).toHaveLength(3);
        expect(jqChildren.length).toBe(3);

        const nqTags = nqChildren.nodes.map((node: HtmlNode) => node.tagName && node.tagName.toLowerCase());
        const jqTags: string[] = [];
        jqChildren.each((index: number, element: HTMLElement) => {
            jqTags.push(element.tagName.toLowerCase());
        });

        expect(nqTags).toEqual(jqTags);
        expect(nqTags).toEqual(['h1', 'div', 'ul']);

        const nqClasses = nqChildren.nodes.map((node: HtmlNode) => node.attributes?.class);
        const jqClasses: string[] = [];
        jqChildren.each((index: number, element: HTMLElement) => {
            jqClasses.push(element.className);
        });

        expect(nqClasses).toEqual(jqClasses);
        expect(nqClasses).toEqual(['title', 'content', 'list']);
    });

    test('children() should return immediate children only, not grandchildren - jquery-comparison', () => {
        const nqContentDiv = nqRoot.find('.content');
        const jqContentDiv = jqRoot.find('.content');

        const nqChildren = nqContentDiv.children();
        const jqChildren = jqContentDiv.children();

        // Should return p, p, div.nested (not the spans inside nested)
        expect(nqChildren.nodes).toHaveLength(3);
        expect(jqChildren.length).toBe(3);

        const nqTags = nqChildren.nodes.map((node: HtmlNode) => node.tagName && node.tagName.toLowerCase());
        const jqTags: string[] = [];
        jqChildren.each((index: number, element: HTMLElement) => {
            jqTags.push(element.tagName.toLowerCase());
        });

        expect(nqTags).toEqual(jqTags);
        expect(nqTags).toEqual(['p', 'p', 'div']);
    });

    test('children() should filter children by selector - jquery-comparison', () => {
        const nqMainDiv = nqRoot.find('#main');
        const jqMainDiv = jqRoot.find('#main');

        const nqChildren = nqMainDiv.children('div');
        const jqChildren = jqMainDiv.children('div');

        expect(nqChildren.nodes).toHaveLength(1); // Only div.content
        expect(jqChildren.length).toBe(1);

        const nqClass = nqChildren.attr('class');
        const jqClass = jqChildren.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('content');
    });

    test('children() should filter children by class selector - jquery-comparison', () => {
        const nqContentDiv = nqRoot.find('.content');
        const jqContentDiv = jqRoot.find('.content');

        const nqChildren = nqContentDiv.children('.paragraph');
        const jqChildren = jqContentDiv.children('.paragraph');

        expect(nqChildren.nodes).toHaveLength(2);
        expect(jqChildren.length).toBe(2);

        const nqTexts = nqChildren.nodes.map((node: HtmlNode) => node.children?.[0]?.data || '');
        const jqTexts: string[] = [];
        jqChildren.each((index: number, element: HTMLElement) => {
            jqTexts.push(jQuery(element).text());
        });

        expect(nqTexts).toEqual(jqTexts);
        expect(nqTexts).toEqual(['First paragraph', 'Second paragraph']);
    });

    test('children() should work with list elements - jquery-comparison', () => {
        const nqList = nqRoot.find('.list');
        const jqList = jqRoot.find('.list');

        const nqChildren = nqList.children();
        const jqChildren = jqList.children();

        expect(nqChildren.nodes).toHaveLength(3);
        expect(jqChildren.length).toBe(3);

        const nqTags = nqChildren.nodes.map((node: HtmlNode) => node.tagName && node.tagName.toLowerCase());
        const jqTags: string[] = [];
        jqChildren.each((index: number, element: HTMLElement) => {
            jqTags.push(element.tagName.toLowerCase());
        });

        expect(nqTags).toEqual(jqTags);
        expect(nqTags).toEqual(['li', 'li', 'li']);
    });

    test('children() should work with complex selectors - jquery-comparison', () => {
        const nqList = nqRoot.find('.list');
        const jqList = jqRoot.find('.list');

        const nqChildren = nqList.children('.item.special');
        const jqChildren = jqList.children('.item.special');

        expect(nqChildren.nodes).toHaveLength(1);
        expect(jqChildren.length).toBe(1);

        const nqText = nqChildren.text();
        const jqText = jqChildren.text();

        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Item 3');
    });

    test('children() should return empty collection for elements with no children - jquery-comparison', () => {
        const nqParagraph = nqRoot.find('.paragraph').first();
        const jqParagraph = jqRoot.find('.paragraph').first();

        const nqChildren = nqParagraph.children();
        const jqChildren = jqParagraph.children();

        expect(nqChildren.nodes).toHaveLength(0);
        expect(jqChildren.length).toBe(0);
    });

    test('children() should work with chaining - jquery-comparison', () => {
        const nqResult = nqRoot.find('#main').children('div').children('p');
        const jqResult = jqRoot.find('#main').children('div').children('p');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        const nqTexts = nqResult.nodes.map((node: HtmlNode) => node.children?.[0]?.data || '');
        const jqTexts: string[] = [];
        jqResult.each((index: number, element: HTMLElement) => {
            jqTexts.push(jQuery(element).text());
        });

        expect(nqTexts).toEqual(jqTexts);
        expect(nqTexts).toEqual(['First paragraph', 'Second paragraph']);
    });

    test('children() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqChildren = nqEmpty.children();
        const jqChildren = jqEmpty.children();

        expect(nqChildren.nodes).toHaveLength(0);
        expect(jqChildren.length).toBe(0);
    });
});
