import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';
import { HtmlNode } from '../../../../types';

describe('closest() method - Node-Query vs jQuery Comparison', () => {
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

  test('closest() should find element itself if it matches - jquery-comparison', () => {
    const nqArticles = nqRoot.find('article');
    const jqArticles = jqRoot.find('article');

    const nqClosest = nqArticles.closest('article');
    const jqClosest = jqArticles.closest('article');

    expect(nqClosest.nodes).toHaveLength(2);
    expect(jqClosest.length).toBe(2);

    // Should return the articles themselves
    const nqClasses = nqClosest.nodes.map((node: HtmlNode) => node.attributes.class);
    const jqClasses: string[] = [];
    jqClosest.each((index: number, element: any) => {
      jqClasses.push(element.className);
    });

    expect(nqClasses.sort()).toEqual(jqClasses.sort());
    expect(nqClasses).toEqual(['article', 'article']);
  });

  test('closest() should find closest ancestor matching selector - jquery-comparison', () => {
    const nqSpans = nqRoot.find('span');
    const jqSpans = jqRoot.find('span');

    const nqClosest = nqSpans.closest('.article');
    const jqClosest = jqSpans.closest('.article');

    expect(nqClosest.nodes).toHaveLength(1); // Both spans are in the same article, so 1 unique ancestor
    expect(jqClosest.length).toBe(1);

    const nqClasses = nqClosest.nodes.map((node: HtmlNode) => node.attributes.class);
    const jqClasses: string[] = [];
    jqClosest.each((index: number, element: any) => {
      jqClasses.push(element.className);
    });

    expect(nqClasses.sort()).toEqual(jqClasses.sort());
    expect(nqClasses).toEqual(['article']);
  });

  test('closest() should return empty for elements with no matching ancestors - jquery-comparison', () => {
    const nqBody = nqRoot.find('body');
    const jqBody = jqRoot.find('body');

    const nqClosest = nqBody.closest('.nonexistent');
    const jqClosest = jqBody.closest('.nonexistent');

    expect(nqClosest.nodes).toHaveLength(0);
    expect(jqClosest.length).toBe(0);
  });

  test('closest() should work with complex selectors - jquery-comparison', () => {
    const nqInnerSpan = nqRoot.find('.inner-span');
    const jqInnerSpan = jqRoot.find('.inner-span');

    const nqClosest = nqInnerSpan.closest('article.article');
    const jqClosest = jqInnerSpan.closest('article.article');

    expect(nqClosest.nodes).toHaveLength(1);
    expect(jqClosest.length).toBe(1);

    const nqClass = nqClosest.attr('class');
    const jqClass = jqClosest.attr('class');

    expect(nqClass).toBe(jqClass);
    expect(nqClass).toBe('article');
  });

  test('closest() should find closest ancestor with ID - jquery-comparison', () => {
    const nqHighlightSpan = nqRoot.find('.highlight');
    const jqHighlightSpan = jqRoot.find('.highlight');

    const nqClosest = nqHighlightSpan.closest('[id]');
    const jqClosest = jqHighlightSpan.closest('[id]');

    expect(nqClosest.nodes).toHaveLength(1);
    expect(jqClosest.length).toBe(1);

    const nqId = nqClosest.attr('id');
    const jqId = jqClosest.attr('id');

    expect(nqId).toBe(jqId);
    expect(nqId).toBe('content');
  });

  test('closest() should work with multiple elements - jquery-comparison', () => {
    const nqAllSpans = nqRoot.find('span');
    const jqAllSpans = jqRoot.find('span');

    const nqClosest = nqAllSpans.closest('.content, .sidebar');
    const jqClosest = jqAllSpans.closest('.content, .sidebar');

    expect(nqClosest.nodes).toHaveLength(1); // All spans are inside content, so only 1 unique ancestor
    expect(jqClosest.length).toBe(1);

    // Check that we get the content ancestor
    const nqIds = nqClosest.nodes.map((node: HtmlNode) => node.attributes.id).filter(id => id);
    const jqIds: string[] = [];
    jqClosest.each((index: number, element: any) => {
      if (element.id) jqIds.push(element.id);
    });

    expect(nqIds.sort()).toEqual(jqIds.sort());
    expect(nqIds).toEqual(['content']);
  });

  test('closest() should handle empty collections - jquery-comparison', () => {
    const nqEmpty = nqRoot.find('.nonexistent');
    const jqEmpty = jqRoot.find('.nonexistent');

    const nqClosest = nqEmpty.closest('div');
    const jqClosest = jqEmpty.closest('div');

    expect(nqClosest.nodes).toHaveLength(0);
    expect(jqClosest.length).toBe(0);
  });

  test('closest() should work with tag selectors - jquery-comparison', () => {
    const nqTitle = nqRoot.find('.title');
    const jqTitle = jqRoot.find('.title');

    const nqClosest = nqTitle.closest('div');
    const jqClosest = jqTitle.closest('div');

    expect(nqClosest.nodes).toHaveLength(1);
    expect(jqClosest.length).toBe(1);

    const nqId = nqClosest.attr('id');
    const jqId = jqClosest.attr('id');

    expect(nqId).toBe(jqId);
    expect(nqId).toBe('header');
  });
});
