const jq = require('../index');

console.log('=== Comprehensive Method Examples ===\n');

function runExample(name, fn) {
    try {
        console.log(`--- ${name} ---`);
        fn();
    } catch (err) {
        console.log(`Error in ${name}:`, err.message);
    }
    console.log('');
}

// HTML method
runExample('html()', () => {
    const html1 = `<div id="container"><p>Hello <strong>World</strong></p></div>`;
    const $1 = jq(html1);
    console.log('Get HTML:', $1('#container').html());
    $1('#container').html('<span>New content</span>');
    console.log('Set HTML:', $1('#container').html());
});

// TEXT method
console.log('\n--- text() ---');
const html2 = `<div id="box">Hello <strong>World</strong></div>`;
const $2 = jq(html2);
console.log('Get text:', $2('#box').text());
$2('#box').text('Plain text');
console.log('Set text:', $2('#box').text());

// REMOVECLASS method
console.log('\n--- removeClass() ---');
const html3 = `<div class="foo bar baz">Content</div>`;
const $3 = jq(html3);
$3('div').removeClass('bar');
console.log('After removeClass:', $3('div').attr('class'));

// TOGGLECLASS method
console.log('\n--- toggleClass() ---');
const html4 = `<div class="active">Content</div>`;
const $4 = jq(html4);
$4('div').toggleClass('active');
console.log('After toggle (remove):', $4('div').attr('class'));
$4('div').toggleClass('active');
console.log('After toggle (add):', $4('div').attr('class'));

// HASCLASS method
console.log('\n--- hasClass() ---');
const html5 = `<div class="foo bar">Content</div>`;
const $5 = jq(html5);
console.log('Has "bar":', $5('div').hasClass('bar'));
console.log('Has "baz":', $5('div').hasClass('baz'));

// FIND method
console.log('\n--- find() ---');
const html6 = `
    <div id="container">
        <p class="text">Paragraph</p>
        <span class="text">Span</span>
    </div>
`;
const $6 = jq(html6);
const found = $6('#container').find('.text');
console.log('Found elements:', found.length);

// CHILDREN method
console.log('\n--- children() ---');
const html7 = `
    <ul id="list">
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>
`;
const $7 = jq(html7);
const children = $7('#list').children();
console.log('Children count:', children.length);

// PARENT method
console.log('\n--- parent() ---');
const html8 = `<div id="parent"><span id="child">Text</span></div>`;
const $8 = jq(html8);
const parent = $8('#child').parent();
console.log('Parent id:', parent.attr('id'));

// APPEND method
console.log('\n--- append() ---');
const html9 = `<ul id="list"><li>Item 1</li></ul>`;
const $9 = jq(html9);
$9('#list').append('<li>Item 2</li>');
console.log('Items after append:', $9('#list').children().length);

// REMOVE method
console.log('\n--- remove() ---');
const html10 = `<div><p>Para 1</p><p class="remove">Para 2</p></div>`;
const $10 = jq(html10);
$10('.remove').remove();
console.log('Paragraphs after remove:', $10('p').length);

// FILTER method
console.log('\n--- filter() ---');
const html11 = `
    <div>
        <span class="keep">Keep 1</span>
        <span>Remove</span>
        <span class="keep">Keep 2</span>
    </div>
`;
const $11 = jq(html11);
const filtered = $11('span').filter('.keep');
console.log('Filtered count:', filtered.length);

// EQ method
console.log('\n--- eq() ---');
const html12 = `<div><span>0</span><span>1</span><span>2</span></div>`;
const $12 = jq(html12);
console.log('Element at index 1:', $12('span').eq(1).text());

// FIRST/LAST methods
console.log('\n--- first() / last() ---');
const html13 = `<ul><li>First</li><li>Middle</li><li>Last</li></ul>`;
const $13 = jq(html13);
console.log('First:', $13('li').first().text());
console.log('Last:', $13('li').last().text());

// MAP method
console.log('\n--- map() ---');
const html14 = `<div><span>1</span><span>2</span><span>3</span></div>`;
const $14 = jq(html14);
const mapped = $14('span').map(function (i, el) {
    return parseInt(jq(el).text()) * 2;
}).get();
console.log('Mapped values:', mapped);

// VAL method
console.log('\n--- val() ---');
const html15 = `<input type="text" value="initial">`;
const $15 = jq(html15);
console.log('Initial value:', $15('input').val());
$15('input').val('updated');
console.log('Updated value:', $15('input').val());

// SIBLINGS method
console.log('\n--- siblings() ---');
const html16 = `<div><span>1</span><span id="target">2</span><span>3</span></div>`;
const $16 = jq(html16);
const siblings = $16('#target').siblings();
console.log('Siblings count:', siblings.length);

// NEXT/PREV methods
console.log('\n--- next() / prev() ---');
const html17 = `<div><span>A</span><span id="mid">B</span><span>C</span></div>`;
const $17 = jq(html17);
console.log('Next:', $17('#mid').next().text());
console.log('Prev:', $17('#mid').prev().text());

// CLOSEST method
console.log('\n--- closest() ---');
const html18 = `<div class="container"><div class="inner"><span id="deep">Text</span></div></div>`;
const $18 = jq(html18);
const closest = $18('#deep').closest('.container');
console.log('Closest .container found:', closest.length > 0);

// WRAP method
console.log('\n--- wrap() ---');
const html19 = `<div><span>Content</span></div>`;
const $19 = jq(html19);
$19('span').wrap('<div class="wrapper"></div>');
console.log('Wrapped:', $19('.wrapper').length > 0);

console.log('\n=== End of Examples ===');
