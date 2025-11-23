import $ from '../../../index';
import JQ from '../../../jq';

describe('Basic selector functionality', () => {
  let root: JQ;

  beforeEach(() => {
    const html = `
      <div id="main" class="container">
        <header class="header">
          <h1 id="title" class="title">Welcome</h1>
          <nav class="nav">
            <ul>
              <li class="nav-item"><a href="#home">Home</a></li>
              <li class="nav-item active"><a href="#about">About</a></li>
            </ul>
          </nav>
        </header>
        <main class="content">
          <article id="post-1" class="post featured">
            <h2>First Post</h2>
            <p>Some content here.</p>
          </article>
          <article id="post-2" class="post">
            <h2>Second Post</h2>
            <p>More content here.</p>
          </article>
        </main>
        <footer class="footer">
          <p>&copy; 2024</p>
        </footer>
      </div>
    `;
    root = $(html);
  });

  describe('Selector specificity and precedence', () => {
    test('should handle elements with multiple classes', () => {
      const activeNavItem = root.find('.nav-item.active');
      expect(activeNavItem.nodes).toHaveLength(1);
      const activeNavItemClass = activeNavItem.nodes[0].attributes?.class;
      expect(activeNavItemClass).toContain('nav-item');
      expect(activeNavItemClass).toContain('active');
    });

    test('should find all elements matching class selector', () => {
      const allNavItems = root.find('.nav-item');
      expect(allNavItems.nodes).toHaveLength(2);
      const firstNavItemClass = allNavItems.nodes[0].attributes?.class;
      expect(firstNavItemClass).toContain('nav-item');
      const secondNavItemClass = allNavItems.nodes[1].attributes?.class;
      expect(secondNavItemClass).toContain('nav-item');
    });
  });

  describe('Advanced selector combinations', () => {
    test('should handle IDs with numbers and hyphens', () => {
      // Add test HTML with special ID patterns
      const specialHtml = `
        <div id="item-1" class="item">
          <span id="sub-item_2" class="sub-item">Test</span>
        </div>
      `;
      const specialRoot = $(specialHtml);

      const hyphenId = specialRoot.find('#item-1');
      expect(hyphenId.nodes).toHaveLength(1);
      const hyphenIdValue = hyphenId.nodes[0].attributes?.id;
      expect(hyphenIdValue).toBe('item-1');

      const underscoreId = specialRoot.find('#sub-item_2');
      expect(underscoreId.nodes).toHaveLength(1);
      const underscoreIdValue = underscoreId.nodes[0].attributes?.id;
      expect(underscoreIdValue).toBe('sub-item_2');
    });

    test('should handle classes with numbers and hyphens', () => {
      const specialHtml = `
        <div class="item-1 highlighted">
          <span class="sub_item_2 active">Test</span>
        </div>
      `;
      const specialRoot = $(specialHtml);

      const hyphenClass = specialRoot.find('.item-1');
      expect(hyphenClass.nodes).toHaveLength(1);

      const underscoreClass = specialRoot.find('.sub_item_2');
      expect(underscoreClass.nodes).toHaveLength(1);
    });

    test('should handle multiple class combinations in different orders', () => {
      const multiClassHtml = `
        <div class="a b c">
          <span class="b c a">First</span>
          <span class="c a b">Second</span>
        </div>
      `;
      const multiClassRoot = $(multiClassHtml);

      const abcSelector = multiClassRoot.find('.a.b.c');
      expect(abcSelector.nodes).toHaveLength(3); // div and both spans have all three classes

      const bcaSelector = multiClassRoot.find('.b.c.a');
      expect(bcaSelector.nodes).toHaveLength(3); // Order shouldn't matter
    });

    test('should handle complex ID and class combinations', () => {
      const complexIdClassHtml = `
        <div id="complex_1-test" class="complex-class primary">
          <span id="simple" class="simple">Simple</span>
          <span class="complex-class secondary">Complex</span>
        </div>
      `;
      const complexRoot = $(complexIdClassHtml);

      // ID with underscore and hyphen
      const complexId = complexRoot.find('#complex_1-test');
      expect(complexId.nodes).toHaveLength(1);

      // Class combinations
      const primaryComplex = complexRoot.find('.complex-class.primary');
      expect(primaryComplex.nodes).toHaveLength(1);

      const secondaryComplex = complexRoot.find('.complex-class.secondary');
      expect(secondaryComplex.nodes).toHaveLength(1);

      // ID and class combination
      const complexIdAndClass = complexRoot.find('#complex_1-test.complex-class');
      expect(complexIdAndClass.nodes).toHaveLength(1);
    });
  });
});
