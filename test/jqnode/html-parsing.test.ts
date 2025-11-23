import $ from '../../index';

describe('HTML Parsing', () => {
    test('should parse simple HTML elements', () => {
        const html = '<div>Hello</div>';
        const result = $(html);
        expect(result.nodes).toHaveLength(1);
        const firstNodeType = result.nodes[0].type;
        expect(firstNodeType).toBe('element');
        const firstNodeTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(firstNodeTag).toBe('div');
        const firstNodeChildren = result.nodes[0].children;
        expect(firstNodeChildren).toHaveLength(1);
        const firstChildType = result.nodes[0].children![0].type;
        expect(firstChildType).toBe('text');
        const firstChildValue = result.nodes[0].children![0].value;
        expect(firstChildValue).toBe('Hello');
    });

    test('should parse self-closing tags', () => {
        const html = '<img src="test.jpg" alt="pic"/>';
        const result = $(html);
        expect(result.nodes).toHaveLength(1);
        const imgNodeType = result.nodes[0].type;
        expect(imgNodeType).toBe('element');
        const imgNodeTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(imgNodeTag).toBe('img');
        const imgSrc = result.nodes[0].attributes?.src;
        expect(imgSrc).toBe('test.jpg');
        const imgAlt = result.nodes[0].attributes?.alt;
        expect(imgAlt).toBe('pic');
        const imgChildren = result.nodes[0].children;
        expect(imgChildren).toHaveLength(0);
    });

    test('should parse attributes', () => {
        const html = '<div class="test" id="main" data-value="123"></div>';
        const result = $(html);
        const nodeClass = result.nodes[0].attributes?.class;
        expect(nodeClass).toBe('test');
        const nodeId = result.nodes[0].attributes?.id;
        expect(nodeId).toBe('main');
        const nodeDataValue = result.nodes[0].attributes?.['data-value'];
        expect(nodeDataValue).toBe('123');
    });

    test('should handle quoted attributes', () => {
        const html = '<p data-info=\'some info\' title="Hello World"></p>';
        const result = $(html);
        const nodeDataInfo = result.nodes[0].attributes?.['data-info'];
        expect(nodeDataInfo).toBe('some info');
        const nodeTitle = result.nodes[0].attributes?.title;
        expect(nodeTitle).toBe('Hello World');
    });

    test('should parse nested elements', () => {
        const html = '<div><h1>Title</h1><p>Content</p></div>';
        const result = $(html);
        const nestedDivTag = result.nodes[0].tagName && result.nodes[0].tagName.toLowerCase();
        expect(nestedDivTag).toBe('div');
        const nestedDivChildren = result.nodes[0].children;
        expect(nestedDivChildren).toHaveLength(2);
        const firstChildTag = result.nodes[0].children![0].tagName && result.nodes[0].children![0].tagName.toLowerCase();
        expect(firstChildTag).toBe('h1');
        const firstChildText = result.nodes[0].children![0].children![0].value;
        expect(firstChildText).toBe('Title');
        const secondChildTag = result.nodes[0].children![1].tagName && result.nodes[0].children![1].tagName.toLowerCase();
        expect(secondChildTag).toBe('p');
        const secondChildText = result.nodes[0].children![1].children![0].value;
        expect(secondChildText).toBe('Content');
    });
});
