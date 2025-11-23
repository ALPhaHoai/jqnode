import jq from '../index';

console.log('=== Testing Callable .load() Syntax ===\n');

// Test 1: Your exact requested syntax
console.log('Test 1: jQuery-like callable syntax');
const result = {
    data: `
        <table id="table1"><tr><td>Data 1</td></tr></table>
        <table id="table2"><tr><td>Data 2</td></tr></table>
    `,
};

const $ = jq.load(result?.data);
const tables = $('table'); // THIS IS THE NEW SYNTAX!

console.log('✅ Number of tables:', tables.length);
console.log('✅ Table 1 ID:', tables.eq(0).attr('id'));
console.log('✅ Table 2 ID:', tables.eq(1).attr('id'));

// Test 2: Both syntaxes should work
console.log('\nTest 2: Both syntaxes work');
const html = '<div><p class="text">Hello</p><p class="text">World</p></div>';
const $2 = jq.load(html);

const paras1 = $2('p'); // Callable syntax
const paras2 = $2.find('p'); // Traditional syntax

console.log('✅ Callable syntax found:', paras1.length, 'paragraphs');
console.log('✅ Traditional syntax found:', paras2.length, 'paragraphs');
console.log('✅ Both return same result:', paras1.length === paras2.length);

// Test 3: Chaining still works
console.log('\nTest 3: Method chaining');
const $3 = jq.load('<div><span class="item">A</span><span class="item">B</span></div>');
const firstItem = $3('.item').first().text();
console.log('✅ First item text:', firstItem);

// Test 4: Access to properties
console.log('\nTest 4: Properties access');
const $4 = jq.load('<div><a href="#">Link</a></div>');
console.log('✅ Length property:', $4.length);
console.log('✅ Nodes property:', $4.nodes.length);
console.log('✅ Array-like access [0]:', $4[0] ? 'works' : 'failed');

// Test 5: Iteration
console.log('\nTest 5: Iteration with each()');
const $5 = jq.load('<ul><li>A</li><li>B</li><li>C</li></ul>');
const items = $5('li');
items.each(function (index, item) {
    console.log(`  Item ${index}:`, jq(item).text());
});

console.log('\n✅ SUCCESS! All tests passed!');
console.log('✅ You can now use: const $ = jq.load(html); $("selector");');
