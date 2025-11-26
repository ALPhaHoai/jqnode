import { JqDocument } from '../../dom/JqNode/JqDocument/JqDocument';
import { JqElement } from '../../dom/JqNode/JqElement/JqElement';
import { JqText } from '../../dom/JqNode/JqCharacterData/JqText';
import { JqComment } from '../../dom/JqNode/JqCharacterData/JqComment';

describe('JqDocument', () => {
    let doc: JqDocument;

    beforeEach(() => {
        doc = new JqDocument();
    });

    it('should create a document with correct node type and name', () => {
        expect(doc.nodeType).toBe(9); // DOCUMENT_NODE
        expect(doc.nodeName).toBe('#document');
    });

    it('should create elements with correct ownerDocument', () => {
        const div = doc.createElement('div');
        expect(div).toBeInstanceOf(JqElement);
        expect(div.tagName).toBe('div');
        expect(div.ownerDocument).toBe(doc);
    });

    it('should create text nodes with correct ownerDocument', () => {
        const text = doc.createTextNode('Hello');
        expect(text).toBeInstanceOf(JqText);
        expect(text.data).toBe('Hello');
        expect(text.ownerDocument).toBe(doc);
    });

    it('should create comments with correct ownerDocument', () => {
        const comment = doc.createComment('My Comment');
        expect(comment).toBeInstanceOf(JqComment);
        expect(comment.data).toBe('My Comment');
        expect(comment.ownerDocument).toBe(doc);
    });

    it('should append children correctly', () => {
        const html = doc.createElement('html');
        doc.appendChild(html);
        expect(doc.children.length).toBe(1);
        expect(doc.firstChild).toBe(html);
        expect(doc.documentElement).toBe(html);
    });

    it('should find elements by ID', () => {
        const html = doc.createElement('html');
        doc.appendChild(html);
        const body = doc.createElement('body');
        html.appendChild(body);
        const div = doc.createElement('div');
        div.setAttribute('id', 'myDiv');
        body.appendChild(div);

        const found = doc.getElementById('myDiv');
        expect(found).toBe(div);
    });

    it('should find elements by tag name', () => {
        const html = doc.createElement('html');
        doc.appendChild(html);
        const body = doc.createElement('body');
        html.appendChild(body);
        const div1 = doc.createElement('div');
        const div2 = doc.createElement('div');
        const span = doc.createElement('span');
        body.appendChild(div1);
        body.appendChild(div2);
        body.appendChild(span);

        const divs = doc.getElementsByTagName('div');
        expect(divs.length).toBe(2);
        expect(divs[0]).toBe(div1);
        expect(divs[1]).toBe(div2);
    });

    it('should find elements by class name', () => {
        const html = doc.createElement('html');
        doc.appendChild(html);
        const body = doc.createElement('body');
        html.appendChild(body);
        const div1 = doc.createElement('div');
        div1.setAttribute('class', 'foo bar');
        const div2 = doc.createElement('div');
        div2.setAttribute('class', 'bar');
        const div3 = doc.createElement('div');
        div3.setAttribute('class', 'foo');
        body.appendChild(div1);
        body.appendChild(div2);
        body.appendChild(div3);

        const bars = doc.getElementsByClassName('bar');
        expect(bars.length).toBe(2);
        expect(bars[0]).toBe(div1);
        expect(bars[1]).toBe(div2);
    });

    it('should handle head and body properties', () => {
        const html = doc.createElement('html');
        doc.appendChild(html);
        const head = doc.createElement('head');
        const body = doc.createElement('body');
        html.appendChild(head);
        html.appendChild(body);

        expect(doc.head).toBe(head);
        expect(doc.body).toBe(body);
    });

    it('should have defaultView property returning null', () => {
        expect(doc.defaultView).toBe(null);
    });
});
