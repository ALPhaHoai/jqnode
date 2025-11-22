import $ from '../../../../index';

describe('parent() method', () => {
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

    test('parent() should get immediate parent of elements', () => {
        const spans = root.find('span');
        const parents = spans.parent();

        expect(parents.nodes).toHaveLength(2); // Two spans with different parents

        const hasPParent = parents.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'p');
        expect(hasPParent).toBe(true);

        const hasDivParent = parents.nodes.some(node => node.tagName && node.tagName.toLowerCase() === 'div');
        expect(hasDivParent).toBe(true);
    });

    test('parent() should work with selector filter', () => {
        const spans = root.find('span');
        const pParents = spans.parent('p');

        expect(pParents.nodes).toHaveLength(1);
        const pParentTag = pParents.nodes[0].tagName && pParents.nodes[0].tagName.toLowerCase();
        expect(pParentTag).toBe('p');
    });

    test('parent() should return empty for root elements', () => {
        const html = root.find('html');
        const parents = html.parent();

        expect(parents.nodes).toHaveLength(0);
    });

    test('parent() should handle multiple elements with same parent', () => {
        const listItems = root.find('li');
        const parents = listItems.parent();

        expect(parents.nodes).toHaveLength(1); // Both li elements have the same ul parent
        const parentTag = parents.nodes[0].tagName && parents.nodes[0].tagName.toLowerCase();
        expect(parentTag).toBe('ul');
    });
});
