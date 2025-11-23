import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../utils/jquery-comparison-helpers';
import { HtmlNode } from '../../../types';

describe('Factory function with CSS selectors - Node-Query vs jQuery Comparison', () => {
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

  test('should handle ID selectors in factory - jquery-comparison', () => {
    const nqTitle = $('#title', nqRoot.nodes);
    const jqTitle = jqRoot.find('#title');

    expect(nqTitle.nodes).toHaveLength(1);
    expect(jqTitle.length).toBe(1);

    const nqTitleTag = nqTitle.nodes[0].tagName && nqTitle.nodes[0].tagName.toLowerCase();
    const jqTitleTag = jqTitle[0].tagName.toLowerCase();

    expect(nqTitleTag).toBe(jqTitleTag);
    expect(nqTitleTag).toBe('h1');

    const nqTitleId = nqTitle.nodes[0].attributes.id;
    const jqTitleId = jqTitle.attr('id');

    expect(nqTitleId).toBe(jqTitleId);
    expect(nqTitleId).toBe('title');
  });

  test('should handle class selectors in factory - jquery-comparison', () => {
    const nqPosts = $('.post', nqRoot.nodes);
    const jqPosts = jqRoot.find('.post');

    expect(nqPosts.nodes).toHaveLength(2);
    expect(jqPosts.length).toBe(2);

    // Verify all have post class
    // Verify all have post class
    nqPosts.each((index: number, element: HtmlNode) => {
      const nqElement = $(element);
      const jqElement = jqPosts.eq(index);
      expect(nqElement.hasClass('post')).toBe(true);
      expect(jqElement.hasClass('post')).toBe(true);
    });
  });

  test('should handle tag selectors in factory - jquery-comparison', () => {
    const nqArticles = $('article', nqRoot.nodes);
    const jqArticles = jqRoot.find('article');

    expect(nqArticles.nodes).toHaveLength(2);
    expect(jqArticles.length).toBe(2);

    const nqTags = nqArticles.nodes.map(node => node.tagName && node.tagName.toLowerCase());
    const jqTags = [];
    jqArticles.each((index: number, element: HTMLElement) => {
      jqTags.push(element.tagName.toLowerCase());
    });

    expect(nqTags.sort()).toEqual(jqTags.sort());
    expect(nqTags).toEqual(['article', 'article']);
  });

  test('should handle attribute selectors in factory - jquery-comparison', () => {
    const nqIdElements = $('[id]', nqRoot.nodes);
    const jqIdElements = jqRoot.find('[id]');

    expect(nqIdElements.nodes).toHaveLength(4); // main, title, post-1, post-2
    expect(jqIdElements.length).toBe(4);
  });

  test('should handle complex selectors in factory - jquery-comparison', () => {
    const nqComplex = $('.post.featured', nqRoot.nodes);
    const jqComplex = jqRoot.find('.post.featured');

    expect(nqComplex.nodes).toHaveLength(1);
    expect(jqComplex.length).toBe(1);

    const nqText = nqComplex.text();
    const jqText = jqComplex.text();

    expect(nqText).toBe(jqText);
    expect(nqText).toBe('\n            First Post\n            Some content here.\n          ');
  });
});
