const jq = require('../index');

console.log('=== siblings(), next(), prev(), eq(), first(), last() Examples ===\n');

// siblings() Examples
console.log('--- siblings() ---\n');

console.log('Example 1: Get All Siblings');
const html1 = `
    <div>
        <span>A</span>
        <span id="target">B</span>
        <span>C</span>
        <span>D</span>
    </div>
`;
const $1 = jq(html1);
const siblings = $1('#target').siblings();
console.log('Siblings of B:', siblings.length);
siblings.each(function () {
    console.log('  ', jq(this).text());
});

console.log('\nExample 2: Filter Siblings');
const html2 = `
    <ul>
        <li class="item">Item 1</li>
        <li id="target">Target</li>
        <li>Other</li>
        <li class="item">Item 2</li>
    </ul>
`;
const $2 = jq(html2);
const itemSiblings = $2('#target').siblings('.item');
console.log('Siblings with .item class:', itemSiblings.length);

// next() and prev() Examples
console.log('\n--- next() and prev() ---\n');

console.log('Example 3: Next Sibling');
const html3 = `
    <div>
        <p>First</p>
        <p id="current">Current</p>
        <p>Next</p>
    </div>
`;
const $3 = jq(html3);
console.log('Next sibling:', $3('#current').next().text());

console.log('\nExample 4: Previous Sibling');
console.log('Previous sibling:', $3('#current').prev().text());

console.log('\nExample 5: Navigation');
const html5 = `
    <nav>
        <a href="/">Home</a>
        <a href="/about" id="current-page">About</a>
        <a href="/contact">Contact</a>
    </nav>
`;
const $5 = jq(html5);
const prevPage = $5('#current-page').prev();
const nextPage = $5('#current-page').next();
console.log('Previous page:', prevPage.text());
console.log('Next page:', nextPage.text());

// eq() Examples
console.log('\n--- eq() ---\n');

console.log('Example 6: Get Element by Index');
const html6 = `
    <ul>
        <li>Index 0</li>
        <li>Index 1</li>
        <li>Index 2</li>
        <li>Index 3</li>
    </ul>
`;
const $6 = jq(html6);
console.log('Element at index 0:', $6('li').eq(0).text());
console.log('Element at index 2:', $6('li').eq(2).text());

console.log('\nExample 7: Negative Index');
console.log('Last element (eq(-1)):', $6('li').eq(-1).text());
console.log('Second to last (eq(-2)):', $6('li').eq(-2).text());

// first() and last() Examples
console.log('\n--- first() and last() ---\n');

console.log('Example 8: First Element');
const html8 = `
    <div>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <p>Last paragraph</p>
    </div>
`;
const $8 = jq(html8);
console.log('First:', $8('p').first().text());
console.log('Last:', $8('p').last().text());

console.log('\nExample 9: Styling First/Last');
const html9 = `
    <ul id="menu">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
`;
const $9 = jq(html9);
$9('#menu li').first().addClass('first-item');
$9('#menu li').last().addClass('last-item');
$9('#menu li').each(function () {
    const classes = jq(this).attr('class');
    console.log('  ', jq(this).text(), ':', classes || '(no class)');
});

// Combined Examples
console.log('\n--- Combined Usage ---\n');

console.log('Example 10: Breadcrumb Navigation');
const html10 = `
    <nav class="breadcrumb">
        <a href="/">Home</a>
        <span>›</span>
        <a href="/category">Category</a>
        <span>›</span>
        <a href="/subcategory" id="current">Subcategory</a>
    </nav>
`;
const $10 = jq(html10);
console.log('Current page:', $10('#current').text());
console.log('All previous links:');
$10('#current').prevAll('a').each(function () {
    console.log('  ', jq(this).text());
});

console.log('\nExample 11: Table Row Selection');
const html11 = `
    <table>
        <tr><td>Row 1</td></tr>
        <tr id="selected"><td>Row 2 (Selected)</td></tr>
        <tr><td>Row 3</td></tr>
    </table>
`;
const $11 = jq(html11);
const $selectedRow = $11('#selected');
console.log('Selected row:', $selectedRow.find('td').text());
console.log('Row above:', $selectedRow.prev().find('td').text());
console.log('Row below:', $selectedRow.next().find('td').text());

console.log('\nExample 12: Menu Item Selection');
const html12 = `
    <ul class="menu">
        <li>Menu 1</li>
        <li>Menu 2</li>
        <li>Menu 3</li>
        <li>Menu 4</li>
        <li>Menu 5</li>
    </ul>
`;
const $12 = jq(html12);
// Select third item (index 2)
const selectedItem = $12('.menu li').eq(2);
selectedItem.addClass('active');
// Style siblings
selectedItem.siblings().addClass('inactive');
console.log('Menu items:');
$12('.menu li').each(function (i) {
    console.log(`  Item ${i + 1}:`, jq(this).attr('class') || '(no class)');
});

console.log('\n=== End of Examples ===');
