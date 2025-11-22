import $ from '../../../../index';
import JQ from '../../../../jq';

describe('wrapInner() method', () => {
    let root: JQ;

    beforeEach(() => {
        const html = `
      <div class="container">
        <p>First paragraph with <em>emphasis</em></p>
        <p>Second paragraph</p>
        <div class="empty-div"></div>
      </div>
    `;
        root = $(html);
    });

    test('wrapInner() should wrap the contents of each element', () => {
        const paragraphs = root.find('p');
        paragraphs.wrapInner('<span class="wrapper"></span>');

        const wrapperElements = root.find('.wrapper');
        const wrapperElementsCount = wrapperElements.length;
        expect(wrapperElementsCount).toBe(2);

        const firstParagraphHtml = root.find('p').eq(0).html();
        expect(firstParagraphHtml).toBe('<span class="wrapper">First paragraph with <em>emphasis</em></span>');

        const secondParagraphHtml = root.find('p').eq(1).html();
        expect(secondParagraphHtml).toBe('<span class="wrapper">Second paragraph</span>');
    });

    test('wrapInner() should work on multiple element types', () => {
        root.find('p, .empty-div').wrapInner('<section class="content-wrapper"></section>');

        const contentWrapperElements = root.find('.content-wrapper');
        const contentWrapperElementsCount = contentWrapperElements.length;
        expect(contentWrapperElementsCount).toBe(3); // 2 p + 1 div
        const emphasisElement = root.find('p').eq(0).find('.content-wrapper').find('em');
        const emphasisElementText = emphasisElement.text();
        expect(emphasisElementText).toBe('emphasis');
    });

    test('wrapInner() should handle nested wrapper structures', () => {
        const paragraphs = root.find('p');
        paragraphs.wrapInner('<div class="outer"><div class="inner"></div></div>');

        // The content should be placed in the innermost container
        const firstInnerEm = root.find('p').eq(0).find('.inner').find('em');
        const firstInnerEmText = firstInnerEm.text();
        expect(firstInnerEmText).toBe('emphasis');
        const secondInner = root.find('p').eq(1).find('.inner');
        const secondInnerText = secondInner.text();
        expect(secondInnerText).toBe('Second paragraph');
    });

    test('wrapInner() should work with node objects', () => {
        const wrapperNode = {type: 'element', tagName: 'article', attributes: {class: 'article-wrapper'}, children: []};
        const paragraphs = root.find('p');
        paragraphs.wrapInner(wrapperNode);

        const articleWrapperElements = root.find('.article-wrapper');
        const articleWrapperElementsCount = articleWrapperElements.length;
        expect(articleWrapperElementsCount).toBe(2);
        const articleWrapperEm = root.find('p').eq(0).find('.article-wrapper').find('em');
        const articleWrapperEmText = articleWrapperEm.text();
        expect(articleWrapperEmText).toBe('emphasis');
    });

    test('wrapInner() should work with JQ objects', () => {
        const wrapperJQ = $('<header class="header-wrapper"></header>');
        const paragraphs = root.find('p');
        paragraphs.wrapInner(wrapperJQ);

        const headerWrapperElements = root.find('.header-wrapper');
        const headerWrapperElementsCount = headerWrapperElements.length;
        expect(headerWrapperElementsCount).toBe(2);
        const headerWrapperEm = root.find('p').eq(0).find('.header-wrapper').find('em');
        const headerWrapperEmText = headerWrapperEm.text();
        expect(headerWrapperEmText).toBe('emphasis');
    });

    test('wrapInner() should return the original JQ object for chaining', () => {
        const paragraphs = root.find('p');
        const result = paragraphs.wrapInner('<div></div>');

        expect(result).toBe(paragraphs);
    });

    test('wrapInner() should handle complex wrapper structures', () => {
        const paragraphs = root.find('p');
        paragraphs.wrapInner('<div class="complex"><section><article></article></section></div>');

        // Content should be placed in the innermost element (article)
        const firstArticleEm = root.find('p').eq(0).find('article').find('em');
        const firstArticleEmText = firstArticleEm.text();
        expect(firstArticleEmText).toBe('emphasis');
        const secondArticle = root.find('p').eq(1).find('article');
        const secondArticleText = secondArticle.text();
        expect(secondArticleText).toBe('Second paragraph');
    });

    test('wrapInner() should handle empty elements', () => {
        root.find('.empty-div').wrapInner('<span>Content for empty</span>');

        const emptyDivSpan = root.find('.empty-div').find('span');
        const emptyDivSpanText = emptyDivSpan.text();
        expect(emptyDivSpanText).toBe('Content for empty');
    });

    test('wrapInner() should handle elements with only text content', () => {
        const secondParagraph = root.find('p').eq(1);
        secondParagraph.wrapInner('<strong></strong>');

        const secondParagraphStrongText = secondParagraph.find('strong').text();
        expect(secondParagraphStrongText).toBe('Second paragraph');
    });

    test('wrapInner() should handle elements with mixed content', () => {
        const firstParagraph = root.find('p').eq(0);
        firstParagraph.wrapInner('<mark></mark>');

        const markElement = firstParagraph.find('mark');
        const markElementText = markElement.text();
        expect(markElementText).toBe('First paragraph with emphasis');

        const markElementEm = markElement.find('em');
        const markElementEmText = markElementEm.text();
        expect(markElementEmText).toBe('emphasis');
    });

    test('wrapInner() should work when element has no children', () => {
        const emptyDiv = root.find('.empty-div');
        emptyDiv.wrapInner('<p>Added content</p>');

        const emptyDivPText = emptyDiv.find('p').text();
        expect(emptyDivPText).toBe('Added content');
    });
});
