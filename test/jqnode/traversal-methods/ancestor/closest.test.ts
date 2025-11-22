import $ from '../../../../index';

describe('closest() method', () => {
    let root;

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
        root = $(html);
    });

    test('closest() should find element itself if it matches', () => {
        const articles = root.find('article');
        const closest = articles.closest('article');

        expect(closest.nodes).toHaveLength(2); // Should find both articles

        const closestNodeTags = closest.nodes.map(node => node.tagName && node.tagName.toLowerCase());
        closestNodeTags.forEach(tag => {
            expect(tag).toBe('article');
        });
    });

    test('closest() should find closest ancestor that matches', () => {
        const innerSpan = root.find('span.inner-span');
        const closest = innerSpan.closest('article');

        expect(closest.nodes).toHaveLength(1);
        const closestTag = closest.nodes[0].tagName && closest.nodes[0].tagName.toLowerCase();
        expect(closestTag).toBe('article');
        const closestArticleClass = closest.nodes[0].attributes.class;
        expect(closestArticleClass).toBe('article');
    });

    test('closest() should return empty if no match found', () => {
        const span = root.find('span.inner-span');
        const closest = span.closest('.non-existent');

        expect(closest.nodes).toHaveLength(0);
    });

    test('closest() should work with complex selectors', () => {
        const innerSpan = root.find('span.inner-span');
        const closest = innerSpan.closest('div.nested');

        expect(closest.nodes).toHaveLength(1);
        const closestTag = closest.nodes[0].tagName && closest.nodes[0].tagName.toLowerCase();
        expect(closestTag).toBe('div');
        const closestNestedClass = closest.nodes[0].attributes.class;
        expect(closestNestedClass).toBe('nested');
    });

    test('closest() should return the closest match, not all matches', () => {
        const innerSpan = root.find('span.inner-span');
        const closest = innerSpan.closest('div');

        // Should return the immediate div.nested, not the higher div.content
        expect(closest.nodes).toHaveLength(1);
        const closestDivClass = closest.nodes[0].attributes.class;
        expect(closestDivClass).toBe('nested');
    });

    test('closest() should handle multiple elements', () => {
        const spans = root.find('span');
        const closest = spans.closest('article');

        // Both spans are within the same article, so should find 1 article
        expect(closest.nodes).toHaveLength(1);
        const closestTag = closest.nodes[0].tagName && closest.nodes[0].tagName.toLowerCase();
        expect(closestTag).toBe('article');
    });

    test('closest() should return empty for empty selector', () => {
        const span = root.find('span.inner-span');
        const closest = span.closest('');

        expect(closest.nodes).toHaveLength(0);
    });

    test('closest() should return empty for undefined selector', () => {
        const span = root.find('span.inner-span');
        const closest = span.closest();

        expect(closest.nodes).toHaveLength(0);
    });
});
