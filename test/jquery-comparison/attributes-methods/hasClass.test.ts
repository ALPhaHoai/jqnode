import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('hasClass() method - jQuery Comparison', () => {
    const html = `
      <div class="container">
        <div class="item active" id="div1">First</div>
        <div class="item" id="div2">Second</div>
        <div class="item active highlighted" id="div3">Third</div>
        <div class="item multiple classes here" id="div4">Fourth</div>
        <span id="span1">No classes</span>
      </div>
    `;

    test('hasClass() should return true when element has the specified class - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqHasActive = nqDiv1.hasClass('active');
        const jqHasActive = jqDiv1.hasClass('active');

        expect(nqHasActive).toBe(jqHasActive);
        expect(nqHasActive).toBe(true);

        const nqDiv3 = nqRoot.find('#div3');
        const jqDiv3 = jqRoot.find('#div3');

        expect(nqDiv3.hasClass('active')).toBe(jqDiv3.hasClass('active'));
        expect(nqDiv3.hasClass('highlighted')).toBe(jqDiv3.hasClass('highlighted'));
    });

    test('hasClass() should return false when element does not have the specified class - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv2 = nqRoot.find('#div2');
        const jqDiv2 = jqRoot.find('#div2');

        const nqHasActive = nqDiv2.hasClass('active');
        const jqHasActive = jqDiv2.hasClass('active');

        expect(nqHasActive).toBe(jqHasActive);
        expect(nqHasActive).toBe(false);

        expect(nqDiv2.hasClass('highlighted')).toBe(jqDiv2.hasClass('highlighted'));
        expect(nqDiv2.hasClass('highlighted')).toBe(false);
    });

    test('hasClass() should return false when element has no class attribute - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqSpan1 = nqRoot.find('#span1');
        const jqSpan1 = jqRoot.find('#span1');

        const nqHasClass = nqSpan1.hasClass('anyclass');
        const jqHasClass = jqSpan1.hasClass('anyclass');

        expect(nqHasClass).toBe(jqHasClass);
        expect(nqHasClass).toBe(false);
    });

    test('hasClass() should handle multiple classes correctly - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv3 = nqRoot.find('#div3');
        const jqDiv3 = jqRoot.find('#div3');

        expect(nqDiv3.hasClass('active')).toBe(jqDiv3.hasClass('active'));
        expect(nqDiv3.hasClass('highlighted')).toBe(jqDiv3.hasClass('highlighted'));
        expect(nqDiv3.hasClass('nonexistent')).toBe(jqDiv3.hasClass('nonexistent'));
    });

    test('hasClass() should handle elements with multiple space-separated classes - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv4 = nqRoot.find('#div4');
        const jqDiv4 = jqRoot.find('#div4');

        expect(nqDiv4.hasClass('multiple')).toBe(jqDiv4.hasClass('multiple'));
        expect(nqDiv4.hasClass('classes')).toBe(jqDiv4.hasClass('classes'));
        expect(nqDiv4.hasClass('here')).toBe(jqDiv4.hasClass('here'));
        expect(nqDiv4.hasClass('missing')).toBe(jqDiv4.hasClass('missing'));
    });

    test('hasClass() should return false for empty collections - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqEmpty = nqRoot.find('.nonexistent');
        const jqEmpty = jqRoot.find('.nonexistent');

        const nqHasClass = nqEmpty.hasClass('anyclass');
        const jqHasClass = jqEmpty.hasClass('anyclass');

        expect(nqHasClass).toBe(jqHasClass);
        expect(nqHasClass).toBe(false);
    });

    test('hasClass() should only check the first element in the collection - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqAllDivs = nqRoot.find('.item');
        const jqAllDivs = jqRoot.find('.item');

        expect(nqAllDivs.nodes).toHaveLength(4);
        expect(jqAllDivs.length).toBe(4);

        const nqHasActive = nqAllDivs.hasClass('active');
        const jqHasActive = jqAllDivs.hasClass('active');

        expect(nqHasActive).toBe(jqHasActive);
        expect(nqHasActive).toBe(true);

        const nqSecondDiv = nqAllDivs.eq(1);
        const jqSecondDiv = jqAllDivs.eq(1);

        expect(nqSecondDiv.hasClass('active')).toBe(jqSecondDiv.hasClass('active'));
        expect(nqSecondDiv.hasClass('active')).toBe(false);
    });

    test('hasClass() should handle class names with special characters - jquery-comparison', () => {
        const specialHtml = `<div class="special-class_123 test-class"></div>`;
        const { jquery: jqElement, nodeQuery: nqElement } = createTestDom(specialHtml);

        const nqDiv = nqElement.find('div');
        const jqDiv = jqElement.find('div');

        expect(nqDiv.hasClass('special-class_123')).toBe(jqDiv.hasClass('special-class_123'));
        expect(nqDiv.hasClass('test-class')).toBe(jqDiv.hasClass('test-class'));
        expect(nqDiv.hasClass('nonexistent')).toBe(jqDiv.hasClass('nonexistent'));
    });

    test('hasClass() should handle single class elements - jquery-comparison', () => {
        const singleHtml = `<div class="single"></div>`;
        const { jquery: jqElement, nodeQuery: nqElement } = createTestDom(singleHtml);

        const nqDiv = nqElement.find('div');
        const jqDiv = jqElement.find('div');

        expect(nqDiv.hasClass('single')).toBe(jqDiv.hasClass('single'));
        expect(nqDiv.hasClass('other')).toBe(jqDiv.hasClass('other'));
    });

    test('hasClass() should handle empty string class names - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv1 = nqRoot.find('#div1');
        const jqDiv1 = jqRoot.find('#div1');

        const nqHasEmpty = nqDiv1.hasClass('');
        const jqHasEmpty = jqDiv1.hasClass('');

        expect(nqHasEmpty).toBe(jqHasEmpty);
        expect(nqHasEmpty).toBe(false);
    });

    test('hasClass() should handle elements with only whitespace in class attribute - jquery-comparison', () => {
        const whitespaceHtml = `<div class="   "></div>`;
        const { jquery: jqElement, nodeQuery: nqElement } = createTestDom(whitespaceHtml);

        const nqDiv = nqElement.find('div');
        const jqDiv = jqElement.find('div');

        const nqHasClass = nqDiv.hasClass('anyclass');
        const jqHasClass = jqDiv.hasClass('anyclass');

        expect(nqHasClass).toBe(jqHasClass);
        expect(nqHasClass).toBe(false);
    });
});
