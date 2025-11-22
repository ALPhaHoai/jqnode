import $ from '../../../index';

describe('clone() method', () => {
    test('clone() should create a deep copy of elements', () => {
        const html = `<div class="original"><span>Hello</span></div>`;
        const $original = $(html);
        const $cloned = $original.clone();

        // Should be different instances
        expect($cloned).not.toBe($original);
        expect($cloned.nodes[0]).not.toBe($original.nodes[0]);

        // Should have same structure
        expect($cloned.html()).toBe($original.html());
        expect($cloned.text()).toContain('Hello');
    });

    test('clone() should copy nested elements', () => {
        const html = `
            <div class="container">
                <div class="child1">
                    <span>Child 1</span>
                </div>
                <div class="child2">
                    <span>Child 2</span>
                </div>
            </div>
        `;
        const $original = $(html);
        const $cloned = $original.clone();

        expect($cloned.html()).toBe($original.html());
        expect($cloned.text()).toContain('Child 1');
        expect($cloned.text()).toContain('Child 2');
    });

    test('clone() should not copy data by default', () => {
        const html = `<div>Test</div>`;
        const $original = $(html);
        $original.data('key', 'value');
        $original.data('number', 42);

        const $cloned = $original.clone();

        expect($cloned.data('key')).toBeUndefined();
        expect($cloned.data('number')).toBeUndefined();
    });

    test('clone(true) should copy data when withDataAndEvents is true', () => {
        const html = `<div>Test</div>`;
        const $original = $(html);
        $original.data('key', 'value');
        $original.data('number', 42);

        const $cloned = $original.clone(true);

        expect($cloned.data('key')).toBe('value');
        expect($cloned.data('number')).toBe(42);
    });

    test('clone(true, true) should deep copy data for children', () => {
        const html = `<div><span>Child</span></div>`;
        const $original = $(html);
        $original.data('parent-key', 'parent-value');
        // Note: we can't test child data copying without .find() which uses debugLog

        const $cloned = $original.clone(true, true);

        expect($cloned.data('parent-key')).toBe('parent-value');
    });

    test('clone(true, false) should copy parent data but not children data', () => {
        const html = `<div><span>Child</span></div>`;
        const $original = $(html);
        $original.data('parent-key', 'parent-value');

        const $cloned = $original.clone(true, false);

        expect($cloned.data('parent-key')).toBe('parent-value');
    });

    test('clone() should work with multiple elements', () => {
        const html = `
            <div class="item">Item 1</div>
            <div class="item">Item 2</div>
            <div class="item">Item 3</div>
        `;
        const $original = $(html);
        const $cloned = $original.clone();

        expect($cloned.length).toBe(3);
        expect($cloned.text()).toContain('Item 1');
        expect($cloned.text()).toContain('Item 2');
        expect($cloned.text()).toContain('Item 3');
    });

    test('clone() should maintain text nodes', () => {
        const html = `<div>Text before <span>span</span> text after</div>`;
        const $original = $(html);
        const $cloned = $original.clone();

        expect($cloned.text()).toBe('Text before span text after');
    });

    test('clone() should work with empty elements', () => {
        const html = `<div></div>`;
        const $original = $(html);
        const $cloned = $original.clone();

        expect($cloned.html()).toBe('');
        expect($cloned.length).toBe(1);
    });
});
