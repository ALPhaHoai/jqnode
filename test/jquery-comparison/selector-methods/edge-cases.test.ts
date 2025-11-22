import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../utils/jquery-comparison-helpers';

describe('Edge cases and error handling - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

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
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('should handle empty selectors - jquery-comparison', () => {
        const nqResult = nqRoot.find('');
        const jqResult = jqRoot.find('');

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('should handle selectors with only # - jquery-comparison', () => {
        // jQuery throws error for selector with only #
        expect(() => nqRoot.find('#')).toThrow(SyntaxError);
        expect(() => jqRoot.find('#')).toThrow();
    });

    test('should handle selectors with only . - jquery-comparison', () => {
        // jQuery throws error for selector with only .
        expect(() => nqRoot.find('.')).toThrow(SyntaxError);
        expect(() => jqRoot.find('.')).toThrow();
    });

    test('should handle invalid selectors gracefully - jquery-comparison', () => {
        // Invalid selector should throw SyntaxError (jQuery behavior)
        expect(() => nqRoot.find('[unclosed')).toThrow(SyntaxError);
        expect(() => jqRoot.find('[unclosed')).toThrow();
    });

    test('should handle selectors with special characters - jquery-comparison', () => {
        const specialHtml = `<div id="test.id" class="test-class">Test</div>`;
        const { jquery: jqSpecial, nodeQuery: nqSpecial } = createTestDom(specialHtml);

        // Test with dots in ID (needs escaping in some contexts)
        const nqResult = nqSpecial.find('#test\\.id');
        const jqResult = jqSpecial.find('#test\\.id');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('should handle non-existent selectors - jquery-comparison', () => {
        const nqResult = nqRoot.find('.nonexistent-class');
        const jqResult = jqRoot.find('.nonexistent-class');

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('should handle selectors with whitespace - jquery-comparison', () => {
        const nqResult = nqRoot.find(' .container ');
        const jqResult = jqRoot.find(' .container ');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('should handle extremely long selectors - jquery-comparison', () => {
        const longSelector = '.container '.repeat(50) + '.container';
        const nqResult = nqRoot.find(longSelector);
        const jqResult = jqRoot.find(longSelector);

        // Should handle gracefully without crashing
        expect(nqResult.nodes).toHaveLength(0); // No deeply nested .container
        expect(jqResult.length).toBe(0);
    });
});
