import { createTestDom } from '../../../utils/jquery-comparison-helpers';
import JQ from '../../../../jq';

describe('Ancestor traversal chaining - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ, jqRoot: JQuery<any>;

    beforeEach(() => {
        const html = `
      <html>
        <body class="main-body">
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
            </section>
            <aside class="sidebar">
              <h3 class="sidebar-title">Sidebar</h3>
              <ul class="list">
                <li class="list-item">Item 1</li>
                <li class="list-item">Item 2</li>
              </ul>
            </aside>
          </div>
        </body>
      </html>
    `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('parent() chaining should work correctly - jquery-comparison', () => {
        const nqSpan = nqRoot.find('.inner-span');
        const jqSpan = jqRoot.find('.inner-span');

        const nqParent = nqSpan.parent();
        const jqParent = jqSpan.parent();

        expect(nqParent.nodes).toHaveLength(1);
        expect(jqParent.length).toBe(1);

        const nqParentClass = nqParent.attr('class');
        const jqParentClass = jqParent.attr('class');

        expect(nqParentClass).toBe(jqParentClass);
        expect(nqParentClass).toBe('nested');
    });

    test('closest() chaining should work correctly - jquery-comparison', () => {
        const nqSpan = nqRoot.find('.inner-span');
        const jqSpan = jqRoot.find('.inner-span');

        const nqClosest = nqSpan.closest('.article');
        const jqClosest = jqSpan.closest('.article');

        expect(nqClosest.nodes).toHaveLength(1);
        expect(jqClosest.length).toBe(1);

        const nqClosestClass = nqClosest.attr('class');
        const jqClosestClass = jqClosest.attr('class');

        expect(nqClosestClass).toBe(jqClosestClass);
        expect(nqClosestClass).toBe('article');
    });

    test('parents() chaining should work correctly - jquery-comparison', () => {
        const nqSpan = nqRoot.find('.inner-span');
        const jqSpan = jqRoot.find('.inner-span');

        const nqParents = nqSpan.parents('div');
        const jqParents = jqSpan.parents('div');

        expect(nqParents.nodes).toHaveLength(2); // nested and content
        expect(jqParents.length).toBe(2);

        const nqClasses = nqParents.nodes.map((node) => node.attributes.class);
        const jqClasses: string[] = [];
        jqParents.each((index: number, element: HTMLElement) => {
            jqClasses.push(element.className);
        });

        expect(nqClasses.sort()).toEqual(jqClasses.sort());
        expect(nqClasses).toEqual(['content', 'nested']);
    });

    test('parentsUntil() chaining should work correctly - jquery-comparison', () => {
        const nqSpan = nqRoot.find('.inner-span');
        const jqSpan = jqRoot.find('.inner-span');

        const nqParents = nqSpan.parentsUntil('.content');
        const jqParents = jqSpan.parentsUntil('.content');

        expect(nqParents.nodes).toHaveLength(3); // nested -> article -> section
        expect(jqParents.length).toBe(3);

        const nqTags = nqParents.nodes.map((node) => node.tagName && node.tagName.toLowerCase());
        const jqTags: string[] = [];
        jqParents.each((index: number, element: HTMLElement) => {
            jqTags.push(element.tagName.toLowerCase());
        });

        expect(nqTags).toEqual(jqTags);
        expect(nqTags).toEqual(['div', 'article', 'section']);
    });

    test('mixed ancestor traversal chaining - jquery-comparison', () => {
        const nqSpan = nqRoot.find('.highlight');
        const jqSpan = jqRoot.find('.highlight');

        // Chain: closest -> parent -> parents
        const nqResult = nqSpan.closest('.article').parent().parents('.content');
        const jqResult = jqSpan.closest('.article').parent().parents('.content');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqId = nqResult.attr('id');
        const jqId = jqResult.attr('id');

        expect(nqId).toBe(jqId);
        expect(nqId).toBe('content');
    });

    test('ancestor traversal with filtering - jquery-comparison', () => {
        const nqSpans = nqRoot.find('span');
        const jqSpans = jqRoot.find('span');

        const nqResult = nqSpans.parents('div').filter('.nested, .content');
        const jqResult = jqSpans.parents('div').filter('.nested, .content');

        expect(nqResult.nodes).toHaveLength(2); // nested and content divs
        expect(jqResult.length).toBe(2);

        const nqClasses = nqResult.nodes.map((node) => node.attributes.class);
        const jqClasses: string[] = [];
        jqResult.each((index: number, element: HTMLElement) => {
            jqClasses.push(element.className);
        });

        expect(nqClasses.sort()).toEqual(jqClasses.sort());
        expect(nqClasses).toEqual(['content', 'nested']);
    });
});
