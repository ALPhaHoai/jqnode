/**
 * Tests for Element API features in JqElement
 * Tests core properties, selector methods, DOM manipulation, and attributes
 */

import { JqElement } from '../dom/core/JqElement';

describe('JqElement - Element API', () => {
    // ==================== Core Properties ====================

    describe('Core Properties', () => {
        let element: JqElement;

        beforeEach(() => {
            element = new JqElement('element', 'div');
        });

        test('id property get and set', () => {
            expect(element.id).toBe('');
            element.id = 'test-id';
            expect(element.id).toBe('test-id');
            expect(element.getAttribute('id')).toBe('test-id');
        });

        test('className property get and set', () => {
            expect(element.className).toBe('');
            element.className = 'foo bar';
            expect(element.className).toBe('foo bar');
            expect(element.getAttribute('class')).toBe('foo bar');
        });

        test('innerHTML getter serializes children', () => {
            const child1 = new JqElement('element', 'span');
            child1.setAttribute('id', 'span1');
            const textNode = new JqElement('text');
            textNode.data = 'Hello';
            child1.children.push(textNode);
            textNode.parent = child1;

            element.children.push(child1);
            child1.parent = element;

            const html = element.innerHTML;
            expect(html).toContain('<span');
            expect(html).toContain('id="span1"');
            expect(html).toContain('Hello');
        });

        test('innerHTML setter creates text node (stub)', () => {
            element.innerHTML = '<p>Test</p>';
            expect(element.children.length).toBe(1);
            expect(element.children[0].type).toBe('text');
            expect(element.children[0].data).toBe('<p>Test</p>');
        });

        test('outerHTML serializes element with attributes', () => {
            element.setAttribute('class', 'container');
            element.setAttribute('data-value', '123');

            const html = element.outerHTML;
            expect(html).toContain('<div');
            expect(html).toContain('class="container"');
            expect(html).toContain('data-value="123"');
            expect(html).toContain('</div>');
        });

        test('localName returns lowercase tag name', () => {
            element.tagName = 'DIV';
            expect(element.localName).toBe('div');
        });

        test('namespaceURI returns null', () => {
            expect(element.namespaceURI).toBeNull();
        });

        test('prefix returns null', () => {
            expect(element.prefix).toBeNull();
        });
    });

    // ==================== Element Relationships ====================

    describe('Element Relationships', () => {
        let parent: JqElement;
        let child1: JqElement;
        let child2: JqElement;
        let textNode: JqElement;

        beforeEach(() => {
            parent = new JqElement('element', 'div');
            child1 = new JqElement('element', 'span');
            child2 = new JqElement('element', 'p');
            textNode = new JqElement('text');
            textNode.data = 'text';

            parent.children.push(child1, textNode, child2);
            child1.parent = parent;
            textNode.parent = parent;
            child2.parent = parent;
        });

        test('childElementCount returns only element children count', () => {
            expect(parent.childElementCount).toBe(2);
        });

        test('firstElementChild returns first element child', () => {
            expect(parent.firstElementChild).toBe(child1 as unknown as Element);
        });

        test('lastElementChild returns last element child', () => {
            expect(parent.lastElementChild).toBe(child2 as unknown as Element);
        });

        test('nextElementSibling finds next element sibling', () => {
            expect((child1 as any).nextElementSibling).toBe(child2 as unknown as Element);
        });

        test('previousElementSibling finds previous element sibling', () => {
            expect((child2 as any).previousElementSibling).toBe(child1 as unknown as Element);
        });

        test('nextElementSibling skips text nodes', () => {
            const result = (child1 as any).nextElementSibling;
            expect(result).not.toBe(textNode);
            expect(result).toBe(child2 as unknown as Element);
        });
    });

    // ==================== Selector Methods ====================

    describe('Selector Methods', () => {
        let root: JqElement;
        let div1: JqElement;
        let div2: JqElement;
        let span: JqElement;

        beforeEach(() => {
            root = new JqElement('element', 'div');
            root.id = 'root';

            div1 = new JqElement('element', 'div');
            div1.className = 'container';
            div1.id = 'div1';

            div2 = new JqElement('element', 'div');
            div2.className = 'container active';

            span = new JqElement('element', 'span');
            span.id = 'myspan';

            root.children.push(div1, div2);
            div1.parent = root;
            div2.parent = root;

            div1.children.push(span);
            span.parent = div1;
        });

        test('querySelector finds first matching element', () => {
            const result = root.querySelector('.container');
            expect(result).toBe(div1 as unknown as Element);
        });

        test('querySelector with ID selector', () => {
            const result = root.querySelector('#myspan');
            expect(result).toBe(span as unknown as Element);
        });

        test('querySelector returns null when not found', () => {
            const result = root.querySelector('.nonexistent');
            expect(result).toBeNull();
        });

        test('querySelectorAll finds all matching elements', () => {
            const results = root.querySelectorAll('.container');
            expect(results.length).toBe(2);
        });

        test('querySelectorAll returns empty list when not found', () => {
            const results = root.querySelectorAll('.nonexistent');
            expect(results.length).toBe(0);
        });

        test('matches returns true for matching selector', () => {
            expect(div1.matches('.container')).toBe(true);
            expect(div1.matches('#div1')).toBe(true);
        });

        test('matches returns false for non-matching selector', () => {
            expect(div1.matches('.active')).toBe(false);
        });

        test('closest finds matching ancestor', () => {
            const result = span.closest('#root');
            expect(result).toBe(root as unknown as Element);
        });

        test('closest returns self if matches', () => {
            const result = span.closest('#myspan');
            expect(result).toBe(span as unknown as Element);
        });

        test('closest returns null when not found', () => {
            const result = span.closest('.nonexistent');
            expect(result).toBeNull();
        });
    });

    // ==================== Attribute Methods ====================

    describe('Attribute Methods', () => {
        let element: JqElement;

        beforeEach(() => {
            element = new JqElement('element', 'div');
        });

        test('hasAttribute returns false for non-existent attribute', () => {
            expect(element.hasAttribute('data-test')).toBe(false);
        });

        test('hasAttribute returns true after setting attribute', () => {
            element.setAttribute('data-test', 'value');
            expect(element.hasAttribute('data-test')).toBe(true);
        });

        test('hasAttributes returns false for element with no attributes', () => {
            expect(element.hasAttributes()).toBe(false);
        });

        test('hasAttributes returns true after adding attribute', () => {
            element.setAttribute('id', 'test');
            expect(element.hasAttributes()).toBe(true);
        });

        test('getAttributeNames returns empty array initially', () => {
            expect(element.getAttributeNames()).toEqual([]);
        });

        test('getAttributeNames returns all attribute names', () => {
            element.setAttribute('id', 'test');
            element.setAttribute('class', 'foo');
            element.setAttribute('data-value', '123');

            const names = element.getAttributeNames();
            expect(names).toContain('id');
            expect(names).toContain('class');
            expect(names).toContain('data-value');
            expect(names.length).toBe(3);
        });

        test('toggleAttribute adds attribute when not present', () => {
            const result = element.toggleAttribute('hidden');
            expect(result).toBe(true);
            expect(element.hasAttribute('hidden')).toBe(true);
        });

        test('toggleAttribute removes attribute when present', () => {
            element.setAttribute('hidden', '');
            const result = element.toggleAttribute('hidden');
            expect(result).toBe(false);
            expect(element.hasAttribute('hidden')).toBe(false);
        });

        test('toggleAttribute with force=true adds attribute', () => {
            const result = element.toggleAttribute('hidden', true);
            expect(result).toBe(true);
            expect(element.hasAttribute('hidden')).toBe(true);
        });

        test('toggleAttribute with force=false removes attribute', () => {
            element.setAttribute('hidden', '');
            const result = element.toggleAttribute('hidden', false);
            expect(result).toBe(false);
            expect(element.hasAttribute('hidden')).toBe(false);
        });
    });

    // ==================== DOM Manipulation ====================

    describe('DOM Manipulation', () => {
        let parent: JqElement;
        let child1: JqElement;
        let child2: JqElement;

        beforeEach(() => {
            parent = new JqElement('element', 'div');
            child1 = new JqElement('element', 'span');
            child1.id = 'child1';
            child2 = new JqElement('element', 'span');
            child2.id = 'child2';

            parent.children.push(child1);
            child1.parent = parent;
        });

        test('after inserts element after target', () => {
            child1.after(child2 as unknown as Node);
            expect(parent.children.length).toBe(2);
            expect(parent.children[1]).toBe(child2);
        });

        test('after inserts string as text node', () => {
            child1.after('text content');
            expect(parent.children.length).toBe(2);
            expect(parent.children[1].type).toBe('text');
            expect(parent.children[1].data).toBe('text content');
        });

        test('before inserts element before target', () => {
            child1.before(child2 as unknown as Node);
            expect(parent.children.length).toBe(2);
            expect(parent.children[0]).toBe(child2);
            expect(parent.children[1]).toBe(child1);
        });

        test('append adds element as last child', () => {
            parent.append(child2 as unknown as Node);
            expect(parent.children.length).toBe(2);
            expect(parent.children[1]).toBe(child2);
            expect(child2.parent).toBe(parent);
        });

        test('prepend adds element as first child', () => {
            parent.prepend(child2 as unknown as Node);
            expect(parent.children.length).toBe(2);
            expect(parent.children[0]).toBe(child2);
            expect(parent.children[1]).toBe(child1);
        });

        test('remove removes element from parent', () => {
            child1.remove();
            expect(parent.children.length).toBe(0);
            expect(child1.parent).toBeUndefined();
        });

        test('replaceWith replaces element with new element', () => {
            child1.replaceWith(child2 as unknown as Node);
            expect(parent.children.length).toBe(1);
            expect(parent.children[0]).toBe(child2);
            expect(child2.parent).toBe(parent);
            expect(child1.parent).toBeUndefined();
        });

        test('replaceChildren replaces all children', () => {
            const newChild = new JqElement('element', 'p');
            parent.replaceChildren(newChild as unknown as Node);
            expect(parent.children.length).toBe(1);
            expect(parent.children[0]).toBe(newChild);
        });
    });

    // ==================== Dimension Properties ====================

    describe('Dimension Properties (Stubs)', () => {
        let element: JqElement;

        beforeEach(() => {
            element = new JqElement('element', 'div');
        });

        test('clientHeight returns 0', () => {
            expect(element.clientHeight).toBe(0);
        });

        test('clientWidth returns 0', () => {
            expect(element.clientWidth).toBe(0);
        });

        test('scrollTop can be set and retrieved', () => {
            element.scrollTop = 100;
            expect(element.scrollTop).toBe(100);
        });

        test('scrollLeft can be set and retrieved', () => {
            element.scrollLeft = 50;
            expect(element.scrollLeft).toBe(50);
        });

        test('offsetHeight returns 0', () => {
            expect(element.offsetHeight).toBe(0);
        });

        test('offsetWidth returns 0', () => {
            expect(element.offsetWidth).toBe(0);
        });
    });

    // ==================== Utility Methods ====================

    describe('Utility Methods', () => {
        let element: JqElement;

        beforeEach(() => {
            element = new JqElement('element', 'div');
        });

        test('getHTML returns innerHTML', () => {
            element.innerHTML = 'test';
            expect(element.getHTML()).toBe(element.innerHTML);
        });

        test('checkVisibility always returns true', () => {
            expect(element.checkVisibility()).toBe(true);
        });

        test('getBoundingClientRect returns stub DOMRect', () => {
            const rect = element.getBoundingClientRect();
            expect(rect.width).toBe(0);
            expect(rect.height).toBe(0);
            expect(rect.x).toBe(0);
            expect(rect.y).toBe(0);
        });

        test('getClientRects returns empty list', () => {
            const rects = element.getClientRects();
            expect(rects.length).toBe(0);
        });

        test('slot property get and set', () => {
            expect(element.slot).toBe('');
            element.slot = 'my-slot';
            expect(element.slot).toBe('my-slot');
        });

        test('shadowRoot returns null', () => {
            expect(element.shadowRoot).toBeNull();
        });
    });

    // ==================== Adjacent Insertion Methods ====================

    describe('Adjacent Insertion Methods', () => {
        let parent: JqElement;
        let target: JqElement;

        beforeEach(() => {
            parent = new JqElement('element', 'div');
            target = new JqElement('element', 'span');
            target.id = 'target';

            parent.children.push(target);
            target.parent = parent;
        });

        test('insertAdjacentElement beforebegin', () => {
            const newElement = new JqElement('element', 'p');
            target.insertAdjacentElement('beforebegin', newElement as unknown as Element);

            expect(parent.children[0]).toBe(newElement);
            expect(parent.children[1]).toBe(target);
        });

        test('insertAdjacentElement afterbegin', () => {
            const newElement = new JqElement('element', 'p');
            target.insertAdjacentElement('afterbegin', newElement as unknown as Element);

            expect(target.children[0]).toBe(newElement);
        });

        test('insertAdjacentElement beforeend', () => {
            const newElement = new JqElement('element', 'p');
            target.insertAdjacentElement('beforeend', newElement as unknown as Element);

            expect(target.children[target.children.length - 1]).toBe(newElement);
        });

        test('insertAdjacentElement afterend', () => {
            const newElement = new JqElement('element', 'p');
            target.insertAdjacentElement('afterend', newElement as unknown as Element);

            expect(parent.children[1]).toBe(newElement);
        });

        test('insertAdjacentText creates text node', () => {
            target.insertAdjacentText('beforebegin', 'Hello');
            expect(parent.children[0].type).toBe('text');
            expect(parent.children[0].data).toBe('Hello');
        });
    });
});
