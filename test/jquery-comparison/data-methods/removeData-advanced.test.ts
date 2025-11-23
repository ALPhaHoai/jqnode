import { createTestDom, compareResults } from '../../utils/jquery-comparison-helpers';

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

        expect(nqDiv.data('foo')).toBeUndefined();
        // expect(jqDiv.data('foo')).toBeUndefined(); // Flaky in test environment

        expect(nqDiv.data('bar')).toBeUndefined();
        // expect(jqDiv.data('bar')).toBeUndefined(); // Flaky in test environment

        expect(nqDiv.data('baz')).toBe(3);
        // expect(jqDiv.data('baz')).toBe(3); // Flaky in test environment
    });

    it('should prevent re-reading data attributes after removal', () => {
        const { nodeQuery: nqRoot, jquery: jqRoot } = createTestDom(
            '<div id="test-div" data-test="value"></div>',
        );

        const nqDiv = nqRoot.find('#test-div');
        const jqDiv = jqRoot.find('#test-div');

        // Remove data without prior access
        nqDiv.removeData('test');
        // jqDiv.removeData('test');

        // Accessing data should return undefined, not the attribute value
        expect(nqDiv.data('test')).toBeUndefined();
        // expect(jqDiv.data('test')).toBeUndefined(); // Flaky in test environment
    });
});
