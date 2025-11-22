import jq from '../../index';

console.log('=== Miscellaneous Methods Examples ===\n');

// get() Examples
console.log('--- get() ---\n');

console.log('Example 1: Get DOM Elements');
const html1 = `<div><span>A</span><span>B</span><span>C</span></div>`;
const $1 = jq(html1);

const firstSpan = $1('span').get(0);
console.log('First span (DOM element):', firstSpan.type, '-', firstSpan.children[0].data);

const allSpans = $1('span').get();
console.log('All spans (array):', allSpans.length, 'elements');
console.log('Is array?', Array.isArray(allSpans));

// toArray() Examples
console.log('\n--- toArray() ---\n');

console.log('Example 2: Convert to Plain Array');
const html2 = `<ul><li>1</li><li>2</li><li>3</li></ul>`;
const $2 = jq(html2);

const itemsArray = $2('li').toArray();
console.log('Converted to array:', itemsArray.length);
console.log('Can use forEach:', typeof itemsArray.forEach);

itemsArray.forEach((el, i) => {
    console.log(`  Item ${i}:`, el.children[0].data);
});

// size() Examples
console.log('\n--- size() ---\n');

console.log('Example 3: Get Element Count');
const html3 = `<div><p>A</p><p>B</p><p>C</p><p>D</p></div>`;
const $3 = jq(html3);

console.log('Size:', $3('p').size());
console.log('Length:', $3('p').length);
console.log('Are equal?', $3('p').size() === $3('p').length);

// index() Examples  
console.log('\n--- index() ---\n');

console.log('Example 4: Get Element Index');
const html4 = `
    <ul>
        <li>Item 0</li>
        <li id="target">Item 1</li>
        <li>Item 2</li>
    </ul>
`;
const $4 = jq(html4);
console.log('Index of #target:', $4('#target').index());

$4('li').each(function (i) {
    console.log(`  ${jq(this).text()} is at index:`, jq(this).index());
});

// position() Examples
console.log('\n--- position() ---\n');

console.log('Example 5: Get Element Position');
const html5 = `
    <div style="position: relative">
        <div id="child" style="position: absolute; top: 10px; left: 20px">Child</div>
    </div>
`;
const $5 = jq(html5);
// Note: position() in jqnode returns { top: 0, left: 0 } for parsed HTML
// In real browser, would return actual position
const pos = $5('#child').position();
console.log('Position:', pos);

// Practical Example: Element Inspection
console.log('\n--- Practical: Element Inspection ---\n');

console.log('Example 6: Inspect Selection');
const html6 = `
    <div class="container">
        <p class="text">Para 1</p>
        <p class="text">Para 2</p>
        <p class="text highlight">Para 3</p>
        <p class="text">Para 4</p>
    </div>
`;
const $6 = jq(html6);
const $paragraphs = $6('p');

console.log('Total paragraphs:', $paragraphs.size());
console.log('Type check:', Array.isArray($paragraphs.get()));

// Find highlighted paragraph
$paragraphs.each(function (i) {
    const $p = jq(this);
    if ($p.hasClass('highlight')) {
        console.log('Highlighted paragraph at index:', $p.index());
    }
});

// Practical Example: List Processing
console.log('\n--- Practical: Process List Items ---\n');

console.log('Example 7: List Statistics');
const html7 = `
    <ul id="scores">
        <li data-score="85">Student A</li>
        <li data-score="92">Student B</li>
        <li data-score="78">Student C</li>
        <li data-score="95">Student D</li>
        <li data-score="88">Student E</li>
    </ul>
`;
const $7 = jq(html7);
const $students = $7('#scores li');

console.log('Total students:', $students.size());

const scores = $students.toArray().map(el =>
    parseInt(jq(el).attr('data-score'))
);

const average = scores.reduce((a, b) => a + b, 0) / scores.length;
console.log('Average score:', average.toFixed(2));
console.log('Highest score:', Math.max(...scores));
console.log('Lowest score:', Math.min(...scores));

//Practical Example: Navigation
console.log('\n--- Practical: Menu Navigation ---\n');

console.log('Example 8: Active Menu Item');
const html8 = `
    <nav>
        <a href="/home">Home</a>
        <a href="/products">Products</a>
        <a href="/about" class="active">About</a>
        <a href="/contact">Contact</a>
    </nav>
`;
const $8 = jq(html8);
const $activeLink = $8('.active');

console.log('Active page:', $activeLink.text());
console.log('Active index:', $activeLink.index());
console.log('Total menu items:', $8('a').size());

// Get all menu item details
const menuItems = $8('a').toArray().map((el, i) => ({
    index: i,
    text: jq(el).text(),
    href: jq(el).attr('href'),
    active: jq(el).hasClass('active')
}));

console.log('Menu structure:');
menuItems.forEach(item => {
    console.log(`  [${item.index}] ${item.text} ${item.active ? '(active)' : ''}`);
});

console.log('\n=== End of Examples ===');
