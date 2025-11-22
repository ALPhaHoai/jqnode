import $ from '../../../../index';

describe('appendTo() method', () => {
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

    test('appendTo() should append elements to target as last children', () => {
        const newElement = $('<span>New content</span>');
        newElement.appendTo('.container');

        const containerSpan = root.find('.container').find('span');
        expect(containerSpan.text()).toBe('New content');

        const containerChildrenCount = root.find('.container').children().length;
        expect(containerChildrenCount).toBe(2); // p and span
    });

    test('appendTo() should append to multiple targets', () => {
        const newElement = $('<em>Shared content</em>');
        newElement.appendTo('.target1, .target2');

        const target1Em = root.find('.target1').find('em');
        expect(target1Em.text()).toBe('Shared content');
        const target2Em = root.find('.target2').find('em');
        expect(target2Em.text()).toBe('Shared content');
    });

    test('appendTo() should clone elements when appending to multiple targets', () => {
        const newElements = $('<span>First</span><span>Second</span>');
        newElements.appendTo('.target1, .target2');

        const target1Spans = root.find('.target1').find('span');
        const target1SpansCount = target1Spans.length;
        expect(target1SpansCount).toBe(2);
        const target2Spans = root.find('.target2').find('span');
        const target2SpansCount = target2Spans.length;
        expect(target2SpansCount).toBe(2);

        const totalSpansCount = root.find('span').length;
        expect(totalSpansCount).toBe(4); // 2 in each target
    });

    test('appendTo() should work with HTML string targets', () => {
        const newElement = $('<p>Appended</p>');
        newElement.appendTo('<div class="dynamic"></div>');

        // The dynamically created element should be in the global root
        const dynamicParagraph = $('.dynamic').find('p');
        expect(dynamicParagraph.text()).toBe('Appended');
    });

    test('appendTo() should return the original JQ object', () => {
        const newElement = $('<span>test</span>');
        const result = newElement.appendTo('.container');

        expect(result).toBe(newElement);
        const containerSpan = root.find('.container').find('span');
        expect(containerSpan.text()).toBe('test');
    });

    test('appendTo() should handle node object targets', () => {
        const targetNode = root.find('.container').nodes[0];
        const newElement = $('<strong>Node target</strong>');
        newElement.appendTo(targetNode);

        const containerStrong = root.find('.container').find('strong');
        expect(containerStrong.text()).toBe('Node target');
    });

    test('appendTo() should work with JQ object targets', () => {
        const targetJQ = root.find('.container');
        const newElement = $('<i>JQ target</i>');
        newElement.appendTo(targetJQ);

        const containerI = root.find('.container').find('i');
        expect(containerI.text()).toBe('JQ target');
    });
});
