/**
 * Tests for JqDOMTokenList implementation
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { JqDOMTokenList } from '../../../dom/collections/JqDOMTokenList';
import { JqElement } from '../../../dom/JqNode/JqElement/JqElement';

describe('JqDOMTokenList', () => {
    let element: JqElement;
    let tokenList: JqDOMTokenList;

    beforeEach(() => {
        element = new JqElement('element', 'div');
        element.setAttribute('class', 'foo bar baz');
        tokenList = new JqDOMTokenList(element as unknown as Element, 'class');
    });

    describe('initialization', () => {
        it('should parse existing class attribute', () => {
            expect(tokenList.length).toBe(3);
            expect(tokenList.contains('foo')).toBe(true);
            expect(tokenList.contains('bar')).toBe(true);
            expect(tokenList.contains('baz')).toBe(true);
        });

        it('should handle empty class attribute', () => {
            const emptyElement = new JqElement('element', 'div');
            const emptyList = new JqDOMTokenList(emptyElement as unknown as Element, 'class');
            expect(emptyList.length).toBe(0);
        });

        it('should handle whitespace in class attribute', () => {
            element.setAttribute('class', '  foo   bar  ');
            tokenList = new JqDOMTokenList(element as unknown as Element, 'class');
            expect(tokenList.length).toBe(2);
            expect(tokenList.contains('foo')).toBe(true);
            expect(tokenList.contains('bar')).toBe(true);
        });
    });

    describe('length property', () => {
        it('should return the number of tokens', () => {
            expect(tokenList.length).toBe(3);
        });

        it('should update when tokens are added', () => {
            tokenList.add('qux');
            expect(tokenList.length).toBe(4);
        });

        it('should update when tokens are removed', () => {
            tokenList.remove('foo');
            expect(tokenList.length).toBe(2);
        });
    });

    describe('value property', () => {
        it('should return space-separated token list', () => {
            expect(tokenList.value).toBe('foo bar baz');
        });

        it('should set tokens from string', () => {
            tokenList.value = 'new classes here';
            expect(tokenList.length).toBe(3);
            expect(tokenList.contains('new')).toBe(true);
            expect(tokenList.contains('classes')).toBe(true);
            expect(tokenList.contains('here')).toBe(true);
        });
    });

    describe('item method', () => {
        it('should return token at index', () => {
            expect(tokenList.item(0)).toBe('foo');
            expect(tokenList.item(1)).toBe('bar');
            expect(tokenList.item(2)).toBe('baz');
        });

        it('should return null for out of bounds index', () => {
            expect(tokenList.item(-1)).toBe(null);
            expect(tokenList.item(3)).toBe(null);
            expect(tokenList.item(100)).toBe(null);
        });
    });

    describe('contains method', () => {
        it('should return true if token exists', () => {
            expect(tokenList.contains('foo')).toBe(true);
            expect(tokenList.contains('bar')).toBe(true);
        });

        it('should return false if token does not exist', () => {
            expect(tokenList.contains('qux')).toBe(false);
            expect(tokenList.contains('nonexistent')).toBe(false);
        });
    });

    describe('add method', () => {
        it('should add a single token', () => {
            tokenList.add('qux');
            expect(tokenList.length).toBe(4);
            expect(tokenList.contains('qux')).toBe(true);
        });

        it('should add multiple tokens', () => {
            tokenList.add('qux', 'quux');
            expect(tokenList.length).toBe(5);
            expect(tokenList.contains('qux')).toBe(true);
            expect(tokenList.contains('quux')).toBe(true);
        });

        it('should not add duplicate tokens', () => {
            tokenList.add('foo');
            expect(tokenList.length).toBe(3);
        });

        it('should update element attribute', () => {
            tokenList.add('qux');
            expect(element.getAttribute('class')).toBe('foo bar baz qux');
        });

        it('should throw on empty token', () => {
            expect(() => tokenList.add('')).toThrow('The token provided must not be empty');
        });

        it('should throw on token with whitespace', () => {
            expect(() => tokenList.add('foo bar')).toThrow('The token provided contains whitespace');
        });
    });

    describe('remove method', () => {
        it('should remove a single token', () => {
            tokenList.remove('foo');
            expect(tokenList.length).toBe(2);
            expect(tokenList.contains('foo')).toBe(false);
        });

        it('should remove multiple tokens', () => {
            tokenList.remove('foo', 'bar');
            expect(tokenList.length).toBe(1);
            expect(tokenList.contains('foo')).toBe(false);
            expect(tokenList.contains('bar')).toBe(false);
        });

        it('should update element attribute', () => {
            tokenList.remove('foo');
            expect(element.getAttribute('class')).toBe('bar baz');
        });

        it('should remove attribute when all tokens removed', () => {
            tokenList.remove('foo', 'bar', 'baz');
            expect(element.getAttribute('class')).toBe(null);
        });

        it('should throw on empty token', () => {
            expect(() => tokenList.remove('')).toThrow('The token provided must not be empty');
        });

        it('should throw on token with whitespace', () => {
            expect(() => tokenList.remove('foo bar')).toThrow('The token provided contains whitespace');
        });
    });

    describe('toggle method', () => {
        it('should add token if not present', () => {
            const result = tokenList.toggle('qux');
            expect(result).toBe(true);
            expect(tokenList.contains('qux')).toBe(true);
        });

        it('should remove token if present', () => {
            const result = tokenList.toggle('foo');
            expect(result).toBe(false);
            expect(tokenList.contains('foo')).toBe(false);
        });

        it('should force add when force is true', () => {
            const result = tokenList.toggle('qux', true);
            expect(result).toBe(true);
            expect(tokenList.contains('qux')).toBe(true);
        });

        it('should force remove when force is false', () => {
            const result = tokenList.toggle('foo', false);
            expect(result).toBe(false);
            expect(tokenList.contains('foo')).toBe(false);
        });

        it('should update element attribute', () => {
            tokenList.toggle('qux');
            expect(element.getAttribute('class')).toContain('qux');
        });
    });

    describe('replace method', () => {
        it('should replace existing token', () => {
            const result = tokenList.replace('foo', 'qux');
            expect(result).toBe(true);
            expect(tokenList.contains('foo')).toBe(false);
            expect(tokenList.contains('qux')).toBe(true);
        });

        it('should return false if old token does not exist', () => {
            const result = tokenList.replace('nonexistent', 'qux');
            expect(result).toBe(false);
            expect(tokenList.contains('qux')).toBe(false);
        });

        it('should update element attribute', () => {
            tokenList.replace('foo', 'qux');
            expect(element.getAttribute('class')).not.toContain('foo');
            expect(element.getAttribute('class')).toContain('qux');
        });
    });

    describe('iterator methods', () => {
        it('should iterate with for...of', () => {
            const tokens: string[] = [];
            for (const token of tokenList as any) {
                tokens.push(token);
            }
            expect(tokens).toEqual(['foo', 'bar', 'baz']);
        });

        it('should iterate with forEach', () => {
            const tokens: string[] = [];
            tokenList.forEach((token) => {
                tokens.push(token);
            });
            expect(tokens).toEqual(['foo', 'bar', 'baz']);
        });

        it('should provide index in forEach', () => {
            const indices: number[] = [];
            tokenList.forEach((_, index) => {
                indices.push(index);
            });
            expect(indices).toEqual([0, 1, 2]);
        });

        it('should iterate values', () => {
            const values = Array.from(tokenList.values());
            expect(values).toEqual(['foo', 'bar', 'baz']);
        });

        it('should iterate keys', () => {
            const keys = Array.from(tokenList.keys());
            expect(keys).toEqual([0, 1, 2]);
        });

        it('should iterate entries', () => {
            const entries = Array.from(tokenList.entries());
            expect(entries).toEqual([
                [0, 'foo'],
                [1, 'bar'],
                [2, 'baz']
            ]);
        });
    });

    describe('toString method', () => {
        it('should return value as string', () => {
            expect(tokenList.toString()).toBe('foo bar baz');
        });
    });

    describe('integration with JqElement', () => {
        it('should work with classList property', () => {
            const el = new JqElement('element', 'div');
            el.setAttribute('class', 'foo bar');
            const classList = el.classList;

            expect(classList.length).toBe(2);
            expect(classList.contains('foo')).toBe(true);
            expect(classList.contains('bar')).toBe(true);
        });

        it('should update element when classList is modified', () => {
            const el = new JqElement('element', 'div');
            el.setAttribute('class', 'foo');
            const classList = el.classList;

            classList.add('bar');
            expect(el.getAttribute('class')).toBe('foo bar');
        });
    });
});
