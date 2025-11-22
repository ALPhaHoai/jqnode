import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('parents() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <html>
        <head>
          <title>Test Page</title>
        </head>
        <body class="main-body">
          <div id="header" class="header">
            <h1 class="title">Main Title</h1>
          </div>
          <div id="content" class="content">
            <section class="section">
              <article class="article">
                <h2 class="article-title">Article 1</h2>
                <p class="paragraph">First paragraph <span class="highlight">with span</span></p>
                <div class="nested">
                  <p class="inner-para">Inner paragraph</p>
                  <span class="inner-span">Inner span</span>
                </div>
              </article>
              <article class="article">
                <h2 class="article-title">Article 2</h2>
                <p class="paragraph">Second paragraph</p>
              </article>
            </section>
            <aside class="sidebar">
              <h3 class="sidebar-title">Sidebar</h3>
              <ul class="list">
                <li class="list-item">Item 1</li>
                <li class="list-item">Item 2</li>
              </ul>
            </aside>
          </div>
          <footer id="footer" class="footer">
            <p class="footer-text">Footer content</p>
          </footer>
        </body>
      </html>
    `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('parents() should get all ancestors of elements - jquery-comparison', () => {
        const nqInnerSpan = nqRoot.find('.inner-span');
        const jqInnerSpan = jqRoot.find('.inner-span');

        const nqParents = nqInnerSpan.parents();
        const jqParents = jqInnerSpan.parents();

        expect(nqParents.nodes).toHaveLength(6); // nested -> article -> section -> content -> body -> html
        expect(jqParents.length).toBe(6);

        // Check the chain of parent tags
        const nqTags = nqParents.nodes.map(node => node.tagName && node.tagName.toLowerCase());
        const jqTags = [];
        jqParents.each((index, element) => {
            jqTags.push(element.tagName.toLowerCase());
        });

        expect(nqTags).toEqual(jqTags);
        expect(nqTags).toEqual(['div', 'article', 'section', 'div', 'body', 'html']);
    });

    test('parents() should filter ancestors with selector - jquery-comparison', () => {
        const nqInnerSpan = nqRoot.find('.inner-span');
        const jqInnerSpan = jqRoot.find('.inner-span');

        const nqParents = nqInnerSpan.parents('div');
        const jqParents = jqInnerSpan.parents('div');

        expect(nqParents.nodes).toHaveLength(2); // nested div and content div
        expect(jqParents.length).toBe(2);

        const nqClasses = nqParents.nodes.map(node => node.attributes.class);
        const jqClasses = [];
        jqParents.each((index, element) => {
            jqClasses.push(element.className);
        });

        expect(nqClasses.sort()).toEqual(jqClasses.sort());
        expect(nqClasses).toEqual(['content', 'nested']);
    });

    test('parents() should work with multiple elements - jquery-comparison', () => {
        const nqSpans = nqRoot.find('span');
        const jqSpans = jqRoot.find('span');

        const nqParents = nqSpans.parents('.article');
        const jqParents = jqSpans.parents('.article');

        expect(nqParents.nodes).toHaveLength(1); // Both highlight and inner-span are in the same article
        expect(jqParents.length).toBe(1);

        // Should get unique parents (no duplicates)
        const nqIds = nqParents.nodes.map(node => node.attributes.class);
        const jqIds = [];
        jqParents.each((index, element) => {
            jqIds.push(element.className);
        });

        expect(nqIds.sort()).toEqual(jqIds.sort());
        expect(nqIds).toEqual(['article']); // Both spans are in the same article, so unique parents
    });

    test('parents() should return empty for root elements - jquery-comparison', () => {
        const nqHtml = nqRoot.find('html');
        const jqHtml = jqRoot.find('html');

        const nqParents = nqHtml.parents();
        const jqParents = jqHtml.parents();

        expect(nqParents.nodes).toHaveLength(0);
        expect(jqParents.length).toBe(0);
    });

    test('parents() should work with ID selector filter - jquery-comparison', () => {
        const nqTitle = nqRoot.find('.title');
        const jqTitle = jqRoot.find('.title');

        const nqParents = nqTitle.parents('#content');
        const jqParents = jqTitle.parents('#content');

        expect(nqParents.nodes).toHaveLength(0); // title is in header, not content
        expect(jqParents.length).toBe(0);
    });

    test('parents() should handle complex selectors - jquery-comparison', () => {
        const nqListItem = nqRoot.find('.list-item');
        const jqListItem = jqRoot.find('.list-item');

        const nqParents = nqListItem.parents('[id]');
        const jqParents = jqListItem.parents('[id]');

        expect(nqParents.nodes).toHaveLength(1); // Only content div has ID
        expect(jqParents.length).toBe(1);

        const nqId = nqParents.attr('id');
        const jqId = jqParents.attr('id');

        expect(nqId).toBe(jqId);
        expect(nqId).toBe('content');
    });

    test('parents() should work with chaining - jquery-comparison', () => {
        const nqSpan = nqRoot.find('.highlight');
        const jqSpan = jqRoot.find('.highlight');

        const nqParents = nqSpan.parents().filter('div');
        const jqParents = jqSpan.parents().filter('div');

        expect(nqParents.nodes).toHaveLength(1); // content div
        expect(jqParents.length).toBe(1);

        const nqClasses = nqParents.nodes.map(node => node.attributes.class);
        const jqClasses = [];
        jqParents.each((index, element) => {
            jqClasses.push(element.className);
        });

        expect(nqClasses.sort()).toEqual(jqClasses.sort());
        expect(nqClasses).toEqual(['content']);
    });

    test('parents() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqParents = nqEmpty.parents();
        const jqParents = jqEmpty.parents();

        expect(nqParents.nodes).toHaveLength(0);
        expect(jqParents.length).toBe(0);
    });
});
