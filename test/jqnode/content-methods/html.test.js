const $ = require('../../../index');

describe('html() method', () => {
    let root;

    beforeEach(() => {
        const html = `
      <div class="post" id="main">
        <h1 style="color:red">Hello</h1>
        <p data-info='some info'>World</p>
        <img src="image.jpg" alt='pic'/>
      </div>
    `;
        root = $(html);
    });

    test('html() should return inner HTML', () => {
        const h1Element = root.find('h1');
        expect(h1Element.html()).toBe('Hello');

        const divElement = root.find('div');
        expect(divElement.html()).toContain('<h1 style="color:red">Hello</h1>');
        expect(divElement.html()).toContain('<p data-info="some info">World</p>');
        expect(divElement.html()).toContain('<img src="image.jpg" alt="pic">');
    });

    test('html() should handle self-closing tags correctly', () => {
        const imgElement = root.find('img');
        expect(imgElement.html()).toBe(''); // Self-closing tags have no inner HTML
    });
});
