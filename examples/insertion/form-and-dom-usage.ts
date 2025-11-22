import jq from '../index';

console.log('=== val(), prop(), append(), remove() Examples ===\n');

// val() Examples
console.log('--- val() ---\n');

console.log('Example 1: Text Input');
const html1 = `<input type="text" id="username" value="johndoe">`;
const $1 = jq(html1);
console.log('Current value:', $1('#username').val());
$1('#username').val('janedoe');
console.log('After change:', $1('#username').val());

console.log('\nExample 2: Textarea');
const html2 = `<textarea id="message">Hello World</textarea>`;
const $2 = jq(html2);
console.log('Textarea value:', $2('#message').val());
$2('#message').val('Updated message');
console.log('After update:', $2('#message').val());

console.log('\nExample 3: Select');
const html3 = `
    <select id="country">
        <option value="us">USA</option>
        <option value="uk" selected>UK</option>
        <option value="ca">Canada</option>
    </select>
`;
const $3 = jq(html3);
console.log('Selected value:', $3('#country').val());
$3('#country').val('ca');
console.log('After change:', $3('#country').val());

// prop() Examples
console.log('\n--- prop() ---\n');

console.log('Example 4: Checkbox');
const html4 = `<input type="checkbox" id="agree" checked>`;
const $4 = jq(html4);
console.log('Checked (prop):', $4('#agree').prop('checked'));
console.log('Checked (attr):', $4('#agree').attr('checked'));
$4('#agree').prop('checked', false);
console.log('After unchecking:', $4('#agree').prop('checked'));

console.log('\nExample 5: Disabled');
const html5 = `<button id="submit">Submit</button>`;
const $5 = jq(html5);
$5('#submit').prop('disabled', true);
console.log('Disabled:', $5('#submit').prop('disabled'));
$5('#submit').prop('disabled', false);
console.log('After enabling:', $5('#submit').prop('disabled'));

// append() Examples
console.log('\n--- append() ---\n');

console.log('Example 6: Append to List');
const html6 = `
    <ul id="tasks">
        <li>Task 1</li>
        <li>Task 2</li>
    </ul>
`;
const $6 = jq(html6);
$6('#tasks').append('<li>Task 3</li>');
$6('#tasks').append('<li>Task 4</li>');
console.log('Tasks after append:', $6('#tasks').children().length);

console.log('\nExample 7: Append Multiple');
const html7 = `<div id="container"></div>`;
const $7 = jq(html7);
$7('#container')
    .append('<p>Paragraph 1</p>')
    .append('<p>Paragraph 2</p>')
    .append('<p>Paragraph 3</p>');
console.log('Paragraphs in container:', $7('#container').children().length);

console.log('\nExample 8: Append to Multiple Elements');
const html8 = `
    <div>
        <div class="box">Box 1</div>
        <div class="box">Box 2</div>
    </div>
`;
const $8 = jq(html8);
$8('.box').append('<span class="badge">New</span>');
console.log('Each box now has badge:');
$8('.box').each(function (i) {
    console.log(`  Box ${i + 1} children:`, jq(this).children().length);
});

// remove() Examples
console.log('\n--- remove() ---\n');

console.log('Example 9: Remove Elements');
const html9 = `
    <ul>
        <li>Item 1</li>
        <li class="delete">Item 2</li>
        <li>Item 3</li>
        <li class="delete">Item 4</li>
    </ul>
`;
const $9 = jq(html9);
console.log('Items before remove:', $9('li').length);
$9('.delete').remove();
console.log('Items after remove:', $9('li').length);

console.log('\nExample 10: Remove with Filter');
const html10 = `
    <div>
        <p class="keep">Keep 1</p>
        <p class="remove">Remove</p>
        <p class="keep">Keep 2</p>
    </div>
`;
const $10 = jq(html10);
$10('p').remove('.remove');
console.log('Paragraphs after filtered remove:', $10('p').length);
$10('p').each(function () {
    console.log('  Remaining:', jq(this).attr('class'));
});

console.log('\nExample 11: Build Form Dynamically');
const html11 = `<form id="dynamic-form"></form>`;
const $11 = jq(html11);
$11('#dynamic-form')
    .append('<input type="text" name="name" placeholder="Name">')
    .append('<input type="email" name="email" placeholder="Email">')
    .append('<button type="submit">Submit</button>');
console.log('Form inputs:', $11('#dynamic-form').find('input').length);
console.log('Form has submit button:', $11('#dynamic-form').find('button').length > 0);

console.log('\n=== End of Examples ===');
