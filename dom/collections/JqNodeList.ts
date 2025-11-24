/**
 * JqNodeList - Implementation of the DOM NodeList interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/NodeList
 */

import { JqElement } from '../core/JqElement';

export class JqNodeList implements NodeList {
    private _nodes: JqElement[];

    constructor(nodes: JqElement[] = []) {
        this._nodes = nodes;

        // Create a proxy to support numeric indexing
        return new Proxy(this, {
            get: (target, prop) => {
                if (typeof prop === 'string') {
                    const index = Number(prop);
                    // Support numeric indexing: nodeList[0], nodeList[1], etc.
                    if (!isNaN(index) && Number.isInteger(index)) {
                        return target.item(index);
                    }
                }
                return (target as any)[prop];
            }
        });
    }

    /**
     * Returns the number of nodes in the NodeList.
     */
    get length(): number {
        return this._nodes.length;
    }

    /**
     * Returns the node at the given zero-based index into the list.
     * Returns null if the index is out of range.
     *
     * An alternative to accessing nodeList[i] (which instead returns undefined when i is out-of-bounds).
     */
    item(index: number): Node | null {
        if (index < 0 || index >= this._nodes.length) {
            return null;
        }
        return this._nodes[index] as unknown as Node;
    }

    /**
     * Executes a provided function once per NodeList element,
     * passing the element as an argument to the function.
     */
    forEach(callbackfn: (value: Node, key: number, parent: NodeList) => void, thisArg?: any): void {
        const callback = thisArg !== undefined ? callbackfn.bind(thisArg) : callbackfn;
        for (let i = 0; i < this._nodes.length; i++) {
            callback(this._nodes[i] as unknown as Node, i, this as unknown as NodeList);
        }
    }

    /**
     * Iterator support for for...of loops
     */
    // @ts-expect-error - ArrayIterator requires recursive [Symbol.dispose] on nested iterators which cannot be satisfied
    [Symbol.iterator](): IterableIterator<Node> & { [Symbol.dispose]?: () => void } {
        let index = 0;
        const nodes = this._nodes;

        const iterator: IterableIterator<Node> & { [Symbol.dispose]?: () => void } = {
            next(): IteratorResult<Node> {
                if (index < nodes.length) {
                    return {
                        value: nodes[index++] as unknown as Node,
                        done: false
                    };
                } else {
                    return {
                        value: undefined as any,
                        done: true
                    };
                }
            },
            [Symbol.iterator](): IterableIterator<Node> & { [Symbol.dispose]?: () => void } {
                return iterator;
            },
            [Symbol.dispose]() {
                // No-op disposal for compatibility
            }
        };

        return iterator;
    }

    /**
     * Returns an iterator allowing code to go through all key/value pairs contained in the collection.
     * In this case, the keys are integers starting from 0 and the values are nodes.
     */
    // @ts-expect-error - ArrayIterator requires recursive [Symbol.dispose] on nested iterators which cannot be satisfied
    entries(): IterableIterator<[number, Node]> & { [Symbol.dispose]?: () => void } {
        const nodes = this._nodes;
        let index = 0;

        const iterator: IterableIterator<[number, Node]> & { [Symbol.dispose]?: () => void } = {
            next(): IteratorResult<[number, Node]> {
                if (index < nodes.length) {
                    return {
                        value: [index, nodes[index++] as unknown as Node],
                        done: false
                    };
                } else {
                    return {
                        value: undefined as any,
                        done: true
                    };
                }
            },
            [Symbol.iterator](): IterableIterator<[number, Node]> & { [Symbol.dispose]?: () => void } {
                return this;
            },
            [Symbol.dispose]() {
                // No-op disposal for compatibility
            }
        };

        return iterator;
    }

