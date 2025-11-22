import $ from '../../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../../utils/jquery-comparison-helpers';

describe('parentsUntil() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <html>
        <body class="main-body">
          <div id="content" class="content">
            <section class="section">
              <article class="article">
                <div class="nested">
                  <p class="inner-para">Inner paragraph</p>
                  <span class="inner-span">Inner span</span>
                </div>
              </article>
            </section>
            <aside class="sidebar">
              <div class="widget">
                <span class="widget-span">Widget span</span>
              </div>
            </aside>
          </div>
        </body>
      </html>
    `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('parentsUntil() should get ancestors until specified selector - jquery-comparison', () => {
        const nqInnerSpan = nqRoot.find('.inner-span');
        const jqInnerSpan = jqRoot.find('.inner-span');

        const nqParents = nqInnerSpan.parentsUntil('.content');
        const jqParents = jqInnerSpan.parentsUntil('.content');

        expect(nqParents.nodes).toHaveLength(3); // span -> nested -> article -> section (stops before content)
        expect(jqParents.length).toBe(3);

        const nqTags = nqParents.nodes.map(node => node.tagName && node.tagName.toLowerCase());
        const jqTags = [];
        jqParents.each((index, element) => {
            jqTags.push(element.tagName.toLowerCase());
        });

        expect(nqTags).toEqual(jqTags);
        expect(nqTags).toEqual(['div', 'article', 'section']);
    });

    test('parentsUntil() should include all ancestors if filter never matches - jquery-comparison', () => {
        const nqInnerSpan = nqRoot.find('.inner-span');
        const jqInnerSpan = jqRoot.find('.inner-span');

        const nqParents = nqInnerSpan.parentsUntil('.nonexistent');
        const jqParents = jqInnerSpan.parentsUntil('.nonexistent');

        expect(nqParents.nodes).toHaveLength(6); // All ancestors up to html
        expect(jqParents.length).toBe(6);
    });

    test('parentsUntil() should stop at first matching ancestor - jquery-comparison', () => {
        const nqWidgetSpan = nqRoot.find('.widget-span');
        const jqWidgetSpan = jqRoot.find('.widget-span');

        const nqParents = nqWidgetSpan.parentsUntil('aside');
        const jqParents = jqWidgetSpan.parentsUntil('aside');

        expect(nqParents.nodes).toHaveLength(1); // Only the widget div
        expect(jqParents.length).toBe(1);

        const nqClass = nqParents.attr('class');
        const jqClass = jqParents.attr('class');

        expect(nqClass).toBe(jqClass);
        expect(nqClass).toBe('widget');
    });

    test('parentsUntil() should work with multiple elements - jquery-comparison', () => {
        const nqSpans = nqRoot.find('span');
        const jqSpans = jqRoot.find('span');

        const nqParents = nqSpans.parentsUntil('.content');
        const jqParents = jqSpans.parentsUntil('.content');

        expect(nqParents.nodes).toHaveLength(5); // Parents from both spans
        expect(jqParents.length).toBe(5);
    });

    test('parentsUntil() should handle empty collections - jquery-comparison', () => {
        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqParents = nqEmpty.parentsUntil('div');
        const jqParents = jqEmpty.parentsUntil('div');

        expect(nqParents.nodes).toHaveLength(0);
        expect(jqParents.length).toBe(0);
    });

    test('parentsUntil() should work with ID selectors - jquery-comparison', () => {
        const nqInnerSpan = nqRoot.find('.inner-span');
        const jqInnerSpan = jqRoot.find('.inner-span');

        const nqParents = nqInnerSpan.parentsUntil('#content');
        const jqParents = jqInnerSpan.parentsUntil('#content');

        expect(nqParents.nodes).toHaveLength(3); // span -> nested -> article -> section
        expect(jqParents.length).toBe(3);
    });
});
