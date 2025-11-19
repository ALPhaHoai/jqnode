const $ = require('../../../../index');

describe('method chaining with ancestors', () => {
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

    test('should allow chaining after parent()', () => {
        const spans = root.find('span');
        const result = spans.parent().attr('class');

        // Should be able to chain and get attributes from parent elements
        expect(typeof result).toBe('string');
        const resultLength = result.length;
        expect(resultLength).toBeGreaterThan(0);
    });

    test('should allow chaining after parents()', () => {
        const spans = root.find('span');
        const result = spans.parents().find('.content');

        const contentElementsCount = result.nodes.length;
        expect(contentElementsCount).toBeGreaterThan(0);
    });

    test('should allow chaining after closest()', () => {
        const spans = root.find('span');
        const result = spans.closest('article').find('h2');

        const articleTitlesCount = result.nodes.length;
        expect(articleTitlesCount).toBeGreaterThan(0);
    });
});
