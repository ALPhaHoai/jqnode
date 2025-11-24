import { JqHTMLCollection } from '../../dom/collections/JqHTMLCollection';
import { JqElement } from '../../types';

describe('JqHTMLCollection', () => {
    let elements: JqElement[];
    let collection: JqHTMLCollection;

    beforeEach(() => {
        // Create test elements
        elements = [];

        const div1 = new JqElement('element', 'div');
        div1.setAttribute('id', 'first');
        div1.setAttribute('name', 'div-one');
        elements.push(div1);

        const div2 = new JqElement('element', 'div');
        div2.setAttribute('id', 'second');
        div2.setAttribute('name', 'div-two');
        elements.push(div2);

        const span = new JqElement('element', 'span');
        span.setAttribute('id', 'third');
        elements.push(span);

        collection = new JqHTMLCollection(elements);
    });

    it('should have correct length', () => {
        expect(collection.length).toBe(3);
    });

    it('should retrieve item by numeric index', () => {
        const item = collection.item(0);
        expect(item).not.toBeNull();
        expect((item as any).tagName).toBe('div');
    });

    it('should retrieve item using array notation', () => {
        const item = (collection as any)[0];
        expect(item).not.toBeUndefined();
        expect((item as any).tagName).toBe('div');
    });

    it('should return null for out-of-bounds index', () => {
        expect(collection.item(-1)).toBeNull();
        expect(collection.item(10)).toBeNull();
    });

    it('should retrieve item by ID using namedItem', () => {
        const item = collection.namedItem('first');
        expect(item).not.toBeNull();
        expect((item as any).getAttribute('id')).toBe('first');
    });

    it('should retrieve item by name attribute using namedItem', () => {
        const item = collection.namedItem('div-one');
        expect(item).not.toBeNull();
        expect((item as any).getAttribute('name')).toBe('div-one');
    });

    it('should support named access via proxy', () => {
        const item = (collection as any)['first'];
        expect(item).not.toBeUndefined();
        expect(item.getAttribute('id')).toBe('first');
    });

    it('should return null for non-existent name', () => {
        expect(collection.namedItem('non-existent')).toBeNull();
    });

    it('should be iterable with for...of loop', () => {
        const ids: string[] = [];
        for (const element of collection) {
            const id = (element as any).getAttribute('id');
            if (id) {
                ids.push(id);
            }
        }
        expect(ids).toEqual(['first', 'second', 'third']);
    });

    it('should prioritize ID over name in namedItem', () => {
        const div = new JqElement('element', 'div');
        div.setAttribute('id', 'priority-test');
        div.setAttribute('name', 'priority-test');

        const div2 = new JqElement('element', 'div');
        div2.setAttribute('name', 'priority-test');

        const testCollection = new JqHTMLCollection([div2, div]);
        const item = testCollection.namedItem('priority-test');

        // Should return the element with matching ID, not name
        expect(item).toBe(div as any);
    });

    it('should handle empty collection', () => {
        const emptyCollection = new JqHTMLCollection([]);
        expect(emptyCollection.length).toBe(0);
        expect(emptyCollection.item(0)).toBeNull();
        expect(emptyCollection.namedItem('anything')).toBeNull();
    });

    it('should update elements using _setElements', () => {
        const newElement = new JqElement('element', 'p');
        newElement.setAttribute('id', 'new');

        collection._setElements([newElement]);
        expect(collection.length).toBe(1);
        expect(collection.item(0)).toBe(newElement as any);
    });

    it('should retrieve elements using _getElements', () => {
        const retrieved = collection._getElements();
        expect(retrieved).toBe(elements);
        expect(retrieved.length).toBe(3);
    });
});
