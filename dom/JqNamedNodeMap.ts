import { HtmlNode } from './HtmlNode';
import { JqAttr } from './JqAttr';

export class JqNamedNodeMap implements NamedNodeMap {
    private readonly _node: HtmlNode;
    private _data: Record<string, string> = {};

    constructor(node: HtmlNode) {
        this._node = node;
        return new Proxy(this, {
            get: (target, prop) => {
                if (typeof prop === 'string') {
                    const index = Number(prop);
                    if (!isNaN(index) && Number.isInteger(index)) {
                        return target.item(index);
                    }
                }
                return (target as any)[prop];
            }
        });
    }

    /**
     * Internal method to set attribute data (used by parser and clone operations)
     */
    _setData(data: Record<string, string>): void {
        this._data = { ...data };
    }

    /**
     * Internal method to get attribute data (used for serialization and cloning)
     */
    _getData(): Record<string, string> {
        return { ...this._data };
    }

    get length(): number {
        return Object.keys(this._data).length;
    }

    item(index: number): Attr | null {
        const keys = Object.keys(this._data);
        if (index < 0 || index >= keys.length) {
            return null;
        }
        const name = keys[index];
        return new JqAttr(this._node, name);
    }

    getNamedItem(qualifiedName: string): Attr | null {
        if (Object.prototype.hasOwnProperty.call(this._data, qualifiedName)) {
            return new JqAttr(this._node, qualifiedName);
        }
        return null;
    }

    getNamedItemNS(_namespace: string | null, localName: string): Attr | null {
        return this.getNamedItem(localName);
    }

    setNamedItem(attr: Attr): Attr | null {
        const oldAttr = this.getNamedItem(attr.name);
        this._data[attr.name] = attr.value;
        return oldAttr;
    }

    setNamedItemNS(attr: Attr): Attr | null {
        return this.setNamedItem(attr);
    }

    removeNamedItem(qualifiedName: string): Attr {
        if (Object.prototype.hasOwnProperty.call(this._data, qualifiedName)) {
            const oldAttr = new JqAttr(this._node, qualifiedName);
            delete this._data[qualifiedName];
            return oldAttr;
        }
        throw new Error(`Failed to execute 'removeNamedItem' on 'NamedNodeMap': No item with name '${qualifiedName}' was found.`);
    }

    removeNamedItemNS(_namespace: string | null, localName: string): Attr {
        return this.removeNamedItem(localName);
    }

    [index: number]: Attr;

    [Symbol.iterator](): any {
        let index = 0;
        return {
            next: (): IteratorResult<Attr> => {
                if (index < this.length) {
                    const value = this.item(index);
                    index++;
                    return { value: value!, done: false };
                }
                return { value: undefined as any, done: true };
            },
            [Symbol.iterator]() { return this; }
        };
    }
}
