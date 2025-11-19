const $ = require('../../../index');

describe('removeAttr() method', () => {
    let root;

    beforeEach(() => {
        $.clearRootNodesRegistry();
        const html = `
      <div class="container" data-test="test-value" id="main">
        <input type="text" id="input1" value="initial" disabled/>
        <img src="image.jpg" alt="picture" title="Image Title"/>
        <p class="text" data-info="paragraph">Hello World</p>
      </div>
    `;
        root = $(html);
    });

    test('removeAttr() should remove attributes from elements', () => {
        const divElement = root.find('.container');
        expect(divElement.attr('data-test')).toBe('test-value');

        divElement.removeAttr('data-test');
        expect(divElement.attr('data-test')).toBeUndefined();
    });

    test('removeAttr() should remove multiple attributes from single element', () => {
        const divElement = root.find('.container');
        expect(divElement.attr('data-test')).toBe('test-value');
        expect(divElement.attr('id')).toBe('main');

        divElement.removeAttr('data-test').removeAttr('id');
        expect(divElement.attr('data-test')).toBeUndefined();
        expect(divElement.attr('id')).toBeUndefined();
    });

    test('removeAttr() should remove attributes from multiple elements', () => {
        const elements = root.find('[data-test], [id]');
        elements.removeAttr('data-test');

        const divElement = root.find('.container');
        expect(divElement.attr('data-test')).toBeUndefined();
    });

    test('removeAttr() should handle non-existent attributes gracefully', () => {
        const divElement = root.find('.container');
        expect(() => {
            divElement.removeAttr('non-existent');
        }).not.toThrow();

        // Element should remain unchanged
        expect(divElement.attr('data-test')).toBe('test-value');
    });

    test('removeAttr() should be chainable', () => {
        const divElement = root.find('.container');
        const result = divElement.removeAttr('data-test');
        expect(result).toBe(divElement);
    });

    test('removeAttr() should work with different attribute types', () => {
        const inputElement = root.find('#input1');
        const imgElement = root.find('img');

        // Remove boolean attribute
        expect(inputElement.attr('disabled')).toBeTruthy();
        inputElement.removeAttr('disabled');
        expect(inputElement.attr('disabled')).toBeUndefined();

        // Remove string attributes
        expect(imgElement.attr('src')).toBe('image.jpg');
        expect(imgElement.attr('alt')).toBe('picture');
        expect(imgElement.attr('title')).toBe('Image Title');

        imgElement.removeAttr('src').removeAttr('alt');
        expect(imgElement.attr('src')).toBeUndefined();
        expect(imgElement.attr('alt')).toBeUndefined();
        expect(imgElement.attr('title')).toBe('Image Title'); // Should still exist
    });

    test('removeAttr() should work on different element types', () => {
        const inputElement = root.find('#input1');
        const imgElement = root.find('img');
        const pElement = root.find('p');

        inputElement.removeAttr('value');
        imgElement.removeAttr('src');
        pElement.removeAttr('data-info');

        expect(inputElement.attr('value')).toBeUndefined();
        expect(imgElement.attr('src')).toBeUndefined();
        expect(pElement.attr('data-info')).toBeUndefined();
    });

    test('removeAttr() should handle empty selection', () => {
        const emptySelection = root.find('.non-existent');
        expect(() => {
            emptySelection.removeAttr('any-attribute');
        }).not.toThrow();
    });
});
