/**
 * Implementation of the MathMLElement interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/MathMLElement
 * 
 * MathMLElement is the base interface for all MathML elements.
 * It inherits from Element and adds MathML-specific properties and methods.
 * 
 * @example
 * const elem = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'math');
 * elem.style.color = 'blue';
 */

import { JqElement } from '../JqElement';
import { JqCSSStyleDeclaration } from '../JqHTMLElement/JqCSSStyleDeclaration';
import { createDOMStringMap } from '../JqHTMLElement/JqDOMStringMap';

/**
 * Represents a MathML element in the DOM tree.
 * Provides MathML-specific properties and functionality while inheriting
 * all Element functionality from JqElement.
 */
export class JqMathMLElement extends JqElement {
    private _style: JqCSSStyleDeclaration | null = null;
    private _dataset: any = null;
    private _autofocus: boolean = false;
    private _tabIndex: number = -1;

    constructor(tagName: string) {
        super('element', tagName);
    }

    // ==================== Instance Properties ====================

    /**
     * A StylePropertyMap representing the declarations of the element's style attribute.
     * Note: Returns the style object as StylePropertyMap is not implemented.
     */
    get attributeStyleMap(): any {
        // StylePropertyMap is not widely implemented yet, return null or style
        return null; // As per MDN, this returns StylePropertyMap which we don't implement
    }

    /**
     * Whether the control should be focused when the page loads,
     * or when a dialog or popover becomes shown.
     */
    get autofocus(): boolean {
        return this._autofocus || this.hasAttribute('autofocus');
    }

    set autofocus(value: boolean) {
        this._autofocus = value;
        if (value) {
            this.setAttribute('autofocus', '');
        } else {
            this.removeAttribute('autofocus');
        }
    }

    /**
     * A DOMStringMap object which provides a list of key/value pairs of named data attributes
     * which correspond to custom data attributes attached to the element.
     * These correspond to MathML's data-* global attributes.
     */
    get dataset(): DOMStringMap {
        if (!this._dataset) {
            this._dataset = createDOMStringMap(this);
        }
        return this._dataset as unknown as DOMStringMap;
    }

    /**
     * A CSSStyleDeclaration representing the declarations of the element's style attribute.
     */
    get style(): CSSStyleDeclaration {
        if (!this._style) {
            this._style = new JqCSSStyleDeclaration(this);
        }
        return this._style as unknown as CSSStyleDeclaration;
    }

    /**
     * The position of the element in the tabbing order.
     */
    get tabIndex(): number {
        const tabIndexAttr = this.getAttribute('tabindex');
        if (tabIndexAttr !== null) {
            const parsed = parseInt(tabIndexAttr, 10);
            return isNaN(parsed) ? -1 : parsed;
        }
        return this._tabIndex;
    }

    set tabIndex(value: number) {
        this._tabIndex = value;
        this.setAttribute('tabindex', String(value));
    }

    // ==================== Instance Methods ====================

    /**
     * Removes keyboard focus from the currently focused element.
     */
    blur(): void {
        // In a real browser, this would remove focus from the element
        // For server-side implementation, this is a no-op
    }

    /**
     * Makes the element the current keyboard focus.
     */
    focus(options?: FocusOptions): void {
        // In a real browser, this would set focus to the element
        // For server-side implementation, this is a no-op
    }
}
