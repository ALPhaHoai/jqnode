/**
 * Implementation of the SVGElement interface
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
 * 
 * SVGElement is the base interface for all SVG elements.
 * It inherits from Element and adds SVG-specific properties and methods.
 * 
 * @example
 * const elem = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
 * elem.style.fill = 'red';
 */

import { JqElement } from '../JqElement';
import { JqCSSStyleDeclaration } from '../JqHTMLElement/JqCSSStyleDeclaration';
import { JqDOMStringMap } from '../JqHTMLElement/JqDOMStringMap';

/**
 * Represents an SVG element in the DOM tree.
 * Provides SVG-specific properties and functionality while inheriting
 * all Element functionality from JqElement.
 */
export class JqSVGElement extends JqElement {
    private _style: JqCSSStyleDeclaration | null = null;
    private _dataset: JqDOMStringMap | null = null;
    private _nonce: string = '';
    private _autofocus: boolean = false;
    private _tabIndex: number = -1;

    constructor(tagName: string) {
        super('element', tagName);
    }

    // ==================== Instance Properties ====================

    /**
     * A StylePropertyMap representing the declarations of the element's style attribute.
     * For now, we return a CSSStyleDeclaration for compatibility.
     */
    get attributeStyleMap(): any {
        // StylePropertyMap is not widely implemented yet, return style instead
        return this.style;
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
     * An SVGAnimatedString that reflects the value of the class attribute.
     * Note: This is deprecated. Authors are advised to use Element.classList instead.
     * @deprecated Use classList instead
     */
    override get className(): string {
        return this.getAttribute('class') || '';
    }

    override set className(value: string) {
        this.setAttribute('class', value);
    }

    /**
     * A DOMStringMap object which provides a list of key/value pairs of named data attributes
     * which correspond to custom data attributes attached to the element.
     */
    get dataset(): DOMStringMap {
        if (!this._dataset) {
            this._dataset = new JqDOMStringMap(this as any);
        }
        return this._dataset as unknown as DOMStringMap;
    }

    /**
     * Returns the cryptographic number used once that is used by
     * Content Security Policy to determine whether a given fetch will be allowed to proceed.
     */
    get nonce(): string {
        return this._nonce || this.getAttribute('nonce') || '';
    }

    set nonce(value: string) {
        this._nonce = value;
        this.setAttribute('nonce', value);
    }

    /**
     * An SVGSVGElement referring to the nearest ancestor <svg> element.
     * null if the given element is the outermost <svg> element.
     */
    get ownerSVGElement(): SVGSVGElement | null {
        let current = this.parent;
        while (current) {
            if (current.tagName && current.tagName.toLowerCase() === 'svg') {
                return current as unknown as SVGSVGElement;
            }
            current = current.parent;
        }
        return null;
    }

    /**
     * A CSSStyleDeclaration representing the declarations of the element's style attribute.
     */
    get style(): CSSStyleDeclaration {
        if (!this._style) {
            this._style = new JqCSSStyleDeclaration(this as any);
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

    /**
     * The SVGElement which established the current viewport.
     * Often the nearest ancestor <svg> element.
     * null if the given element is the outermost <svg> element.
     */
    get viewportElement(): SVGElement | null {
        // For most SVG elements, the viewport element is the same as nearestViewportElement
        return this.nearestViewportElement as unknown as SVGElement;
    }

    /**
     * The nearest ancestor <svg> element.
     * null if the current element is the outermost <svg> element.
     */
    get nearestViewportElement(): SVGSVGElement | null {
        // Same as ownerSVGElement for most cases
        return this.ownerSVGElement;
    }

    /**
     * The farthest ancestor <svg> element (the outermost <svg> element).
     * null if the current element is the outermost <svg> element.
     */
    get farthestViewportElement(): SVGSVGElement | null {
        let farthest: JqElement | undefined = null as any;
        let current = this.parent;

        while (current) {
            if (current.tagName && current.tagName.toLowerCase() === 'svg') {
                farthest = current;
            }
            current = current.parent;
        }

        return farthest as unknown as SVGSVGElement | null;
    }

    // ==================== Instance Methods ====================

    /**
     * Removes keyboard focus from the currently focused element.
     */
    blur(): void {
        // In a real browser, this would remove focus from the element
        // For server-side implementation, this is a no-op
        // Subclasses or implementations with focus management can override this
    }

    /**
     * Makes the element the current keyboard focus.
     */
    focus(options?: FocusOptions): void {
        // In a real browser, this would set focus to the element
        // For server-side implementation, this is a no-op
        // Subclasses or implementations with focus management can override this
    }

    // ==================== Event Handlers ====================
    // Note: SVGElement supports various events through addEventListener
    // The following are common event handler properties:

    /**
     * Event handler for the abort event.
     * Fired when page loading is stopped before an SVG element has been allowed to load completely.
     */
    onabort: ((this: SVGElement, ev: Event) => any) | null = null;

    /**
     * Event handler for the error event.
     * Fired when an SVG element does not load properly or when an error occurs during script execution.
     */
    onerror: OnErrorEventHandler | null = null;

    /**
     * Event handler for the load event.
     * Fires on an SVGElement when it is loaded in the browser.
     */
    onload: ((this: SVGElement, ev: Event) => any) | null = null;

    /**
     * Event handler for the resize event.
     * Fired when an SVG document is being resized.
     */
    onresize: ((this: SVGElement, ev: Event) => any) | null = null;

    /**
     * Event handler for the scroll event.
     * Fired when an SVG document view is being shifted along the X and/or Y axes.
     */
    onscroll: ((this: SVGElement, ev: Event) => any) | null = null;

    /**
     * Event handler for the unload event.
     * Fired when the DOM implementation removes an SVG document from a window or frame.
     */
    onunload: ((this: SVGElement, ev: Event) => any) | null = null;
}
