import $ from '../../../../index';

describe('parents() method', () => {
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

    test('parents() should get all ancestors', () => {
        const innerSpan = root.find('span.inner-span');
        const ancestors = innerSpan.parents();

        // Should include: div.nested, article, section, div.content, body, html
        const ancestorsNodesCount = ancestors.nodes.length;
        expect(ancestorsNodesCount).toBeGreaterThan(3);

        const hasNestedDiv = ancestors.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'div' && node.attributes.class === 'nested');
        expect(hasNestedDiv).toBe(true);

        const hasArticle = ancestors.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'article');
        expect(hasArticle).toBe(true);

        const hasSection = ancestors.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'section');
        expect(hasSection).toBe(true);

        const hasBody = ancestors.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'body');
        expect(hasBody).toBe(true);
    });

    test('parents() should work with selector filter', () => {
        const innerSpan = root.find('span.inner-span');
        const divAncestors = innerSpan.parents('div');

        // Should include div.nested, div.content
        const divAncestorsNodesCount = divAncestors.nodes.length;
        expect(divAncestorsNodesCount).toBeGreaterThanOrEqual(2);
        divAncestors.nodes.forEach(node => {
            expect(node.tagName && node.tagName.toLowerCase()).toBe('div');
        });
    });

    test('parents() should return empty for root elements', () => {
        const html = root.find('html');
        const ancestors = html.parents();

        expect(ancestors.nodes).toHaveLength(0);
    });
});
