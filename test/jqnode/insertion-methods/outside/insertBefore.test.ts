import $ from '../../../../index';

describe('insertBefore() method', () => {
    let root;

    beforeEach(() => {
        // Clear the global root nodes registry to ensure test isolation
        $.clearRootNodesRegistry();
        const html = `
      <div class="container">
        <p>First</p>
        <p>Second</p>
        <p>Third</p>
      </div>
      <div class="target1">
        <span>Target content</span>
      </div>
      <div class="target2">
        <em>Target content 2</em>
      </div>
    `;
        root = $(html);
    });

    test('insertBefore() should insert elements before each target', () => {
        const newElement = $('<strong>Inserted</strong>');
        newElement.insertBefore('.container p');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(6); // strong, p, strong, p, strong, p
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('Inserted');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('First');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Inserted');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('Second');
    });

    test('insertBefore() should insert before multiple targets', () => {
        const newElements = $('<div>Before all</div>');
        newElements.insertBefore('p');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(6); // div, p, div, p, div, p
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('Before all');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('First');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Before all');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('Second');
    });

    test('insertBefore() should clone elements when inserting before multiple targets', () => {
        const newElements = $('<span>Clone me</span><em>And me</em>');
        newElements.insertBefore('.container p');

        // Should have 3 sets of cloned elements (one before each p), plus existing elements
        const totalSpans = root.find('span').length;
        expect(totalSpans).toBe(4); // 1 original + 3 cloned

        const totalEms = root.find('em').length;
        expect(totalEms).toBe(4); // 1 original + 3 cloned
    });

    test('insertBefore() should work with HTML string targets', () => {
        const newElement = $('<p>Dynamic insert</p>');
        newElement.insertBefore('<div class="dynamic-target"><span>Target</span></div>');

        // Should create the dynamic target and insert before it
        const dynamicTargetCount = $('.dynamic-target').length;
        expect(dynamicTargetCount).toBe(1);
        const pElementsCount = $('p').length;
        expect(pElementsCount).toBe(4); // 3 from setup + 1 inserted p element
        // Find the inserted p element (should be the last one before the dynamic target)
        const allPElements = $('p');
        const insertedPElement = allPElements.eq(3); // The 4th p element
        expect(insertedPElement.text()).toBe('Dynamic insert');
    });

    test('insertBefore() should return the original JQ object', () => {
        const newElement = $('<span>test</span>');
        const result = newElement.insertBefore('.container p');

        expect(result).toBe(newElement);
    });

    test('insertBefore() should handle node object targets', () => {
        const targetNode = root.find('.container p').first().nodes[0];
        const newElement = $('<strong>Node target</strong>');
        newElement.insertBefore(targetNode);

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('Node target');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('First');
    });

    test('insertBefore() should work with JQ object targets', () => {
        const targetJQ = root.find('.container p').first();
        const newElement = $('<i>JQ target</i>');
        newElement.insertBefore(targetJQ);

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('JQ target');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('First');
    });

    test('insertBefore() should handle different target types', () => {
        const newElement = $('<mark>Mixed targets</mark>');
        newElement.insertBefore('.target1 span, .target2 em');

        const target1FirstChildText = root.find('.target1').children().eq(0).text();
        expect(target1FirstChildText).toBe('Mixed targets');

        const target2FirstChildText = root.find('.target2').children().eq(0).text();
        expect(target2FirstChildText).toBe('Mixed targets');
    });
});
