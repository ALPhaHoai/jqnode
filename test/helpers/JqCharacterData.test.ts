/**
 * Tests for JqCharacterData class
 */

import { JqCharacterData } from '../../dom/JqCharacterData';
import { JqText } from '../../dom/JqText';

// Use JqText as concrete implementation for testing abstract JqCharacterData
describe('JqCharacterData', () => {
    describe('Constructor and basic properties', () => {
        it('should create with empty data by default', () => {
            const text = new JqText();
            expect(text.data).toBe('');
            expect(text.length).toBe(0);
        });

        it('should create with initial data', () => {
            const text = new JqText('Hello World');
            expect(text.data).toBe('Hello World');
            expect(text.length).toBe(11);
        });

        it('should have correct node properties', () => {
            const text = new JqText('test');
            expect(text.nodeValue).toBe('test');
            expect(text.textContent).toBe('test');
        });
    });

    describe('Data property', () => {
        it('should get and set data', () => {
            const text = new JqText('initial');
            expect(text.data).toBe('initial');

            text.data = 'updated';
            expect(text.data).toBe('updated');
        });

        it('should update length when data changes', () => {
            const text = new JqText('short');
            expect(text.length).toBe(5);

            text.data = 'much longer text';
            expect(text.length).toBe(16);
        });

        it('should sync with nodeValue', () => {
            const text = new JqText('test');
            text.nodeValue = 'changed';
            expect(text.data).toBe('changed');
        });

        it('should sync with textContent', () => {
            const text = new JqText('test');
            text.textContent = 'changed';
            expect(text.data).toBe('changed');
        });
    });

    describe('appendData', () => {
        it('should append data to existing content', () => {
            const text = new JqText('Hello');
            text.appendData(' World');
            expect(text.data).toBe('Hello World');
            expect(text.length).toBe(11);
        });

        it('should append to empty data', () => {
            const text = new JqText();
            text.appendData('New content');
            expect(text.data).toBe('New content');
        });
    });

    describe('deleteData', () => {
        it('should delete characters at offset', () => {
            const text = new JqText('Hello World');
            text.deleteData(5, 6); // Remove ' World'
            expect(text.data).toBe('Hello');
        });

        it('should delete from middle', () => {
            const text = new JqText('abcdefgh');
            text.deleteData(2, 4); // Remove 'cdef'
            expect(text.data).toBe('abgh');
        });

        it('should handle delete beyond length', () => {
            const text = new JqText('Hello');
            text.deleteData(3, 100); // Remove from index 3 to end
            expect(text.data).toBe('Hel');
        });

        it('should throw error for negative offset', () => {
            const text = new JqText('test');
            expect(() => text.deleteData(-1, 2)).toThrow();
        });

        it('should throw error for offset beyond length', () => {
            const text = new JqText('test');
            expect(() => text.deleteData(10, 2)).toThrow();
        });
    });

    describe('insertData', () => {
        it('should insert at beginning', () => {
            const text = new JqText('World');
            text.insertData(0, 'Hello ');
            expect(text.data).toBe('Hello World');
        });

        it('should insert in middle', () => {
            const text = new JqText('ac');
            text.insertData(1, 'b');
            expect(text.data).toBe('abc');
        });

        it('should insert at end', () => {
            const text = new JqText('Hello');
            text.insertData(5, ' World');
            expect(text.data).toBe('Hello World');
        });

        it('should throw error for negative offset', () => {
            const text = new JqText('test');
            expect(() => text.insertData(-1, 'x')).toThrow();
        });

        it('should throw error for offset beyond length', () => {
            const text = new JqText('test');
            expect(() => text.insertData(10, 'x')).toThrow();
        });
    });

    describe('replaceData', () => {
        it('should replace characters', () => {
            const text = new JqText('Hello World');
            text.replaceData(6, 5, 'JavaScript'); // Replace 'World' with 'JavaScript'
            expect(text.data).toBe('Hello JavaScript');
        });

        it('should replace at beginning', () => {
            const text = new JqText('Hello World');
            text.replaceData(0, 5, 'Hi'); // Replace 'Hello' with 'Hi'
            expect(text.data).toBe('Hi World');
        });

        it('should work like delete when replacement is empty', () => {
            const text = new JqText('Hello World');
            text.replaceData(5, 6, ''); // Remove ' World'
            expect(text.data).toBe('Hello');
        });

        it('should throw error for negative offset', () => {
            const text = new JqText('test');
            expect(() => text.replaceData(-1, 2, 'x')).toThrow();
        });
    });

    describe('substringData', () => {
        it('should return substring', () => {
            const text = new JqText('Hello World');
            const substring = text.substringData(0, 5);
            expect(substring).toBe('Hello');
        });

        it('should return substring from middle', () => {
            const text = new JqText('Hello World');
            const substring = text.substringData(6, 5);
            expect(substring).toBe('World');
        });

        it('should handle count beyond length', () => {
            const text = new JqText('Hello');
            const substring = text.substringData(2, 100);
            expect(substring).toBe('llo');
        });

        it('should throw error for negative offset', () => {
            const text = new JqText('test');
            expect(() => text.substringData(-1, 2)).toThrow();
        });

        it('should throw error for offset beyond length', () => {
            const text = new JqText('test');
            expect(() => text.substringData(10, 2)).toThrow();
        });
    });

    describe('Element sibling navigation', () => {
        it('should return null for nextElementSibling when no siblings', () => {
            const text = new JqText('test');
            expect(text.nextElementSibling).toBeNull();
        });

        it('should return null for previousElementSibling when no siblings', () => {
            const text = new JqText('test');
            expect(text.previousElementSibling).toBeNull();
        });

        // Note: More comprehensive sibling tests would require integration with HtmlNode
        // and are better suited for integration tests
    });

    describe('Node manipulation methods', () => {
        it('should have remove method', () => {
            const text = new JqText('test');
            expect(typeof text.remove).toBe('function');
        });

        it('should have after method', () => {
            const text = new JqText('test');
            expect(typeof text.after).toBe('function');
        });

        it('should have before method', () => {
            const text = new JqText('test');
            expect(typeof text.before).toBe('function');
        });

        it('should have replaceWith method', () => {
            const text = new JqText('test');
            expect(typeof text.replaceWith).toBe('function');
        });
    });
});
