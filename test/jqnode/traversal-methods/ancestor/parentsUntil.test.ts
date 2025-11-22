import $ from '../../../../index';

describe('parentsUntil() method', () => {
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

    test('parentsUntil() should get ancestors until specified selector', () => {
        const innerSpan = root.find('span.inner-span');
        const ancestors = innerSpan.parentsUntil('section');

        // Should include: div.nested, article, but not section or higher

        const hasNestedDiv = ancestors.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'div' && node.attributes.class === 'nested');
        expect(hasNestedDiv).toBe(true);

        const hasArticle = ancestors.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'article');
        expect(hasArticle).toBe(true);

        const hasSection = ancestors.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'section');
        expect(hasSection).toBe(false);
    });

    test('parentsUntil() should work with filter selector', () => {
        const innerSpan = root.find('span.inner-span');
        const ancestors = innerSpan.parentsUntil('section', 'div');

        // Should include only div ancestors until section
        ancestors.nodes.forEach(node => {
            expect(node.tagName && node.tagName.toLowerCase()).toBe('div');
        });

        const hasNestedClass = ancestors.nodes.some(node => node.attributes.class === 'nested');
        expect(hasNestedClass).toBe(true);

        const hasContentClass = ancestors.nodes.some(node => node.attributes.class === 'content');
        expect(hasContentClass).toBe(false); // content div is after section
    });

    test('parentsUntil() should return all ancestors if stop selector not found', () => {
        const innerSpan = root.find('span.inner-span');
        const ancestors = innerSpan.parentsUntil('.non-existent');

        // Should include all ancestors since stop selector doesn't exist
        const ancestorsNodesCount = ancestors.nodes.length;
        expect(ancestorsNodesCount).toBeGreaterThan(3);
    });
});
