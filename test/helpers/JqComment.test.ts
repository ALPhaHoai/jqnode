/**
 * Tests for JqComment class
 */

import { JqComment } from '../../dom/core/JqComment';
import { JqElement } from '../../types';

describe('JqComment', () => {
    describe('Constructor', () => {
        it('should create with no arguments', () => {
            const comment = new JqComment();
            expect(comment.data).toBe('');
            expect(comment.nodeType).toBe(8); // COMMENT_NODE
            expect(comment.nodeName).toBe('#comment');
        });

        it('should create with initial data', () => {
            const comment = new JqComment('This is a comment');
            expect(comment.data).toBe('This is a comment');
            expect(comment.nodeType).toBe(8);
        });

        it('should have correct node name', () => {
            const comment = new JqComment('test');
            expect(comment.nodeName).toBe('#comment');
        });
    });

    describe('fromJqElement', () => {
        it('should create JqComment from JqElement', () => {
            const jqElement = new JqElement('comment');
            jqElement.textData = 'Test comment content';

            const comment = JqComment.fromJqElement(jqElement);
            expect(comment.data).toBe('Test comment content');
            expect(comment.getJqElement()).toBe(jqElement);
        });

        it('should sync data changes with JqElement', () => {
            const jqElement = new JqElement('comment');
            jqElement.textData = 'Initial comment';

            const comment = JqComment.fromJqElement(jqElement);
            comment.data = 'Updated comment';

            expect(jqElement.textData).toBe('Updated comment');
            expect(comment.data).toBe('Updated comment');
        });

        it('should read data from JqElement', () => {
            const jqElement = new JqElement('comment');
            jqElement.textData = 'From JqElement';

            const comment = JqComment.fromJqElement(jqElement);
            jqElement.textData = 'Changed externally';

            expect(comment.data).toBe('Changed externally');
        });
    });

    describe('cloneNode', () => {
        it('should clone comment node', () => {
            const comment = new JqComment('Original comment');
            const cloned = comment.cloneNode();

            expect(cloned.data).toBe('Original comment');
            expect(cloned).not.toBe(comment);
            expect(cloned).toBeInstanceOf(JqComment);
        });

        it('should create independent clone', () => {
            const comment = new JqComment('Original');
            const cloned = comment.cloneNode();

            cloned.data = 'Modified';
            expect(comment.data).toBe('Original');
        });

        it('should ignore deep parameter', () => {
            const comment = new JqComment('test comment');
            const shallow = comment.cloneNode(false);
            const deep = comment.cloneNode(true);

            expect(shallow.data).toBe('test comment');
            expect(deep.data).toBe('test comment');
        });
    });

    describe('Inherited CharacterData methods', () => {
        it('should have data manipulation methods', () => {
            const comment = new JqComment('test');

            expect(typeof comment.appendData).toBe('function');
            expect(typeof comment.deleteData).toBe('function');
            expect(typeof comment.insertData).toBe('function');
            expect(typeof comment.replaceData).toBe('function');
            expect(typeof comment.substringData).toBe('function');
        });

        it('should use appendData correctly', () => {
            const comment = new JqComment('Start');
            comment.appendData(' End');
            expect(comment.data).toBe('Start End');
        });

        it('should use insertData correctly', () => {
            const comment = new JqComment('Heo');
            comment.insertData(2, 'll');
            expect(comment.data).toBe('Hello');
        });

        it('should use deleteData correctly', () => {
            const comment = new JqComment('Hello World');
            comment.deleteData(5, 6);
            expect(comment.data).toBe('Hello');
        });

        it('should use replaceData correctly', () => {
            const comment = new JqComment('Hello World');
            comment.replaceData(6, 5, 'There');
            expect(comment.data).toBe('Hello There');
        });

        it('should use substringData correctly', () => {
            const comment = new JqComment('Hello World');
            const substring = comment.substringData(0, 5);
            expect(substring).toBe('Hello');
        });
    });

    describe('Node interface properties', () => {
        it('should have correct nodeType', () => {
            const comment = new JqComment();
            expect(comment.nodeType).toBe(8);
            expect(comment.nodeType).toBe(comment.COMMENT_NODE);
        });

        it('should have correct nodeName', () => {
            const comment = new JqComment();
            expect(comment.nodeName).toBe('#comment');
        });

        it('should sync nodeValue with data', () => {
            const comment = new JqComment('test comment');
            expect(comment.nodeValue).toBe('test comment');

            comment.nodeValue = 'changed';
            expect(comment.data).toBe('changed');
        });

        it('should sync textContent with data', () => {
            const comment = new JqComment('test comment');
            expect(comment.textContent).toBe('test comment');

            comment.textContent = 'changed';
            expect(comment.data).toBe('changed');
        });
    });

    describe('CharacterData properties', () => {
        it('should report correct length', () => {
            const comment = new JqComment('Hello');
            expect(comment.length).toBe(5);

            comment.data = 'Hello World';
            expect(comment.length).toBe(11);
        });

        it('should allow empty data', () => {
            const comment = new JqComment('');
            expect(comment.length).toBe(0);
            expect(comment.data).toBe('');
        });
    });

    describe('Integration with JqElement', () => {
        it('should not have JqElement reference by default', () => {
            const comment = new JqComment('test');
            expect(comment.getJqElement()).toBeNull();
        });

        it('should maintain JqElement reference when created via fromJqElement', () => {
            const jqElement = new JqElement('comment');
            const comment = JqComment.fromJqElement(jqElement);

            expect(comment.getJqElement()).toBe(jqElement);
        });
    });

    describe('Comment-specific behavior', () => {
        it('should represent comments (not displayed but available in source)', () => {
            const comment = new JqComment('This comment should not display');
            expect(comment.data).toBe('This comment should not display');
            expect(comment.nodeName).toBe('#comment');
            expect(comment.nodeType).toBe(8);
        });

        it('should allow typical comment content', () => {
            const comment1 = new JqComment(' TODO: Fix this later ');
            expect(comment1.data).toBe(' TODO: Fix this later ');

            const comment2 = new JqComment(' Copyright 2024 ');
            expect(comment2.data).toBe(' Copyright 2024 ');

            const comment3 = new JqComment('[if IE]>...<![endif]');
            expect(comment3.data).toBe('[if IE]>...<![endif]');
        });
    });
});
