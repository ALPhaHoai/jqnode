import $ from '../../../index';

describe('text() method', () => {
    let root;

    beforeEach(() => {
        $.clearRootNodesRegistry();
        const html = `
      <div class="post" id="main">
        <h1 style="color:red">Hello</h1>
        <p data-info='some info'>World</p>
        <img src="image.jpg" alt='pic'/>
      </div>
    `;
        root = $(html);
    });

    test('text() should get text content', () => {
        const h1Element = root.find('h1');
        expect(h1Element.text()).toBe('Hello');

        const pElement = root.find('p');
        expect(pElement.text()).toBe('World');

        expect(root.text().trim()).toBe('Hello\n        World');
    });

    test('text() should set text content', () => {
        const h1Element = root.find('h1');
        h1Element.text('Updated!');
        expect(h1Element.text()).toBe('Updated!');
    });
});
