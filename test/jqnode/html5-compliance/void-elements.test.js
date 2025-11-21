const $ = require('../../../index');

describe('HTML5 Void Elements', () => {
    beforeEach(() => {
        $.clearRootNodesRegistry();
    });

    test('should parse area as self-closing', () => {
        const html = '<map name="workmap"><area shape="rect" coords="34,44,270,350" alt="Computer"></map>';
        const root = $(html);

        const area = root.find('area');
        expect(area.nodes).toHaveLength(1);
        expect(area.nodes[0].children).toHaveLength(0);
        expect(area.attr('shape')).toBe('rect');
        expect(area.attr('alt')).toBe('Computer');
    });

    test('should parse base as self-closing', () => {
        const html = '<head><base href="https://example.com/" target="_blank"></head>';
        const root = $(html);

        const base = root.find('base');
        expect(base.nodes).toHaveLength(1);
        expect(base.nodes[0].children).toHaveLength(0);
        expect(base.attr('href')).toBe('https://example.com/');
        expect(base.attr('target')).toBe('_blank');
    });

    test('should parse br as self-closing', () => {
        const html = '<p>Line 1<br>Line 2</p>';
        const root = $(html);

        const br = root.find('br');
        expect(br.nodes).toHaveLength(1);
        expect(br.nodes[0].children).toHaveLength(0);
    });

    test('should parse col as self-closing', () => {
        const html = '<table><colgroup><col span="2" style="background-color:red"><col style="background-color:yellow"></colgroup></table>';
        const root = $(html);

        const cols = root.find('col');
        expect(cols.nodes).toHaveLength(2);
        cols.nodes.forEach(col => {
            expect(col.children).toHaveLength(0);
        });

        const firstCol = cols.eq(0);
        expect(firstCol.attr('span')).toBe('2');
    });

    test('should parse embed as self-closing', () => {
        const html = '<embed type="video/webm" src="video.mp4" width="250" height="200">';
        const root = $(html);

        const embed = root.find('embed');
        expect(embed.nodes).toHaveLength(1);
        expect(embed.nodes[0].children).toHaveLength(0);
        expect(embed.attr('type')).toBe('video/webm');
        expect(embed.attr('src')).toBe('video.mp4');
    });

    test('should parse hr as self-closing', () => {
        const html = '<div><p>Text</p><hr><p>More text</p></div>';
        const root = $(html);

        const hr = root.find('hr');
        expect(hr.nodes).toHaveLength(1);
        expect(hr.nodes[0].children).toHaveLength(0);
    });

    test('should parse img as self-closing', () => {
        const html = '<img src="test.jpg" alt="Test Image" width="100" height="100">';
        const root = $(html);

        const img = root.find('img');
        expect(img.nodes).toHaveLength(1);
        expect(img.nodes[0].children).toHaveLength(0);
        expect(img.attr('src')).toBe('test.jpg');
        expect(img.attr('alt')).toBe('Test Image');
    });

    test('should parse input as self-closing', () => {
        const html = '<input type="text" name="username" value="test">';
        const root = $(html);

        const input = root.find('input');
        expect(input.nodes).toHaveLength(1);
        expect(input.nodes[0].children).toHaveLength(0);
        expect(input.attr('type')).toBe('text');
        expect(input.attr('name')).toBe('username');
    });

    test('should parse link as self-closing', () => {
        const html = '<head><link rel="stylesheet" href="styles.css" type="text/css"></head>';
        const root = $(html);

        const link = root.find('link');
        expect(link.nodes).toHaveLength(1);
        expect(link.nodes[0].children).toHaveLength(0);
        expect(link.attr('rel')).toBe('stylesheet');
        expect(link.attr('href')).toBe('styles.css');
    });

    test('should parse meta as self-closing', () => {
        const html = '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>';
        const root = $(html);

        const metas = root.find('meta');
        expect(metas.nodes).toHaveLength(2);
        metas.nodes.forEach(meta => {
            expect(meta.children).toHaveLength(0);
        });

        const charsetMeta = metas.eq(0);
        expect(charsetMeta.attr('charset')).toBe('UTF-8');
    });

    test('should parse param as self-closing', () => {
        const html = '<object data="movie.swf"><param name="autoplay" value="true"></object>';
        const root = $(html);

        const param = root.find('param');
        expect(param.nodes).toHaveLength(1);
        expect(param.nodes[0].children).toHaveLength(0);
        expect(param.attr('name')).toBe('autoplay');
        expect(param.attr('value')).toBe('true');
    });

    test('should parse source as self-closing', () => {
        const html = '<video><source src="movie.mp4" type="video/mp4"><source src="movie.ogg" type="video/ogg"></video>';
        const root = $(html);

        const sources = root.find('source');
        expect(sources.nodes).toHaveLength(2);
        sources.nodes.forEach(source => {
            expect(source.children).toHaveLength(0);
        });

        const firstSource = sources.eq(0);
        expect(firstSource.attr('src')).toBe('movie.mp4');
        expect(firstSource.attr('type')).toBe('video/mp4');
    });

    test('should parse track as self-closing', () => {
        const html = '<video><track kind="captions" src="captions.vtt" srclang="en" label="English"></video>';
        const root = $(html);

        const track = root.find('track');
        expect(track.nodes).toHaveLength(1);
        expect(track.nodes[0].children).toHaveLength(0);
        expect(track.attr('kind')).toBe('captions');
        expect(track.attr('src')).toBe('captions.vtt');
    });

    test('should parse wbr as self-closing', () => {
        const html = '<p>This is a very<wbr>long<wbr>word</p>';
        const root = $(html);

        const wbrs = root.find('wbr');
        expect(wbrs.nodes).toHaveLength(2);
        wbrs.nodes.forEach(wbr => {
            expect(wbr.children).toHaveLength(0);
        });
    });

    test('should parse all void elements together', () => {
        const html = `
            <div>
                <area shape="rect">
                <base href="/">
                <br>
                <col>
                <embed src="test.swf">
                <hr>
                <img src="test.jpg">
                <input type="text">
                <link rel="stylesheet">
                <meta charset="UTF-8">
                <param name="test">
                <source src="test.mp4">
                <track kind="captions">
                <wbr>
            </div>
        `;
        const root = $(html);

        // All void elements should be self-closing
        const voidElements = [
            'area', 'base', 'br', 'col', 'embed',
            'hr', 'img', 'input', 'link', 'meta',
            'param', 'source', 'track', 'wbr'
        ];

        voidElements.forEach(tag => {
            const element = root.find(tag);
            expect(element.nodes).toHaveLength(1);
            expect(element.nodes[0].children).toHaveLength(0);
        });
    });

    test('should handle void elements with explicit self-closing syntax', () => {
        const html = '<img src="test.jpg" /><br /><input type="text" />';
        const root = $(html);

        const img = root.find('img');
        const br = root.find('br');
        const input = root.find('input');

        expect(img.nodes[0].children).toHaveLength(0);
        expect(br.nodes[0].children).toHaveLength(0);
        expect(input.nodes[0].children).toHaveLength(0);
    });

    test('should handle void elements without explicit self-closing syntax', () => {
        const html = '<img src="test.jpg"><br><input type="text">';
        const root = $(html);

        const img = root.find('img');
        const br = root.find('br');
        const input = root.find('input');

        expect(img.nodes[0].children).toHaveLength(0);
        expect(br.nodes[0].children).toHaveLength(0);
        expect(input.nodes[0].children).toHaveLength(0);
    });
});
