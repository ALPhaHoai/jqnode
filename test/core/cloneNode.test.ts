import _cloneNode from '../../helpers/cloneNode';
import { JqElement } from '../../dom/core/JqElement';

describe('_cloneNode Helper', () => {
    test('should not share attributes reference between original and clone', () => {
        const original = new JqElement('element', 'div');
        original.setAttribute('id', 'original');

        const clone = _cloneNode(original);

        expect(clone).not.toBe(original);
        expect(clone!.attributes).not.toBe(original.attributes);

        // Modify clone's attributes
        if (clone) {
            clone.setAttribute('id', 'clone');
        }

        // Original should remain unchanged
        expect(original.getAttribute('id')).toBe('original');
        expect(clone!.getAttribute('id')).toBe('clone');
    });

    test('should not share attribs reference between original and clone', () => {
        const original = new JqElement('element', 'div');
        original.setAttribute('id', 'original');

        const clone = _cloneNode(original);

        expect(clone).not.toBe(original);
        expect(clone!.attribs).not.toBe(original.attribs);

        // Modify clone's attribs (the plain object representation)
        if (clone && clone.attribs) {
            // Since attribs is a getter, we need to modify via setAttribute
            clone.setAttribute('id', 'clone');
        }

        // Original should remain unchanged
        expect(original.attribs!['id']).toBe('original');
        expect(clone!.attribs!['id']).toBe('clone');
    });

    test('should deep clone children by default', () => {
        const child = new JqElement('element', 'span');
        child.setAttribute('class', 'child');

        const original = new JqElement('element', 'div');
        original.appendChild(child as unknown as Node);

        const clone = _cloneNode(original);

        expect(clone).toBeDefined();
        expect(clone!.children).toHaveLength(1);
        expect(clone!.children![0]).not.toBe(child);
        expect(clone!.children![0].tagName).toBe('span');
        expect(clone!.children![0].parent).toBe(clone);
    });

    test('should shallow clone when deep is false', () => {
        const child = new JqElement('element', 'span');
        const original = new JqElement('element', 'div');
        original.appendChild(child as unknown as Node);

        const clone = _cloneNode(original, false);

        expect(clone).toBeDefined();
        expect(clone?.children).toEqual([]);
    });

    test('should clone text nodes', () => {
        const original = new JqElement('text');
        original.data = 'Hello World';

        const clone = _cloneNode(original);

        expect(clone).not.toBe(original);
        expect(clone!.type).toBe('text');
        expect(clone!.data).toBe('Hello World');
    });

    test('should clone comment nodes', () => {
        const original = new JqElement('comment');
        original.data = ' This is a comment ';

        const clone = _cloneNode(original);

        expect(clone).not.toBe(original);
        expect(clone!.type).toBe('comment');
        expect(clone!.data).toBe(' This is a comment ');
    });

    test('should return undefined/null if input is undefined/null', () => {
        expect(_cloneNode(undefined)).toBeUndefined();
        expect(_cloneNode(null)).toBeNull();
    });
});

