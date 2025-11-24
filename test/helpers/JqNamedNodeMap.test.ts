import { JqNamedNodeMap } from '../../dom/JqNamedNodeMap';
import { JqAttr } from '../../dom/JqAttr';
import { HtmlNode } from '../../types';

describe('JqNamedNodeMap', () => {
    let node: HtmlNode;
    let attributes: JqNamedNodeMap;

    beforeEach(() => {
        node = new HtmlNode('element', 'div');
        node.setAttribute('id', 'test-id');
        node.setAttribute('class', 'test-class');
        node.setAttribute('data-value', '123');
        attributes = node.attributes;
    });

    it('should have correct length', () => {
        expect(attributes.length).toBe(3);
    });

    it('should retrieve item by index', () => {
        const attr = attributes.item(0);
        expect(attr).not.toBeNull();
        expect(attr?.name).toBe('id');
        expect(attr?.value).toBe('test-id');
    });

    it('should retrieve item by name', () => {
        const attr = attributes.getNamedItem('class');
        expect(attr).not.toBeNull();
        expect(attr?.name).toBe('class');
        expect(attr?.value).toBe('test-class');
    });

    it('should return null for non-existent item', () => {
        expect(attributes.getNamedItem('non-existent')).toBeNull();
    });

    it('should support array access via proxy', () => {
        expect(attributes[0]).not.toBeUndefined();
        expect(attributes[0].name).toBe('id');
        expect(attributes[1].name).toBe('class');
    });

    it('should be iterable', () => {
        const names: string[] = [];
        for (const attr of attributes) {
            names.push(attr.name);
        }
        expect(names).toEqual(['id', 'class', 'data-value']);
    });

    it('should remove named item', () => {
        attributes.removeNamedItem('id');
        expect(attributes.length).toBe(2);
        expect(attributes.getNamedItem('id')).toBeNull();
        expect(node.getAttribute('id')).toBeNull();
    });

    it('should set named item', () => {
        const newAttr = new JqAttr(node, 'new-attr');
        newAttr.value = 'new-value';
        attributes.setNamedItem(newAttr);

        expect(attributes.length).toBe(4);
        expect(attributes.getNamedItem('new-attr')?.value).toBe('new-value');
        expect(node.getAttribute('new-attr')).toBe('new-value');
    });
});


