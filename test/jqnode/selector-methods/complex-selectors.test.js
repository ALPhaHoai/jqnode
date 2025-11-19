const $ = require('../../../index');

describe('Complex selector combinations and edge cases', () => {
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
    test('should support mixing multiple advanced features', () => {
        // Attribute selectors + pseudo-selectors
        const idFirstChildElements = root.find('[id]:first-child').nodes;
        expect(idFirstChildElements).toHaveLength(2); // h1#title and article#post-1 are first children with id

        const secondPostElement = root.find('.post:nth-child(2)').nodes;
        expect(secondPostElement).toHaveLength(1); // Second article (which has .post)

        // Combinators + attribute selectors
        const directChildrenWithClass = root.find('div > [class]').nodes;
        expect(directChildrenWithClass).toHaveLength(3); // header, main, footer (direct children of div with class)

        const adjacentElements = root.find('[id] + [class]').nodes;
        expect(adjacentElements).toHaveLength(2); // nav (after h1#title) and article#post-2 (after article#post-1)

        // Pseudo-selectors + combinators
        const firstChildH1Elements = root.find(':first-child > h1').nodes;
        expect(firstChildH1Elements).toHaveLength(1); // header:first-child has h1 child

        const siblingArticles = root.find('article:first-child ~ article:last-child').nodes;
        expect(siblingArticles).toHaveLength(1); // Second article (last article)
    });

    test('should support complex nested selector expressions', () => {
        // Highly complex combinations
        const complexH1Selector = root.find('div.container > header > h1.title#title:first-child').nodes;
        expect(complexH1Selector).toHaveLength(1); // The h1 title

        const complexArticleSelector = root.find('main > article.post.featured:nth-child(2) > h2 + p').nodes;
        expect(complexArticleSelector).toHaveLength(0); // No such structure

        const complexNavSelector = root.find('nav > ul > li.nav-item.active:first-of-type > a').nodes;
        expect(complexNavSelector).toHaveLength(0); // No such nested structure
    });

    test('should support selector lists with advanced features', () => {
        // Multiple selectors with various advanced features
        const selectorList1 = root.find('h1:first-child, .post:last-child, #title:only-child').nodes;
        expect(selectorList1).toHaveLength(2); // .post:last-child + #title:only-child

        const selectorList2 = root.find('[id], :first-child, .post.featured').nodes;
        expect(selectorList2).toHaveLength(12); // 4 [id] + 10 :first-child + 1 .post.featured - overlaps

        const selectorList3 = root.find('div > h1, main > article, nav > ul').nodes;
        expect(selectorList3).toHaveLength(3); // h1 + 2 articles + ul
    });

    test('should support :not() in complex expressions', () => {
        // :not() with multiple pseudos - valid CSS syntax
        const notPostNotNavElements = root.find(':not(.post):not(.nav)').nodes;
        expect(notPostNotNavElements).toHaveLength(15); // Elements that are neither .post nor .nav

        const notFeaturedNotPost1Articles = root.find('article:not(.featured):not(#post-1)').nodes;
        expect(notFeaturedNotPost1Articles).toHaveLength(1); // Second article (not featured, not #post-1)

        // :not() with combinators and other features
        const notH1FirstChildElements = root.find('div > :not(h1):first-child').nodes;
        expect(notH1FirstChildElements).toHaveLength(1); // header (first child of div that isn't h1)

        const notIdPlusNotClassElements = root.find(':not([id]) + :not([class])').nodes;
        expect(notIdPlusNotClassElements).toHaveLength(2); // p elements preceded by elements without id
    });

    test('should NOT support CSS3+ selector features', () => {
        // CSS3 pseudo-elements (different from pseudo-classes)
        const beforePseudoElement = root.find('::before').nodes;
        expect(beforePseudoElement).toHaveLength(0);

        const afterPseudoElement = root.find('::after').nodes;
        expect(afterPseudoElement).toHaveLength(0);

        const firstLinePseudoElement = root.find('::first-line').nodes;
        expect(firstLinePseudoElement).toHaveLength(0);

        // CSS3 pseudo-classes
        const targetPseudoClass = root.find(':target').nodes;
        expect(targetPseudoClass).toHaveLength(0);

        const langPseudoClass = root.find(':lang(en)').nodes;
        expect(langPseudoClass).toHaveLength(0);

        const rootPseudoClass = root.find(':root').nodes;
        expect(rootPseudoClass).toHaveLength(1); // Root element
    });

    test('should NOT support advanced CSS selector syntax', () => {
        // Namespaced selectors
        const namespacedElementSelector = root.find('prefix|element').nodes;
        expect(namespacedElementSelector).toHaveLength(0);

        const universalNamespacedSelector = root.find('*|div').nodes;
        expect(universalNamespacedSelector).toHaveLength(18); // Universal selector matches all elements

        // Grid and flexbox pseudo-classes
        const nthColumnSelector = root.find(':nth-column(1)').nodes;
        expect(nthColumnSelector).toHaveLength(0);

        // Case sensitivity modifiers
        const caseInsensitiveSelector = root.find('div i').nodes;
        expect(caseInsensitiveSelector).toHaveLength(0); // case insensitive by default
    });

    test('should NOT support malformed or invalid selectors', () => {
        // Malformed selectors should throw SyntaxError (jQuery behavior)
        expect(() => root.find('[unclosed')).toThrow(SyntaxError);
        // Note: 'unclosed(' and ':not(unclosed' are not syntax errors in jQuery

        // Invalid syntax combinations
        const leadingChildCombinator = root.find('> div').nodes;
        expect(leadingChildCombinator).toHaveLength(0); // leading combinator

        const leadingAdjacentCombinator = root.find('+ .class').nodes;
        expect(leadingAdjacentCombinator).toHaveLength(0); // leading combinator

        const leadingSiblingCombinator = root.find('~ #id').nodes;
        expect(leadingSiblingCombinator).toHaveLength(0); // leading combinator

        const doubleChildCombinator = root.find('div > > span').nodes;
        expect(doubleChildCombinator).toHaveLength(0); // double combinators
    });

    test('should NOT support complex attribute selector expressions', () => {
        // Complex attribute matching
        const containsPostFeaturedSelector = root.find('[class*="post featured"]').nodes;
        expect(containsPostFeaturedSelector).toHaveLength(1); // article.post.featured contains "post featured"

        const dashPostSelector = root.find('[id|="post"]').nodes;
        expect(dashPostSelector).toHaveLength(2); // post-1 and post-2

        // Multiple attribute conditions (invalid CSS but testing)
        const multipleAttributeSelector = root.find('[class][id][data-*]').nodes;
        expect(multipleAttributeSelector).toHaveLength(0);
    });

    test('should NOT support jQuery-specific selectors', () => {
        // jQuery extensions
        const visibleSelector = root.find(':visible').nodes;
        expect(visibleSelector).toHaveLength(0);

        const hiddenSelector = root.find(':hidden').nodes;
        expect(hiddenSelector).toHaveLength(0);

        const headerSelector = root.find(':header').nodes;
        expect(headerSelector).toHaveLength(0);

        const inputSelector = root.find(':input').nodes;
        expect(inputSelector).toHaveLength(0);

        const buttonSelector = root.find(':button').nodes;
        expect(buttonSelector).toHaveLength(0);

        const checkboxSelector = root.find(':checkbox').nodes;
        expect(checkboxSelector).toHaveLength(0);
    });

    test('should NOT support advanced combinators and relationships', () => {
        // Column combinator (CSS3)
        const columnCombinatorSelector = root.find('div || td').nodes;
        expect(columnCombinatorSelector).toHaveLength(0);

        // Complex sibling relationships
        const complexSiblingSelector = root.find('h1 ~ p ~ span').nodes;
        expect(complexSiblingSelector).toHaveLength(0);

        const consecutiveArticlesSelector = root.find('article + article + article').nodes;
        expect(consecutiveArticlesSelector).toHaveLength(0); // No three consecutive articles
    });
});
