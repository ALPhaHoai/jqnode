import jq from '../../index';

console.log('=== DOM Insertion Methods Examples ===\n');

// append() and appendTo()
console.log('--- append() and appendTo() ---\n');

console.log('Example 1: Append to List');
const html1 = `
    <ul id="tasks">
        <li>Task 1</li>
        <li>Task 2</li>
    </ul>
`;
const $1 = jq(html1);
$1('#tasks').append('<li>Task 3</li>');
$1('#tasks').append('<li>Task 4</li>');
console.log('Tasks after append:', $1('#tasks li').length);

console.log('\nExample 2: appendTo()');
const html2 = `<ul id="list"></ul>`;
const $2 = jq(html2);
jq('<li>Item A</li>').appendTo($2('#list'));
jq('<li>Item B</li>').appendTo($2('#list'));
console.log('Items in list:', $2('#list li').length);

// prepend() and prependTo()
console.log('\n--- prepend() and prependTo() ---\n');

console.log('Example 3: Prepend to List');
const html3 = `
    <ul>
        <li>Second</li>
        <li>Third</li>
    </ul>
`;
const $3 = jq(html3);
$3('ul').prepend('<li>First</li>');
console.log('First item:', $3('li').first().text());

// after() and before()
console.log('\n--- after() and before() ---\n');

console.log('Example 4: Insert Siblings');
const html4 = `
    <div>
        <p id="middle">Middle paragraph</p>
    </div>
`;
const $4 = jq(html4);
$4('#middle').before('<p>Before paragraph</p>');
$4('#middle').after('<p>After paragraph</p>');
console.log('Total paragraphs:', $4('p').length);
$4('p').each(function (i) {
    console.log(`  ${i + 1}:`, jq(this).text());
});

// wrap(), wrapAll(), wrapInner()
console.log('\n--- Wrapping Methods ---\n');

console.log('Example 5: wrap() - Individual Wrapping');
const html5 = `
    <div>
        <span>A</span>
        <span>B</span>
        <span>C</span>
    </div>
`;
const $5 = jq(html5);
$5('span').wrap('<div class="wrapper"></div>');
console.log('Wrappers created:', $5('.wrapper').length);

console.log('\nExample 6: wrapInner() - Wrap Content');
const html6 = `<p>Hello World</p>`;
const $6 = jq(html6);
$6('p').wrapInner('<strong></strong>');
console.log('Wrapped content:', $6('p').html());

// remove()
console.log('\n--- remove() ---\n');

console.log('Example 7: Remove Elements');
const html7 = `
    <ul>
        <li>Keep 1</li>
        <li class="remove">Delete</li>
        <li>Keep 2</li>
        <li class="remove">Delete</li>
    </ul>
`;
const $7 = jq(html7);
console.log('Before remove:', $7('li').length);
$7('.remove').remove();
console.log('After remove:', $7('li').length);

// Practical Example: Building a Menu
console.log('\n--- Practical: Building Dynamic Menu ---\n');

console.log('Example 8: Create Navigation Menu');
const html8 = `<nav id="menu"></nav>`;
const $8 = jq(html8);

const menuItems = [
    { text: 'Home', href: '/', active: true },
    { text: 'Products', href: '/products', active: false },
    { text: 'About', href: '/about', active: false },
    { text: 'Contact', href: '/contact', active: false }
];

const $ul = jq('<ul class="nav"></ul>');
menuItems.forEach(item => {
    const $li = jq('<li></li>');
    const $a = jq(`<a href="${item.href}">${item.text}</a>`);
    if (item.active) {
        $a.addClass('active');
    }
    $li.append($a.nodes[0]);
    $ul.append($li.nodes[0]);
});

$8('#menu').append($ul.nodes[0]);
console.log('Menu items created:', $8('#menu li').length);
console.log('Active item:', $8('#menu .active').text());

// Practical Example: Form Building
console.log('\n--- Practical: Dynamic Form Building ---\n');

console.log('Example 9: Build Contact Form');
const html9 = `<div id="form-container"></div>`;
const $9 = jq(html9);

const $form = jq('<form id="contact-form"></form>');

// Add name field
$form.append('<div class="field"><label>Name:</label><input type="text" name="name"></div>');

// Add email field
$form.append('<div class="field"><label>Email:</label><input type="email" name="email"></div>');

// Add message field
$form.append('<div class="field"><label>Message:</label><textarea name="message"></textarea></div>');

// Add submit button
$form.append('<button type="submit">Send Message</button>');

$9('#form-container').append($form.nodes[0]);
console.log('Form fields created:', $9('.field').length);
console.log('Form has inputs:', $9('input').length);
console.log('Form has textarea:', $9('textarea').length > 0);

// Practical Example: Table Building
console.log('\n--- Practical: Dynamic Table ---\n');

console.log('Example 10: Build Data Table');
const html10 = `<div id="table-container"></div>`;
const $10 = jq(html10);

const data = [
    { name: 'Alice', role: 'Developer', dept: 'Engineering' },
    { name: 'Bob', role: 'Designer', dept: 'Design' },
    { name: 'Charlie', role: 'Manager', dept: 'Operations' }
];

const $table = jq('<table></table>');

// Add header
const $thead = jq('<thead></thead>');
const $headerRow = jq('<tr></tr>');
['Name', 'Role', 'Department'].forEach(header => {
    $headerRow.append(`<th>${header}</th>`);
});
$thead.append($headerRow.nodes[0]);
$table.append($thead.nodes[0]);

// Add body
const $tbody = jq('<tbody></tbody>');
data.forEach(row => {
    const $tr = jq('<tr></tr>');
    $tr.append(`<td>${row.name}</td>`);
    $tr.append(`<td>${row.role}</td>`);
    $tr.append(`<td>${row.dept}</td>`);
    $tbody.append($tr.nodes[0]);
});
$table.append($tbody.nodes[0]);

$10('#table-container').append($table.nodes[0]);
console.log('Table rows:', $10('tbody tr').length);
console.log('Table cells:', $10('td').length);

console.log('\n=== End of Examples ===');
