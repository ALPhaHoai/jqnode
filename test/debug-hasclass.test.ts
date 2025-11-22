import $ from '../index';

describe('Debug hasClass', () => {
    test('debug hasClass with simple element', () => {
        const html = '<div id="test-div" class="active">Test</div>';
        const root = $(html);

        console.log('Root nodes:', root.nodes);
        console.log('First node:', root.nodes[0]);
        console.log('First node attributes:', root.nodes[0].attributes);
        console.log('First node _originalElement:', root.nodes[0]._originalElement);

        const result = root.hasClass('active');
        console.log('hasClass result:', result);

        expect(result).toBe(true);
    });

    test('debug hasClass with find', () => {
        const html = '<div><p id="para" class="test">Test</p></div>';
        const root = $(html);
        const para = root.find('#para');

        console.log('Para nodes:', para.nodes);
        console.log('Para first node:', para.nodes[0]);
        console.log('Para attributes:', para.nodes[0].attributes);
        console.log('Para _originalElement:', para.nodes[0]._originalElement);

        const result = para.hasClass('test');
        console.log('hasClass result:', result);

        expect(result).toBe(true);
    });
});
