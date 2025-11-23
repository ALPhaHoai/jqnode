import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('cssCamel() method - jQuery Comparison', () => {
    test('should convert CSS property names to camelCase - jquery-comparison', () => {
        const html = '<div style="background-color: red; font-size: 14px">Test</div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');
        const jqDiv = jqRoot.find('div');

        // jQuery uses camelCase for JS style properties
        expect(nqDiv.css('backgroundColor')).toBe(jqDiv.css('backgroundColor'));
        expect(nqDiv.css('fontSize')).toBe(jqDiv.css('fontSize'));
    });

    test('should allow setting with camelCase - jquery-comparison', () => {
        const html = '<div>Test</div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');
        const jqDiv = jqRoot.find('div');

        nqDiv.css('backgroundColor', 'blue');
        jqDiv.css('backgroundColor', 'blue');

        expect(nqDiv.css('backgroundColor')).toBe(jqDiv.css('backgroundColor'));
        expect(nqDiv.css('backgroundColor')).toBe('blue');
    });
});

describe('cssCamel() method - jqnode specific', () => {
    test('should get style values using camelCase or hyphenated names', () => {
        const html = '<div style="background-color: red; font-size: 14px">Test</div>';
        const { nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');

        // Should work with camelCase
        expect(nqDiv.cssCamel('backgroundColor')).toBe('red');
        expect(nqDiv.cssCamel('fontSize')).toBe('14px');

        // Should work with hyphenated
        expect(nqDiv.cssCamel('background-color')).toBe('red');
        expect(nqDiv.cssCamel('font-size')).toBe('14px');
    });

    test('should set style values using camelCase or hyphenated names', () => {
        const html = '<div>Test</div>';
        const { nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');

        nqDiv.cssCamel('backgroundColor', 'blue');
        expect(nqDiv.cssCamel('backgroundColor')).toBe('blue');

        nqDiv.cssCamel('font-size', '20px');
        expect(nqDiv.cssCamel('fontSize')).toBe('20px');
    });

    test('should return camelCase keys when getting multiple properties', () => {
        const html = '<div style="background-color: red; font-size: 14px; margin-top: 10px">Test</div>';
        const { nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');

        // Pass mixed array
        const props = nqDiv.cssCamel(['background-color', 'fontSize', 'margin-top']);

        // Expect all keys to be camelCase as per documentation
        expect(props).toHaveProperty('backgroundColor', 'red');
        expect(props).toHaveProperty('fontSize', '14px');
        expect(props).toHaveProperty('marginTop', '10px');

        // Should NOT have hyphenated keys
        expect(props).not.toHaveProperty('background-color');
        expect(props).not.toHaveProperty('margin-top');
    });
});
