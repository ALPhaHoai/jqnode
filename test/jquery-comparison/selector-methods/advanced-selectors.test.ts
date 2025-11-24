import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JQ } from '../../../index';

describe('Advanced selectors (now supported) - Node-Query vs jQuery Comparison', () => {
    let nqRoot: JQ;
    let jqRoot: any;

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

    test('should support attribute selectors - jquery-comparison', () => {
        // Test attribute presence - no elements in test HTML have data-info attribute
        const nqAttrSelector = nqRoot.find('[data-info]');
        const jqAttrSelector = jqRoot.find('[data-info]');

        expect(nqAttrSelector.nodes).toHaveLength(0);
        expect(jqAttrSelector.length).toBe(0);

        // Test attribute value - no elements have this attribute/value
        const nqAttrValueSelector = nqRoot.find('[data-info="some info"]');
        const jqAttrValueSelector = jqRoot.find('[data-info="some info"]');

        expect(nqAttrValueSelector.nodes).toHaveLength(0);
        expect(jqAttrValueSelector.length).toBe(0);

        // Test attribute selectors that should match
        const nqIdSelector = nqRoot.find('[id]');
        const jqIdSelector = jqRoot.find('[id]');

        expect(nqIdSelector.nodes).toHaveLength(4); // #main, #title, #post-1, #post-2
        expect(jqIdSelector.length).toBe(4);

        const nqClassSelector = nqRoot.find('[class]');
        const jqClassSelector = jqRoot.find('[class]');

        expect(nqClassSelector.nodes).toHaveLength(10); // All elements with class attributes
        expect(jqClassSelector.length).toBe(10);
    });

    test('should support attribute selector variations - jquery-comparison', () => {
        // Attribute presence selectors
        const nqIdElements = nqRoot.find('[id]');
        const jqIdElements = jqRoot.find('[id]');

        expect(nqIdElements.nodes).toHaveLength(4); // main, title, post-1, post-2
        expect(jqIdElements.length).toBe(4);

        const nqClassElements = nqRoot.find('[class]');
        const jqClassElements = jqRoot.find('[class]');

        expect(nqClassElements.nodes).toHaveLength(10); // All elements with class attribute
        expect(jqClassElements.length).toBe(10);

        // Attribute value selectors
        const nqTitleElement = nqRoot.find('[id="title"]');
        const jqTitleElement = jqRoot.find('[id="title"]');

        expect(nqTitleElement.nodes).toHaveLength(1);
        expect(jqTitleElement.length).toBe(1);

        const nqPostClassElement = nqRoot.find('[class="post"]');
        const jqPostClassElement = jqRoot.find('[class="post"]');

        expect(nqPostClassElement.nodes).toHaveLength(1); // Only post-2 has exactly "post"
        expect(jqPostClassElement.length).toBe(1);

        // Attribute starts with (^=)
        const nqPostIdElements = nqRoot.find('[id^="post"]');
        const jqPostIdElements = jqRoot.find('[id^="post"]');

        expect(nqPostIdElements.nodes).toHaveLength(2); // post-1, post-2
        expect(jqPostIdElements.length).toBe(2);

        // Attribute ends with ($=)
        const nqPost1Element = nqRoot.find('[id$="-1"]');
        const jqPost1Element = jqRoot.find('[id$="-1"]');

        expect(nqPost1Element.nodes).toHaveLength(1); // post-1
        expect(jqPost1Element.length).toBe(1);

        // Attribute contains (*=)
        const nqOstContainingElements = nqRoot.find('[id*="ost"]');
        const jqOstContainingElements = jqRoot.find('[id*="ost"]');

        expect(nqOstContainingElements.nodes).toHaveLength(2); // post-1, post-2
        expect(jqOstContainingElements.length).toBe(2);

        // Attribute contains word (~=)
        const nqFeaturedElements = nqRoot.find('[class~="featured"]');
        const jqFeaturedElements = jqRoot.find('[class~="featured"]');

        expect(nqFeaturedElements.nodes).toHaveLength(1); // post-1 has 'featured' class
        expect(jqFeaturedElements.length).toBe(1);

        // Attribute starts with dash-separated (|=)
        const nqPostDashElements = nqRoot.find('[id|="post"]');
        const jqPostDashElements = jqRoot.find('[id|="post"]');

        expect(nqPostDashElements.nodes).toHaveLength(2); // post-1, post-2
        expect(jqPostDashElements.length).toBe(2);
    });

    test('should support complex attribute selectors - jquery-comparison', () => {
        const complexHtml = `
      <div data-test="value1" data-other="value2">
        <span data-test="value1-modified">Span 1</span>
        <span data-test="value2">Span 2</span>
        <span data-complex="prefix-value1-suffix">Complex</span>
      </div>
    `;
        const { jquery: jqComplex, nodeQuery: nqComplex } = createTestDom(complexHtml);

        // Multiple attribute conditions
        const nqMultiAttr = nqComplex.find('[data-test="value1"][data-other="value2"]');
        const jqMultiAttr = jqComplex.find('[data-test="value1"][data-other="value2"]');

        expect(nqMultiAttr.nodes).toHaveLength(1);
        expect(jqMultiAttr.length).toBe(1);

        // Attribute value containing dash
        const nqDashAttr = nqComplex.find('[data-complex*="value1"]');
        const jqDashAttr = jqComplex.find('[data-complex*="value1"]');

        expect(nqDashAttr.nodes).toHaveLength(1);
        expect(jqDashAttr.length).toBe(1);

        // Attribute starts with prefix followed by dash
        const nqPrefixDash = nqComplex.find('[data-complex^="prefix-"]');
        const jqPrefixDash = jqComplex.find('[data-complex^="prefix-"]');

        expect(nqPrefixDash.nodes).toHaveLength(1);
        expect(jqPrefixDash.length).toBe(1);

        // Attribute ends with suffix preceded by dash
        const nqSuffixDash = nqComplex.find('[data-complex$="-suffix"]');
        const jqSuffixDash = jqComplex.find('[data-complex$="-suffix"]');

        expect(nqSuffixDash.nodes).toHaveLength(1);
        expect(jqSuffixDash.length).toBe(1);
    });

    test('should support combinators and complex selectors - jquery-comparison', () => {
        const combinatorHtml = `
      <div class="container">
        <div class="parent">
          <span class="child">Child 1</span>
          <div class="nested">
            <span class="child">Child 2</span>
          </div>
        </div>
        <div class="sibling">
          <span class="child">Child 3</span>
        </div>
      </div>
    `;
        const { jquery: jqCombinator, nodeQuery: nqCombinator } = createTestDom(combinatorHtml);

        // Descendant combinator (space)
        const nqDescendants = nqCombinator.find('.container .child');
        const jqDescendants = jqCombinator.find('.container .child');

        expect(nqDescendants.nodes).toHaveLength(3);
        expect(jqDescendants.length).toBe(3);

        // Child combinator (>)
        const nqChildren = nqCombinator.find('.parent > .child');
        const jqChildren = jqCombinator.find('.parent > .child');

        expect(nqChildren.nodes).toHaveLength(1); // Only direct child
        expect(jqChildren.length).toBe(1);

        // Adjacent sibling combinator (+)
        const siblingHtml = `
      <div class="first">First</div>
      <div class="second">Second</div>
      <div class="third">Third</div>
    `;
        const { jquery: jqSibling, nodeQuery: nqSibling } = createTestDom(siblingHtml);

        const nqAdjacent = nqSibling.find('.first + .second');
        const jqAdjacent = jqSibling.find('.first + .second');

        expect(nqAdjacent.nodes).toHaveLength(1);
        expect(jqAdjacent.length).toBe(1);

        // General sibling combinator (~)
        const nqGeneralSiblings = nqSibling.find('.first ~ div');
        const jqGeneralSiblings = jqSibling.find('.first ~ div');

        expect(nqGeneralSiblings.nodes).toHaveLength(2); // second and third
        expect(jqGeneralSiblings.length).toBe(2);
    });
});
