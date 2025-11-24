import { JqAttr } from '../../dom/JqAttr';
import { HtmlNode } from '../../types';

describe('JqAttr', () => {
    let node: HtmlNode;

    beforeEach(() => {
        node = new HtmlNode('element', 'div');
        node.setAttribute('id', 'test-id');
        node.setAttribute('class', 'test-class');
    });

    it('should reflect node attributes', () => {
        const attr = new JqAttr(node, 'id');
        expect(attr.value).toBe('test-id');

        node.setAttribute('id', 'changed');
        expect(attr.value).toBe('changed');
    });

    it('should update node attributes', () => {
        const attr = new JqAttr(node, 'id');
        attr.value = 'updated';
        expect(node.getAttribute('id')).toBe('updated');
    });

    it('should implement basic Node properties', () => {
        const attr = new JqAttr(node, 'id');
        expect(attr.nodeType).toBe(2);
        expect(attr.nodeName).toBe('id');
        expect(attr.specified).toBe(true);
    });

    it('should clone node', () => {
        const attr = new JqAttr(node, 'id');
        const clone = attr.cloneNode();
        expect(clone).not.toBe(attr);
        expect(clone.name).toBe(attr.name);
        expect(clone.value).toBe(attr.value);
    });
});


