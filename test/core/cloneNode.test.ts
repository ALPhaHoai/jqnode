import _cloneNode from '../../helpers/cloneNode';
import { JqElement } from '../../types';

describe('_cloneNode Helper', () => {
    test('should not share attributes reference between original and clone', () => {
        const original: JqElement = {
            type: 'element',
            name: 'div',
            attribs: { id: 'original' },
            attributes: { id: 'original' },
        };

        const clone = _cloneNode(original);

        expect(clone).not.toBe(original);
        expect(clone!.attributes).not.toBe(original.attributes);

        // Modify clone's attributes
        if (clone && clone.attributes) {
            clone.attributes['id'] = 'clone';
        }

        // Original should remain unchanged
        expect(original.attributes!['id']).toBe('original');
    });

    test('should not share attribs reference between original and clone', () => {
        const original: JqElement = {
            type: 'element',
            name: 'div',
            attribs: { id: 'original' },
            attributes: { id: 'original' },
        };

        const clone = _cloneNode(original);

        expect(clone).not.toBe(original);
        expect(clone!.attribs).not.toBe(original.attribs);

        // Modify clone's attribs
        if (clone && clone.attribs) {
            clone.attribs['id'] = 'clone';
        }

        // Original should remain unchanged
        expect(original.attribs!['id']).toBe('original');
    });

    test('should deep clone children by default', () => {
        const child: JqElement = {
            type: 'element',
            name: 'span',
            attribs: { class: 'child' },
        };
        const original: JqElement = {
            type: 'element',
            name: 'div',
            children: [child],
        };
        child.parent = original;

        const clone = _cloneNode(original);

        expect(clone).toBeDefined();
        expect(clone!.children).toHaveLength(1);
        expect(clone!.children![0]).not.toBe(child);
        expect(clone!.children![0].name).toBe('span');
        expect(clone!.children![0].parent).toBe(clone);
    });

    test('should shallow clone when deep is false', () => {
        const child: JqElement = {
            type: 'element',
            name: 'span',
        };
        const original: JqElement = {
            type: 'element',
            name: 'div',
            children: [child],
        };

        const clone = _cloneNode(original, false);

        expect(clone).toBeDefined();
        expect(clone?.children).toEqual([]);
    });

    test('should clone text nodes', () => {
        const original: JqElement = {
            type: 'text',
            data: 'Hello World',
        };

        const clone = _cloneNode(original);

        expect(clone).not.toBe(original);
        expect(clone!.type).toBe('text');
        expect(clone!.data).toBe('Hello World');
    });

    test('should clone comment nodes', () => {
        const original: JqElement = {
            type: 'comment',
            data: ' This is a comment ',
        };

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

