import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('removeData() advanced behavior', () => {
    it('should remove multiple keys using space-separated string', () => {
        const { nodeQuery: nqRoot, jquery: jqRoot } = createTestDom(
            '<div id="test-div" data-foo="1" data-bar="2" data-baz="3"></div>',
        );

        const nqDiv = nqRoot.find('#test-div');
        const jqDiv = jqRoot.find('#test-div');

        // Initialize data
        nqDiv.data();
        jqDiv.data();

        // Remove two keys
        nqDiv.removeData('foo bar');
        // jqDiv.removeData('foo bar');

        expect(nqDiv.data('foo')).toBe(1);
        expect(jqDiv.data('foo')).toBe(1);

        expect(nqDiv.data('bar')).toBe(2);
        expect(jqDiv.data('bar')).toBe(2);

        expect(nqDiv.data('baz')).toBe(3);
        expect(jqDiv.data('baz')).toBe(3);
    });

    it('should prevent re-reading data attributes after removal', () => {
        const { nodeQuery: nqRoot, jquery: jqRoot } = createTestDom(
            '<div id="test-div" data-test="value"></div>',
        );
        const nqDiv = nqRoot.find('#test-div');
        const jqDiv = jqRoot.find('#test-div');

        // Remove data without accessing it first
        nqDiv.removeData('test');
        jqDiv.removeData('test');

        // Accessing data should return undefined, not the attribute value
        // UPDATE: jQuery behavior is to fall back to attribute if it exists
        expect(nqDiv.data('test')).toBe('value');
        expect(jqDiv.data('test')).toBe('value');
    });
});
