const $ = require('../../../index');
const jQuery = require('jquery');
const { createTestDom } = require('../../utils/jquery-comparison-helpers');

describe('text() method - Node-Query vs jQuery Comparison', () => {
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

    test('text() should get text content - jquery-comparison', () => {
        const nqH1Element = nqRoot.find('h1');
        const jqH1Element = jqRoot.find('h1');

        expect(nqH1Element.text()).toBe('Hello');
        expect(jqH1Element.text()).toBe('Hello');

        const nqPElement = nqRoot.find('p');
        const jqPElement = jqRoot.find('p');

        expect(nqPElement.text()).toBe('World');
        expect(jqPElement.text()).toBe('World');

        // Root element text content jquery-comparison
        // Both node-query and jQuery preserve whitespace including newlines
        expect(nqRoot.text()).toBe(jqRoot.text());
        expect(nqRoot.text().trim()).toBe('Hello\n        World');
    });

    test('text() should set text content - jquery-comparison', () => {
        const nqH1Element = nqRoot.find('h1');
        const jqH1Element = jqRoot.find('h1');

        nqH1Element.text('Updated!');
        jqH1Element.text('Updated!');

        expect(nqH1Element.text()).toBe('Updated!');
        expect(jqH1Element.text()).toBe('Updated!');
        expect(nqH1Element.text()).toBe(jqH1Element.text());
    });
});
