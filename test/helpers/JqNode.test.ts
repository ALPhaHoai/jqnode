import { JqElement } from '../../types';
import { JqNode } from '../../dom/JqNode';

describe('JqNode', () => {
    describe('Node Type Constants', () => {
        it('should have correct node type constants', () => {
            const node = new JqElement('element', 'div');

            expect(node.ELEMENT_NODE).toBe(1);
            expect(node.ATTRIBUTE_NODE).toBe(2);
            expect(node.TEXT_NODE).toBe(3);
            expect(node.CDATA_SECTION_NODE).toBe(4);
            expect(node.PROCESSING_INSTRUCTION_NODE).toBe(7);
            expect(node.COMMENT_NODE).toBe(8);
            expect(node.DOCUMENT_NODE).toBe(9);
            expect(node.DOCUMENT_TYPE_NODE).toBe(10);
            expect(node.DOCUMENT_FRAGMENT_NODE).toBe(11);
        });

        it('should have correct document position constants', () => {
            const node = new JqElement('element', 'div');

            expect(node.DOCUMENT_POSITION_DISCONNECTED).toBe(1);
            expect(node.DOCUMENT_POSITION_PRECEDING).toBe(2);
            expect(node.DOCUMENT_POSITION_FOLLOWING).toBe(4);
            expect(node.DOCUMENT_POSITION_CONTAINS).toBe(8);
            expect(node.DOCUMENT_POSITION_CONTAINED_BY).toBe(16);
            expect(node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC).toBe(32);
        });
    });

    describe('Node Properties', () => {
        it('should set correct nodeType for element nodes', () => {
            const element = new JqElement('element', 'div');
            expect(element.nodeType).toBe(1); // ELEMENT_NODE
        });

        it('should set correct nodeType for text nodes', () => {
            const text = new JqElement('text');
            expect(text.nodeType).toBe(3); // TEXT_NODE
        });

        it('should set correct nodeType for comment nodes', () => {
            const comment = new JqElement('comment');
            expect(comment.nodeType).toBe(8); // COMMENT_NODE
        });

        it('should return correct nodeName for element nodes', () => {
            const element = new JqElement('element', 'div');
            expect(element.nodeName).toBe('DIV');
        });

        it('should return correct nodeName for text nodes', () => {
            const text = new JqElement('text');
            expect(text.nodeName).toBe('#text');
        });

        it('should return correct nodeName for comment nodes', () => {
            const comment = new JqElement('comment');
            expect(comment.nodeName).toBe('#comment');
        });

        it('should return nodeValue for text nodes', () => {
            const text = new JqElement('text');
            text.data = 'Hello World';
            expect(text.nodeValue).toBe('Hello World');
        });

        it('should return nodeValue for comment nodes', () => {
            const comment = new JqElement('comment');
            comment.data = 'This is a comment';
            expect(comment.nodeValue).toBe('This is a comment');
        });

        it('should return null nodeValue for element nodes', () => {
            const element = new JqElement('element', 'div');
            expect(element.nodeValue).toBe(null);
        });

        it('should set nodeValue for text nodes', () => {
            const text = new JqElement('text');
            text.nodeValue = 'New value';
            expect(text.data).toBe('New value');
        });
    });

    describe('Tree Traversal Properties', () => {
        it('should have correct firstChild property', () => {
            const parent = new JqElement('element', 'div');
            const child1 = new JqElement('element', 'span');
            const child2 = new JqElement('element', 'p');

            parent.appendChild(child1 as unknown as Node);
            parent.appendChild(child2 as unknown as Node);

            expect(parent.firstChild).toBe(child1 as unknown as ChildNode);
        });

        it('should have correct lastChild property', () => {
            const parent = new JqElement('element', 'div');
            const child1 = new JqElement('element', 'span');
            const child2 = new JqElement('element', 'p');

            parent.appendChild(child1 as unknown as Node);
            parent.appendChild(child2 as unknown as Node);

            expect(parent.lastChild).toBe(child2 as unknown as ChildNode);
        });

        it('should return null for firstChild when no children', () => {
            const parent = new JqElement('element', 'div');
            expect(parent.firstChild).toBe(null);
        });

        it('should return null for lastChild when no children', () => {
            const parent = new JqElement('element', 'div');
            expect(parent.lastChild).toBe(null);
        });

        it('should have correct nextSibling property', () => {
            const parent = new JqElement('element', 'div');
            const child1 = new JqElement('element', 'span');
            const child2 = new JqElement('element', 'p');

            child1.next = child2;

            expect(child1.nextSibling).toBe(child2 as unknown as ChildNode);
        });

        it('should have correct previousSibling property', () => {
            const parent = new JqElement('element', 'div');
            const child1 = new JqElement('element', 'span');
            const child2 = new JqElement('element', 'p');

            child2.prev = child1;

            expect(child2.previousSibling).toBe(child1 as unknown as ChildNode);
        });

        it('should have correct parentNode property', () => {
            const parent = new JqElement('element', 'div');
            const child = new JqElement('element', 'span');

            child.parent = parent;

            expect(child.parentNode).toBe(parent as unknown as ParentNode);
        });
    });

    describe('Node Methods', () => {
        describe('appendChild', () => {
            it('should append child to parent', () => {
                const parent = new JqElement('element', 'div');
                const child = new JqElement('element', 'span');

                parent.appendChild(child as unknown as Node);

                expect(parent.children).toContain(child);
                expect(child.parent).toBe(parent);
            });

            it('should append multiple children in order', () => {
                const parent = new JqElement('element', 'div');
                const child1 = new JqElement('element', 'span');
                const child2 = new JqElement('element', 'p');

                parent.appendChild(child1 as unknown as Node);
                parent.appendChild(child2 as unknown as Node);

                expect(parent.children[0]).toBe(child1);
                expect(parent.children[1]).toBe(child2);
            });
        });

        describe('removeChild', () => {
            it('should remove child from parent', () => {
                const parent = new JqElement('element', 'div');
                const child = new JqElement('element', 'span');

                parent.appendChild(child as unknown as Node);
                parent.removeChild(child as unknown as Node);

                expect(parent.children).not.toContain(child);
                expect(child.parent).toBeUndefined();
            });

            it('should throw error when removing non-existent child', () => {
                const parent = new JqElement('element', 'div');
                const child = new JqElement('element', 'span');

                expect(() => {
                    parent.removeChild(child as unknown as Node);
                }).toThrow('Node was not found');
            });
        });

        describe('insertBefore', () => {
            it('should insert node before reference child', () => {
                const parent = new JqElement('element', 'div');
                const child1 = new JqElement('element', 'span');
                const child2 = new JqElement('element', 'p');
                const newChild = new JqElement('element', 'a');

                parent.appendChild(child1 as unknown as Node);
                parent.appendChild(child2 as unknown as Node);
                parent.insertBefore(newChild as unknown as Node, child2 as unknown as Node);

                expect(parent.children[0]).toBe(child1);
                expect(parent.children[1]).toBe(newChild);
                expect(parent.children[2]).toBe(child2);
            });

            it('should append when reference child is null', () => {
                const parent = new JqElement('element', 'div');
                const child = new JqElement('element', 'span');

                parent.insertBefore(child as unknown as Node, null);

                expect(parent.children).toContain(child);
            });

            it('should throw error when reference child not found', () => {
                const parent = new JqElement('element', 'div');
                const child = new JqElement('element', 'span');
                const ref = new JqElement('element', 'p');

                expect(() => {
                    parent.insertBefore(child as unknown as Node, ref as unknown as Node);
                }).toThrow('Reference node was not found');
            });
        });

        describe('replaceChild', () => {
            it('should replace old child with new child', () => {
                const parent = new JqElement('element', 'div');
                const oldChild = new JqElement('element', 'span');
                const newChild = new JqElement('element', 'p');

                parent.appendChild(oldChild as unknown as Node);
                parent.replaceChild(newChild as unknown as Node, oldChild as unknown as Node);

                expect(parent.children).toContain(newChild);
                expect(parent.children).not.toContain(oldChild);
                expect(oldChild.parent).toBeUndefined();
                expect(newChild.parent).toBe(parent);
            });

            it('should throw error when child to replace not found', () => {
                const parent = new JqElement('element', 'div');
                const oldChild = new JqElement('element', 'span');
                const newChild = new JqElement('element', 'p');

                expect(() => {
                    parent.replaceChild(newChild as unknown as Node, oldChild as unknown as Node);
                }).toThrow('Node was not found');
            });
        });

        describe('hasChildNodes', () => {
            it('should return true when node has children', () => {
                const parent = new JqElement('element', 'div');
                const child = new JqElement('element', 'span');

                parent.appendChild(child as unknown as Node);

                expect(parent.hasChildNodes()).toBe(true);
            });

            it('should return false when node has no children', () => {
                const parent = new JqElement('element', 'div');
                expect(parent.hasChildNodes()).toBe(false);
            });
        });

        describe('cloneNode', () => {
            it('should create shallow clone by default', () => {
                const node = new JqElement('element', 'div');
                node.setAttribute('class', 'test');
                const child = new JqElement('element', 'span');
                node.appendChild(child as unknown as Node);

                const clone = node.cloneNode();

                expect(clone).not.toBe(node);
                expect(clone.tagName).toBe('div');
                expect(clone.getAttribute('class')).toBe('test');
                expect(clone.children.length).toBe(0);
            });

            it('should create deep clone when deep=true', () => {
                const node = new JqElement('element', 'div');
                node.setAttribute('class', 'test');
                const child = new JqElement('element', 'span');
                child.setAttribute('id', 'child');
                node.appendChild(child as unknown as Node);

                const clone = node.cloneNode(true);

                expect(clone).not.toBe(node);
                expect(clone.children.length).toBe(1);
                expect(clone.children[0]).not.toBe(child);
                expect(clone.children[0].tagName).toBe('span');
                expect(clone.children[0].getAttribute('id')).toBe('child');
            });
        });

        describe('contains', () => {
            it('should return true when node contains descendant', () => {
                const parent = new JqElement('element', 'div');
                const child = new JqElement('element', 'span');
                const grandchild = new JqElement('element', 'a');

                parent.appendChild(child as unknown as Node);
                child.appendChild(grandchild as unknown as Node);

                expect(parent.contains(grandchild as unknown as Node)).toBe(true);
            });

            it('should return false when node does not contain target', () => {
                const node1 = new JqElement('element', 'div');
                const node2 = new JqElement('element', 'span');

                expect(node1.contains(node2 as unknown as Node)).toBe(false);
            });

            it('should return false when comparing with self', () => {
                const node = new JqElement('element', 'div');
                expect(node.contains(node as unknown as Node)).toBe(false);
            });
        });

        describe('isEqualNode', () => {
            it('should return true for equal nodes', () => {
                const node1 = new JqElement('element', 'div');
                node1.setAttribute('class', 'test');

                const node2 = new JqElement('element', 'div');
                node2.setAttribute('class', 'test');

                expect(node1.isEqualNode(node2 as unknown as Node)).toBe(true);
            });

            it('should return false for different node types', () => {
                const element = new JqElement('element', 'div');
                const text = new JqElement('text');

                expect(element.isEqualNode(text as unknown as Node)).toBe(false);
            });

            it('should return false for different tag names', () => {
                const node1 = new JqElement('element', 'div');
                const node2 = new JqElement('element', 'span');

                expect(node1.isEqualNode(node2 as unknown as Node)).toBe(false);
            });
        });

        describe('isSameNode', () => {
            it('should return true for same node reference', () => {
                const node = new JqElement('element', 'div');
                expect(node.isSameNode(node as unknown as Node)).toBe(true);
            });

            it('should return false for different nodes', () => {
                const node1 = new JqElement('element', 'div');
                const node2 = new JqElement('element', 'div');

                expect(node1.isSameNode(node2 as unknown as Node)).toBe(false);
            });
        });

        describe('textContent', () => {
            it('should get textContent for text node', () => {
                const text = new JqElement('text');
                text.data = 'Hello';
                expect(text.textContent).toBe('Hello');
            });

            it('should get textContent for element with text children', () => {
                const parent = new JqElement('element', 'div');
                const text1 = new JqElement('text');
                text1.data = 'Hello ';
                const text2 = new JqElement('text');
                text2.data = 'World';

                parent.appendChild(text1 as unknown as Node);
                parent.appendChild(text2 as unknown as Node);

                expect(parent.textContent).toBe('Hello World');
            });

            it('should set textContent on element', () => {
                const element = new JqElement('element', 'div');
                element.textContent = 'Test content';

                expect(element.children.length).toBe(1);
                expect(element.children[0].type).toBe('text');
                expect(element.children[0].data).toBe('Test content');
            });

            it('should replace existing children when setting textContent', () => {
                const element = new JqElement('element', 'div');
                const child = new JqElement('element', 'span');
                element.appendChild(child as unknown as Node);

                element.textContent = 'New content';

                expect(element.children.length).toBe(1);
                expect(element.children[0].type).toBe('text');
            });
        });
    });
});
