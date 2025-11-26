/**
 * Implementation of the HTMLElement Web API
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
 * 
 * HTMLElement represents any HTML element. Some elements directly implement this interface,
 * while others implement it via an interface that inherits it.
 * 
 * @example
 * const elem = document.createElement('my-custom-element');
 * elem.hidden = true;
 * elem.innerText = 'Hello World';
 */

import { JqElement } from '../JqElement';
import { JqCSSStyleDeclaration } from './JqCSSStyleDeclaration';
import { createDOMStringMap } from './JqDOMStringMap';

/**
 * Represents an HTML element implementing the full HTMLElement Web API.
 * This class extends JqElement to provide all HTMLElement properties and methods.
 */
export class JqHTMLElement extends JqElement {
    private _style: JqCSSStyleDeclaration | null = null;
    private _dataset: any = null;

    constructor(tagName: string) {
        super('element', tagName);
    }

    // ==================== HTMLElement Properties ====================

    /**
     * Gets or sets the access key assigned to the element
     */
    get accessKey(): string {
        return this.getAttribute('accesskey') || '';
    }

    set accessKey(value: string) {
        this.setAttribute('accesskey', value);
    }

    /**
     * Returns a string containing the element's assigned access key
     */
    get accessKeyLabel(): string {
        return this.accessKey;
    }

    /**
     * Returns a reference to the element's anchor element, or null if it doesn't have one
     */
    get anchorElement(): Element | null {
        return null; // Not implemented in server-side DOM
    }

    /**
     * A StylePropertyMap representing the declarations of the element's style attribute
     * Note: Returns null as StylePropertyMap is not implemented
     */
    get attributeStyleMap(): any {
        return null; // StylePropertyMap not implemented for server-side
    }

    /**
     * Gets or sets the element's capitalization behavior for user input
     */
    get autocapitalize(): string {
        return this.getAttribute('autocapitalize') || '';
    }

    set autocapitalize(value: string) {
        this.setAttribute('autocapitalize', value);
    }

    /**
     * Gets or sets whether the element should be focused when the page loads
     */
    get autofocus(): boolean {
        return this.hasAttribute('autofocus');
    }

    set autofocus(value: boolean) {
        if (value) {
            this.setAttribute('autofocus', '');
        } else {
            this.removeAttribute('autofocus');
        }
    }

    /**
     * Gets or sets whether text input should be automatically corrected
     */
    get autocorrect(): boolean {
        const value = this.getAttribute('autocorrect');
        return value !== 'off';
    }

    set autocorrect(value: boolean) {
        this.setAttribute('autocorrect', value ? 'on' : 'off');
    }

    /**
     * Gets or sets whether the element is editable
     */
    get contentEditable(): string {
        return this.getAttribute('contenteditable') || 'inherit';
    }

    set contentEditable(value: string) {
        this.setAttribute('contenteditable', value);
    }

    /**
     * Returns a DOMStringMap for reading and writing custom data attributes (data-*)
     */
    get dataset(): DOMStringMap {
        if (!this._dataset) {
            this._dataset = createDOMStringMap(this);
        }
        return this._dataset as unknown as DOMStringMap;
    }

    /**
     * Gets or sets the directionality of the element
     */
    get dir(): string {
        return this.getAttribute('dir') || '';
    }

    set dir(value: string) {
        this.setAttribute('dir', value);
    }

    /**
     * Gets or sets whether the element can be dragged
     */
    get draggable(): boolean {
        return this.getAttribute('draggable') === 'true';
    }

    set draggable(value: boolean) {
        this.setAttribute('draggable', String(value));
    }

    /**
     * Returns the EditContext associated with the element, or null
     */
    get editContext(): any {
        return null; // Not implemented in server-side DOM
    }

    set editContext(_value: any) {
        // No-op for server-side
    }

    /**
     * Gets or sets what action label to present for the enter key on virtual keyboards
     */
    get enterKeyHint(): string {
        return this.getAttribute('enterkeyhint') || '';
    }

