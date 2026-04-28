import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('data() advanced behavior', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nqRoot: any, jqRoot: any;

    beforeEach(() => {
        const html = `
            <div id="test-div" 
                data-foo="bar" 
                data-my-long-key="value"
                data-json='{"a":1}'
                data-array='[1,2]'
                data-invalid='{a:1}'
                data-num="123"
                data-leading-zero="0123"
                data-float="123.45"
                data-exp="1E5"
            ></div>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        jqRoot = jquery;
        nqRoot = nodeQuery;
    });

    test('should cache data attributes after first access', () => {
        const nqDiv = nqRoot.find('#test-div');
        const jqDiv = jqRoot.find('#test-div');

        // First access
        expect(nqDiv.data('foo')).toBe('bar');
        expect(jqDiv.data('foo')).toBe('bar');

        // Modify DOM attribute directly
        // For jqnode (plain object), update attributes object
        if (nqDiv[0].setAttribute) {
            nqDiv[0].setAttribute('data-foo', 'baz');
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (nqDiv[0].attributes as any)['data-foo'] = 'baz';
        }

        // For jQuery (DOM node), update attribute
        jqDiv[0].setAttribute('data-foo', 'baz');

        // Subsequent access should return cached value
        expect(nqDiv.data('foo')).toBe('bar');
        expect(jqDiv.data('foo')).toBe('bar');
    });

    test('should handle camelCase conversion correctly', () => {
        const nqDiv = nqRoot.find('#test-div');
        const jqDiv = jqRoot.find('#test-div');

        expect(nqDiv.data('myLongKey')).toBe('value');
        expect(jqDiv.data('myLongKey')).toBe('value');

        const nqData = nqDiv.data();
        const jqData = jqDiv.data();

        expect(nqData.myLongKey).toBe('value');
        expect(jqData.myLongKey).toBe('value');
        expect('my-long-key' in nqData).toBe(false);
    });

    test('should parse JSON values correctly', () => {
        const nqDiv = nqRoot.find('#test-div');
        const jqDiv = jqRoot.find('#test-div');

        expect(nqDiv.data('json')).toEqual({ a: 1 });
        expect(jqDiv.data('json')).toEqual({ a: 1 });

        expect(nqDiv.data('array')).toEqual([1, 2]);
        expect(jqDiv.data('array')).toEqual([1, 2]);

        // Invalid JSON should remain string
        expect(nqDiv.data('invalid')).toBe('{a:1}');
        expect(jqDiv.data('invalid')).toBe('{a:1}');
    });

    test('should parse numeric values correctly according to jQuery rules', () => {
        const nqDiv = nqRoot.find('#test-div');
        const jqDiv = jqRoot.find('#test-div');

        expect(nqDiv.data('num')).toBe(123);
        expect(jqDiv.data('num')).toBe(123);

        // "0123" -> 123 changes representation, so should stay string
        expect(nqDiv.data('leadingZero')).toBe('0123'); // Note: attribute is data-leading-zero
        expect(jqDiv.data('leadingZero')).toBe('0123');

        expect(nqDiv.data('float')).toBe(123.45);
        expect(jqDiv.data('float')).toBe(123.45);

        // "1E5" -> 100000 changes representation, so should stay string
        expect(nqDiv.data('exp')).toBe('1E5');
        expect(jqDiv.data('exp')).toBe('1E5');
    });
});
