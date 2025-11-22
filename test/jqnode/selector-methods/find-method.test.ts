import $ from '../../../index';

describe('JQ find() method with CSS selectors', () => {
    let root;

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

    test('should find elements by tag name', () => {
        const articles = root.find('article');
        expect(articles.nodes).toHaveLength(2);
    });

    test('should find elements by ID', () => {
        const title = root.find('#title');
        expect(title.nodes).toHaveLength(1);
        const titleId = title.nodes[0].attributes.id;
        expect(titleId).toBe('title');
    });

    test('should find elements by class', () => {
        const navItems = root.find('.nav-item');
        expect(navItems.nodes).toHaveLength(2);
        const allHaveNavItemClass = navItems.nodes.every(node => node.attributes.class.includes('nav-item'));
        expect(allHaveNavItemClass).toBe(true);
    });

    test('should find elements by multiple classes', () => {
        const featuredPost = root.find('.post.featured');
        expect(featuredPost.nodes).toHaveLength(1);
        const featuredPostClass = featuredPost.nodes[0].attributes.class;
        expect(featuredPostClass).toContain('post');
        expect(featuredPostClass).toContain('featured');
    });

    test('should find elements by tag and class combination', () => {
        const h1Title = root.find('h1.title');
        expect(h1Title.nodes).toHaveLength(1);
        const h1TitleTag = h1Title.nodes[0].tagName && h1Title.nodes[0].tagName.toLowerCase();
        expect(h1TitleTag).toBe('h1');
        const h1TitleClass = h1Title.nodes[0].attributes.class;
        expect(h1TitleClass).toBe('title');
    });

    test('should find elements by class and ID combination', () => {
        const titleElement = root.find('.title#title');
        expect(titleElement.nodes).toHaveLength(1);
        const titleElementClass = titleElement.nodes[0].attributes.class;
        expect(titleElementClass).toBe('title');
        const titleElementId = titleElement.nodes[0].attributes.id;
        expect(titleElementId).toBe('title');
    });

    test('should return empty for non-existent selectors', () => {
        const nonExistent = root.find('#nonexistent');
        expect(nonExistent.nodes).toHaveLength(0);

        const nonExistentClass = root.find('.nonexistent');
        expect(nonExistentClass.nodes).toHaveLength(0);
    });
});
