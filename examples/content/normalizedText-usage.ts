import jq from '../../index';

console.log('=== normalizedText() Method Examples ===\n');

// Example 1: Basic whitespace normalization
console.log('Example 1: Basic Whitespace Normalization');
const html1 = `<div id="content">Hello    World</div>`;
const $1 = jq.load(html1);
console.log('text():', $1('#content').text());
console.log('normalizedText():', $1('#content').normalizedText());
// text() preserves multiple spaces, normalizedText() collapses them

// Example 2: Remove tabs and newlines
console.log('\n\nExample 2: Remove Tabs and Newlines');
const html2 = `<p>Content\twith\ntabs\rand\r\nnewlines</p>`;
const $2 = jq.load(html2);
console.log('text():', JSON.stringify($2('p').text()));
console.log('normalizedText():', $2('p').normalizedText());
// All tabs, newlines, and carriage returns are converted to spaces

// Example 3: Clean up formatted HTML
console.log('\n\nExample 3: Clean Up Formatted HTML');
const html3 = `
    <div class="article">
        Hello
        World
        from
        jqnode
    </div>
`;
const $3 = jq.load(html3);
console.log('text():', JSON.stringify($3('.article').text()));
console.log('normalizedText():', $3('.article').normalizedText());
// Removes indentation and extra whitespace from formatted HTML

// Example 4: Multiple elements
console.log('\n\nExample 4: Multiple Elements');
const html4 = `
    <ul>
        <li>Item   1</li>
        <li>Item\t2</li>
        <li>Item\n3</li>
    </ul>
`;
const $4 = jq.load(html4);
console.log('text():', JSON.stringify($4('li').text()));
console.log('normalizedText():', $4('li').normalizedText());
// Normalizes text from all matched elements

// Example 5: API response cleaning
console.log('\n\nExample 5: API Response Cleaning');
const apiHtml = `
    <div class="description">
        Product    Description
        with    inconsistent
        spacing    and    
        formatting
    </div>
`;
const $5 = jq.load(apiHtml);
const cleanDescription = $5('.description').normalizedText();
console.log('Cleaned API response:', cleanDescription);
// Perfect for cleaning HTML from APIs or web scraping

// Example 6: HTML entities
console.log('\n\nExample 6: HTML Entities');
const html6 = `<div>Hello&nbsp;&nbsp;&nbsp;World</div>`;
const $6 = jq.load(html6);
console.log('text():', $6('div').text());
console.log('normalizedText():', $6('div').normalizedText());
// Unescapes HTML entities then normalizes

// Example 7: Nested elements with whitespace
console.log('\n\nExample 7: Nested Elements');
const html7 = `
    <div class="card">
        <h2>
            Card    Title
        </h2>
        <p>
            Card    content
            with    spacing
        </p>
    </div>
`;
const $7 = jq.load(html7);
console.log('Card text():', JSON.stringify($7('.card').text()));
console.log('Card normalizedText():', $7('.card').normalizedText());
console.log('Title only:', $7('h2').normalizedText());
console.log('Content only:', $7('p').normalizedText());

// Example 8: Comparing with text()
console.log('\n\nExample 8: Side-by-Side Comparison');
const html8 = `
    <div class="messy">
        This    has
        lots    of    
        whitespace    issues
    </div>
`;
const $8 = jq.load(html8);
console.log('Original length:', $8('.messy').text().length);
console.log('Normalized length:', $8('.messy').normalizedText().length);
console.log('Original:', JSON.stringify($8('.messy').text()));
console.log('Normalized:', $8('.messy').normalizedText());

// Example 9: Table data extraction
console.log('\n\nExample 9: Table Data Extraction');
const html9 = `
    <table>
        <tr>
            <td>
                Data    with
                extra    spaces
            </td>
            <td>
                More    messy
                data
            </td>
        </tr>
    </table>
`;
const $9 = jq.load(html9);
$9('td').each(function (i) {
    console.log(`Cell ${i + 1} (normalized):`, jq(this).normalizedText());
});

// Example 10: Empty and edge cases
console.log('\n\nExample 10: Edge Cases');
const html10 = `
    <div id="empty"></div>
    <div id="spaces">     </div>
    <div id="tabs">\t\t\t</div>
    <div id="newlines">\n\n\n</div>
`;
const $10 = jq.load(html10);
console.log('Empty div:', JSON.stringify($10('#empty').normalizedText()));
console.log('Only spaces:', JSON.stringify($10('#spaces').normalizedText()));
console.log('Only tabs:', JSON.stringify($10('#tabs').normalizedText()));
console.log('Only newlines:', JSON.stringify($10('#newlines').normalizedText()));
// All return empty string after normalization

// Example 11: Setter works like text()
console.log('\n\nExample 11: Setter Behavior');
const html11 = `<div id="test">Old content</div>`;
const $11 = jq.load(html11);
$11('#test').normalizedText('New content');
console.log('After setter:', $11('#test').text());
// Setter behaves identically to text()

// Example 12: Real-world use case - Web scraping
console.log('\n\nExample 12: Web Scraping Use Case');
const scrapedHtml = `
    <div class="product-info">
        <h3 class="name">
            Gaming    Laptop
            Pro    2024
        </h3>
        <span class="price">
            $1,299.99
        </span>
        <p class="specs">
            16GB    RAM
            1TB    SSD
            RTX    4060
        </p>
    </div>
`;
const $12 = jq.load(scrapedHtml);
const product = {
    name: $12('.name').normalizedText(),
    price: $12('.price').normalizedText(),
    specs: $12('.specs').normalizedText(),
};
console.log('Extracted product data:', JSON.stringify(product, null, 2));

console.log('\n=== End of Examples ===');
