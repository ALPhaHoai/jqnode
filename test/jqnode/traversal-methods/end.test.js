const $ = require('../../../index');

describe('end() method', () => {
    let root;

    beforeEach(() => {
        $.clearRootNodesRegistry();
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
        root = $(html);
    });

    test('end() should return to previous selection after find()', () => {
        const articleSelection = root.find('.article');

        // After find(), we have the article elements
        expect(articleSelection.nodes).toHaveLength(1);

        // After end(), we should return to the root selection
        const endResult = articleSelection.end();

        // Should return to the original root selection
        expect(endResult.nodes).toHaveLength(1);
        expect(endResult.nodes[0].tagName).toBe('HTML');
    });

    test('end() should return to previous selection after filter()', () => {
        const paragraphs = root.find('p');

        // Start with all paragraphs
        expect(paragraphs.nodes).toHaveLength(2);

        // Filter to get only paragraphs with class
        const filtered = paragraphs.filter('.paragraph');
        expect(filtered.nodes).toHaveLength(1);

        // After end(), we should return to all paragraphs
        const endResult = filtered.end();
        expect(endResult.nodes).toHaveLength(2);
    });

    test('end() should work with chained operations', () => {
        const result = root.find('.article').find('p').end();

        // After chaining find().find().end(), we should be back to the article selection
        expect(result.nodes).toHaveLength(1);
        expect(result.attr('class')).toBe('article');
    });

    test('end() should return to previous selection after find()', () => {
        // find() creates a new selection with previous state
        const foundSelection = root.find('.highlight');

        const endResult = foundSelection.end();

        // end() should return to the previous selection (root)
        expect(endResult.nodes).toHaveLength(1);
        expect(endResult.nodes[0].tagName).toBe('HTML');
    });

    test('end() should allow further chaining after restoration', () => {
        const result = root.find('.article').find('span').end().find('.paragraph');

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('class')).toBe('paragraph');
    });

    test('end() should work with multiple end() calls', () => {
        const result = root.find('.content').find('.article').find('p').end().end();

        // After two end() calls, we should be back to the content selection
        expect(result.nodes).toHaveLength(1);
        expect(result.attr('id')).toBe('content');
    });

    test('end() should work with complex traversal chains', () => {
        // Chain: find content -> find article -> end (back to content) -> find sidebar
        const result = root.find('#content').find('.article').end().find('.sidebar');

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('class')).toBe('sidebar');
    });

    test('end() should maintain selection order', () => {
        const spans = root.find('span');

        // Filter spans and then end
        const filtered = spans.filter('.highlight, .inner-span');
        expect(filtered.nodes).toHaveLength(2);

        const endResult = filtered.end();

        // Should be back to all spans
        expect(endResult.nodes).toHaveLength(2);
    });

    test('end() should work with empty collections', () => {
        const empty = root.find('.nonexistent');
        expect(empty.nodes).toHaveLength(0);

        const endResult = empty.end();

        // end() on empty collection should return to previous selection (root)
        expect(endResult.nodes).toHaveLength(1);
        expect(endResult.nodes[0].tagName).toBe('HTML');
    });

    test('end() should preserve jQuery object structure', () => {
        const result = root.find('.article').end();

        // Should have the same methods available
        expect(typeof result.addClass).toBe('function');
        expect(typeof result.find).toBe('function');
        expect(typeof result.end).toBe('function');
    });
});
