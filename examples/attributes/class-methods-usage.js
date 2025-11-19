const jq = require('../index');

console.log('=== removeClass(), toggleClass(), hasClass() Examples ===\n');

// removeClass Examples
console.log('--- removeClass() ---\n');

console.log('Example 1: Remove Single Class');
const html1 = `<div class="foo bar baz">Content</div>`;
const $1 = jq(html1);
$1('div').removeClass('bar');
console.log('After removing "bar":', $1('div').attr('class'));

console.log('\nExample 2: Remove Multiple Classes');
const html2 = `<div class="one two three four">Content</div>`;
const $2 = jq(html2);
$2('div').removeClass('two four');
console.log('After removing "two four":', $2('div').attr('class'));

console.log('\nExample 3: Remove with Function');
const html3 = `
    <div>
        <span class="item color-red">Red</span>
        <span class="item color-blue">Blue</span>
        <span class="item color-green">Green</span>
    </div>
`;
const $3 = jq(html3);
$3('span').removeClass(function (index, className) {
    // Remove color- classes
    const match = className.match(/color-\S+/);
    return match ? match[0] : '';
});
console.log('After removing color classes:');
$3('span').each(function () {
    console.log('  ', jq(this).attr('class'));
});

// toggleClass Examples
console.log('\n\n--- toggleClass() ---\n');

console.log('Example 4: Toggle Class');
const html4 = `<div class="active">Content</div>`;
const $4 = jq(html4);
console.log('Before toggle:', $4('div').attr('class'));
$4('div').toggleClass('active');
console.log('After first toggle:', $4('div').attr('class') || '(no classes)');
$4('div').toggleClass('active');
console.log('After second toggle:', $4('div').attr('class'));

console.log('\nExample 5: Toggle with State');
const html5 = `<div>Content</div>`;
const $5 = jq(html5);
$5('div').toggleClass('visible', true); // Force add
console.log('Force add:', $5('div').attr('class'));
$5('div').toggleClass('visible', false); // Force remove
console.log('Force remove:', $5('div').attr('class') || '(no classes)');

console.log('\nExample 6: Toggle Multiple Classes');
const html6 = `<button>Button</button>`;
const $6 = jq(html6);
$6('button').toggleClass('active primary');
console.log('After toggle:', $6('button').attr('class'));

// hasClass Examples
console.log('\n\n--- hasClass() ---\n');

console.log('Example 7: Check for Class');
const html7 = `<div class="foo bar baz">Content</div>`;
const $7 = jq(html7);
console.log('Has "foo":', $7('div').hasClass('foo'));
console.log('Has "bar":', $7('div').hasClass('bar'));
console.log('Has "missing":', $7('div').hasClass('missing'));

console.log('\nExample 8: Conditional Logic');
const html8 = `
    <ul>
        <li class="active">Item 1</li>
        <li>Item 2</li>
        <li class="active">Item 3</li>
    </ul>
`;
const $8 = jq(html8);
$8('li').each(function (i) {
    const $li = jq(this);
    const status = $li.hasClass('active') ? 'Active' : 'Inactive';
    console.log(`  Item ${i + 1}: ${status}`);
});

console.log('\nExample 9: Combined Usage');
const html9 = `
    <div>
        <button class="btn primary">Save</button>
        <button class="btn">Cancel</button>
    </div>
`;
const $9 = jq(html9);
$9('button').each(function () {
    const $btn = jq(this);
    if ($btn.hasClass('primary')) {
        $btn.addClass('important');
    } else {
        $btn.addClass('secondary');
    }
});
console.log('Buttons after processing:');
$9('button').each(function () {
    console.log('  ', jq(this).attr('class'));
});

console.log('\n=== End of Examples ===');
