import $ from '../../../../index';

describe('prependTo() method', () => {
    let root;

    beforeEach(() => {
        const html = `
      <div class="container">
        <p>Existing paragraph</p>
      </div>
      <div class="target1"></div>
      <div class="target2"></div>
    `;
        root = $(html);
    });

    test('prependTo() should prepend elements to target as first children', () => {
        const newElement = $('<span>New content</span>');
        newElement.prependTo('.container');

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('New content');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Existing paragraph');
    });

    test('prependTo() should prepend to multiple targets', () => {
        const newElement = $('<em>Shared content</em>');
        newElement.prependTo('.target1, .target2');

        const target1FirstChildText = root.find('.target1').children().eq(0).text();
        expect(target1FirstChildText).toBe('Shared content');
        const target2FirstChildText = root.find('.target2').children().eq(0).text();
        expect(target2FirstChildText).toBe('Shared content');
    });

    test('prependTo() should clone elements when prepending to multiple targets', () => {
        const newElements = $('<span>First</span><span>Second</span>');
        newElements.prependTo('.target1, .target2');

        const target1SpanCount = root.find('.target1').find('span').length;
        expect(target1SpanCount).toBe(2);
        const target2SpanCount = root.find('.target2').find('span').length;
        expect(target2SpanCount).toBe(2);
        const totalSpans = root.find('span');
        const totalSpansCount = totalSpans.length;
        expect(totalSpansCount).toBe(4); // 2 in each target
    });

    test('prependTo() should work with HTML string targets', () => {
        const newElement = $('<p>Prepended</p>');
        newElement.prependTo('<div class="dynamic"></div>');

        // The dynamically created element should be in the global root
        const dynamicElementFirstChildText = $('.dynamic').children().eq(0).text();
        expect(dynamicElementFirstChildText).toBe('Prepended');
    });

    test('prependTo() should return the original JQ object', () => {
        const newElement = $('<span>test</span>');
        const result = newElement.prependTo('.container');

        expect(result).toBe(newElement);
        const containerFirstChildText = root.find('.container').children().eq(0).text();
        expect(containerFirstChildText).toBe('test');
    });

    test('prependTo() should handle node object targets', () => {
        const targetNode = root.find('.container').nodes[0];
        const newElement = $('<strong>Node target</strong>');
        newElement.prependTo(targetNode);

        const containerFirstChildText = root.find('.container').children().eq(0).text();
        expect(containerFirstChildText).toBe('Node target');
    });

    test('prependTo() should work with JQ object targets', () => {
        const targetJQ = root.find('.container');
        const newElement = $('<i>JQ target</i>');
        newElement.prependTo(targetJQ);

        const containerFirstChildText = root.find('.container').children().eq(0).text();
        expect(containerFirstChildText).toBe('JQ target');
    });
});
