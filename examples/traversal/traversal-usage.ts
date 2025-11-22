import jq from '../index';

console.log('=== find(), filter(), children(), parent() Examples ===\n');

// find() Examples
console.log('--- find() ---\n');

console.log('Example 1: Find Descendants');
const html1 = `
    <div id="container">
        <p class="text">Paragraph 1</p>
        <div class="inner">
            <p class="text">Paragraph 2</p>
            <span>Span</span>
        </div>
    </div>
`;
const $1 = jq(html1);
const paragraphs = $1('#container').find('p');
console.log('Found paragraphs:', paragraphs.length);
const textElements = $1('#container').find('.text');
console.log('Found .text elements:', textElements.length);

// filter() Examples
console.log('\n--- filter() ---\n');

console.log('Example 2: Filter by Selector');
const html2 = `
    <div>
        <span class="active">Active 1</span>
        <span>Inactive</span>
        <span class="active">Active 2</span>
    </div>
`;
const $2 = jq(html2);
const activeSpans = $2('span').filter('.active');
console.log('Active spans:', activeSpans.length);

console.log('\nExample 3: Filter by Function');
const html3 = `
    <ul>
        <li data-value="10">Item 1</li>
        <li data-value="25">Item 2</li>
        <li data-value="5">Item 3</li>
        <li data-value="30">Item 4</li>
    </ul>
`;
const $3 = jq(html3);
const highValue = $3('li').filter(function () {
    return parseInt(jq(this).attr('data-value')) > 15;
});
console.log('High value items:', highValue.length);
highValue.each(function () {
    console.log('  ', jq(this).text(), '=', jq(this).attr('data-value'));
});

// children() Examples
console.log('\n--- children() ---\n');

console.log('Example 4: Get All Children');
const html4 = `
    <ul id="list">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
`;
const $4 = jq(html4);
const children = $4('#list').children();
console.log('Direct children:', children.length);

console.log('\nExample 5: Filter Children');
const html5 = `
    <div id="container">
        <span class="keep">Keep 1</span>
        <p>Remove</p>
        <span class="keep">Keep 2</span>
        <div>Remove</div>
    </div>
`;
const $5 = jq(html5);
const spanChildren = $5('#container').children('span');
console.log('Span children:', spanChildren.length);
const keepChildren = $5('#container').children('.keep');
console.log('Children with .keep:', keepChildren.length);

// parent() Examples
console.log('\n--- parent() ---\n');

console.log('Example 6: Get Parent');
const html6 = `
    <div id="parent">
        <span id="child">Text</span>
    </div>
`;
const $6 = jq(html6);
const parent = $6('#child').parent();
console.log('Parent ID:', parent.attr('id'));

console.log('\nExample 7: Filter Parent');
const html7 = `
    <div class="container">
        <div class="inner">
            <span id="target">Text</span>
        </div>
    </div>
`;
const $7 = jq(html7);
const innerParent = $7('#target').parent('.inner');
console.log('Parent with .inner:', innerParent.length);
const containerParent = $7('#target').parent('.container');
console.log('Parent with .container (immediate only):', containerParent.length);

// Combined Example
console.log('\n--- Combined Usage ---\n');

console.log('Example 8: Complex Traversal');
const html8 = `
    <div class="app">
        <nav class="menu">
            <ul>
                <li class="active"><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </div>
`;
const $8 = jq(html8);

// Find all links
const allLinks = $8('.app').find('a');
console.log('All links:', allLinks.length);

// Find active menu items
const activeItems = $8('.menu').find('li').filter('.active');
console.log('Active menu items:', activeItems.length);

// Get children of ul
const menuItems = $8('ul').children();
console.log('Menu items (li elements):', menuItems.length);

// Get parent of active link
const activeLink = $8('li.active').find('a');
const linkParent = activeLink.parent();
console.log('Active link parent class:', linkParent.attr('class'));

console.log('\n=== End of Examples ===');
