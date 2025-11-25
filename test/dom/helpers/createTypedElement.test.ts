/**
 * Tests for custom and unknown element distinction in createTypedElement
 */

import { createTypedElement } from '../../../dom/helpers/createTypedElement';
import { JqHTMLElement } from '../../../dom/core/JqHTMLElement';
import { JqHTMLUnknownElement } from '../../../dom/core/JqHTMLUnknownElement';
import { JqHTMLDivElement } from '../../../dom/html-elements/text/JqHTMLDivElement';

describe('createTypedElement - Custom vs Unknown Elements', () => {
    describe('Custom Elements (with hyphen)', () => {
        test('creates JqHTMLElement for custom element names', () => {
            const elem = createTypedElement('my-custom-element');
            expect(elem).toBeInstanceOf(JqHTMLElement);
            expect(elem.constructor.name).toBe('JqHTMLElement');
        });

        test('preserves tag name for custom elements', () => {
            const elem = createTypedElement('web-component');
            expect(elem.tagName).toBe('web-component');
        });

        test('handles multiple hyphens', () => {
            const elem = createTypedElement('app-header-menu-item');
            expect(elem).toBeInstanceOf(JqHTMLElement);
        });

        test('handles hyphen at different positions', () => {
            const elem1 = createTypedElement('x-foo');
            const elem2 = createTypedElement('custom-x');
            const elem3 = createTypedElement('a-b-c');

            expect(elem1).toBeInstanceOf(JqHTMLElement);
            expect(elem2).toBeInstanceOf(JqHTMLElement);
            expect(elem3).toBeInstanceOf(JqHTMLElement);
        });

        test('case-insensitive matching for custom elements', () => {
            const elem1 = createTypedElement('My-Custom');
            const elem2 = createTypedElement('MY-CUSTOM');
            const elem3 = createTypedElement('my-custom');

            expect(elem1).toBeInstanceOf(JqHTMLElement);
            expect(elem2).toBeInstanceOf(JqHTMLElement);
            expect(elem3).toBeInstanceOf(JqHTMLElement);
        });
    });

    describe('Unknown Elements (without hyphen)', () => {
        test('creates JqHTMLUnknownElement for unknown element names', () => {
            const elem = createTypedElement('foobar');
            expect(elem).toBeInstanceOf(JqHTMLUnknownElement);
            expect(elem.constructor.name).toBe('JqHTMLUnknownElement');
        });

        test('preserves tag name for unknown elements', () => {
            const elem = createTypedElement('unknown');
            expect(elem.tagName).toBe('unknown');
        });

        test('handles numbers in unknown elements', () => {
            const elem1 = createTypedElement('element123');
            const elem2 = createTypedElement('123element');
            const elem3 = createTypedElement('elem123ent');

            expect(elem1).toBeInstanceOf(JqHTMLUnknownElement);
            expect(elem2).toBeInstanceOf(JqHTMLUnknownElement);
            expect(elem3).toBeInstanceOf(JqHTMLUnknownElement);
        });

        test('non-standard heading numbers return unknown element', () => {
            const elem1 = createTypedElement('h7');
            const elem2 = createTypedElement('h0');
            const elem3 = createTypedElement('h99');

            expect(elem1).toBeInstanceOf(JqHTMLUnknownElement);
            expect(elem2).toBeInstanceOf(JqHTMLUnknownElement);
            expect(elem3).toBeInstanceOf(JqHTMLUnknownElement);
        });
    });

    describe('Standard Elements (unaffected)', () => {
        test('standard elements still return correct types', () => {
            const div = createTypedElement('div');
            expect(div).toBeInstanceOf(JqHTMLDivElement);
            expect(div.constructor.name).toBe('JqHTMLDivElement');
        });

        test('case-insensitive for standard elements', () => {
            const div1 = createTypedElement('DIV');
            const div2 = createTypedElement('div');
            const div3 = createTypedElement('DiV');

            expect(div1).toBeInstanceOf(JqHTMLDivElement);
            expect(div2).toBeInstanceOf(JqHTMLDivElement);
            expect(div3).toBeInstanceOf(JqHTMLDivElement);
        });
    });

    describe('Edge Cases', () => {
        test('single hyphen treated as custom element', () => {
            const elem = createTypedElement('-');
            expect(elem).toBeInstanceOf(JqHTMLElement);
        });

        test('starting with hyphen is custom element', () => {
            const elem = createTypedElement('-invalid');
            expect(elem).toBeInstanceOf(JqHTMLElement);
        });

        test('ending with hyphen is custom element', () => {
            const elem = createTypedElement('invalid-');
            expect(elem).toBeInstanceOf(JqHTMLElement);
        });

        test('double hyphens still custom element', () => {
            const elem = createTypedElement('test--component');
            expect(elem).toBeInstanceOf(JqHTMLElement);
        });

        test('empty string is unknown element', () => {
            const elem = createTypedElement('');
            expect(elem).toBeInstanceOf(JqHTMLUnknownElement);
        });
    });

    describe('HTML5 Behavior Matching', () => {
        test('custom element behavior matches HTML5', () => {
            // In HTML5: document.createElement('my-custom').constructor.name === "HTMLElement"
            const elem = createTypedElement('my-custom');
            expect(elem.constructor.name).toBe('JqHTMLElement');
        });

        test('unknown element behavior matches HTML5', () => {
            // In HTML5: document.createElement('foobar').constructor.name === "HTMLUnknownElement"
            const elem = createTypedElement('foobar');
            expect(elem.constructor.name).toBe('JqHTMLUnknownElement');
        });

        test('different types are distinct', () => {
            const custom = createTypedElement('my-element');
            const unknown = createTypedElement('unknown');

            expect(custom.constructor.name).not.toBe(unknown.constructor.name);
        });
    });
});
