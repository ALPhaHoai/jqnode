import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('html() method - Node-Query vs jQuery Comparison', () => {
    let nqRoot, jqRoot;

    beforeEach(() => {
        const html = `
      <div class="post" id="main">
        <h1 style="color:red">Hello</h1>
        <p data-info='some info'>World</p>
        <img src="image.jpg" alt='pic'/>
      </div>
    `;

        // Use the helper to create consistent DOM setup
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('html() should return inner HTML - jquery-comparison', () => {
        const nqH1Element = nqRoot.find('h1');
        const jqH1Element = jqRoot.find('h1');

        expect(nqH1Element.html()).toBe('Hello');
        expect(jqH1Element.html()).toBe('Hello');

        const nqDivElement = nqRoot.find('div');
        const jqDivElement = jqRoot.find('div');

        // Get raw HTML to match jQuery's exact output
        const nqHtml = nqDivElement.html();
        const jqHtml = jqDivElement.html();

        expect(nqHtml).toContain('<h1 style="color:red">Hello</h1>');
        expect(jqHtml).toContain('<h1 style="color:red">Hello</h1>');

        expect(nqHtml).toContain('<p data-info="some info">World</p>');
        expect(jqHtml).toContain('<p data-info="some info">World</p>');

        // jQuery outputs regular img tags (not self-closing)
        expect(nqHtml).toContain('<img src="image.jpg" alt="pic">');
        expect(jqHtml).toContain('<img src="image.jpg" alt="pic">');
    });

    test('html() should handle self-closing tags correctly - jquery-comparison', () => {
        const nqImgElement = nqRoot.find('img');
        const jqImgElement = jqRoot.find('img');

        expect(nqImgElement.html()).toBe(''); // Self-closing tags have no inner HTML
        expect(jqImgElement.html()).toBe(''); // Self-closing tags have no inner HTML
    });
});
