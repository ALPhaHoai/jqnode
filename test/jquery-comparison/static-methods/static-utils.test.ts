/**
 * Tests for jQuery static utility methods
 */

import $ from '../../../index';

describe('jQuery static utility methods', () => {
    describe('$.now()', () => {
        it('should return current timestamp', () => {
            const before = Date.now();
            const result = $.now();
            const after = Date.now();

            expect(result).toBeGreaterThanOrEqual(before);
            expect(result).toBeLessThanOrEqual(after);
        });
    });

    describe('$.noop()', () => {
        it('should be a function that does nothing', () => {
            expect(typeof $.noop).toBe('function');
            expect($.noop()).toBeUndefined();
        });
    });

    describe('$.type()', () => {
        it('should detect undefined', () => {
            expect($.type(undefined)).toBe('undefined');
            expect($.type(undefined)).toBe('undefined');
        });

        it('should detect null', () => {
            expect($.type(null)).toBe('null');
        });

        it('should detect boolean', () => {
            expect($.type(true)).toBe('boolean');
            expect($.type(false)).toBe('boolean');
            expect($.type(new Boolean())).toBe('boolean');
        });

        it('should detect number', () => {
            expect($.type(3)).toBe('number');
            expect($.type(new Number(3))).toBe('number');
        });

        it('should detect string', () => {
            expect($.type('test')).toBe('string');
            expect($.type(new String('test'))).toBe('string');
        });

        it('should detect function', () => {
            expect($.type(function () { })).toBe('function');
            expect($.type(() => { })).toBe('function');
        });

        it('should detect array', () => {
            expect($.type([])).toBe('array');
            expect($.type(new Array())).toBe('array');
        });

        it('should detect date', () => {
            expect($.type(new Date())).toBe('date');
        });

        it('should detect regexp', () => {
            expect($.type(/test/)).toBe('regexp');
        });

        it('should detect error', () => {
            expect($.type(new Error())).toBe('error');
        });

        it('should detect object', () => {
            expect($.type({})).toBe('object');
        });
    });

    describe('$.isArray()', () => {
        it('should detect arrays', () => {
            expect($.isArray([])).toBe(true);
            expect($.isArray([1, 2, 3])).toBe(true);
        });

        it('should return false for non-arrays', () => {
            expect($.isArray({})).toBe(false);
            expect($.isArray('string')).toBe(false);
            expect($.isArray(null)).toBe(false);
        });
    });

    describe('$.isFunction()', () => {
        it('should detect functions', () => {
            expect($.isFunction(function () { })).toBe(true);
            expect($.isFunction(() => { })).toBe(true);
        });

        it('should return false for non-functions', () => {
            expect($.isFunction({})).toBe(false);
            expect($.isFunction('string')).toBe(false);
            expect($.isFunction(null)).toBe(false);
        });
    });

    describe('$.isPlainObject()', () => {
        it('should detect plain objects', () => {
            expect($.isPlainObject({})).toBe(true);
            expect($.isPlainObject({ a: 1 })).toBe(true);
        });

        it('should return false for non-plain objects', () => {
            expect($.isPlainObject([])).toBe(false);
            expect($.isPlainObject(null)).toBe(false);
            expect($.isPlainObject(new Date())).toBe(false);
        });
    });

    describe('$.isNumeric()', () => {
        it('should detect numeric values', () => {
            expect($.isNumeric(123)).toBe(true);
            expect($.isNumeric('123')).toBe(true);
            expect($.isNumeric(1.5)).toBe(true);
            expect($.isNumeric(-10)).toBe(true);
        });

        it('should return false for non-numeric values', () => {
            expect($.isNumeric('abc')).toBe(false);
            expect($.isNumeric([])).toBe(false);
            expect($.isNumeric(null)).toBe(false);
            expect($.isNumeric(NaN)).toBe(false);
        });
    });

    describe('$.isEmptyObject()', () => {
        it('should detect empty objects', () => {
            expect($.isEmptyObject({})).toBe(true);
        });

        it('should return false for non-empty objects', () => {
            expect($.isEmptyObject({ a: 1 })).toBe(false);
        });

        it('should handle null/undefined', () => {
            expect($.isEmptyObject(null)).toBe(true);
            expect($.isEmptyObject(undefined)).toBe(true);
        });
    });

    describe('$.inArray()', () => {
        it('should find element in array', () => {
            expect($.inArray(2, [1, 2, 3])).toBe(1);
            expect($.inArray('b', ['a', 'b', 'c'])).toBe(1);
        });

        it('should return -1 if not found', () => {
            expect($.inArray(4, [1, 2, 3])).toBe(-1);
        });

        it('should support fromIndex parameter', () => {
            expect($.inArray(2, [1, 2, 3, 2], 2)).toBe(3);
        });
    });

    describe('$.makeArray()', () => {
        it('should convert array-like objects to arrays', () => {
            const arrayLike = { 0: 'a', 1: 'b', length: 2 };
            const result = $.makeArray(arrayLike);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual(['a', 'b']);
        });

        it('should handle arrays', () => {
            const arr = [1, 2, 3];
            const result = $.makeArray(arr);
            expect(result).toEqual([1, 2, 3]);
            expect(result).not.toBe(arr); // Should be a copy
        });

        it('should handle null/undefined', () => {
            expect($.makeArray(null)).toEqual([]);
            expect($.makeArray(undefined)).toEqual([]);
        });
    });

    describe('$.trim()', () => {
        it('should trim whitespace', () => {
            expect($.trim('  hello  ')).toBe('hello');
            expect($.trim('\n\t test \n')).toBe('test');
        });

        it('should handle null/undefined', () => {
            expect($.trim(null)).toBe('');
            expect($.trim(undefined)).toBe('');
        });
    });

    describe('$.param()', () => {
        it('should serialize plain objects', () => {
            const obj = { a: 1, b: 2 };
            const result = $.param(obj);
            expect(result).toBe('a=1&b=2');
        });

        it('should serialize nested objects', () => {
            const obj = { a: { b: 1 } };
            const result = $.param(obj);
            expect(result).toBe('a%5Bb%5D=1');
        });

        it('should serialize arrays', () => {
            const arr = [{ name: 'a', value: 1 }, { name: 'b', value: 2 }];
            const result = $.param(arr);
            expect(result).toBe('a=1&b=2');
        });

        it('should handle traditional mode', () => {
            const obj = { a: [1, 2] };
            const result = $.param(obj, true);
            // In traditional mode, should have multiple a= entries
            expect(result).toContain('a=');
        });
    });

    describe('$.parseJSON()', () => {
        it('should parse JSON strings', () => {
            expect($.parseJSON('{"a":1}')).toEqual({ a: 1 });
            expect($.parseJSON('[1,2,3]')).toEqual([1, 2, 3]);
        });

        it('should throw on invalid JSON', () => {
            expect(() => $.parseJSON('invalid')).toThrow();
        });
    });

    describe('$.extend()', () => {
        it('should merge objects', () => {
            const obj1 = { a: 1 };
            const obj2 = { b: 2 };
            const result = $.extend(obj1, obj2);
            expect(result).toEqual({ a: 1, b: 2 });
            expect(result).toBe(obj1);
        });

        it('should deep merge when deep flag is true', () => {
            const obj1 = { a: { b: 1 } };
            const obj2 = { a: { c: 2 } };
            const result = $.extend(true, obj1, obj2);
            expect(result).toEqual({ a: { b: 1, c: 2 } });
        });

        it('should overwrite values', () => {
            const obj1 = { a: 1 };
            const obj2 = { a: 2 };
            const result = $.extend(obj1, obj2);
            expect(result.a).toBe(2);
        });
    });

    describe('$.uniqueSort()', () => {
        it('should remove duplicates', () => {
            const arr = [1, 2, 1, 3, 2];
            $.uniqueSort(arr);
            expect(arr.length).toBe(3);
            expect(arr).toContain(1);
            expect(arr).toContain(2);
            expect(arr).toContain(3);
        });

        it('should modify array in place', () => {
            const arr = [1, 2, 1];
            const result = $.uniqueSort(arr);
            expect(result).toBe(arr);
        });
    });

    describe('$.unique()', () => {
        it('should be alias for uniqueSort', () => {
            const arr = [1, 2, 1, 3, 2];
            $.unique(arr);
            expect(arr.length).toBe(3);
        });
    });

    describe('$.escapeSelector()', () => {
        it('should escape special characters', () => {
            const selector = 'my.class';
            const result = $.escapeSelector(selector);
            // Should escape the dot with backslash
            expect(result).toContain('\\.');
        });

        it('should handle complex selectors', () => {
            const selector = '#id:not(.class)';
            const result = $.escapeSelector(selector);
            expect(typeof result).toBe('string');
        });
    });
});
