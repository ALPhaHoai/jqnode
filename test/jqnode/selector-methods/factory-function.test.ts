import $ from '../../../index';
import JQ from '../../../jq';

describe('Factory function with CSS selectors', () => {
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

    test('should handle ID selectors in factory', () => {
        const title = $('#title', root.nodes);
        expect(title.nodes).toHaveLength(1);
        const titleTag = title.nodes[0].tagName && title.nodes[0].tagName.toLowerCase();
        expect(titleTag).toBe('h1');
        const titleId = title.nodes[0].attributes.id;
        expect(titleId).toBe('title');
    });

    test('should handle class selectors in factory', () => {
        const posts = $('.post', root.nodes);
        expect(posts.nodes).toHaveLength(2);
        const allHavePostClass = posts.nodes.every(node => node.attributes.class.includes('post'));
        expect(allHavePostClass).toBe(true);
    });

    test('should handle combined tag and class selectors in factory', () => {
        const featuredPost = $('article.featured', root.nodes);
        expect(featuredPost.nodes).toHaveLength(1);
        const featuredPostTag = featuredPost.nodes[0].tagName && featuredPost.nodes[0].tagName.toLowerCase();
        expect(featuredPostTag).toBe('article');
        const featuredPostClass = featuredPost.nodes[0].attributes.class;
        expect(featuredPostClass).toContain('featured');
    });

    test('should handle combined class and ID selectors in factory', () => {
        const title = $('.title#title', root.nodes);
        expect(title.nodes).toHaveLength(1);
        const titleTag = title.nodes[0].tagName && title.nodes[0].tagName.toLowerCase();
        expect(titleTag).toBe('h1');
        const titleClass = title.nodes[0].attributes.class;
        expect(titleClass).toBe('title');
        const titleId = title.nodes[0].attributes.id;
        expect(titleId).toBe('title');
    });

    test('should return empty result for selectors with no context', () => {
        const result = $('#nonexistent');
        expect(result.nodes).toHaveLength(0);
    });
});
