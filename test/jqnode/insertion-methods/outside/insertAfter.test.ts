import $ from '../../../../index';
import { HtmlNode } from '../../../../types';
import JQ from '../../../../jq';

describe('insertAfter() method', () => {
    let root: JQ;

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

    test('insertAfter() should insert elements after each target', () => {
        const newElement = $('<strong>Inserted</strong>');
        newElement.insertAfter('.container p');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(6); // p, strong, p, strong, p, strong
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Inserted');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Second');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('Inserted');
        const fifthChildText = containerChildren.eq(4).text();
        expect(fifthChildText).toBe('Third');
        const sixthChildText = containerChildren.eq(5).text();
        expect(sixthChildText).toBe('Inserted');
    });

    test('insertAfter() should insert after multiple targets', () => {
        const newElements = $('<div>After all</div>');
        newElements.insertAfter('.container p');

        const containerChildren = root.find('.container').children();
        const containerChildrenCount = containerChildren.length;
        expect(containerChildrenCount).toBe(6); // p, div, p, div, p, div
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('After all');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Second');
        const fourthChildText = containerChildren.eq(3).text();
        expect(fourthChildText).toBe('After all');
        const fifthChildText = containerChildren.eq(4).text();
        expect(fifthChildText).toBe('Third');
        const sixthChildText = containerChildren.eq(5).text();
        expect(sixthChildText).toBe('After all');
    });

    test('insertAfter() should clone elements when inserting after multiple targets', () => {
        const newElements = $('<span>Clone me</span><em>And me</em>');
        newElements.insertAfter('.container p');

        // Should have 3 sets of cloned elements (one after each p), plus 1 original span/em
        const totalSpans = root.find('span');
        const totalSpansCount = totalSpans.length;
        expect(totalSpansCount).toBe(4);

        const totalEms = root.find('em');
        const totalEmsCount = totalEms.length;
        expect(totalEmsCount).toBe(4);
    });

    test('insertAfter() should work with HTML string targets', () => {
        const newElement = $('<p>Dynamic insert</p>');
        newElement.insertAfter('<div class="dynamic-target"><span>Target</span></div>');

        // Should create the dynamic target and insert the p element
        const dynamicTargetCount = $('.dynamic-target').length;
        expect(dynamicTargetCount).toBe(1);
        // Find the inserted p element by its text content
        const allPElements = $('p');
        const insertedPElement = allPElements.filter((i: number, el: HtmlNode) => $(el).text() === 'Dynamic insert');
        const insertedPElementCount = insertedPElement.length;
        expect(insertedPElementCount).toBe(2); // Original + cloned
        const firstInsertedText = insertedPElement.first().text();
        expect(firstInsertedText).toBe('Dynamic insert');
    });

    test('insertAfter() should return the original JQ object', () => {
        const newElement = $('<span>test</span>');
        const result = newElement.insertAfter('.container p');

        expect(result).toBe(newElement);
    });

    test('insertAfter() should handle node object targets', () => {
        const targetNode = root.find('.container p').first().nodes[0];
        const newElement = $('<strong>Node target</strong>');
        newElement.insertAfter(targetNode);

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('Node target');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Second');
    });

    test('insertAfter() should work with JQ object targets', () => {
        const targetJQ = root.find('.container p').first();
        const newElement = $('<i>JQ target</i>');
        newElement.insertAfter(targetJQ);

        const containerChildren = root.find('.container').children();
        const firstChildText = containerChildren.eq(0).text();
        expect(firstChildText).toBe('First');
        const secondChildText = containerChildren.eq(1).text();
        expect(secondChildText).toBe('JQ target');
        const thirdChildText = containerChildren.eq(2).text();
        expect(thirdChildText).toBe('Second');
    });

    test('insertAfter() should handle different target types', () => {
        const newElement = $('<mark>Mixed targets</mark>');
        newElement.insertAfter('.target1 span, .target2 em');

        const target1SecondChildText = root.find('.target1').children().eq(1).text();
        expect(target1SecondChildText).toBe('Mixed targets');
        const target2SecondChildText = root.find('.target2').children().eq(1).text();
        expect(target2SecondChildText).toBe('Mixed targets');
    });
});
