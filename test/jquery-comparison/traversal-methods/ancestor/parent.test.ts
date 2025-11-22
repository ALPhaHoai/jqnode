import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('parent() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
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
    `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('parent() should get immediate parent of elements - jquery-comparison', () => {
        const nqSpans = nqRoot.find('span');
        const jqSpans = jqRoot.find('span');

        const nqParents = nqSpans.parent();
        const jqParents = jqSpans.parent();

        expect(nqParents.length).toBe(jqParents.length);
        expect(nqParents.length).toBe(2);

        // Compare parent tags
        const nqParentTags = [];
        nqParents.each((index, element) => {
            nqParentTags.push(element.tagName.toLowerCase());
        });
        const jqParentTags = [];
        jqParents.each((index, element) => {
            jqParentTags.push(element.tagName.toLowerCase());
        });

        expect(nqParentTags.sort()).toEqual(jqParentTags.sort());
        expect(nqParentTags).toEqual(['div', 'p']);
    });

    test('parent() should get immediate parent of single element - jquery-comparison', () => {
        const nqTitle = nqRoot.find('.title');
        const jqTitle = jqRoot.find('.title');

        const nqParent = nqTitle.parent();
        const jqParent = jqTitle.parent();

        expect(nqParent.length).toBe(jqParent.length);
        expect(nqParent.length).toBe(1);

        const nqParentId = nqParent.attr('id');
        const jqParentId = jqParent.attr('id');

        expect(nqParentId).toBe(jqParentId);
        expect(nqParentId).toBe('header');
    });


    test('parent() should work with filtered collections - jquery-comparison', () => {
        const nqArticles = nqRoot.find('.article');
        const jqArticles = jqRoot.find('.article');

        const nqFilteredParents = nqArticles.filter(':first-child').parent();
        const jqFilteredParents = jqArticles.filter(':first-child').parent();

        expect(nqFilteredParents.length).toBe(jqFilteredParents.length);
        expect(nqFilteredParents.length).toBe(1);

        const nqParentClass = nqFilteredParents.attr('class');
        const jqParentClass = jqFilteredParents.attr('class');

        expect(nqParentClass).toBe(jqParentClass);
        expect(nqParentClass).toBe('section');
    });

    test('parent() should handle elements with same parent - jquery-comparison', () => {
        const nqListItems = nqRoot.find('.list-item');
        const jqListItems = jqRoot.find('.list-item');

        const nqParents = nqListItems.parent();
        const jqParents = jqListItems.parent();

        expect(nqParents.length).toBe(jqParents.length); // Both li elements have the same ul parent
        expect(nqParents.length).toBe(1);

        const nqParentTag = nqParents[0].tagName.toLowerCase();
        const jqParentTag = jqParents[0].tagName.toLowerCase();

        expect(nqParentTag).toBe(jqParentTag);
        expect(nqParentTag).toBe('ul');
    });

    test('parent() should work with chaining - jquery-comparison', () => {
        const nqInnerSpan = nqRoot.find('.inner-span');
        const jqInnerSpan = jqRoot.find('.inner-span');

        const nqGrandParent = nqInnerSpan.parent().parent();
        const jqGrandParent = jqInnerSpan.parent().parent();

        expect(nqGrandParent.length).toBe(jqGrandParent.length);
        expect(nqGrandParent.length).toBe(1);

        const nqGrandParentClass = nqGrandParent.attr('class');
        const jqGrandParentClass = jqGrandParent.attr('class');

        expect(nqGrandParentClass).toBe(jqGrandParentClass);
        expect(nqGrandParentClass).toBe('article');
    });

    test('parent() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqParents = nqEmpty.parent();
        const jqParents = jqEmpty.parent();

        expect(nqParents.length).toBe(jqParents.length);
        expect(nqParents.length).toBe(0);
    });
});
