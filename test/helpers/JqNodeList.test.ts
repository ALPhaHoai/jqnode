import { JqNodeList, JqNodeListOf } from '../../dom/JqNodeList';
import { JqElement } from '../../types';

describe('JqNodeList', () => {
    let nodes: JqElement[];
    let nodeList: JqNodeList;

    beforeEach(() => {
        // Create test nodes
        nodes = [];

        const div1 = new JqElement('element', 'div');
        div1.setAttribute('id', 'first');
        nodes.push(div1);

        const div2 = new JqElement('element', 'div');
        div2.setAttribute('id', 'second');
        nodes.push(div2);

        const text = new JqElement('text');
        text.data = 'some text';
        nodes.push(text);

        nodeList = new JqNodeList(nodes);
    });

    it('should have correct length', () => {
        expect(nodeList.length).toBe(3);
    });

    it('should retrieve item by numeric index', () => {
        const item = nodeList.item(0);
        expect(item).not.toBeNull();
        expect((item as any).tagName).toBe('div');
    });

    it('should retrieve item using array notation', () => {
        const item = (nodeList as any)[0];
        expect(item).not.toBeUndefined();
        expect((item as any).tagName).toBe('div');
    });

    it('should return null for out-of-bounds index', () => {
        expect(nodeList.item(-1)).toBeNull();
        expect(nodeList.item(10)).toBeNull();
    });

    it('should be iterable with for...of loop', () => {
        const items: Node[] = [];
        for (const node of nodeList) {
            items.push(node);
        }
        expect(items.length).toBe(3);
        expect(items[0]).toBe(nodes[0] as unknown as Node);
    });

    it('should support forEach', () => {
        const items: Node[] = [];
        nodeList.forEach((node, index, list) => {
            items.push(node);
            expect(list).toBe(nodeList);
            expect(index).toBeGreaterThanOrEqual(0);
        });
        expect(items.length).toBe(3);
        expect(items[0]).toBe(nodes[0] as unknown as Node);
    });

    it('should support entries iterator', () => {
        const entries = Array.from(nodeList.entries());
        expect(entries.length).toBe(3);
        expect(entries[0][0]).toBe(0);
        expect(entries[0][1]).toBe(nodes[0] as unknown as Node);
    });

    it('should support keys iterator', () => {
        const keys = Array.from(nodeList.keys());
        expect(keys).toEqual([0, 1, 2]);
    });

    it('should support values iterator', () => {
        const values = Array.from(nodeList.values());
        expect(values.length).toBe(3);
        expect(values[0]).toBe(nodes[0] as unknown as Node);
    });

    it('should handle empty list', () => {
        const emptyList = new JqNodeList([]);
        expect(emptyList.length).toBe(0);
        expect(emptyList.item(0)).toBeNull();

        let count = 0;
        emptyList.forEach(() => count++);
        expect(count).toBe(0);
    });

    it('should update nodes using _setNodes', () => {
        const newNode = new JqElement('element', 'p');
        nodeList._setNodes([newNode]);
        expect(nodeList.length).toBe(1);
        expect(nodeList.item(0)).toBe(newNode as unknown as Node);
    });

    it('should retrieve nodes using _getNodes', () => {
        const retrieved = nodeList._getNodes();
        expect(retrieved).toBe(nodes);
        expect(retrieved.length).toBe(3);
    });
});

describe('JqNodeListOf', () => {
    it('should work with specific node types', () => {
        const div = new JqElement('element', 'div');
        const list = new JqNodeListOf<HTMLElement>([div]);

        const item = list.item(0);
        // TypeScript check: item should be inferred as HTMLElement | null
        // Runtime check:
        expect(item).toBe(div as unknown as HTMLElement);
    });

    it('should support typed forEach', () => {
        const div = new JqElement('element', 'div');
        const list = new JqNodeListOf<HTMLElement>([div]);

        list.forEach((node) => {
            // TypeScript check: node should be inferred as HTMLElement
            expect(node).toBe(div as unknown as HTMLElement);
        });
    });
});
