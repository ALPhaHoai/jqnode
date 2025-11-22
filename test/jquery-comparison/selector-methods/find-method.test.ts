import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../utils/jquery-comparison-helpers';

describe('JQ find() method with CSS selectors - Node-Query vs jQuery Comparison', () => {
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

    test('should find elements by tag name - jquery-comparison', () => {
        const nqArticles = nqRoot.find('article');
        const jqArticles = jqRoot.find('article');

        expect(nqArticles.nodes).toHaveLength(2);
        expect(jqArticles.length).toBe(2);
    });

    test('should find elements by ID - jquery-comparison', () => {
        const nqTitle = nqRoot.find('#title');
        const jqTitle = jqRoot.find('#title');

        expect(nqTitle.nodes).toHaveLength(1);
        expect(jqTitle.length).toBe(1);

        const nqTitleId = nqTitle.attr('id');
        const jqTitleId = jqTitle.attr('id');

        expect(nqTitleId).toBe(jqTitleId);
        expect(nqTitleId).toBe('title');
    });

    test('should find elements by class - jquery-comparison', () => {
        const nqNavItems = nqRoot.find('.nav-item');
        const jqNavItems = jqRoot.find('.nav-item');

        expect(nqNavItems.nodes).toHaveLength(2);
        expect(jqNavItems.length).toBe(2);

        // Compare class attributes
        for (let i = 0; i < nqNavItems.nodes.length; i++) {
            const nqClass = nqNavItems.eq(i).attr('class');
            const jqClass = jqNavItems.eq(i).attr('class');
            expect(nqClass).toBe(jqClass);
            expect(nqClass).toContain('nav-item');
        }
    });

    test('should find elements by attribute presence - jquery-comparison', () => {
        const nqIdElements = nqRoot.find('[id]');
        const jqIdElements = jqRoot.find('[id]');

        expect(nqIdElements.nodes).toHaveLength(4); // main, title, post-1, post-2
        expect(jqIdElements.length).toBe(4);
    });

    test('should find elements by attribute value - jquery-comparison', () => {
        const nqTitleElement = nqRoot.find('[id="title"]');
        const jqTitleElement = jqRoot.find('[id="title"]');

        expect(nqTitleElement.nodes).toHaveLength(1);
        expect(jqTitleElement.length).toBe(1);
    });

    test('should find elements by complex selectors - jquery-comparison', () => {
        const nqComplex = nqRoot.find('.post.featured');
        const jqComplex = jqRoot.find('.post.featured');

        expect(nqComplex.nodes).toHaveLength(1);
        expect(jqComplex.length).toBe(1);

        const nqText = nqComplex.text();
        const jqText = jqComplex.text();

        expect(nqText).toBe(jqText);
    });

    test('should find elements using descendant combinators - jquery-comparison', () => {
        const nqDescendants = nqRoot.find('.container h1');
        const jqDescendants = jqRoot.find('.container h1');

        expect(nqDescendants.nodes).toHaveLength(1);
        expect(jqDescendants.length).toBe(1);
    });

    test('should find elements using child combinators - jquery-comparison', () => {
        const nqChildren = nqRoot.find('main > article');
        const jqChildren = jqRoot.find('main > article');

        expect(nqChildren.nodes).toHaveLength(2);
        expect(jqChildren.length).toBe(2);
    });

    test('should find elements using adjacent sibling combinators - jquery-comparison', () => {
        const nqAdjacent = nqRoot.find('h1 + nav');
        const jqAdjacent = jqRoot.find('h1 + nav');

        expect(nqAdjacent.nodes).toHaveLength(1);
        expect(jqAdjacent.length).toBe(1);
    });

    test('should find elements using general sibling combinators - jquery-comparison', () => {
        const nqGeneralSiblings = nqRoot.find('h1 ~ nav');
        const jqGeneralSiblings = jqRoot.find('h1 ~ nav');

        expect(nqGeneralSiblings.nodes).toHaveLength(1);
        expect(jqGeneralSiblings.length).toBe(1);
    });
});
