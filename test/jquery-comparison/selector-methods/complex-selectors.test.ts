import { createTestDom } from '../../utils/jquery-comparison-helpers';
import { JQ } from '../../../index';

describe('Complex selector combinations and edge cases - Node-Query vs jQuery Comparison', () => {
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

  test('should support mixing multiple advanced features - jquery-comparison', () => {
    // Attribute selectors + pseudo-selectors
    const nqIdFirstChildElements = nqRoot.find('[id]:first-child');
    const jqIdFirstChildElements = jqRoot.find('[id]:first-child');

    expect(nqIdFirstChildElements.nodes).toHaveLength(3); // div#main, h1#title, and article#post-1 are first children with id
    expect(jqIdFirstChildElements.length).toBe(3);

    const nqSecondPostElement = nqRoot.find('.post:nth-child(2)');
    const jqSecondPostElement = jqRoot.find('.post:nth-child(2)');

    expect(nqSecondPostElement.nodes).toHaveLength(1); // Second article (which has .post)
    expect(jqSecondPostElement.length).toBe(1);

    // Combinators + attribute selectors
    const nqDirectChildrenWithClass = nqRoot.find('div > [class]');
    const jqDirectChildrenWithClass = jqRoot.find('div > [class]');

    expect(nqDirectChildrenWithClass.nodes).toHaveLength(3); // header, main, footer (direct children of div with class)
    expect(jqDirectChildrenWithClass.length).toBe(3);

    // Adjacent sibling combinator with attributes
    const nqAdjacentElements = nqRoot.find('[id] + [class]');
    const jqAdjacentElements = jqRoot.find('[id] + [class]');

    expect(nqAdjacentElements.nodes).toHaveLength(2); // nav (after h1#title) and article#post-2 (after article#post-1)
    expect(jqAdjacentElements.length).toBe(2);

    // Pseudo-selectors + combinators
    const nqFirstDescendants = nqRoot.find('.container :first-child');
    const jqFirstDescendants = jqRoot.find('.container :first-child');

    expect(nqFirstDescendants.nodes).toHaveLength(10); // All :first-child elements within .container
    expect(jqFirstDescendants.length).toBe(10);
  });

  test('should handle complex nested selector combinations - jquery-comparison', () => {
    const complexHtml = `
      <div class="level1">
        <div class="level2">
          <div class="level3">
            <span class="target">Target 1</span>
            <span class="target">Target 2</span>
          </div>
          <div class="level3">
            <span class="target">Target 3</span>
          </div>
        </div>
        <div class="level2">
          <span class="target">Target 4</span>
        </div>
      </div>
    `;
    const { jquery: jqComplex, nodeQuery: nqComplex } = createTestDom(complexHtml);

    // Complex descendant selectors
    const nqDeepDescendants = nqComplex.find('.level1 .level2 .level3 .target');
    const jqDeepDescendants = jqComplex.find('.level1 .level2 .level3 .target');

    expect(nqDeepDescendants.nodes).toHaveLength(3); // Target 1, 2, 3
    expect(jqDeepDescendants.length).toBe(3);

    // Mixed combinators
    const nqMixedCombinators = nqComplex.find('.level1 > .level2 > .level3 .target');
    const jqMixedCombinators = jqComplex.find('.level1 > .level2 > .level3 .target');

    expect(nqMixedCombinators.nodes).toHaveLength(3); // Same result
    expect(jqMixedCombinators.length).toBe(3);
  });

  test('should handle complex attribute and class combinations - jquery-comparison', () => {
    const attrClassHtml = `
      <div class="item" data-type="primary" data-status="active">
        <span class="item secondary" data-type="secondary">Span 1</span>
        <span class="item primary active" data-type="primary" data-status="active">Span 2</span>
        <span class="item" data-type="tertiary" data-status="inactive">Span 3</span>
      </div>
    `;
    const { jquery: jqAttrClass, nodeQuery: nqAttrClass } = createTestDom(attrClassHtml);

    // Complex attribute and class combinations
    const nqComplexAttrClass = nqAttrClass.find(
      '.item[data-type="primary"][data-status="active"]',
    );
    const jqComplexAttrClass = jqAttrClass.find(
      '.item[data-type="primary"][data-status="active"]',
    );

    expect(nqComplexAttrClass.nodes).toHaveLength(2); // div and span 2
    expect(jqComplexAttrClass.length).toBe(2);

    // Class and attribute mixing
    const nqClassAttrMix = nqAttrClass.find('span.item[data-type]');
    const jqClassAttrMix = jqAttrClass.find('span.item[data-type]');

    expect(nqClassAttrMix.nodes).toHaveLength(3); // All spans have data-type
    expect(jqClassAttrMix.length).toBe(3);
  });

  test('should handle complex pseudo-selector combinations - jquery-comparison', () => {
    const pseudoHtml = `
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
        <li>Item 5</li>
      </ul>
    `;
    const { jquery: jqPseudo, nodeQuery: nqPseudo } = createTestDom(pseudoHtml);

    // Complex pseudo-selector combinations
    const nqEvenItems = nqPseudo.find('li:nth-child(even)');
    const jqEvenItems = jqPseudo.find('li:nth-child(even)');

    expect(nqEvenItems.nodes).toHaveLength(2); // 2nd and 4th items
    expect(jqEvenItems.length).toBe(2);

    const nqOddItems = nqPseudo.find('li:nth-child(odd)');
    const jqOddItems = jqPseudo.find('li:nth-child(odd)');

    expect(nqOddItems.nodes).toHaveLength(3); // 1st, 3rd, 5th items
    expect(jqOddItems.length).toBe(3);

    // Combining pseudo-selectors with other selectors
    const nqComplexPseudo = nqPseudo.find('li:first-child, li:last-child');
    const jqComplexPseudo = jqPseudo.find('li:first-child, li:last-child');

    expect(nqComplexPseudo.nodes).toHaveLength(2); // First and last li
    expect(jqComplexPseudo.length).toBe(2);
  });

  test('should handle complex selector precedence and specificity - jquery-comparison', () => {
    const specificityHtml = `
      <div class="container">
        <div id="specific" class="item special">Specific Item</div>
        <div class="item special">General Item 1</div>
        <div class="item">General Item 2</div>
      </div>
    `;
    const { jquery: jqSpecificity, nodeQuery: nqSpecificity } = createTestDom(specificityHtml);

    // Test that more specific selectors work correctly
    const nqIdSelector = nqSpecificity.find('#specific');
    const jqIdSelector = jqSpecificity.find('#specific');

    expect(nqIdSelector.nodes).toHaveLength(1);
    expect(jqIdSelector.length).toBe(1);

    const nqClassSelector = nqSpecificity.find('.item');
    const jqClassSelector = jqSpecificity.find('.item');

    expect(nqClassSelector.nodes).toHaveLength(3);
    expect(jqClassSelector.length).toBe(3);

    // Complex selector combinations
    const nqComplexSpecific = nqSpecificity.find('#specific.item.special');
    const jqComplexSpecific = jqSpecificity.find('#specific.item.special');

    expect(nqComplexSpecific.nodes).toHaveLength(1);
    expect(jqComplexSpecific.length).toBe(1);
  });
});
