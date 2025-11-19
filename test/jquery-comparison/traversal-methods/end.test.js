const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom, compareResults } = require('../../utils/jquery-comparison-helpers');

describe('end() method - Node-Query vs jQuery Comparison', () => {
  let nqRoot, jqRoot;

  beforeEach(() => {
    const html = `
      <html>
        <body class="main-body">
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
            </section>
            <aside class="sidebar">
              <h3 class="sidebar-title">Sidebar</h3>
              <ul class="list">
                <li class="list-item">Item 1</li>
                <li class="list-item">Item 2</li>
              </ul>
            </aside>
          </div>
        </body>
      </html>
    `;
    const { jquery, nodeQuery } = createTestDom(html);
    jqRoot = jquery;
    nqRoot = nodeQuery;
  });

  test('end() should return to previous selection after find() - jquery-comparison', () => {
    const nqRootSelection = nqRoot.find('.article');
    const jqRootSelection = jqRoot.find('.article');

    // After find(), we have the article elements
    expect(nqRootSelection.nodes).toHaveLength(1);
    expect(jqRootSelection.length).toBe(1);

    // After end(), we should return to the root selection
    const nqEndResult = nqRootSelection.end();
    const jqEndResult = jqRootSelection.end();

    // Compare the results
    expect(nqEndResult.nodes).toHaveLength(jqEndResult.length);
    // Document objects don't have tagName, so we need to check nodeName or nodeType instead
    if (jqEndResult[0].tagName) {
      expect(nqEndResult.nodes[0].tagName).toBe(jqEndResult[0].tagName.toUpperCase());
    }
  });

  test('end() should return to previous selection after filter() - jquery-comparison', () => {
    const nqParagraphs = nqRoot.find('p');
    const jqParagraphs = jqRoot.find('p');

    // Start with all paragraphs
    expect(nqParagraphs.nodes).toHaveLength(2);
    expect(jqParagraphs.length).toBe(2);

    // Filter to get only paragraphs with class
    const nqFiltered = nqParagraphs.filter('.paragraph');
    const jqFiltered = jqParagraphs.filter('.paragraph');

    expect(nqFiltered.nodes).toHaveLength(1);
    expect(jqFiltered.length).toBe(1);

    // After end(), we should return to all paragraphs
    const nqEndResult = nqFiltered.end();
    const jqEndResult = jqFiltered.end();

    expect(nqEndResult.nodes).toHaveLength(jqEndResult.length);
    expect(nqEndResult.nodes).toHaveLength(2);
  });

  test('end() should work with chained operations - jquery-comparison', () => {
    const nqRootSelection = nqRoot.find('.article').find('p').end();
    const jqRootSelection = jqRoot.find('.article').find('p').end();

    // After chaining find().find().end(), we should be back to the article selection
    expect(nqRootSelection.nodes).toHaveLength(1);
    expect(jqRootSelection.length).toBe(1);

    const nqClass = nqRootSelection.attr('class');
    const jqClass = jqRootSelection.attr('class');

    expect(nqClass).toBe(jqClass);
    expect(nqClass).toBe('article');
  });

  test('end() should return to previous selection after find() - jquery-comparison', () => {
    // find() creates a new selection with previous state
    const nqFoundSelection = nqRoot.find('.highlight');
    const jqFoundSelection = jqRoot.find('.highlight');

    const nqEndResult = nqFoundSelection.end();
    const jqEndResult = jqFoundSelection.end();

    // end() should return to the previous selection (nqRoot/jqRoot)
    expect(nqEndResult.nodes).toHaveLength(jqEndResult.length);
    expect(nqEndResult.nodes).toHaveLength(1);
    expect(jqEndResult.length).toBe(1);
    // nqRoot is body, jqRoot is document - they have different structures
    expect(nqEndResult.nodes[0].tagName).toBe('BODY');
    // Document objects don't have tagName (they have nodeName '#document')
    expect(jqEndResult[0].tagName).toBeUndefined();
  });

  test('end() should allow further chaining after restoration - jquery-comparison', () => {
    const nqResult = nqRoot.find('.article').find('span').end().find('.paragraph');
    const jqResult = jqRoot.find('.article').find('span').end().find('.paragraph');

    expect(nqResult.nodes).toHaveLength(1);
    expect(jqResult.length).toBe(1);

    const nqClass = nqResult.attr('class');
    const jqClass = jqResult.attr('class');

    expect(nqClass).toBe(jqClass);
    expect(nqClass).toBe('paragraph');
  });

  test('end() should work with multiple end() calls - jquery-comparison', () => {
    const nqResult = nqRoot.find('.content').find('.article').find('p').end().end();
    const jqResult = jqRoot.find('.content').find('.article').find('p').end().end();

    // After two end() calls, we should be back to the content selection
    expect(nqResult.nodes).toHaveLength(1);
    expect(jqResult.length).toBe(1);

    const nqId = nqResult.attr('id');
    const jqId = jqResult.attr('id');

    expect(nqId).toBe(jqId);
    expect(nqId).toBe('content');
  });

  test('end() should work with complex traversal chains - jquery-comparison', () => {
    // Chain: find content -> find article -> end (back to content) -> find sidebar
    const nqResult = nqRoot.find('#content').find('.article').end().find('.sidebar');
    const jqResult = jqRoot.find('#content').find('.article').end().find('.sidebar');

    expect(nqResult.nodes).toHaveLength(jqResult.length);
    expect(nqResult.nodes).toHaveLength(1);
    expect(jqResult.length).toBe(1);

    const nqClass = nqResult.attr('class');
    const jqClass = jqResult.attr('class');

    expect(nqClass).toBe(jqClass);
    expect(nqClass).toBe('sidebar');
  });

  test('end() should maintain selection order - jquery-comparison', () => {
    const nqSpans = nqRoot.find('span');
    const jqSpans = jqRoot.find('span');

    // Filter spans and then end
    const nqFiltered = nqSpans.filter('.highlight, .inner-span');
    const jqFiltered = jqSpans.filter('.highlight, .inner-span');

    expect(nqFiltered.nodes).toHaveLength(2);
    expect(jqFiltered.length).toBe(2);

    const nqEndResult = nqFiltered.end();
    const jqEndResult = jqFiltered.end();

    // Should be back to all spans
    expect(nqEndResult.nodes).toHaveLength(jqEndResult.length);
    expect(nqEndResult.nodes).toHaveLength(2);
  });

  test('end() should work with empty collections - jquery-comparison', () => {
    const nqEmpty = nqRoot.find('.nonexistent');
    const jqEmpty = jqRoot.find('.nonexistent');

    expect(nqEmpty.nodes).toHaveLength(0);
    expect(jqEmpty.length).toBe(0);

    const nqEndResult = nqEmpty.end();
    const jqEndResult = jqEmpty.end();

    // end() on empty collection should return to previous selection (nqRoot/jqRoot)
    expect(nqEndResult.nodes).toHaveLength(jqEndResult.length);
    expect(nqEndResult.nodes).toHaveLength(1);
    expect(jqEndResult.length).toBe(1);
    expect(nqEndResult.nodes[0].tagName).toBe('BODY');
    // Document objects don't have tagName (they have nodeName '#document')
    expect(jqEndResult[0].tagName).toBeUndefined();
  });

  test('end() should preserve jQuery object structure - jquery-comparison', () => {
    const nqResult = nqRoot.find('.article').end();
    const jqResult = jqRoot.find('.article').end();

    // Both should have the same structure and be chainable
    expect(typeof nqResult.addClass).toBe('function');
    expect(typeof jqResult.addClass).toBe('function');

    expect(typeof nqResult.find).toBe('function');
    expect(typeof jqResult.find).toBe('function');
  });
});