    set enterKeyHint(value: string) {
        this.setAttribute('enterkeyhint', value);
    }

    /**
     * Gets or sets the hidden state of the element
     */
    get hidden(): boolean | string {
        const hiddenAttr = this.getAttribute('hidden');
        if (hiddenAttr === null) return false;
        if (hiddenAttr === '' || hiddenAttr === 'true') return true;
        return hiddenAttr; // Can be 'until-found' or other values
    }

    set hidden(value: boolean | string) {
        if (value === false) {
            this.removeAttribute('hidden');
        } else if (value === true) {
            this.setAttribute('hidden', '');
        } else {
            this.setAttribute('hidden', String(value));
        }
    }

    /**
     * Gets or sets whether the element is inert
     */
    get inert(): boolean {
        return this.hasAttribute('inert');
    }

    set inert(value: boolean) {
        if (value) {
            this.setAttribute('inert', '');
        } else {
            this.removeAttribute('inert');
        }
    }

    /**
     * Gets or sets the rendered text content of the element
     * As a getter, approximates visible text. As a setter, replaces content.
     */
    get innerText(): string {
        // Simplified: returns text content
        // In a real browser, this would respect CSS visibility, display, etc.
        return this.textContent || '';
    }

    set innerText(value: string) {
        this.textContent = value;
    }

    /**
     * Gets or sets the input mode hint for virtual keyboards
     */
    get inputMode(): string {
        return this.getAttribute('inputmode') || '';
    }

    set inputMode(value: string) {
        this.setAttribute('inputmode', value);
    }

    /**
     * Returns whether the element's content can be edited
     */
    get isContentEditable(): boolean {
        const editable = this.contentEditable;
        return editable === 'true' || editable === '';
    }

    /**
     * Gets or sets the language of the element
     */
    get lang(): string {
        return this.getAttribute('lang') || '';
    }

    set lang(value: string) {
        this.setAttribute('lang', value);
    }

    /**
     * Returns the cryptographic nonce used by Content Security Policy
     */
    get nonce(): string {
        return this.getAttribute('nonce') || '';
    }

    set nonce(value: string) {
        this.setAttribute('nonce', value);
    }

    /**
     * Returns the height of the element relative to the layout
     * Returns 0 for server-side rendering
     */
    get offsetHeight(): number {
        return 0; // No layout in server-side DOM
    }

    /**
     * Returns the distance from the element's left border to its offsetParent's left border
     * Returns 0 for server-side rendering
     */
    get offsetLeft(): number {
        return 0; // No layout in server-side DOM
    }

    /**
     * Returns the element from which all offset calculations are computed
     */
    get offsetParent(): Element | null {
        return this.parent as unknown as Element || null;
    }

    /**
     * Returns the distance from the element's top border to its offsetParent's top border
     * Returns 0 for server-side rendering
     */
    get offsetTop(): number {
        return 0; // No layout in server-side DOM
    }

    /**
     * Returns the width of the element relative to the layout
     * Returns 0 for server-side rendering
     */
    get offsetWidth(): number {
        return 0; // No layout in server-side DOM
    }

    /**
     * Gets or sets the rendered text content (same as innerText for setter, includes element for getter)
     */
    get outerText(): string {
        return this.innerText;
    }

    set outerText(value: string) {
        // In a real browser, this would replace the element with a text node
        // For server-side, we just set innerText
        this.innerText = value;
    }

    /**
     * Gets or sets the popover state
     */
    get popover(): string | null {
        return this.getAttribute('popover');
    }

    set popover(value: string | null) {
        if (value === null) {
            this.removeAttribute('popover');
        } else {
            this.setAttribute('popover', value);
        }
    }

    /**
     * Gets or sets the spell-checking hint
     */
    get spellcheck(): boolean {
        const value = this.getAttribute('spellcheck');
        return value !== 'false';
    }

    set spellcheck(value: boolean) {
        this.setAttribute('spellcheck', String(value));
    }

