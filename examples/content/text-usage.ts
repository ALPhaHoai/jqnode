import jq from '../index';

console.log('=== text() Method Examples ===\n');

// Example 1: Get text content
console.log('Example 1: Get Text Content');
const html1 = `<div id="content">Hello <strong>World</strong> from <em>jqnode</em></div>`;
const $1 = jq(html1);
console.log('Text content:', $1('#content').text());
// Output: "Hello World from jqnode" (no HTML tags)

// Example 2: Set text content
console.log('\n\nExample 2: Set Text Content');
const html2 = `<div id="box">Old content with <strong>HTML</strong></div>`;
const $2 = jq(html2);
$2('#box').text('New plain text');
console.log('After setting text:', $2('#box').html());
// HTML tags are escaped/converted to plain text

// Example 3: Get text from multiple elements
console.log('\n\nExample 3: Multiple Elements - Get');
const html3 = `
    <div>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <p>Third paragraph</p>
    </div>
`;
const $3 = jq(html3);
const allText = $3('p').text();
console.log('Combined text:', allText);
// Concatenates text from all paragraphs

// Example 4: Set text on multiple elements
console.log('\n\nExample 4: Multiple Elements - Set');
const html4 = `
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
`;
const $4 = jq(html4);
$4('li').text('Updated item');
console.log('Each item now says:');
$4('li').each(function (i) {
    console.log(`  ${i + 1}: ${jq(this).text()}`);
});

// Example 5: Special characters handling
console.log('\n\nExample 5: Special Characters');
const html5 = `<div id="special"></div>`;
const $5 = jq(html5);
$5('#special').text('<p>This & that</p>');
console.log('HTML content:', $5('#special').html());
// Special characters are escaped: &lt;p&gt;This &amp; that&lt;/p&gt;

// Example 6: Extract data from complex HTML
console.log('\n\nExample 6: Extract Text from Complex HTML');
const html6 = `
    <article>
        <h1>Article Title</h1>
        <div class="meta">
            <span class="author">By <strong>John Doe</strong></span>
            <span class="date">Jan 1, 2024</span>
        </div>
        <p>Article content here...</p>
    </article>
`;
const $6 = jq(html6);
console.log('Title:', $6('h1').text());
console.log('Author:', $6('.author').text());
console.log('Date:', $6('.date').text());

// Example 7: Clear content
console.log('\n\nExample 7: Clear Content');
const html7 = `<div id="message">Important message</div>`;
const $7 = jq(html7);
$7('#message').text('');
console.log('After clearing:', $7('#message').text() === '' ? 'Empty' : 'Not empty');

// Example 8: Numbers and booleans
console.log('\n\nExample 8: Non-String Values');
const html8 = `<span id="counter"></span>`;
const $8 = jq(html8);
$8('#counter').text(42);
console.log('Number as text:', $8('#counter').text(), typeof $8('#counter').text());
$8('#counter').text(true);
console.log('Boolean as text:', $8('#counter').text());

console.log('\n=== End of Examples ===');
