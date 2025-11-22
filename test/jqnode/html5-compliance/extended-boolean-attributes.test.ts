import $ from '../../../index';

describe('HTML5 Extended Boolean Attributes', () => {
    beforeEach(() => {
        $.clearRootNodesRegistry();
    });

    describe('Input element boolean attributes', () => {
        test('should handle readonly attribute', () => {
            const html = '<input type="text" readonly><input type="text">';
            const root = $(html);

            const readonlyInput = root.find('input').eq(0);
            const normalInput = root.find('input').eq(1);

            expect(readonlyInput.attr('readonly')).toBe('readonly');
            expect(normalInput.attr('readonly')).toBeUndefined();
        });

        test('should handle autofocus attribute', () => {
            const html = '<input type="text" autofocus><input type="text">';
            const root = $(html);

            const autofocusInput = root.find('input').eq(0);
            const normalInput = root.find('input').eq(1);

            expect(autofocusInput.attr('autofocus')).toBe('autofocus');
            expect(normalInput.attr('autofocus')).toBeUndefined();
        });

        test('should handle formnovalidate attribute', () => {
            const html = '<input type="submit" formnovalidate><input type="submit">';
            const root = $(html);

            const noValidateInput = root.find('input').eq(0);
            const normalInput = root.find('input').eq(1);

            expect(noValidateInput.attr('formnovalidate')).toBe('formnovalidate');
            expect(normalInput.attr('formnovalidate')).toBeUndefined();
        });
    });

    describe('Video/Audio element boolean attributes', () => {
        test('should handle autoplay attribute', () => {
            const html = '<video autoplay></video><video></video>';
            const root = $(html);

            const autoplayVideo = root.find('video').eq(0);
            const normalVideo = root.find('video').eq(1);

            expect(autoplayVideo.attr('autoplay')).toBe('autoplay');
            expect(normalVideo.attr('autoplay')).toBeUndefined();
        });

        test('should handle controls attribute', () => {
            const html = '<video controls></video><audio controls></audio>';
            const root = $(html);

            const video = root.find('video');
            const audio = root.find('audio');

            expect(video.attr('controls')).toBe('controls');
            expect(audio.attr('controls')).toBe('controls');
        });

        test('should handle loop attribute', () => {
            const html = '<video loop></video><audio loop></audio>';
            const root = $(html);

            const video = root.find('video');
            const audio = root.find('audio');

            expect(video.attr('loop')).toBe('loop');
            expect(audio.attr('loop')).toBe('loop');
        });

        test('should handle muted attribute', () => {
            const html = '<video muted></video><audio muted></audio>';
            const root = $(html);

            const video = root.find('video');
            const audio = root.find('audio');

            expect(video.attr('muted')).toBe('muted');
            expect(audio.attr('muted')).toBe('muted');
        });
    });

    describe('Script element boolean attributes', () => {
        test('should handle async attribute', () => {
            const html = '<script async src="test.js"></script><script src="other.js"></script>';
            const root = $(html);

            const asyncScript = root.find('script').eq(0);
            const normalScript = root.find('script').eq(1);

            expect(asyncScript.attr('async')).toBe('async');
            expect(normalScript.attr('async')).toBeUndefined();
        });

        test('should handle defer attribute', () => {
            const html = '<script defer src="test.js"></script><script src="other.js"></script>';
            const root = $(html);

            const deferScript = root.find('script').eq(0);
            const normalScript = root.find('script').eq(1);

            expect(deferScript.attr('defer')).toBe('defer');
            expect(normalScript.attr('defer')).toBeUndefined();
        });
    });

    describe('Form element boolean attributes', () => {
        test('should handle novalidate attribute', () => {
            const html = '<form novalidate></form><form></form>';
            const root = $(html);

            const noValidateForm = root.find('form').eq(0);
            const normalForm = root.find('form').eq(1);

            expect(noValidateForm.attr('novalidate')).toBe('novalidate');
            expect(normalForm.attr('novalidate')).toBeUndefined();
        });
    });

    describe('Miscellaneous boolean attributes', () => {
        test('should handle hidden attribute', () => {
            const html = '<div hidden></div><div></div>';
            const root = $(html);

            const hiddenDiv = root.find('div').eq(0);
            const normalDiv = root.find('div').eq(1);

            expect(hiddenDiv.attr('hidden')).toBe('hidden');
            expect(normalDiv.attr('hidden')).toBeUndefined();
        });

        test('should handle default attribute on track', () => {
            const html = '<track kind="captions" default><track kind="captions">';
            const root = $(html);

            const defaultTrack = root.find('track').eq(0);
            const normalTrack = root.find('track').eq(1);

            expect(defaultTrack.attr('default')).toBe('default');
            expect(normalTrack.attr('default')).toBeUndefined();
        });

        test('should handle open attribute on details', () => {
            const html = '<details open><summary>Title</summary></details><details><summary>Title</summary></details>';
            const root = $(html);

            const openDetails = root.find('details').eq(0);
            const closedDetails = root.find('details').eq(1);

            expect(openDetails.attr('open')).toBe('open');
            expect(closedDetails.attr('open')).toBeUndefined();
        });

        test('should handle reversed attribute on ol', () => {
            const html = '<ol reversed><li>Item</li></ol><ol><li>Item</li></ol>';
            const root = $(html);

            const reversedOl = root.find('ol').eq(0);
            const normalOl = root.find('ol').eq(1);

            expect(reversedOl.attr('reversed')).toBe('reversed');
            expect(normalOl.attr('reversed')).toBeUndefined();
        });

        test('should handle ismap attribute on img', () => {
            const html = '<img src="test.jpg" ismap><img src="test.jpg">';
            const root = $(html);

            const ismapImg = root.find('img').eq(0);
            const normalImg = root.find('img').eq(1);

            expect(ismapImg.attr('ismap')).toBe('ismap');
            expect(normalImg.attr('ismap')).toBeUndefined();
        });

        test('should handle itemscope attribute', () => {
            const html = '<div itemscope itemtype="http://schema.org/Product"></div><div></div>';
            const root = $(html);

            const itemscopeDiv = root.find('div').eq(0);
            const normalDiv = root.find('div').eq(1);

            expect(itemscopeDiv.attr('itemscope')).toBe('itemscope');
            expect(normalDiv.attr('itemscope')).toBeUndefined();
        });
    });

    describe('Setting extended boolean attributes', () => {
        test('should set readonly attribute to attribute name', () => {
            const html = '<input type="text">';
            const root = $(html);
            const input = root.find('input');

            input.attr('readonly', 'readonly');
            expect(input.attr('readonly')).toBe('readonly');
        });

        test('should set autofocus attribute to attribute name', () => {
            const html = '<input type="text">';
            const root = $(html);
            const input = root.find('input');

            input.attr('autofocus', 'autofocus');
            expect(input.attr('autofocus')).toBe('autofocus');
        });

        test('should set hidden attribute to attribute name', () => {
            const html = '<div></div>';
            const root = $(html);
            const div = root.find('div');

            div.attr('hidden', 'hidden');
            expect(div.attr('hidden')).toBe('hidden');
        });
    });

    describe('Multiple extended boolean attributes', () => {
        test('should handle multiple boolean attributes on same element', () => {
            const html = '<input type="text" readonly autofocus required>';
            const root = $(html);
            const input = root.find('input');

            expect(input.attr('readonly')).toBe('readonly');
            expect(input.attr('autofocus')).toBe('autofocus');
            expect(input.attr('required')).toBe('required');
        });

        test('should handle multiple boolean attributes on video element', () => {
            const html = '<video autoplay controls loop muted></video>';
            const root = $(html);
            const video = root.find('video');

            expect(video.attr('autoplay')).toBe('autoplay');
            expect(video.attr('controls')).toBe('controls');
            expect(video.attr('loop')).toBe('loop');
            expect(video.attr('muted')).toBe('muted');
        });
    });
});
