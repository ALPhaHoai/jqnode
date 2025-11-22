import $ from '../../../index';

describe('Advanced selectors (now supported)', () => {
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

    test('should support attribute selectors', () => {
        // Test attribute presence - no elements in test HTML have data-info attribute
        const attrSelector = root.find('[data-info]');
        expect(attrSelector.nodes).toHaveLength(0);

        // Test attribute value - no elements have this attribute/value
        const attrValueSelector = root.find('[data-info="some info"]');
        expect(attrValueSelector.nodes).toHaveLength(0);

        // Test attribute selectors that should match
        const idSelector = root.find('[id]');
        expect(idSelector.nodes).toHaveLength(4); // #main, #title, #post-1, #post-2

        const classSelector = root.find('[class]');
        expect(classSelector.nodes).toHaveLength(10); // All elements with class attributes
    });

    test('should support attribute selector variations', () => {
        // Attribute presence selectors
        const idElements = root.find('[id]');
        expect(idElements.nodes).toHaveLength(4); // main, title, post-1, post-2

        const classElements = root.find('[class]');
        expect(classElements.nodes).toHaveLength(10); // All elements with class attribute

        // Attribute value selectors
        const titleElement = root.find('[id="title"]');
        expect(titleElement.nodes).toHaveLength(1);

        const postClassElement = root.find('[class="post"]');
        expect(postClassElement.nodes).toHaveLength(1); // Only post-2 has exactly "post"

        // Attribute starts with (^=)
        const postIdElements = root.find('[id^="post"]');
        expect(postIdElements.nodes).toHaveLength(2); // post-1, post-2

        // Attribute ends with ($=)
        const post1Element = root.find('[id$="-1"]');
        expect(post1Element.nodes).toHaveLength(1); // post-1

        // Attribute contains (*=)
        const ostContainingElements = root.find('[id*="ost"]');
        expect(ostContainingElements.nodes).toHaveLength(2); // post-1, post-2

        // Attribute contains word (~=)
        const featuredClassElements = root.find('[class~="featured"]');
        expect(featuredClassElements.nodes).toHaveLength(1); // post-1

        // Attribute starts with pipe (|=) - no lang attributes
        const langEnElements = root.find('[lang|="en"]');
        expect(langEnElements.nodes).toHaveLength(0);
    });

    test('should support attribute selectors with different quote types', () => {
        // Different quote styles - no elements have data-info attribute
        const singleQuoteDataInfo = root.find("[data-info='some info']");
        expect(singleQuoteDataInfo.nodes).toHaveLength(0);

        const doubleQuoteDataInfo = root.find('[data-info="some info"]');
        expect(doubleQuoteDataInfo.nodes).toHaveLength(0);

        const unquotedDataInfo = root.find("[data-info=some]");
        expect(unquotedDataInfo.nodes).toHaveLength(0);
    });

    test('should support complex attribute selector combinations', () => {
        // Multiple attribute selectors
        const classAndIdElements = root.find('[class][id]');
        expect(classAndIdElements.nodes).toHaveLength(4); // main, title, post-1, post-2

        const articleClassAndIdElements = root.find('article[class][id]');
        expect(articleClassAndIdElements.nodes).toHaveLength(2); // post-1, post-2

        // Attribute selectors with classes/IDs - no title attribute on #title
        const featuredArticleWithDataType = root.find('article.featured[data-type]');
        expect(featuredArticleWithDataType.nodes).toHaveLength(0);

        const titleElementWithTitleAttr = root.find('#title[title]');
        expect(titleElementWithTitleAttr.nodes).toHaveLength(0);
    });

    test('should support pseudo-selectors', () => {
        // Note: :first is not standard CSS, but :first-child should work
        const firstSelector = root.find('article:first');
        expect(firstSelector.nodes).toHaveLength(0); // Not a standard pseudo-selector

        const nthChildSelector = root.find('article:nth-child(1)');
        expect(nthChildSelector.nodes).toHaveLength(1); // First article

        const lastSelector = root.find('.nav-item:last');
        expect(lastSelector.nodes).toHaveLength(0); // :last is not standard, use :last-child
    });

    test('should support structural pseudo-classes', () => {
        // Positional pseudo-classes
        const firstChildArticles = root.find('article:first-child');
        expect(firstChildArticles.nodes).toHaveLength(1); // First article in main

        const lastChildArticles = root.find('article:last-child');
        expect(lastChildArticles.nodes).toHaveLength(1); // Second article in main

        const onlyChildArticles = root.find('article:only-child');
        expect(onlyChildArticles.nodes).toHaveLength(0); // No article is only child

        // nth-child variations
        const firstLi = root.find('li:nth-child(1)');
        expect(firstLi.nodes).toHaveLength(1); // First li

        const evenLis = root.find('li:nth-child(2n)');
        expect(evenLis.nodes).toHaveLength(1); // Second (even) li

        const evenLisAlt = root.find('li:nth-child(even)');
        expect(evenLisAlt.nodes).toHaveLength(1); // Second li

        const oddLis = root.find('li:nth-child(odd)');
        expect(oddLis.nodes).toHaveLength(1); // First li

        const complexNthLis = root.find('li:nth-child(3n+1)');
        expect(complexNthLis.nodes).toHaveLength(1); // First li

        // nth-last-child variations
        const lastLi = root.find('li:nth-last-child(1)');
        expect(lastLi.nodes).toHaveLength(1); // Last li

        const secondFromEndLi = root.find('li:nth-last-child(2)');
        expect(secondFromEndLi.nodes).toHaveLength(1); // First li (second from end)
    });

    test('should support combinators', () => {
        // Child combinator
        const childSelector = root.find('div > h1');
        expect(childSelector.nodes).toHaveLength(0); // No div directly contains h1

        // Adjacent sibling combinator
        const adjacentSelector = root.find('h1 + nav');
        expect(adjacentSelector.nodes).toHaveLength(1); // nav is adjacent to h1

        // General sibling combinator
        const siblingSelector = root.find('h1 ~ p');
        expect(siblingSelector.nodes).toHaveLength(0); // No p siblings of h1

        // Descendant combinator (space)
        const descendantSelector = root.find('div h1');
        expect(descendantSelector.nodes).toHaveLength(1); // h1 is descendant of div
    });
});
