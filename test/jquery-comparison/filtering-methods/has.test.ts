import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../../utils/jquery-comparison-helpers';

describe('has() method - Node-Query vs jQuery Comparison', () => {
    test('has() should filter elements that have descendants matching selector - jquery-comparison', () => {
        const html = `
            <div class="container">
                <span>Has span</span>
            </div>
            <div class="container">
                <p>Has paragraph</p>
            </div>
            <div class="container">
                No children here
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('span');
        const jqResult = jqContainersFiltered.has('span');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text().trim();
        const jqText = jqResult.text().trim();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Has span');
    });

    test('has() should filter elements that have multiple descendants matching selector - jquery-comparison', () => {
        const html = `
            <div class="container">
                <span>First</span>
                <span>Second</span>
            </div>
            <div class="container">
                <p>Paragraph</p>
            </div>
            <div class="container">
                <span>Single span</span>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('span');
        const jqResult = jqContainersFiltered.has('span');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);

        // Check first div has 2 spans
        const nqFirstDivChildren = nqResult.nodes[0].children.filter((c: any) => c.type === 'element');
        const jqFirstDivChildren = jqResult.eq(0).children().filter('span');
        expect(nqFirstDivChildren).toHaveLength(2);
        expect(jqFirstDivChildren.length).toBe(2);

        // Check second div has 1 span
        const nqSecondDivChildren = nqResult.nodes[1].children.filter((c: any) => c.type === 'element');
        const jqSecondDivChildren = jqResult.eq(1).children().filter('span');
        expect(nqSecondDivChildren).toHaveLength(1);
        expect(jqSecondDivChildren.length).toBe(1);
    });

    test('has() should filter elements with nested descendants - jquery-comparison', () => {
        const html = `
            <div class="container">
                <div class="wrapper">
                    <span>Nested span</span>
                </div>
            </div>
            <div class="container">
                <span>Direct span</span>
            </div>
            <div class="container">
                <p>No span here</p>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('span');
        const jqResult = jqContainersFiltered.has('span');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);
    });

    test('has() should work with different selectors - jquery-comparison', () => {
        const html = `
            <div class="container">
                <input type="text" class="input-field"/>
            </div>
            <div class="container">
                <input type="password" class="input-field"/>
            </div>
            <div class="container">
                <textarea class="input-field"></textarea>
            </div>
            <div class="container">
                <select class="input-field"></select>
            </div>
            <div class="container">
                <div>No inputs here</div>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('input');
        const jqResult = jqContainersFiltered.has('input');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);
    });

    test('has() should work with class selectors - jquery-comparison', () => {
        const html = `
            <div class="container">
                <div class="special">Special content</div>
            </div>
            <div class="container">
                <div class="normal">Normal content</div>
            </div>
            <div class="container">
                <div class="special">Another special</div>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('.special');
        const jqResult = jqContainersFiltered.has('.special');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);
    });

    test('has() should return empty collection when no matches - jquery-comparison', () => {
        const html = `
            <div class="container">
                <span>Content</span>
            </div>
            <div class="container">
                <p>More content</p>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('div.nonexistent');
        const jqResult = jqContainersFiltered.has('div.nonexistent');

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('has() should work with complex selectors - jquery-comparison', () => {
        const html = `
            <div class="container">
                <input type="text" name="username" required/>
            </div>
            <div class="container">
                <input type="email" name="email"/>
            </div>
            <div class="container">
                <input type="text" name="address"/>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('input[required]');
        const jqResult = jqContainersFiltered.has('input[required]');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('has() should work with id selectors - jquery-comparison', () => {
        const html = `
            <div class="container">
                <div id="special">Special div</div>
            </div>
            <div class="container">
                <div>Normal div</div>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('#special');
        const jqResult = jqContainersFiltered.has('#special');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqText = nqResult.text().trim();
        const jqText = jqResult.text().trim();
        expect(nqText).toBe(jqText);
        expect(nqText).toBe('Special div');
    });

    test('has() should handle empty collection - jquery-comparison', () => {
        const { jquery: jqEmpty, nodeQuery: nqEmpty } = createTestDom('<div></div>');
        const nqEmptyCollection = nqEmpty.find('.nonexistent');
        const jqEmptyCollection = jqEmpty.find('.nonexistent');

        const nqResult = nqEmptyCollection.has('span');
        const jqResult = jqEmptyCollection.has('span');

        expect(nqResult.nodes).toHaveLength(0);
        expect(jqResult.length).toBe(0);
    });

    test('has() should work with chaining - jquery-comparison', () => {
        const html = `
            <div class="container">
                <span class="marker">Has marker</span>
                <p>Content</p>
            </div>
            <div class="container">
                <div>No marker</div>
                <p>Other content</p>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        // Chain: has() -> attr()
        const nqResult = nqContainersFiltered.has('.marker').attr('data-has-marker', 'true');
        const jqResult = jqContainersFiltered.has('.marker').attr('data-has-marker', 'true');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);

        const nqAttr = nqResult.attr('data-has-marker');
        const jqAttr = jqResult.attr('data-has-marker');
        expect(nqAttr).toBe(jqAttr);
        expect(nqAttr).toBe('true');
    });

    test('has() should handle multiple levels of nesting - jquery-comparison', () => {
        const html = `
            <div class="container">
                <div class="level1">
                    <div class="level2">
                        <span>Deep nested</span>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="level1">
                    <p>No span here</p>
                </div>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('span');
        const jqResult = jqContainersFiltered.has('span');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('has() should work with text nodes - jquery-comparison', () => {
        const html = `
            <div class="container">
                <span>Has text</span>
            </div>
            <div class="container">
                <span></span>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        // Both containers have spans, but the selector is for spans
        const nqResult = nqContainersFiltered.has('span');
        const jqResult = jqContainersFiltered.has('span');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);
    });

    test('has() should return new collection instance - jquery-comparison', () => {
        const html = `
            <div class="container">
                <span>Content</span>
            </div>
            <div class="container">
                <p>Other content</p>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('span');
        const jqResult = jqContainersFiltered.has('span');

        expect(nqResult).not.toBe(nqContainersFiltered);
        expect(jqResult).not.toBe(jqContainersFiltered);

        expect(nqResult.nodes).not.toBe(nqContainersFiltered.nodes);
        expect(nqResult.nodes.length).toBe(1);
        expect(jqResult.length).toBe(1);
    });

    test('has() should handle malformed selectors gracefully - jquery-comparison', () => {
        const html = `
            <div class="container">
                <span>Content</span>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        // Invalid selector should throw SyntaxError (jQuery behavior)
        expect(() => nqContainersFiltered.has('[invalid')).toThrow(SyntaxError);
        expect(() => jqContainersFiltered.has('[invalid')).toThrow();
    });

    test('has() should work with universal selector - jquery-comparison', () => {
        const html = `
            <div class="container">
                <span>Has children</span>
            </div>
            <div class="container">
                Empty
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        const nqResult = nqContainersFiltered.has('*');
        const jqResult = jqContainersFiltered.has('*');

        expect(nqResult.nodes).toHaveLength(1);
        expect(jqResult.length).toBe(1);
    });

    test('has() should handle self-referencing selectors - jquery-comparison', () => {
        const html = `
            <div class="container target">
                <span>Content</span>
            </div>
            <div class="container">
                <span>Content</span>
            </div>
        `;
        const { jquery: jqContainers, nodeQuery: nqContainers } = createTestDom(html);
        const nqContainersFiltered = nqContainers.find('.container');
        const jqContainersFiltered = jqContainers.find('.container');

        // Look for containers that have spans (both do)
        const nqResult = nqContainersFiltered.has('span');
        const jqResult = jqContainersFiltered.has('span');

        expect(nqResult.nodes).toHaveLength(2);
        expect(jqResult.length).toBe(2);
    });
});
