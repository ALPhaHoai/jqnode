import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('val() select behavior', () => {
    test('should get value from selected attribute initially', () => {
        const html = `
            <select id="single">
                <option value="1">One</option>
                <option value="2" selected>Two</option>
                <option value="3">Three</option>
            </select>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqEl = nodeQuery.find('#single');
        const jqEl = jquery.find('#single');

        expect(nqEl.val()).toBe('2');
        expect(jqEl.val()).toBe('2');
    });

    test('should get value from property after dynamic change', () => {
        const html = `
            <select id="single">
                <option value="1">One</option>
                <option value="2" selected>Two</option>
                <option value="3">Three</option>
            </select>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqEl = nodeQuery.find('#single');
        const jqEl = jquery.find('#single');

        // Change selection via prop
        nqEl.find('option[value="3"]').prop('selected', true);
        jqEl.find('option[value="3"]').prop('selected', true);

        // Should reflect new selection
        expect(nqEl.val()).toBe('3');
        expect(jqEl.val()).toBe('3');
    });

    test('should update property when setting value via val()', () => {
        const html = `
            <select id="single">
                <option value="1">One</option>
                <option value="2" selected>Two</option>
                <option value="3">Three</option>
            </select>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqEl = nodeQuery.find('#single');
        const jqEl = jquery.find('#single');

        // Set value via val()
        nqEl.val('3');
        jqEl.val('3');

        expect(nqEl.val()).toBe('3');
        expect(jqEl.val()).toBe('3');

        // Check property of option 3
        expect(nqEl.find('option[value="3"]').prop('selected')).toBe(true);
        expect(jqEl.find('option[value="3"]').prop('selected')).toBe(true);

        // Check property of option 2 (should be false)
        expect(nqEl.find('option[value="2"]').prop('selected')).toBe(false);
        expect(jqEl.find('option[value="2"]').prop('selected')).toBe(false);
    });

    test('should handle multiple select with array value', () => {
        const html = `
            <select id="multi" multiple>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
        `;
        const { jquery, nodeQuery } = createTestDom(html);
        const nqEl = nodeQuery.find('#multi');
        const jqEl = jquery.find('#multi');

        // Set multiple values
        nqEl.val(['1', '3']);
        jqEl.val(['1', '3']);

        expect(nqEl.val()).toEqual(['1', '3']);
        expect(jqEl.val()).toEqual(['1', '3']);

        // Check properties
        expect(nqEl.find('option[value="1"]').prop('selected')).toBe(true);
        expect(nqEl.find('option[value="2"]').prop('selected')).toBe(false);
        expect(nqEl.find('option[value="3"]').prop('selected')).toBe(true);
    });
});
