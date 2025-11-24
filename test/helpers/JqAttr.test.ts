import { JqAttr } from '../../dom/JqAttr';
import { JqElement } from '../../types';

describe('JqAttr', () => {
    let node: JqElement;

    beforeEach(() => {
        node = new JqElement('element', 'div');
        node.setAttribute('id', 'test-id');
        node.setAttribute('class', 'test-class');
    });

    it('should reflect node attributes', () => {
        const attr = new JqAttr('id', node);
        expect(attr.value).toBe('test-id');

        node.setAttribute('id', 'changed');
        expect(attr.value).toBe('changed');
    });

    it('should update node attributes', () => {
        const attr = new JqAttr('id', node);
        attr.value = 'updated';
        expect(node.getAttribute('id')).toBe('updated');
    });

    it('should implement basic Node properties', () => {
        const attr = new JqAttr('id', node);
        expect(attr.nodeType).toBe(2);
        expect(attr.nodeName).toBe('id');
        expect(attr.specified).toBe(true);
    });

    it('should clone node', () => {
        const attr = new JqAttr('id', node);
        const clone = attr.cloneNode();

        // Clone should be detached (no owner element)
        expect(clone).not.toBe(attr);
        expect(clone.name).toBe(attr.name);
        expect(clone.value).toBe(attr.value);
        expect(clone.ownerElement).toBeNull();

        // Clone should be independent
        clone.value = 'modified';
        expect(attr.value).toBe('test-id'); // Original unchanged
    });

    it('should create detached attribute', () => {
        const detached = new JqAttr('standalone', 'standalone-value');

        expect(detached.name).toBe('standalone');
        expect(detached.value).toBe('standalone-value');
        expect(detached.ownerElement).toBeNull();
        expect(detached.nodeType).toBe(2);
    });

    it('should allow detached attribute value changes', () => {
        const detached = new JqAttr('test');

        expect(detached.value).toBe('');
        detached.value = 'new-value';
        expect(detached.value).toBe('new-value');
    });
});


