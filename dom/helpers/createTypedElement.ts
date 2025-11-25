/**
 * Shared element factory function that creates typed HTML elements based on tag name.
 * Used by both JqDocument.createElement() and the HTML parser.
 *
 * This centralizes the element creation logic to avoid duplication and ensure
 * consistency across the codebase.
 */

import {JqElement} from '../core/JqElement';
import * as HTMLElements from '../index';

/**
 * Creates a properly typed HTML element instance based on the tag name.
 *
 * @param tagName - The HTML tag name (case-insensitive)
 * @returns A typed JqElement instance (e.g., JqHTMLDivElement for 'div')
 *
 * @example
 * const div = createTypedElement('div');  // Returns JqHTMLDivElement
 * const table = createTypedElement('TABLE');  // Returns JqHTMLTableElement
 * const custom = createTypedElement('my-element');  // Returns generic JqElement
 */
export function createTypedElement(tagName: string): JqElement {
    const tag = tagName.toLowerCase();

    // Factory method - return specific element types
    switch (tag) {
        // Structural elements
        case 'html': return new HTMLElements.JqHTMLHtmlElement();
        case 'head': return new HTMLElements.JqHTMLHeadElement();
        case 'body': return new HTMLElements.JqHTMLBodyElement();
        case 'div': return new HTMLElements.JqHTMLDivElement();
        case 'span': return new HTMLElements.JqHTMLSpanElement();

        // Text content
        case 'p': return new HTMLElements.JqHTMLParagraphElement();
        case 'h1': return new HTMLElements.JqHTMLHeadingElement(1);
        case 'h2': return new HTMLElements.JqHTMLHeadingElement(2);
        case 'h3': return new HTMLElements.JqHTMLHeadingElement(3);
        case 'h4': return new HTMLElements.JqHTMLHeadingElement(4);
        case 'h5': return new HTMLElements.JqHTMLHeadingElement(5);
        case 'h6': return new HTMLElements.JqHTMLHeadingElement(6);
        case 'br': return new HTMLElements.JqHTMLBRElement();
        case 'hr': return new HTMLElements.JqHTMLHRElement();
        case 'pre': return new HTMLElements.JqHTMLPreElement();

        // Links
        case 'a': return new HTMLElements.JqHTMLAnchorElement();

        // Lists
        case 'ul': return new HTMLElements.JqHTMLUListElement();
        case 'ol': return new HTMLElements.JqHTMLOListElement();
        case 'li': return new HTMLElements.JqHTMLLIElement();
        case 'dl': return new HTMLElements.JqHTMLDListElement();
        case 'dd': return new HTMLElements.JqHTMLDDElement();
        case 'dt': return new HTMLElements.JqHTMLDTElement();

        // Media
        case 'img': return new HTMLElements.JqHTMLImageElement();
        case 'audio': return new HTMLElements.JqHTMLAudioElement();
        case 'video': return new HTMLElements.JqHTMLVideoElement();
        case 'source': return new HTMLElements.JqHTMLSourceElement();
        case 'track': return new HTMLElements.JqHTMLTrackElement();

        // Forms
        case 'form': return new HTMLElements.JqHTMLFormElement();
        case 'input': return new HTMLElements.JqHTMLInputElement();
        case 'button': return new HTMLElements.JqHTMLButtonElement();
        case 'select': return new HTMLElements.JqHTMLSelectElement();
        case 'option': return new HTMLElements.JqHTMLOptionElement();
        case 'textarea': return new HTMLElements.JqHTMLTextAreaElement();
        case 'label': return new HTMLElements.JqHTMLLabelElement();
        case 'fieldset': return new HTMLElements.JqHTMLFieldSetElement();
        case 'legend': return new HTMLElements.JqHTMLLegendElement();
        case 'datalist': return new HTMLElements.JqHTMLDataListElement();
        case 'optgroup': return new HTMLElements.JqHTMLOptGroupElement();
        case 'output': return new HTMLElements.JqHTMLOutputElement();
        case 'progress': return new HTMLElements.JqHTMLProgressElement();
        case 'meter': return new HTMLElements.JqHTMLMeterElement();

        // Tables
        case 'table': return new HTMLElements.JqHTMLTableElement();
        case 'tr': return new HTMLElements.JqHTMLTableRowElement();
        case 'td': return new HTMLElements.JqHTMLTableCellElement('td');
        case 'th': return new HTMLElements.JqHTMLTableCellElement('th');
        case 'thead': return new HTMLElements.JqHTMLTableSectionElement('thead');
        case 'tbody': return new HTMLElements.JqHTMLTableSectionElement('tbody');
        case 'tfoot': return new HTMLElements.JqHTMLTableSectionElement('tfoot');
        case 'caption': return new HTMLElements.JqHTMLTableCaptionElement();
        case 'col': return new HTMLElements.JqHTMLTableColElement('col');
        case 'colgroup': return new HTMLElements.JqHTMLTableColElement('colgroup');

        // Metadata & Scripts
        case 'meta': return new HTMLElements.JqHTMLMetaElement();
        case 'link': return new HTMLElements.JqHTMLLinkElement();
        case 'script': return new HTMLElements.JqHTMLScriptElement();
        case 'style': return new HTMLElements.JqHTMLStyleElement();
        case 'title': return new HTMLElements.JqHTMLTitleElement();
        case 'base': return new HTMLElements.JqHTMLBaseElement();

        // Embedded content
        case 'iframe': return new HTMLElements.JqHTMLIFrameElement();
        case 'canvas': return new HTMLElements.JqHTMLCanvasElement();
        case 'embed': return new HTMLElements.JqHTMLEmbedElement();
        case 'object': return new HTMLElements.JqHTMLObjectElement();
        case 'picture': return new HTMLElements.JqHTMLPictureElement();
        case 'area': return new HTMLElements.JqHTMLAreaElement();
        case 'map': return new HTMLElements.JqHTMLMapElement();

        // Semantic elements
        case 'address': return new HTMLElements.JqHTMLAddressElement();
        case 'article': return new HTMLElements.JqHTMLArticleElement();
        case 'aside': return new HTMLElements.JqHTMLAsideElement();
        case 'footer': return new HTMLElements.JqHTMLFooterElement();
        case 'header': return new HTMLElements.JqHTMLHeaderElement();
        case 'hgroup': return new HTMLElements.JqHTMLHGroupElement();
        case 'main': return new HTMLElements.JqHTMLMainElement();
        case 'nav': return new HTMLElements.JqHTMLNavElement();
        case 'section': return new HTMLElements.JqHTMLSectionElement();
        case 'search': return new HTMLElements.JqHTMLSearchElement();
        case 'blockquote': return new HTMLElements.JqHTMLBlockquoteElement();
        case 'figure': return new HTMLElements.JqHTMLFigureElement();
        case 'figcaption': return new HTMLElements.JqHTMLFigcaptionElement();
        case 'menu': return new HTMLElements.JqHTMLMenuElement();

        // Inline text semantics
        case 'abbr': return new HTMLElements.JqHTMLAbbrElement();
        case 'b': return new HTMLElements.JqHTMLBElement();
        case 'bdi': return new HTMLElements.JqHTMLBDIElement();
        case 'bdo': return new HTMLElements.JqHTMLBDOElement();
        case 'cite': return new HTMLElements.JqHTMLCiteElement();
        case 'code': return new HTMLElements.JqHTMLCodeElement();
        case 'data': return new HTMLElements.JqHTMLDataElement();
        case 'dfn': return new HTMLElements.JqHTMLDFNElement();
        case 'em': return new HTMLElements.JqHTMLEmElement();
        case 'i': return new HTMLElements.JqHTMLIElement();
        case 'kbd': return new HTMLElements.JqHTMLKbdElement();
        case 'mark': return new HTMLElements.JqHTMLMarkElement();
        case 'q': return new HTMLElements.JqHTMLQuoteElement();
        case 'rp': return new HTMLElements.JqHTMLRPElement();
        case 'rt': return new HTMLElements.JqHTMLRTElement();
        case 'ruby': return new HTMLElements.JqHTMLRubyElement();
        case 's': return new HTMLElements.JqHTMLSElement();
        case 'samp': return new HTMLElements.JqHTMLSampElement();
        case 'small': return new HTMLElements.JqHTMLSmallElement();
        case 'strong': return new HTMLElements.JqHTMLStrongElement();
        case 'sub': return new HTMLElements.JqHTMLSubElement();
        case 'sup': return new HTMLElements.JqHTMLSupElement();
        case 'time': return new HTMLElements.JqHTMLTimeElement();
        case 'u': return new HTMLElements.JqHTMLUElement();
        case 'var': return new HTMLElements.JqHTMLVarElement();
        case 'wbr': return new HTMLElements.JqHTMLWbrElement();

        // Edits
        case 'ins': return new HTMLElements.JqHTMLModElement('ins');
        case 'del': return new HTMLElements.JqHTMLModElement('del');

        // Interactive
        case 'details': return new HTMLElements.JqHTMLDetailsElement();
        case 'dialog': return new HTMLElements.JqHTMLDialogElement();
        case 'summary': return new HTMLElements.JqHTMLSummaryElement();

        // Web components
        case 'slot': return new HTMLElements.JqHTMLSlotElement();
        case 'template': return new HTMLElements.JqHTMLTemplateElement();

        // Scripting
        case 'noscript': return new HTMLElements.JqHTMLNoScriptElement();

        // Default fallback for unknown elements
        default: return new JqElement('element', tagName);
    }
}
