import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('HTML5 Extended Boolean Attributes - jQuery Comparison', () => {
    test('should handle readonly attribute - jquery-comparison', () => {
        const html = '<input type="text" readonly><input type="text">';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqReadonly = nqRoot.find('input').eq(0);
        const jqReadonly = jqRoot.find('input').eq(0);

        expect(nqReadonly.attr('readonly')).toBe(jqReadonly.attr('readonly'));
        expect(nqReadonly.attr('readonly')).toBe('readonly');
    });

    test('should handle autofocus attribute - jquery-comparison', () => {
        const html = '<input type="text" autofocus><input type="text">';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqAutofocus = nqRoot.find('input').eq(0);
        const jqAutofocus = jqRoot.find('input').eq(0);

        expect(nqAutofocus.attr('autofocus')).toBe(jqAutofocus.attr('autofocus'));
        expect(nqAutofocus.attr('autofocus')).toBe('autofocus');
    });

    test('should handle video autoplay and controls - jquery-comparison', () => {
        const html = '<video autoplay controls></video>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqVideo = nqRoot.find('video');
        const jqVideo = jqRoot.find('video');

        expect(nqVideo.attr('autoplay')).toBe(jqVideo.attr('autoplay'));
        expect(nqVideo.attr('controls')).toBe(jqVideo.attr('controls'));
    });

    test('should handle hidden attribute - jquery-comparison', () => {
        const html = '<div hidden></div><div></div>';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqHidden = nqRoot.find('div').eq(0);
        const jqHidden = jqRoot.find('div').eq(0);

        expect(nqHidden.attr('hidden')).toBe(jqHidden.attr('hidden'));
        expect(nqHidden.attr('hidden')).toBe('hidden');
    });

    test('should set boolean attributes - jquery-comparison', () => {
        const html = '<input type="text">';
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqInput = nqRoot.find('input');
        const jqInput = jqRoot.find('input');

        nqInput.attr('readonly', 'readonly');
        jqInput.attr('readonly', 'readonly');

        expect(nqInput.attr('readonly')).toBe(jqInput.attr('readonly'));
        expect(nqInput.attr('readonly')).toBe('readonly');
    });
});
