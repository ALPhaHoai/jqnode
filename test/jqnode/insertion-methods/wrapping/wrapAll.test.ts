import $ from '../../../../index';

describe('wrapAll() method', () => {
    let root;

    beforeEach(() => {
        const html = `
      <div class="container">
        <p>First paragraph</p>
        <span>Inline element</span>
        <p>Second paragraph</p>
        <em>Another inline</em>
      </div>
    `;
        root = $(html);
    });

    test('wrapAll() should wrap all elements in the set with a single wrapper', () => {
        const paragraphs = root.find('p');
        paragraphs.wrapAll('<div class="wrapper"></div>');

        const wrapperElements = root.find('.wrapper');
        const wrapperElementsCount = wrapperElements.length;
        expect(wrapperElementsCount).toBe(1);
        const wrapperParagraphs = root.find('.wrapper').find('p');
        const wrapperParagraphsCount = wrapperParagraphs.length;
        expect(wrapperParagraphsCount).toBe(2);
        const firstWrapperParagraphText = wrapperParagraphs.eq(0).text();
        expect(firstWrapperParagraphText).toBe('First paragraph');
        const secondWrapperParagraphText = wrapperParagraphs.eq(1).text();
        expect(secondWrapperParagraphText).toBe('Second paragraph');
    });

    test('wrapAll() should place the wrapper at the position of the first element', () => {
        const elements = root.find('p, span');
        elements.wrapAll('<section class="section-wrapper"></section>');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(2); // section, em

        // The section should contain both p and span elements
        const section = root.find('.section-wrapper');
        const sectionParagraphs = section.find('p');
        const sectionParagraphsCount = sectionParagraphs.length;
        expect(sectionParagraphsCount).toBe(2);

        const sectionSpans = section.find('span');
        const sectionSpansCount = sectionSpans.length;
        expect(sectionSpansCount).toBe(1);
    });

    test('wrapAll() should handle nested wrapper structures', () => {
        const paragraphs = root.find('p');
        paragraphs.wrapAll('<div class="outer"><div class="inner"></div></div>');

        const outerWrapper = root.find('.outer');
        const outerWrapperCount = outerWrapper.length;
        expect(outerWrapperCount).toBe(1);

        // Elements should be placed in the innermost container
        const innerWrapper = outerWrapper.find('.inner');
        const innerWrapperParagraphs = innerWrapper.find('p');
        const innerWrapperParagraphsCount = innerWrapperParagraphs.length;
        expect(innerWrapperParagraphsCount).toBe(2);
    });

    test('wrapAll() should work with node objects', () => {
        const wrapperNode = {type: 'element', tagName: 'article', attributes: {class: 'article-wrapper'}, children: []};
        const paragraphs = root.find('p');
        paragraphs.wrapAll(wrapperNode);

        const articleWrapper = root.find('.article-wrapper');
        const articleWrapperCount = articleWrapper.length;
        expect(articleWrapperCount).toBe(1);

        const articleWrapperParagraphs = articleWrapper.find('p');
        const articleWrapperParagraphsCount = articleWrapperParagraphs.length;
        expect(articleWrapperParagraphsCount).toBe(2);
    });

    test('wrapAll() should work with JQ objects', () => {
        const wrapperJQ = $('<header class="header-wrapper"></header>');
        const paragraphs = root.find('p');
        paragraphs.wrapAll(wrapperJQ);

        const headerWrapper = root.find('.header-wrapper');
        const headerWrapperCount = headerWrapper.length;
        expect(headerWrapperCount).toBe(1);

        const headerWrapperParagraphs = headerWrapper.find('p');
        const headerWrapperParagraphsCount = headerWrapperParagraphs.length;
        expect(headerWrapperParagraphsCount).toBe(2);
    });

    test('wrapAll() should return the original JQ object for chaining', () => {
        const paragraphs = root.find('p');
        const result = paragraphs.wrapAll('<div></div>');

        expect(result).toBe(paragraphs);
    });

    test('wrapAll() should handle complex wrapper structures', () => {
        const paragraphs = root.find('p');
        paragraphs.wrapAll('<div class="complex"><section><article></article></section></div>');

        const complexWrapper = root.find('.complex');
        const complexWrapperCount = complexWrapper.length;
        expect(complexWrapperCount).toBe(1);
        // Elements should be placed in the innermost element (article)
        const complexWrapperArticleParagraphsCount = complexWrapper.find('article').find('p').length;
        expect(complexWrapperArticleParagraphsCount).toBe(2);
    });

    test('wrapAll() should do nothing with empty set', () => {
        const emptySet = root.find('.nonexistent');
        emptySet.wrapAll('<div></div>');

        // Should not modify the DOM
        const totalDivsCount = root.find('div').length;
        expect(totalDivsCount).toBe(1); // Only the original container
    });

    test('wrapAll() should handle single element', () => {
        const singleElement = root.find('p').first();
        singleElement.wrapAll('<div class="single-wrapper"></div>');

        const singleWrapper = root.find('.single-wrapper');
        const singleWrapperCount = singleWrapper.length;
        expect(singleWrapperCount).toBe(1);
        const singleWrapperParagraphText = root.find('.single-wrapper').find('p').text();
        expect(singleWrapperParagraphText).toBe('First paragraph');
    });

    test('wrapAll() should work when elements have no parent', () => {
        const detachedElements = $('<p>Detached 1</p><p>Detached 2</p>');
        // This should not throw an error
        expect(() => detachedElements.wrapAll('<div></div>')).not.toThrow();
    });
});