    /**
     * Returns a CSSStyleDeclaration representing the element's style attribute
     */
    get style(): CSSStyleDeclaration {
        if (!this._style) {
            this._style = new JqCSSStyleDeclaration(this);
        }
        return this._style as unknown as CSSStyleDeclaration;
    }

    /**
     * Gets or sets the position of the element in the tabbing order
     */
    get tabIndex(): number {
        const value = this.getAttribute('tabindex');
        return value ? parseInt(value, 10) : -1;
    }

    set tabIndex(value: number) {
        this.setAttribute('tabindex', String(value));
    }

    /**
     * Gets or sets the tooltip text
     */
    get title(): string {
        return this.getAttribute('title') || '';
    }

    set title(value: string) {
        this.setAttribute('title', value);
    }

    /**
     * Gets or sets whether the element should be translated
     */
    get translate(): boolean {
        const value = this.getAttribute('translate');
        return value !== 'no';
    }

    set translate(value: boolean) {
        this.setAttribute('translate', value ? 'yes' : 'no');
    }

    /**
     * Gets or sets the virtual keyboard policy
     */
    get virtualKeyboardPolicy(): string {
        return this.getAttribute('virtualkeyboardpolicy') || '';
    }

    set virtualKeyboardPolicy(value: string) {
        this.setAttribute('virtualkeyboardpolicy', value);
    }

    /**
     * Gets or sets whether browser-provided writing suggestions should be enabled
     */
    get writingSuggestions(): string {
        return this.getAttribute('writingsuggestions') || '';
    }

    set writingSuggestions(value: string) {
        this.setAttribute('writingsuggestions', value);
    }

    // ==================== HTMLElement Methods ====================

    /**
     * Returns an ElementInternals object for custom elements
     */
    attachInternals(): any {
        throw new Error('attachInternals() is not supported in server-side DOM');
    }

    /**
     * Removes keyboard focus from the element
     */
    blur(): void {
        // No-op in server-side DOM
    }

    /**
     * Sends a mouse click event to the element
     */
    click(): void {
        // No-op in server-side DOM (no event dispatching)
    }

    /**
     * Makes the element the current keyboard focus
     */
    focus(_options?: FocusOptions): void {
        // No-op in server-side DOM
    }

    /**
     * Hides a popover element
     */
    hidePopover(): void {
        // Basic implementation: remove from top layer simulation
        this.removeAttribute('data-popover-open');
    }

    /**
     * Shows a popover element
     */
    showPopover(): void {
        // Basic implementation: add to top layer simulation
        this.setAttribute('data-popover-open', 'true');
    }

    /**
     * Toggles a popover element between hidden and showing states
     */
    togglePopover(force?: boolean): boolean {
        const isOpen = this.hasAttribute('data-popover-open');

        if (force !== undefined) {
            if (force) {
                this.showPopover();
                return true;
            } else {
                this.hidePopover();
                return false;
            }
        }

        if (isOpen) {
            this.hidePopover();
            return false;
        } else {
            this.showPopover();
            return true;
        }
    }

    // ==================== Event Handler Properties ====================
    // These are stubs for compatibility with HTMLElement interface
    // In a full implementation, these would connect to an event system

    onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null = null;
    onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
    onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
    onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
    onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null = null;
    onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onbeforeinput: ((this: GlobalEventHandlers, ev: InputEvent) => any) | null = null;
    onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null = null;
    oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    oncopy: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null = null;
    oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oncut: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null = null;
    ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null = null;
    ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onended: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onerror: OnErrorEventHandler | null = null;
    onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null = null;
    onformdata: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
    onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
    onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null = null;
    onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
    onpaste: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null = null;
    onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null = null;
    onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent) => any) | null = null;
    onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null = null;
    onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null = null;
    onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onslotchange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onsubmit: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    ontouchcancel: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null = null;
    ontouchend: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null = null;
    ontouchmove: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null = null;
    ontouchstart: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null = null;
    ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
    ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
    ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
    ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null = null;
    onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwebkitanimationend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwebkitanimationiteration: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwebkitanimationstart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwebkittransitionend: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null = null;
}
