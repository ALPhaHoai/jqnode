/**
 * JqHTMLCollection - Implementation of the DOM HTMLCollection interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
 */

import {JqElement} from '../core/JqElement';

export class JqHTMLCollection {
    private _elements: JqElement[];

    constructor(elements: JqElement[] = []) {
        this._elements = elements;

        // Create a proxy to support numeric and named indexing
        return new Proxy(this, {
            get: (target, prop) => {
                if (typeof prop === 'string') {
                    const index = Number(prop);
                    // Support numeric indexing: collection[0], collection[1], etc.
                    if (!isNaN(index) && Number.isInteger(index)) {
                        return target.item(index);
                    }
                    // Support named indexing: collection['myId'], collection['myName'], etc.
                    const namedItem = target.namedItem(prop);
                    if (namedItem !== null) {
                        return namedItem;
                    }
                }
                return (target as any)[prop];
            }
        });
    }

    /**
     * Returns the number of items in the collection.
     */
    get length(): number {
        return this._elements.length;
    }

    /**
     * Returns the specific element at the given zero-based index into the list.
     * Returns null if the index is out of range.
     *
     * An alternative to accessing collection[i] (which instead returns undefined when i is out-of-bounds).
     */
    item(index: number): Element | null {
        if (index < 0 || index >= this._elements.length) {
            return null;
        }
        return this._elements[index] as unknown as Element;
    }

    /**
     * Returns the specific node whose ID or, as a fallback, name matches the string specified by name.
     * Matching by name is only done as a last resort, only in HTML, and only if the referenced element
     * supports the name attribute. Returns null if no node exists by the given name.
     *
     * An alternative to accessing collection[name] (which instead returns undefined when name does not exist).
     */
    namedItem(name: string): Element | null {
        // First, try to find by ID
        for (const element of this._elements) {
            const id = element.attributes.getNamedItem('id')?.value;
            if (id === name) {
                return element as unknown as Element;
            }
        }

        // Fallback: try to find by name attribute
        for (const element of this._elements) {
            const nameAttr = element.attributes.getNamedItem('name')?.value;
            if (nameAttr === name) {
                return element as unknown as Element;
            }
        }

        return null;
    }

    /**
     * Iterator support for for...of loops
     */
    [Symbol.iterator](): IterableIterator<Element> {
        let index = 0;
        const elements = this._elements;

        const iterator: IterableIterator<Element> = {
            next(): IteratorResult<Element> {
                if (index < elements.length) {
                    return {
                        value: elements[index++] as unknown as Element,
                        done: false
                    };
                } else {
                    return {
                        value: undefined as any,
                        done: true
                    };
                }
            },
            [Symbol.iterator](): IterableIterator<Element> {
                return iterator;
            }
        };

        return iterator;
    }

    /**
     * Internal method to update the elements in the collection
     */
    _setElements(elements: JqElement[]): void {
        this._elements = elements;
    }

    /**
     * Internal method to get the elements in the collection
     */
    _getElements(): JqElement[] {
        return this._elements;
    }
}