    /**
     * Returns an iterator allowing code to go through all the keys of the key/value pairs
     * contained in the collection. In this case, the keys are integers starting from 0.
     */
    // @ts-expect-error - ArrayIterator requires recursive [Symbol.dispose] on nested iterators which cannot be satisfied
    keys(): IterableIterator<number> & { [Symbol.dispose]?: () => void } {
        const length = this._nodes.length;
        let index = 0;

        const iterator: IterableIterator<number> & { [Symbol.dispose]?: () => void } = {
            next(): IteratorResult<number> {
                if (index < length) {
                    return {
                        value: index++,
                        done: false
                    };
                } else {
                    return {
                        value: undefined as any,
                        done: true
                    };
                }
            },
            [Symbol.iterator](): IterableIterator<number> & { [Symbol.dispose]?: () => void } {
                return this;
            },
            [Symbol.dispose]() {
                // No-op disposal for compatibility
            }
        };

        return iterator;
    }

    /**
     * Returns an iterator allowing code to go through all values (nodes) of the
     * key/value pairs contained in the collection.
     */
    // @ts-expect-error - ArrayIterator requires recursive [Symbol.dispose] on nested iterators which cannot be satisfied
    values(): IterableIterator<Node> & { [Symbol.dispose]?: () => void } {
        const nodes = this._nodes;
        let index = 0;

        const iterator: IterableIterator<Node> & { [Symbol.dispose]?: () => void } = {
            next(): IteratorResult<Node> {
                if (index < nodes.length) {
                    return {
                        value: nodes[index++] as unknown as Node,
                        done: false
                    };
                } else {
                    return {
                        value: undefined as any,
                        done: true
                    };
                }
            },
            [Symbol.iterator](): IterableIterator<Node> & { [Symbol.dispose]?: () => void } {
                return this;
            },
            [Symbol.dispose]() {
                // No-op disposal for compatibility
            }
        };

        return iterator;
    }

    /**
     * Numeric indexing support
     */
    [index: number]: Node;

    /**
     * Internal method to update the nodes in the list
     */
    _setNodes(nodes: JqElement[]): void {
        this._nodes = nodes;
    }

    /**
     * Internal method to get the nodes in the list
     */
    _getNodes(): JqElement[] {
        return this._nodes;
    }
}

/**
 * JqNodeListOf - Generic implementation for typed NodeList
 * This provides type-safe NodeList functionality for specific node types
 */
export class JqNodeListOf<TNode extends Node> extends JqNodeList implements NodeListOf<TNode> {
    /**
     * Override forEach to use the specific node type
     */
    override forEach(callbackfn: (value: TNode, key: number, parent: NodeListOf<TNode>) => void, thisArg?: any): void {
        const callback = thisArg !== undefined ? callbackfn.bind(thisArg) : callbackfn;
        const nodes = this._getNodes();
        for (let i = 0; i < nodes.length; i++) {
            callback(nodes[i] as unknown as TNode, i, this as unknown as NodeListOf<TNode>);
        }
    }

    /**
     * Override item to return the specific node type
     */
    // @ts-expect-error - DOM spec allows null return but NodeListOf type expects non-null TNode
    override item(index: number): TNode | null {
        const nodes = this._getNodes();
        if (index < 0 || index >= nodes.length) {
            return null;
        }
        return nodes[index] as unknown as TNode;
    }

    /**
     * Override iterator to use the specific node type
     */
    // @ts-expect-error - ArrayIterator requires recursive [Symbol.dispose] on nested iterators which cannot be satisfied
    override[Symbol.iterator](): IterableIterator<TNode> & { [Symbol.dispose]?: () => void } {
        let index = 0;
        const nodes = this._getNodes();

        const iterator: IterableIterator<TNode> & { [Symbol.dispose]?: () => void } = {
            next(): IteratorResult<TNode> {
                if (index < nodes.length) {
                    return {
                        value: nodes[index++] as unknown as TNode,
                        done: false
                    };
                } else {
                    return {
                        value: undefined as any,
                        done: true
                    };
                }
            },
            [Symbol.iterator](): IterableIterator<TNode> & { [Symbol.dispose]?: () => void } {
                return iterator;
            },
            [Symbol.dispose]() {
                // No-op disposal for compatibility
            }
        };

        return iterator;
    }

    /**
     * Numeric indexing support for specific type
     */
    [index: number]: TNode;
}
