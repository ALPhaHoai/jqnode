import $ from '../../../index';

describe('has() method', () => {
    test('has() should filter elements that have descendants matching selector', () => {
        const html = `
            <div class="container">
                <span>Has span</span>
            </div>
            <div class="container">
                <p>Has paragraph</p>
            </div>
            <div class="container">
                No children here
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(1);
        const resultText = result.text().trim();
        expect(resultText).toBe('Has span');
    });

    test('has() should filter elements that have multiple descendants matching selector', () => {
        const html = `
            <div class="container">
                <span>First</span>
                <span>Second</span>
            </div>
            <div class="container">
                <p>Paragraph</p>
            </div>
            <div class="container">
                <span>Single span</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(2);

        const firstDivElementChildren = result.nodes[0].children.filter((c: any) => c.type === 'element');
        expect(firstDivElementChildren).toHaveLength(2); // First div has 2 spans

        const thirdDivElementChildren = result.nodes[1].children.filter((c: any) => c.type === 'element');
        expect(thirdDivElementChildren).toHaveLength(1); // Third div has 1 span
    });

    test('has() should filter elements with nested descendants', () => {
        const html = `
            <div class="container">
                <div class="nested">
                    <span>Deep span</span>
                </div>
            </div>
            <div class="container">
                <span>Direct span</span>
            </div>
            <div class="container">
                No matching descendants
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(2);
    });

    test('has() should return empty when no elements have matching descendants', () => {
        const html = `
            <div class="container">
                <p>Paragraph</p>
            </div>
            <div class="container">
                <div>Div</div>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(0);
    });

    test('has() should work with class selectors', () => {
        const html = `
            <div class="container">
                <span class="highlight">Highlighted</span>
            </div>
            <div class="container">
                <span>Normal</span>
            </div>
            <div class="container">
                No span
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('.highlight');

        expect(result.nodes).toHaveLength(1);
        const highlightElement = result.find('.highlight');
        expect(highlightElement.text()).toBe('Highlighted');
    });

    test('has() should work with ID selectors', () => {
        const html = `
            <div class="container">
                <span id="target">Target span</span>
            </div>
            <div class="container">
                <span>Other span</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('#target');

        expect(result.nodes).toHaveLength(1);
        const targetSpan = result.find('#target');
        expect(targetSpan.text()).toBe('Target span');
    });

    test('has() should work with complex selectors', () => {
        const html = `
            <div class="container">
                <span class="highlight special">Special highlighted</span>
            </div>
            <div class="container">
                <span class="highlight">Just highlighted</span>
            </div>
            <div class="container">
                <span>Normal</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span.highlight.special');

        expect(result.nodes).toHaveLength(1);
        const resultSpan = result.find('span');
        expect(resultSpan.attr('class')).toBe('highlight special');
    });

    test('has() should work with direct element references', () => {
        const html = `
            <div class="container">
                <span>Span 1</span>
            </div>
            <div class="container">
                <span>Span 2</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const targetSpan = containers.find('span').nodes[0];

        const result = containers.has(targetSpan);

        expect(result.nodes).toHaveLength(1);
        const resultText = result.text().trim();
        expect(resultText).toBe('Span 1');
    });

    test('has() should return empty when called on empty collection', () => {
        const empty = $('.nonexistent');
        const result = empty.has('span');
        expect(result.nodes).toHaveLength(0);
    });

    test('has() should return all elements when all have matching descendants', () => {
        const html = `
            <div class="container">
                <span>First</span>
            </div>
            <div class="container">
                <span>Second</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(2);
    });

    test('has() should handle elements without children', () => {
        const html = `
            <div class="container"></div>
            <div class="container">
                <span>Has child</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(1);
    });

    test('has() should work with deeply nested descendants', () => {
        const html = `
            <div class="container">
                <div class="level1">
                    <div class="level2">
                        <div class="level3">
                            <span class="deep">Deep Span</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <span class="shallow">Shallow Span</span>
            </div>
            <div class="container">
                No spans
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(2); // First two containers have spans
    });

    test('has() should work with complex nested selectors', () => {
        const html = `
            <div class="container">
                <div class="wrapper">
                    <span class="highlight important">Important Highlight</span>
                </div>
            </div>
            <div class="container">
                <div class="wrapper">
                    <span class="highlight">Normal Highlight</span>
                </div>
            </div>
            <div class="container">
                <span>No wrapper</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span.highlight.important');

        expect(result.nodes).toHaveLength(1);
        const resultSpan = result.find('span');
        expect(resultSpan.hasClass('important')).toBe(true);
    });

    test('has() should work with multiple descendant selectors', () => {
        const html = `
            <div class="container">
                <span>Type 1</span>
                <p>Type 2</p>
            </div>
            <div class="container">
                <div>Only div</div>
            </div>
            <div class="container">
                <span>And span</span>
            </div>
        `;
        const containers = $(html).find('.container');

        const result1 = containers.has('span');
        expect(result1.nodes).toHaveLength(2);

        const result2 = containers.has('p');
        expect(result2.nodes).toHaveLength(1);

        const result3 = containers.has('span, p');
        expect(result3.nodes).toHaveLength(2); // First and third containers
    });

    test('has() should work with attribute selectors on descendants', () => {
        const html = `
            <div class="container">
                <span data-type="important">Important</span>
            </div>
            <div class="container">
                <span data-type="normal">Normal</span>
            </div>
            <div class="container">
                <span>No data</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span[data-type="important"]');

        expect(result.nodes).toHaveLength(1);
        const resultSpan = result.find('span');
        expect(resultSpan.attr('data-type')).toBe('important');
    });

    test('has() should distinguish between descendants and siblings', () => {
        const html = `
            <div class="container">
                <span>Descendant</span>
            </div>
            <div class="container">
                <div>Sibling container</div>
                <span>Sibling</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(2); // Both have span descendants
    });

    test('has() should work with mixed content (text and elements)', () => {
        const html = `
            <div class="container">
                Text <span>mixed</span> content
            </div>
            <div class="container">
                Only text content
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(1);
        const containsMixedText = result.text().includes('mixed');
        expect(containsMixedText).toBe(true);
    });

    test('has() should handle empty containers', () => {
        const html = `
            <div class="container"></div>
            <div class="container">
                <span>Content</span>
            </div>
            <div class="container"><!-- comment --></div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(1);
        const resultText = result.text().trim();
        expect(resultText).toBe('Content');
    });

    test('has() should work with self-closing tags', () => {
        const html = `
            <div class="container">
                <input type="text">
                <br>
            </div>
            <div class="container">
                <input type="checkbox">
            </div>
            <div class="container">
                No inputs
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('input');

        expect(result.nodes).toHaveLength(2);
    });

    test('has() should work with different namespaces', () => {
        const html = `
            <div class="container">
                <svg>
                    <circle cx="50" cy="50" r="40"/>
                </svg>
            </div>
            <div class="container">
                <span>HTML span</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('circle, span');

        expect(result.nodes).toHaveLength(2);
    });

    test('has() should handle very deep nesting', () => {
        // Create deeply nested HTML
        let nestedHtml = '<div class="deep">';
        for (let i = 0; i < 10; i++) {
            nestedHtml += `<div class="level${i}">`;
        }
        nestedHtml += '<span>Deepest</span>';
        for (let i = 0; i < 10; i++) {
            nestedHtml += '</div>';
        }
        nestedHtml += '</div>';

        const html = `
            ${nestedHtml}
            <div class="shallow">
                <span>Shallow</span>
            </div>
            <div class="empty"></div>
        `;

        const containers = $(html).find('.deep, .shallow, .empty');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(2); // deep and shallow have spans
    });

    test('has() should work with complex selectors including classes and attributes', () => {
        const html = `
            <div class="container">
                <div class="item active" data-id="1">Item 1</div>
            </div>
            <div class="container">
                <div class="item inactive" data-id="2">Item 2</div>
            </div>
            <div class="container">
                <div class="item active" data-id="3">Item 3</div>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('.item.active[data-id]');

        expect(result.nodes).toHaveLength(2); // First and third containers
    });

    test('has() should handle malformed selectors gracefully', () => {
        const html = `<div class="container"><span>Test</span></div>`;
        const containers = $(html).find('.container');

        // Malformed selectors should throw SyntaxError (jQuery behavior)
        expect(() => containers.has('[unclosed')).toThrow(SyntaxError);

        const result2 = containers.has('span'); // Valid selector should still work
        expect(result2.nodes).toHaveLength(1);
    });

    test('has() should work with empty string selector', () => {
        const html = `<div class="container"><span>Test</span></div>`;
        const containers = $(html).find('.container');

        const result = containers.has('');
        expect(result.nodes).toHaveLength(0);
    });

    test('has() should work with universal selector', () => {
        const html = `
            <div class="container">
                <span>Has children</span>
            </div>
            <div class="container">
                <!-- Only comment -->
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('*');

        expect(result.nodes).toHaveLength(1); // Only first has element children
    });

    test('has() should handle multiple levels of the same selector', () => {
        const html = `
            <div class="container">
                <div class="nested">
                    <div class="deep">
                        <span>Deep span</span>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="nested">
                    <span>Shallow span</span>
                </div>
            </div>
        `;
        const containers = $(html).find('.container');

        const result1 = containers.has('div.deep');
        expect(result1.nodes).toHaveLength(1);

        const result2 = containers.has('div.nested');
        expect(result2.nodes).toHaveLength(2); // Both have nested divs
    });

    test('has() should work with large collections', () => {
        const html = Array.from({ length: 50 }, (_, i) => `
            <div class="container">
                ${i % 3 === 0 ? '<span>Has span</span>' : '<div>No span</div>'}
            </div>
        `).join('');

        const containers = $(html).find('.container');
        const result = containers.has('span');

        // Should have spans in containers where i % 3 === 0
        const expectedCount = Math.floor(50 / 3) + (50 % 3 >= 1 ? 1 : 0);
        expect(result.nodes).toHaveLength(expectedCount);
    });

    test('has() should preserve element attributes', () => {
        const html = `
            <div class="container" data-id="1">
                <span>Content</span>
            </div>
            <div class="container" data-id="2">
                No content
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(1);
        expect(result.attr('data-id')).toBe('1');
    });

    test('has() should work with text nodes mixed with elements', () => {
        const html = `
            <div class="container">
                Text node
                <span>Element</span>
            </div>
            <div class="container">
                <span>Only element</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(2); // Both have span elements
    });

    test('has() should handle containers with only text nodes', () => {
        const html = `
            <div class="container">Only text</div>
            <div class="container">
                <span>Has element</span>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(1);
    });

    test('has() should work with complex chaining scenarios', () => {
        const html = `
            <div class="container priority">
                <span>Priority content</span>
            </div>
            <div class="container normal">
                <span>Normal content</span>
            </div>
            <div class="container priority">
                No span
            </div>
        `;
        const containers = $(html).find('.container');

        // Chain: has span -> filter priority -> first
        const result = containers.has('span').filter('.priority').first();

        expect(result.nodes).toHaveLength(1);
        expect(result.hasClass('priority')).toBe(true);
        const containsPriorityContent = result.text().includes('Priority content');
        expect(containsPriorityContent).toBe(true);
    });

    test('has() should work with elements that have nested identical structures', () => {
        const html = `
            <div class="container">
                <div class="sub">
                    <span>Span 1</span>
                </div>
                <div class="sub">
                    <span>Span 2</span>
                </div>
            </div>
            <div class="container">
                <div class="sub">
                    No span
                </div>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(1); // Only first container has spans
        const resultSpans = result.find('span');
        expect(resultSpans.nodes).toHaveLength(2); // Two spans in the result
    });

    test('has() should handle elements with CDATA sections', () => {
        const html = `
            <div class="container">
                <![CDATA[Some <b>bold</b> text]]>
                <span>Element</span>
            </div>
            <div class="container">
                <![CDATA[Just text]]>
            </div>
        `;
        const containers = $(html).find('.container');
        const result = containers.has('span');

        expect(result.nodes).toHaveLength(1);
    });
});
