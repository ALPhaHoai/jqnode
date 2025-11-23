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
