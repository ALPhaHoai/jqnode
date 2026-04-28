/**
 * Generic HTML element classes for semantic elements
 * These extend JqElement but don't have specific additional properties
 * Based on MDN HTML Element Reference
 */

import { JqElement } from '../../../JqElement';

// Content Sectioning Elements
export class JqHTMLAddressElement extends JqElement {
    constructor() { super('element', 'address'); }
}

export class JqHTMLArticleElement extends JqElement {
    constructor() { super('element', 'article'); }
}

export class JqHTMLAsideElement extends JqElement {
    constructor() { super('element', 'aside'); }
}

export class JqHTMLFooterElement extends JqElement {
    constructor() { super('element', 'footer'); }
}

export class JqHTMLHeaderElement extends JqElement {
    constructor() { super('element', 'header'); }
}

export class JqHTMLHGroupElement extends JqElement {
    constructor() { super('element', 'hgroup'); }
}

export class JqHTMLMainElement extends JqElement {
    constructor() { super('element', 'main'); }
}

export class JqHTMLNavElement extends JqElement {
    constructor() { super('element', 'nav'); }
}

export class JqHTMLSectionElement extends JqElement {
    constructor() { super('element', 'section'); }
}

export class JqHTMLSearchElement extends JqElement {
    constructor() { super('element', 'search'); }
}

// Text Content Elements
export class JqHTMLBlockquoteElement extends JqElement {
    constructor() { super('element', 'blockquote'); }

    get cite(): string {
        return this.getAttribute('cite') || '';
    }

    set cite(value: string) {
        this.setAttribute('cite', value);
    }
}

export class JqHTMLDDElement extends JqElement {
    constructor() { super('element', 'dd'); }
}

export class JqHTMLDTElement extends JqElement {
    constructor() { super('element', 'dt'); }
}

export class JqHTMLFigureElement extends JqElement {
    constructor() { super('element', 'figure'); }
}

export class JqHTMLFigcaptionElement extends JqElement {
    constructor() { super('element', 'figcaption'); }
}

export class JqHTMLMenuElement extends JqElement {
    constructor() { super('element', 'menu'); }
}

// Inline Text Semantics Elements
export class JqHTMLAbbrElement extends JqElement {
    constructor() { super('element', 'abbr'); }
}

export class JqHTMLBElement extends JqElement {
    constructor() { super('element', 'b'); }
}

export class JqHTMLBDIElement extends JqElement {
    constructor() { super('element', 'bdi'); }
}

export class JqHTMLBDOElement extends JqElement {
    constructor() { super('element', 'bdo'); }
}

export class JqHTMLCiteElement extends JqElement {
    constructor() { super('element', 'cite'); }
}

export class JqHTMLCodeElement extends JqElement {
    constructor() { super('element', 'code'); }
}

export class JqHTMLDataElement extends JqElement {
    constructor() { super('element', 'data'); }

    get value(): string {
        return this.getAttribute('value') || '';
    }

    set value(value: string) {
        this.setAttribute('value', value);
    }
}

export class JqHTMLDFNElement extends JqElement {
    constructor() { super('element', 'dfn'); }
}

export class JqHTMLEmElement extends JqElement {
    constructor() { super('element', 'em'); }
}

export class JqHTMLIElement extends JqElement {
    constructor() { super('element', 'i'); }
}

export class JqHTMLKbdElement extends JqElement {
    constructor() { super('element', 'kbd'); }
}

export class JqHTMLMarkElement extends JqElement {
    constructor() { super('element', 'mark'); }
}

export class JqHTMLQuoteElement extends JqElement {
    constructor() { super('element', 'q'); }

    get cite(): string {
        return this.getAttribute('cite') || '';
    }

    set cite(value: string) {
        this.setAttribute('cite', value);
    }
}

export class JqHTMLRPElement extends JqElement {
    constructor() { super('element', 'rp'); }
}

export class JqHTMLRTElement extends JqElement {
    constructor() { super('element', 'rt'); }
}

export class JqHTMLRubyElement extends JqElement {
    constructor() { super('element', 'ruby'); }
}

export class JqHTMLSElement extends JqElement {
    constructor() { super('element', 's'); }
}

export class JqHTMLSampElement extends JqElement {
    constructor() { super('element', 'samp'); }
}

export class JqHTMLSmallElement extends JqElement {
    constructor() { super('element', 'small'); }
}

export class JqHTMLStrongElement extends JqElement {
    constructor() { super('element', 'strong'); }
}

export class JqHTMLSubElement extends JqElement {
    constructor() { super('element', 'sub'); }
}

export class JqHTMLSupElement extends JqElement {
    constructor() { super('element', 'sup'); }
}

export class JqHTMLTimeElement extends JqElement {
    constructor() { super('element', 'time'); }

    get dateTime(): string {
        return this.getAttribute('datetime') || '';
    }

    set dateTime(value: string) {
        this.setAttribute('datetime', value);
    }
}

export class JqHTMLUElement extends JqElement {
    constructor() { super('element', 'u'); }
}

export class JqHTMLVarElement extends JqElement {
    constructor() { super('element', 'var'); }
}

export class JqHTMLWbrElement extends JqElement {
    constructor() { super('element', 'wbr'); }
}
