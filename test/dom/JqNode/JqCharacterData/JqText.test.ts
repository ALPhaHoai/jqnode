/**
 * Tests for JqText class
 */

import { JqText } from '../../../../dom/JqNode/JqCharacterData/JqText';
import { JqElement } from '../../../../types';

describe('JqText', () => {
    describe('Constructor', () => {
        it('should create with no arguments', () => {
            const text = new JqText();
            expect(text.data).toBe('');
            expect(text.nodeType).toBe(3); // TEXT_NODE
            expect(text.nodeName).toBe('#text');
        });

        it('should create with initial data', () => {
            const text = new JqText('Hello World');
            expect(text.data).toBe('Hello World');
            expect(text.nodeType).toBe(3);
        });

        it('should have correct node name', () => {
            const text = new JqText('test');
            expect(text.nodeName).toBe('#text');
        });
    });

    describe('fromJqElement', () => {
        it('should create JqText from JqElement', () => {
            const jqElement = new JqElement('text');
            jqElement.textData = 'Test content';

            const text = JqText.fromJqElement(jqElement);
            expect(text.data).toBe('Test content');
            expect(text.getJqElement()).toBe(jqElement);
        });

        it('should sync data changes with JqElement', () => {
            const jqElement = new JqElement('text');
            jqElement.textData = 'Initial';

            const text = JqText.fromJqElement(jqElement);
            text.data = 'Updated';

            expect(jqElement.textData).toBe('Updated');
            expect(text.data).toBe('Updated');
        });

        it('should read data from JqElement', () => {
            const jqElement = new JqElement('text');
            jqElement.textData = 'From JqElement';

            const text = JqText.fromJqElement(jqElement);
            jqElement.textData = 'Changed externally';

            expect(text.data).toBe('Changed externally');
        });
    });

    describe('assignedSlot', () => {
        it('should always return null', () => {
            const text = new JqText('test');
            expect(text.assignedSlot).toBeNull();
        });
    });

    describe('wholeText', () => {
        it('should return own text when no siblings', () => {
            const text = new JqText('Hello');
            expect(text.wholeText).toBe('Hello');
        });

        // Note: wholeText tests with siblings would require JqElement integration
        // and parent/sibling relationships to be set up properly
        // Those tests are better in integration tests
    });

    describe('splitText', () => {
        it('should split at offset', () => {
            const text = new JqText('HelloWorld');
            const newText = text.splitText(5);

            expect(text.data).toBe('Hello');
            expect(newText.data).toBe('World');
        });

        it('should split at beginning', () => {
            const text = new JqText('Test');
            const newText = text.splitText(0);

            expect(text.data).toBe('');
            expect(newText.data).toBe('Test');
        });

        it('should split at end', () => {
            const text = new JqText('Test');
            const newText = text.splitText(4);

            expect(text.data).toBe('Test');
            expect(newText.data).toBe('');
        });

        it('should split in middle', () => {
            const text = new JqText('abcdef');
            const newText = text.splitText(3);

            expect(text.data).toBe('abc');
            expect(newText.data).toBe('def');
        });

        it('should throw error for negative offset', () => {
            const text = new JqText('test');
            expect(() => text.splitText(-1)).toThrow();
        });

        it('should throw error for offset beyond length', () => {
            const text = new JqText('test');
            expect(() => text.splitText(10)).toThrow();
        });

        it('should return Text node', () => {
            const text = new JqText('test');
            const newText = text.splitText(2);

            expect(newText).toBeInstanceOf(JqText);
            expect(newText.nodeType).toBe(3);
            expect(newText.nodeName).toBe('#text');
        });
    });

    describe('cloneNode', () => {
        it('should clone text node', () => {
            const text = new JqText('Original');
            const cloned = text.cloneNode();

            expect(cloned.data).toBe('Original');
            expect(cloned).not.toBe(text);
            expect(cloned).toBeInstanceOf(JqText);
        });

        it('should create independent clone', () => {
            const text = new JqText('Original');
            const cloned = text.cloneNode();

            cloned.data = 'Modified';
            expect(text.data).toBe('Original');
        });

        it('should ignore deep parameter', () => {
            const text = new JqText('test');
            const shallow = text.cloneNode(false);
            const deep = text.cloneNode(true);

            expect(shallow.data).toBe('test');
            expect(deep.data).toBe('test');
        });
    });

    describe('Inherited CharacterData methods', () => {
        it('should have data manipulation methods', () => {
            const text = new JqText('test');

            expect(typeof text.appendData).toBe('function');
            expect(typeof text.deleteData).toBe('function');
            expect(typeof text.insertData).toBe('function');
            expect(typeof text.replaceData).toBe('function');
            expect(typeof text.substringData).toBe('function');
        });

        it('should use appendData correctly', () => {
            const text = new JqText('Hello');
            text.appendData(' World');
            expect(text.data).toBe('Hello World');
        });

        it('should use insertData correctly', () => {
            const text = new JqText('Heo');
            text.insertData(2, 'll');
            expect(text.data).toBe('Hello');
        });

        it('should use deleteData correctly', () => {
            const text = new JqText('Hello World');
            text.deleteData(5, 6);
            expect(text.data).toBe('Hello');
        });

        it('should use replaceData correctly', () => {
            const text = new JqText('Hello World');
            text.replaceData(6, 5, 'There');
            expect(text.data).toBe('Hello There');
        });

        it('should use substringData correctly', () => {
            const text = new JqText('Hello World');
            const substring = text.substringData(0, 5);
            expect(substring).toBe('Hello');
        });
    });

    describe('Node interface properties', () => {
        it('should have correct nodeType', () => {
            const text = new JqText();
            expect(text.nodeType).toBe(3);
            expect(text.nodeType).toBe(text.TEXT_NODE);
        });

        it('should have correct nodeName', () => {
            const text = new JqText();
            expect(text.nodeName).toBe('#text');
        });

        it('should sync nodeValue with data', () => {
            const text = new JqText('test');
            expect(text.nodeValue).toBe('test');

            text.nodeValue = 'changed';
            expect(text.data).toBe('changed');
        });

        it('should sync textContent with data', () => {
            const text = new JqText('test');
            expect(text.textContent).toBe('test');

            text.textContent = 'changed';
            expect(text.data).toBe('changed');
        });
    });

    describe('Integration with JqElement', () => {
        it('should not have JqElement reference by default', () => {
            const text = new JqText('test');
            expect(text.getJqElement()).toBeNull();
        });

        it('should maintain JqElement reference when created via fromJqElement', () => {
            const jqElement = new JqElement('text');
            const text = JqText.fromJqElement(jqElement);

            expect(text.getJqElement()).toBe(jqElement);
        });
    });
});
