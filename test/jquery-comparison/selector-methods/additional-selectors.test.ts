import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../utils/jquery-comparison-helpers';

describe('Additional selector tests - Node-Query vs jQuery Comparison', () => {
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

  describe('Complex selector combinations', () => {
    test('should handle tag.class#id combinations - jquery-comparison', () => {
      const complexHtml = `
        <div id="main" class="container primary">
          <article class="post featured" id="article-1">
            <h2 class="title">Title 1</h2>
          </article>
          <article class="post" id="article-2">
            <h2 class="title secondary">Title 2</h2>
          </article>
        </div>
      `;
      const { jquery: jqComplex, nodeQuery: nqComplex } = createTestDom(complexHtml);

      // Test different combination orders
      const nqTagClassId = nqComplex.find('article.post#article-1');
      const jqTagClassId = jqComplex.find('article.post#article-1');

      expect(nqTagClassId.nodes).toHaveLength(1);
      expect(jqTagClassId.length).toBe(1);

      const nqIdClassTag = nqComplex.find('#article-1.post.article');
      const jqIdClassTag = jqComplex.find('#article-1.post.article');

      expect(nqIdClassTag.nodes).toHaveLength(0);
      expect(jqIdClassTag.length).toBe(0);
    });

    test('should handle multiple attribute selectors - jquery-comparison', () => {
      const attrHtml = `
        <div>
          <input type="text" name="username" required>
          <input type="password" name="password" required>
          <input type="email" name="email">
          <input type="text" name="address" required>
        </div>
      `;
      const { jquery: jqAttr, nodeQuery: nqAttr } = createTestDom(attrHtml);

      const nqRequiredTexts = nqAttr.find('input[type="text"][required]');
      const jqRequiredTexts = jqAttr.find('input[type="text"][required]');

      expect(nqRequiredTexts.nodes).toHaveLength(2);
      expect(jqRequiredTexts.length).toBe(2);

      const nqNames = nqRequiredTexts.nodes.map(node => node.attributes.name);
      const jqNames = [];
      jqRequiredTexts.each((index: number, element: HTMLElement) => {
        jqNames.push(element.name);
      });

      expect(nqNames.sort()).toEqual(jqNames.sort());
      expect(nqNames).toEqual(['address', 'username']);
    });

    test('should handle universal selector combinations - jquery-comparison', () => {
      const nqUniversal = nqRoot.find('*[id]');
      const jqUniversal = jqRoot.find('*[id]');

      expect(nqUniversal.nodes).toHaveLength(4); // main, title, post-1, post-2
      expect(jqUniversal.length).toBe(4);
    });

    test('should handle case-sensitive attribute matching - jquery-comparison', () => {
      const caseHtml = `<div data-type="Primary" data-type-case="secondary">Test</div>`;
      const { jquery: jqCase, nodeQuery: nqCase } = createTestDom(caseHtml);

      const nqCaseSensitive = nqCase.find('[data-type="Primary"]');
      const jqCaseSensitive = jqCase.find('[data-type="Primary"]');

      expect(nqCaseSensitive.nodes).toHaveLength(1);
      expect(jqCaseSensitive.length).toBe(1);

      const nqCaseInsensitive = nqCase.find('[data-type="primary"]');
      const jqCaseInsensitive = jqCase.find('[data-type="primary"]');

      expect(nqCaseInsensitive.nodes).toHaveLength(0);
      expect(jqCaseInsensitive.length).toBe(0);
    });
  });

  describe('Selector specificity and edge cases', () => {
    test('should handle selectors with escaped characters - jquery-comparison', () => {
      const escapeHtml = `<div class="test:class">Test</div>`;
      const { jquery: jqEscape, nodeQuery: nqEscape } = createTestDom(escapeHtml);

      const nqEscaped = nqEscape.find('.test\\:class');
      const jqEscaped = jqEscape.find('.test\\:class');

      expect(nqEscaped.nodes).toHaveLength(1);
      expect(jqEscaped.length).toBe(1);
    });

    test('should handle selectors with quotes in attributes - jquery-comparison', () => {
      const quoteHtml = `<div data-value="It's &quot;quoted&quot;">Test</div>`;
      const { jquery: jqQuote, nodeQuery: nqQuote } = createTestDom(quoteHtml);

      const nqQuoted = nqQuote.find('[data-value="It\'s \\"quoted\\""]');
      const jqQuoted = jqQuote.find('[data-value="It\'s \\"quoted\\""]');

      expect(nqQuoted.nodes).toHaveLength(1);
      expect(jqQuoted.length).toBe(1);
    });

    test('should handle very specific selectors - jquery-comparison', () => {
      const nqVerySpecific = nqRoot.find('div#main.container header .nav-item.active');
      const jqVerySpecific = jqRoot.find('div#main.container header .nav-item.active');

      expect(nqVerySpecific.nodes).toHaveLength(1);
      expect(jqVerySpecific.length).toBe(1);

      const nqText = nqVerySpecific.text();
      const jqText = jqVerySpecific.text();

      expect(nqText).toBe(jqText);
      expect(nqText).toBe('About');
    });
  });
});
