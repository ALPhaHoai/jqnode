const $ = require('../../../index');

describe('Edge cases and error handling', () => {
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

    test('should handle empty selectors', () => {
        const result = root.find('');
        expect(result.nodes).toHaveLength(0);
    });

    test('should handle selectors with only #', () => {
        // Invalid selector should throw SyntaxError (jQuery behavior)
        expect(() => root.find('#')).toThrow(SyntaxError);
    });

    test('should handle selectors with only .', () => {
        // Invalid selector should throw SyntaxError (jQuery behavior)
        expect(() => root.find('.')).toThrow(SyntaxError);
    });

    test('should handle selectors with special characters', () => {
        const result = root.find('#special-id!');
        expect(result.nodes).toHaveLength(0);
    });

    test('should handle very long selectors', () => {
        const longId = '#'.padEnd(1000, 'a');
        const result = root.find(longId);
        expect(result.nodes).toHaveLength(0);
    });
});
