import $ from '../../../../index';
import JQ from '../../../../jq';

describe('wrap() method', () => {
    let root: JQ;

    beforeEach(() => {
        const html = `
      <div class="container">
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <span>Inline element</span>
      </div>
    `;
        root = $(html);
    });

    test('wrap() should wrap each element with the provided HTML structure', () => {
        const paragraphs = root.find('p');
        paragraphs.wrap('<div class="wrapper"></div>');

        const wrapperElements = root.find('.wrapper');
        const wrapperElementsCount = wrapperElements.length;
        expect(wrapperElementsCount).toBe(2);
        const firstWrapperParagraph = root.find('.wrapper').eq(0).find('p');

        const firstWrapperParagraphText = firstWrapperParagraph.text();
        expect(firstWrapperParagraphText).toBe('First paragraph');

        const secondWrapperParagraph = root.find('.wrapper').eq(1).find('p');

        const secondWrapperParagraphText = secondWrapperParagraph.text();
        expect(secondWrapperParagraphText).toBe('Second paragraph');
    });

    test('wrap() should wrap each element individually', () => {
        root.find('p, span').wrap('<section class="section"></section>');

        const sectionElements = root.find('.section');
        const sectionElementsCount = sectionElements.length;
        expect(sectionElementsCount).toBe(3); // 2 p + 1 span
        const firstSectionParagraph = root.find('.section').eq(0).find('p');

        const firstSectionParagraphText = firstSectionParagraph.text();
        expect(firstSectionParagraphText).toBe('First paragraph');

        const secondSectionParagraph = root.find('.section').eq(1).find('p');

        const secondSectionParagraphText = secondSectionParagraph.text();
        expect(secondSectionParagraphText).toBe('Second paragraph');

        const thirdSectionSpan = root.find('.section').eq(2).find('span');

        const thirdSectionSpanText = thirdSectionSpan.text();
        expect(thirdSectionSpanText).toBe('Inline element');
    });

    test('wrap() should handle nested wrapper structures', () => {
        const paragraphs = root.find('p');
        paragraphs.wrap('<div class="outer"><div class="inner"></div></div>');

        // The wrapper should place elements in the innermost container
        const wrappers = root.find('.outer');
        const wrappersCount = wrappers.length;
        expect(wrappersCount).toBe(2);
        const firstWrapperInnerParagraph = wrappers.eq(0).find('.inner').find('p');

        const firstWrapperInnerParagraphText = firstWrapperInnerParagraph.text();
        expect(firstWrapperInnerParagraphText).toBe('First paragraph');

        const secondWrapperInnerParagraph = wrappers.eq(1).find('.inner').find('p');

        const secondWrapperInnerParagraphText = secondWrapperInnerParagraph.text();
        expect(secondWrapperInnerParagraphText).toBe('Second paragraph');
    });

    test('wrap() should work with node objects', () => {
        const wrapperNode = {type: 'element', tagName: 'article', attributes: {class: 'article-wrapper'}, children: []};
        const paragraphs = root.find('p');
        paragraphs.wrap(wrapperNode);

        const articleWrapperElements = root.find('.article-wrapper');
        const articleWrapperElementsCount = articleWrapperElements.length;
        expect(articleWrapperElementsCount).toBe(2);
        const firstArticleWrapperParagraph = root.find('.article-wrapper').eq(0).find('p');

        const firstArticleWrapperParagraphText = firstArticleWrapperParagraph.text();
        expect(firstArticleWrapperParagraphText).toBe('First paragraph');
    });

    test('wrap() should work with JQ objects', () => {
        const wrapperJQ = $('<header class="header-wrapper"></header>');
        const paragraphs = root.find('p');
        paragraphs.wrap(wrapperJQ);

        const headerWrapperElements = root.find('.header-wrapper');
        const headerWrapperElementsCount = headerWrapperElements.length;
        expect(headerWrapperElementsCount).toBe(2);
        const firstHeaderWrapperParagraph = root.find('.header-wrapper').eq(0).find('p');
        const firstHeaderWrapperParagraphText = firstHeaderWrapperParagraph.text();
        expect(firstHeaderWrapperParagraphText).toBe('First paragraph');
    });

    test('wrap() should return the original JQ object for chaining', () => {
        const paragraphs = root.find('p');
        const result = paragraphs.wrap('<div></div>');

        expect(result).toBe(paragraphs);
    });

    test('wrap() should handle complex wrapper structures', () => {
        const paragraphs = root.find('p');
        paragraphs.wrap('<div class="complex"><section><article></article></section></div>');

        const complexWrappers = root.find('.complex');
        const complexWrappersCount = complexWrappers.length;
        expect(complexWrappersCount).toBe(2);
        // Elements should be placed in the innermost element (article)
        const firstComplexWrapperArticleP = complexWrappers.eq(0).find('article').find('p');

        const firstComplexWrapperArticlePText = firstComplexWrapperArticleP.text();
        expect(firstComplexWrapperArticlePText).toBe('First paragraph');

        const secondComplexWrapperArticleP = complexWrappers.eq(1).find('article').find('p');

        const secondComplexWrapperArticlePText = secondComplexWrapperArticleP.text();
        expect(secondComplexWrapperArticlePText).toBe('Second paragraph');
    });

    test('wrap() should work when element has no parent', () => {
        const detachedElement = $('<p>Detached</p>');
        // This should not throw an error and should not modify anything
        expect(() => detachedElement.wrap('<div></div>')).not.toThrow();
        const detachedElementParent = detachedElement.nodes[0].parent;
        expect(detachedElementParent).toBeNull();
    });

    test('wrap() should handle self-closing wrapper elements', () => {
        const paragraphs = root.find('p');
        paragraphs.wrap('<br/>');

        // br is self-closing, so elements should be wrapped but br won't contain them
        // This is a bit of an edge case - let's check what happens
        const container = root.find('.container');
        // The paragraphs should still be there but the br elements should be siblings
        const containerParagraphs = container.find('p');
        const containerParagraphsCount = containerParagraphs.length;
        expect(containerParagraphsCount).toBe(2);
        const containerBrElements = container.find('br');
        const containerBrElementsCount = containerBrElements.length;
        expect(containerBrElementsCount).toBe(2);
    });
});
