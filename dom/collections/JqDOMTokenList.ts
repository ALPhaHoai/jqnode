/**
 * JqDOMTokenList - Implementation of the DOM DOMTokenList interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
 */

/**
 * Represents a set of space-separated tokens.
 * Commonly used for classList, relList, and other token list attributes.
 */
export class JqDOMTokenList implements DOMTokenList {
    private _element: Element | null = null;
    private _attributeName: string;
    private _tokens: Set<string> = new Set();

    constructor(element: Element | null = null, attributeName: string = 'class') {
        this._element = element;
        this._attributeName = attributeName;
        this._sync();

        // Create a proxy to support numeric indexing
        return new Proxy(this, {
            get: (target, prop) => {
                if (typeof prop === 'string') {
                    const index = Number(prop);
                    // Support numeric indexing: classList[0], classList[1], etc.
                    if (!isNaN(index) && Number.isInteger(index)) {
                        return target.item(index);
                    }
                }
                return (target as any)[prop];
            }
        });
    }

    /**
     * Synchronizes the internal token set with the element's attribute value
     */
    private _sync(): void {
        if (!this._element) {
            this._tokens.clear();
            return;
        }

        const attrValue = this._element.getAttribute(this._attributeName);
        this._tokens.clear();

        if (attrValue) {
            const tokens = attrValue.trim().split(/\s+/).filter(t => t.length > 0);
            tokens.forEach(token => this._tokens.add(token));
        }
    }

    /**
     * Updates the element's attribute from the internal token set
     */
    private _updateAttribute(): void {
        if (!this._element) return;

        if (this._tokens.size === 0) {
            this._element.removeAttribute(this._attributeName);
        } else {
            const value = Array.from(this._tokens).join(' ');
            this._element.setAttribute(this._attributeName, value);
        }
    }

    /**
     * Validates that a token is valid (not empty and contains no whitespace)
     */
    private _validateToken(token: string): void {
        if (token === '') {
            throw new DOMException('The token provided must not be empty.', 'SyntaxError');
        }
        if (/\s/.test(token)) {
            throw new DOMException('The token provided contains whitespace.', 'InvalidCharacterError');
        }
    }

    /**
     * Returns the number of tokens in the list
     */
    get length(): number {
        return this._tokens.size;
    }

    /**
     * Returns the value of the list as a string
     */
    get value(): string {
        return Array.from(this._tokens).join(' ');
    }

    /**
     * Sets the value of the list
     */
    set value(val: string) {
        if (!this._element) return;
        this._element.setAttribute(this._attributeName, val);
        this._sync();
    }

    /**
     * Returns the token at the specified index
     */
    item(index: number): string | null {
        if (index < 0 || index >= this._tokens.size) {
            return null;
        }
        return Array.from(this._tokens)[index];
    }

    /**
     * Returns true if the list contains the given token
     */
    contains(token: string): boolean {
        return this._tokens.has(token);
    }

    /**
     * Adds the specified tokens to the list
     */
    add(...tokens: string[]): void {
        tokens.forEach(token => {
            this._validateToken(token);
            this._tokens.add(token);
        });
        this._updateAttribute();
    }

    /**
     * Removes the specified tokens from the list
     */
    remove(...tokens: string[]): void {
        tokens.forEach(token => {
            this._validateToken(token);
            this._tokens.delete(token);
        });
        this._updateAttribute();
    }

    /**
     * Toggles a token in the list
     * If force is true, adds the token; if false, removes it
     * Returns true if the token is in the list after the operation
     */
    toggle(token: string, force?: boolean): boolean {
        this._validateToken(token);

        if (force === undefined) {
            if (this._tokens.has(token)) {
                this._tokens.delete(token);
                this._updateAttribute();
                return false;
            } else {
                this._tokens.add(token);
                this._updateAttribute();
                return true;
            }
        } else {
            if (force) {
                this._tokens.add(token);
                this._updateAttribute();
                return true;
            } else {
                this._tokens.delete(token);
                this._updateAttribute();
                return false;
            }
        }
    }

    /**
     * Replaces an old token with a new token
     * Returns true if the old token was replaced
     */
    replace(oldToken: string, newToken: string): boolean {
        this._validateToken(oldToken);
        this._validateToken(newToken);

        if (!this._tokens.has(oldToken)) {
            return false;
        }

        this._tokens.delete(oldToken);
        this._tokens.add(newToken);
        this._updateAttribute();
        return true;
    }

    /**
     * Returns true if the given token is in the associated attribute's supported tokens
     * This is primarily for rel attribute validation
     */
    supports(_token: string): boolean {
        // For now, we don't validate supported tokens
        // This would need to be implemented per attribute type
        throw new DOMException('supports() is not supported.', 'NotSupportedError');
    }

    /**
     * Returns an iterator for key/value pairs
     */
    entries(): ArrayIterator<[number, string]> {
        const tokens = Array.from(this._tokens);
        return tokens.entries() as ArrayIterator<[number, string]>;
    }

    /**
     * Executes a callback for each token
     */
    forEach(callback: (value: string, key: number, parent: DOMTokenList) => void, thisArg?: any): void {
        let index = 0;
        for (const token of this._tokens) {
            callback.call(thisArg, token, index++, this as unknown as DOMTokenList);
        }
    }

    /**
     * Returns an iterator for keys (indices)
     */
    keys(): ArrayIterator<number> {
        const tokens = Array.from(this._tokens);
        return tokens.keys() as ArrayIterator<number>;
    }

    /**
     * Returns an iterator for values (tokens)
     */
    values(): ArrayIterator<string> {
        const tokens = Array.from(this._tokens);
        return tokens.values() as ArrayIterator<string>;
    }

    /**
     * Returns string representation of the token list
     */
    toString(): string {
        return this.value;
    }

    /**
     * Makes the class iterable
     */
    [Symbol.iterator](): ArrayIterator<string> {
        return this.values();
    }

    /**
     * Allows array-like access with numeric indices
     */
    [index: number]: string;
}
