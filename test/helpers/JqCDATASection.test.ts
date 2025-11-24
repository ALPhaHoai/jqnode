/**
 * Tests for JqCDATASection class
 */

import { JqCDATASection } from '../../dom/JqCDATASection';
import { HtmlNode } from '../../dom/HtmlNode';

describe('JqCDATASection', () => {
    describe('Constructor', () => {
        it('should create with no arguments', () => {
            const cdataSection = new JqCDATASection();
            expect(cdataSection.data).toBe('');
            expect(cdataSection.nodeType).toBe(4); // CDATA_SECTION_NODE
            expect(cdataSection.nodeName).toBe('#cdata-section');
        });

        it('should create with initial data', () => {
            const cdataSection = new JqCDATASection('This is CDATA content');
            expect(cdataSection.data).toBe('This is CDATA content');
            expect(cdataSection.nodeType).toBe(4);
        });

        it('should have correct node name', () => {
            const cdataSection = new JqCDATASection('test');
            expect(cdataSection.nodeName).toBe('#cdata-section');
        });
    });

    describe('fromHtmlNode', () => {
        it('should create JqCDATASection from HtmlNode', () => {
            const htmlNode = new HtmlNode('text');
            htmlNode.data = 'Test CDATA content';

            const cdataSection = JqCDATASection.fromHtmlNode(htmlNode);
            expect(cdataSection.data).toBe('Test CDATA content');
            expect(cdataSection.getHtmlNode()).toBe(htmlNode);
        });

        it('should sync data changes with HtmlNode', () => {
            const htmlNode = new HtmlNode('text');
            htmlNode.data = 'Initial CDATA';

            const cdataSection = JqCDATASection.fromHtmlNode(htmlNode);
            cdataSection.data = 'Updated CDATA';

            expect(htmlNode.data).toBe('Updated CDATA');
            expect(cdataSection.data).toBe('Updated CDATA');
        });

        it('should read data from HtmlNode', () => {
            const htmlNode = new HtmlNode('text');
            htmlNode.data = 'From HtmlNode';

            const cdataSection = JqCDATASection.fromHtmlNode(htmlNode);
            htmlNode.data = 'Changed externally';

            expect(cdataSection.data).toBe('Changed externally');
        });
    });

    describe('cloneNode', () => {
        it('should clone CDATA section node', () => {
            const cdataSection = new JqCDATASection('Original CDATA');
            const cloned = cdataSection.cloneNode();

            expect(cloned.data).toBe('Original CDATA');
            expect(cloned).not.toBe(cdataSection);
            expect(cloned).toBeInstanceOf(JqCDATASection);
        });

        it('should create independent clone', () => {
            const cdataSection = new JqCDATASection('Original');
            const cloned = cdataSection.cloneNode();

            cloned.data = 'Modified';
            expect(cdataSection.data).toBe('Original');
        });

        it('should ignore deep parameter', () => {
            const cdataSection = new JqCDATASection('test CDATA');
            const shallow = cdataSection.cloneNode();
            const deep = cdataSection.cloneNode();

            expect(shallow.data).toBe('test CDATA');
            expect(deep.data).toBe('test CDATA');
        });
    });

    describe('Inherited CharacterData methods', () => {
        it('should have data manipulation methods', () => {
            const cdataSection = new JqCDATASection('test');

            expect(typeof cdataSection.appendData).toBe('function');
            expect(typeof cdataSection.deleteData).toBe('function');
            expect(typeof cdataSection.insertData).toBe('function');
            expect(typeof cdataSection.replaceData).toBe('function');
            expect(typeof cdataSection.substringData).toBe('function');
        });

        it('should use appendData correctly', () => {
            const cdataSection = new JqCDATASection('Start');
            cdataSection.appendData(' End');
            expect(cdataSection.data).toBe('Start End');
        });

        it('should use insertData correctly', () => {
            const cdataSection = new JqCDATASection('Heo');
            cdataSection.insertData(2, 'll');
            expect(cdataSection.data).toBe('Hello');
        });

        it('should use deleteData correctly', () => {
            const cdataSection = new JqCDATASection('Hello World');
            cdataSection.deleteData(5, 6);
            expect(cdataSection.data).toBe('Hello');
        });

        it('should use replaceData correctly', () => {
            const cdataSection = new JqCDATASection('Hello World');
            cdataSection.replaceData(6, 5, 'There');
            expect(cdataSection.data).toBe('Hello There');
        });

        it('should use substringData correctly', () => {
            const cdataSection = new JqCDATASection('Hello World');
            const substring = cdataSection.substringData(0, 5);
            expect(substring).toBe('Hello');
        });
    });

    describe('Inherited Text methods', () => {
        it('should have Text-specific methods', () => {
            const cdataSection = new JqCDATASection('test');

            expect(typeof cdataSection.splitText).toBe('function');
        });

        it('should use splitText correctly', () => {
            const cdataSection = new JqCDATASection('HelloWorld');
            const newNode = cdataSection.splitText(5);

            expect(cdataSection.data).toBe('Hello');
            expect(newNode.data).toBe('World');
            expect(newNode).toBeInstanceOf(JqCDATASection);
        });

        it('should throw error for invalid splitText offset', () => {
            const cdataSection = new JqCDATASection('test');

            expect(() => cdataSection.splitText(-1)).toThrow();
            expect(() => cdataSection.splitText(100)).toThrow();
        });

        it('should have wholeText property', () => {
            const cdataSection = new JqCDATASection('test');
            expect(cdataSection.wholeText).toBe('test');
        });

        it('should have assignedSlot property', () => {
            const cdataSection = new JqCDATASection('test');
            expect(cdataSection.assignedSlot).toBeNull();
        });
    });

    describe('Node interface properties', () => {
        it('should have correct nodeType', () => {
            const cdataSection = new JqCDATASection();
            expect(cdataSection.nodeType).toBe(4);
            expect(cdataSection.nodeType).toBe(cdataSection.CDATA_SECTION_NODE);
        });

        it('should have correct nodeName', () => {
            const cdataSection = new JqCDATASection();
            expect(cdataSection.nodeName).toBe('#cdata-section');
        });

        it('should sync nodeValue with data', () => {
            const cdataSection = new JqCDATASection('test CDATA');
            expect(cdataSection.nodeValue).toBe('test CDATA');

            cdataSection.nodeValue = 'changed';
            expect(cdataSection.data).toBe('changed');
        });

        it('should sync textContent with data', () => {
            const cdataSection = new JqCDATASection('test CDATA');
            expect(cdataSection.textContent).toBe('test CDATA');

            cdataSection.textContent = 'changed';
            expect(cdataSection.data).toBe('changed');
        });
    });

    describe('CharacterData properties', () => {
        it('should report correct length', () => {
            const cdataSection = new JqCDATASection('Hello');
            expect(cdataSection.length).toBe(5);

            cdataSection.data = 'Hello World';
            expect(cdataSection.length).toBe(11);
        });

        it('should allow empty data', () => {
            const cdataSection = new JqCDATASection('');
            expect(cdataSection.length).toBe(0);
            expect(cdataSection.data).toBe('');
        });
    });

    describe('Integration with HtmlNode', () => {
        it('should not have HtmlNode reference by default', () => {
            const cdataSection = new JqCDATASection('test');
            expect(cdataSection.getHtmlNode()).toBeNull();
        });

        it('should maintain HtmlNode reference when created via fromHtmlNode', () => {
            const htmlNode = new HtmlNode('text');
            const cdataSection = JqCDATASection.fromHtmlNode(htmlNode);

            expect(cdataSection.getHtmlNode()).toBe(htmlNode);
        });
    });

    describe('CDATA-specific behavior', () => {
        it('should represent CDATA sections (escape blocks of text)', () => {
            const cdataSection = new JqCDATASection('Text with <markup> & special chars');
            expect(cdataSection.data).toBe('Text with <markup> & special chars');
            expect(cdataSection.nodeName).toBe('#cdata-section');
            expect(cdataSection.nodeType).toBe(4);
        });

        it('should allow typical CDATA content', () => {
            const cdataSection1 = new JqCDATASection('<![CDATA[This is CDATA]]>');
            expect(cdataSection1.data).toBe('<![CDATA[This is CDATA]]>');

            const cdataSection2 = new JqCDATASection('function() { return x < 5 && y > 10; }');
            expect(cdataSection2.data).toBe('function() { return x < 5 && y > 10; }');

            const cdataSection3 = new JqCDATASection('<script>alert("test")</script>');
            expect(cdataSection3.data).toBe('<script>alert("test")</script>');
        });

        it('should preserve special characters without escaping', () => {
            const content = '< > & " \' = / \\ @ # $ % ^ * ( ) [ ] { }';
            const cdataSection = new JqCDATASection(content);
            expect(cdataSection.data).toBe(content);
        });
    });

    describe('Inheritance hierarchy', () => {
        it('should extend Text', () => {
            const cdataSection = new JqCDATASection('test');
            // JqCDATASection extends JqText extends JqCharacterData extends JqNode
            expect(cdataSection).toBeInstanceOf(JqCDATASection);
        });

        it('should have all Text capabilities', () => {
            const cdataSection = new JqCDATASection('Hello World');

            // Text method
            const newNode = cdataSection.splitText(5);
            expect(cdataSection.data).toBe('Hello');
            expect(newNode.data).toBe(' World');

            // CharacterData method
            cdataSection.appendData('!');
            expect(cdataSection.data).toBe('Hello!');
        });
    });
});
