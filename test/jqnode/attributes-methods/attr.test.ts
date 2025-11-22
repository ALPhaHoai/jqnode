import $ from '../../../index';

describe('attr() method', () => {
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

    test('attr() should get attribute values', () => {
        const pElement = root.find('p');
        expect(pElement.attr('data-info')).toBe('some info');

        const imgElement = root.find('img');
        expect(imgElement.attr('src')).toBe('image.jpg');
        expect(imgElement.attr('alt')).toBe('pic');
    });

    test('attr() should return undefined for non-existent attributes', () => {
        const divElement = root.find('div');
        expect(divElement.attr('non-existent')).toBeUndefined();
    });

    test('attr() should set attribute values', () => {
        const pElement = root.find('p');
        pElement.attr('new-attr', 'new-value');
        expect(pElement.attr('new-attr')).toBe('new-value');
    });
});
