import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('Basic selector functionality - Node-Query vs jQuery Comparison', () => {
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

    describe('Selector specificity and precedence', () => {
        test('should handle elements with multiple classes - jquery-comparison', () => {
            const nqResult = nqRoot.find('.nav-item.active');
            const jqResult = jqRoot.find('.nav-item.active');

            expect(nqResult.nodes).toHaveLength(1);
            expect(jqResult.length).toBe(1);

            const nqClass = nqResult.attr('class');
            const jqClass = jqResult.attr('class');

            expect(nqClass).toBe(jqClass);
            expect(nqClass).toContain('nav-item');
            expect(nqClass).toContain('active');
        });

        test('should find all elements matching class selector - jquery-comparison', () => {
            const nqResult = nqRoot.find('.nav-item');
            const jqResult = jqRoot.find('.nav-item');

            expect(nqResult.nodes).toHaveLength(2);
            expect(jqResult.length).toBe(2);

            // Compare the classes of both results
            for (let i = 0; i < nqResult.nodes.length; i++) {
                const nqClass = nqResult.eq(i).attr('class');
                const jqClass = jqResult.eq(i).attr('class');
                expect(nqClass).toBe(jqClass);
                expect(nqClass).toContain('nav-item');
            }
        });
    });

    describe('Advanced selector combinations', () => {
        test('should handle IDs with numbers and hyphens - jquery-comparison', () => {
            const specialHtml = `
        <div id="item-1" class="item">
          <span id="sub-item_2" class="sub-item">Test</span>
        </div>
      `;
            const { jquery: jqSpecial, nodeQuery: nqSpecial } = createTestDom(specialHtml);

            const nqHyphenId = nqSpecial.find('#item-1');
            const jqHyphenId = jqSpecial.find('#item-1');

            expect(nqHyphenId.nodes).toHaveLength(1);
            expect(jqHyphenId.length).toBe(1);

            const nqHyphenIdValue = nqHyphenId.attr('id');
            const jqHyphenIdValue = jqHyphenId.attr('id');

            expect(nqHyphenIdValue).toBe(jqHyphenIdValue);
            expect(nqHyphenIdValue).toBe('item-1');

            const nqUnderscoreId = nqSpecial.find('#sub-item_2');
            const jqUnderscoreId = jqSpecial.find('#sub-item_2');

            expect(nqUnderscoreId.nodes).toHaveLength(1);
            expect(jqUnderscoreId.length).toBe(1);

            const nqUnderscoreIdValue = nqUnderscoreId.attr('id');
            const jqUnderscoreIdValue = jqUnderscoreId.attr('id');

            expect(nqUnderscoreIdValue).toBe(jqUnderscoreIdValue);
            expect(nqUnderscoreIdValue).toBe('sub-item_2');
        });

        test('should handle classes with numbers and hyphens - jquery-comparison', () => {
            const specialHtml = `
        <div class="item-1 highlighted">
          <span class="sub_item_2 active">Test</span>
        </div>
      `;
            const { jquery: jqSpecial, nodeQuery: nqSpecial } = createTestDom(specialHtml);

            const nqHyphenClass = nqSpecial.find('.item-1');
            const jqHyphenClass = jqSpecial.find('.item-1');

            expect(nqHyphenClass.nodes).toHaveLength(1);
            expect(jqHyphenClass.length).toBe(1);

            const nqUnderscoreClass = nqSpecial.find('.sub_item_2');
            const jqUnderscoreClass = jqSpecial.find('.sub_item_2');

            expect(nqUnderscoreClass.nodes).toHaveLength(1);
            expect(jqUnderscoreClass.length).toBe(1);
        });

        test('should handle multiple class combinations in different orders - jquery-comparison', () => {
            const multiClassHtml = `
        <div class="a b c">
          <span class="b c a">First</span>
          <span class="c a b">Second</span>
        </div>
      `;
            const { jquery: jqMulti, nodeQuery: nqMulti } = createTestDom(multiClassHtml);

            const nqAbcSelector = nqMulti.find('.a.b.c');
            const jqAbcSelector = jqMulti.find('.a.b.c');

            expect(nqAbcSelector.nodes).toHaveLength(3); // div and both spans have all three classes
            expect(jqAbcSelector.length).toBe(3);

            const nqBcaSelector = nqMulti.find('.b.c.a');
            const jqBcaSelector = jqMulti.find('.b.c.a');

            expect(nqBcaSelector.nodes).toHaveLength(3); // Order shouldn't matter
            expect(jqBcaSelector.length).toBe(3);
        });

        test('should handle complex ID and class combinations - jquery-comparison', () => {
            const complexIdClassHtml = `
        <div id="complex_1-test" class="complex-class primary">
          <span id="simple" class="simple">Simple</span>
          <span class="complex-class secondary">Complex</span>
        </div>
      `;
            const { jquery: jqComplex, nodeQuery: nqComplex } = createTestDom(complexIdClassHtml);

            // ID with underscore and hyphen
            const nqComplexId = nqComplex.find('#complex_1-test');
            const jqComplexId = jqComplex.find('#complex_1-test');

            expect(nqComplexId.nodes).toHaveLength(1);
            expect(jqComplexId.length).toBe(1);

            // Class combinations
            const nqPrimaryComplex = nqComplex.find('.complex-class.primary');
            const jqPrimaryComplex = jqComplex.find('.complex-class.primary');

            expect(nqPrimaryComplex.nodes).toHaveLength(1);
            expect(jqPrimaryComplex.length).toBe(1);

            const nqSecondaryComplex = nqComplex.find('.complex-class.secondary');
            const jqSecondaryComplex = jqComplex.find('.complex-class.secondary');

            expect(nqSecondaryComplex.nodes).toHaveLength(1);
            expect(jqSecondaryComplex.length).toBe(1);

            // ID and class combination
            const nqComplexIdAndClass = nqComplex.find('#complex_1-test.complex-class');
            const jqComplexIdAndClass = jqComplex.find('#complex_1-test.complex-class');

            expect(nqComplexIdAndClass.nodes).toHaveLength(1);
            expect(jqComplexIdAndClass.length).toBe(1);
        });
    });
});
