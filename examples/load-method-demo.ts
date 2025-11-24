import jq from '../index';

console.log('=== jqnode .load() Method Demo ===\n');

// Example 1: Basic usage with .load()
console.log('Example 1: Basic .load() usage');
const html1 = `
<div class="container">
    <h1>Hello World</h1>
    <p>This is a test</p>
</div>
`;
const $ = jq.load(html1);
console.log('Title:', $.find('h1').text());
console.log('Paragraph:', $.find('p').text());

// Example 2: Simulating API response (your use case)
console.log('\nExample 2: API response pattern');
const result = {
    data: `
    <html>
        <body>
            <table id="table1">
                <thead>
                    <tr><th>Name</th><th>Age</th></tr>
                </thead>
                <tbody>
                    <tr><td>John</td><td>30</td></tr>
                    <tr><td>Jane</td><td>25</td></tr>
                </tbody>
            </table>
            <table id="table2">
                <thead>
                    <tr><th>Product</th><th>Price</th></tr>
                </thead>
                <tbody>
                    <tr><td>Apple</td><td>$1</td></tr>
                    <tr><td>Banana</td><td>$0.50</td></tr>
                </tbody>
            </table>
        </body>
    </html>
    `,
};

// Your requested syntax!
const $2 = jq.load(result?.data);
const tables = $2.find('table');

console.log('Number of tables:', tables.length);

tables.each(function (index, table) {
    const $table = jq(table);
    console.log(`\nTable ${index + 1}:`);
    console.log('  ID:', $table.attr('id'));
    console.log('  Rows:', $table.find('tr').length);
    console.log(
        '  Headers:',
        $table
            .find('th')
            .map((i, th) => jq(th).text())
            .get()
            .join(', '),
    );
});

// Example 3: Chaining with .load()
console.log('\nExample 3: Chaining with .load()');
const html3 = `
<div class="products">
    <div class="product" data-id="1">Product A</div>
    <div class="product" data-id="2">Product B</div>
    <div class="product" data-id="3">Product C</div>
</div>
`;

const products = jq.load(html3).find('.product');
console.log('Products found:', products.length);
products.each(function (index, product) {
    const $prod = jq(product);
    console.log(`  ${$prod.attr('data-id')}: ${$prod.text()}`);
});

// Example 4: Working with empty or undefined data
console.log('\nExample 4: Safe handling of empty data');
const emptyResult = { data: null };
const $empty = jq.load(emptyResult?.data || '');
console.log('Empty load result:', $empty.length);

// Example 5: Comparison of different loading methods
console.log('\nExample 5: Different loading methods (all equivalent)');
const testHtml = '<div class="test">Test Content</div>';

// Method 1: Direct call
const $a = jq(testHtml);
console.log('Method 1 (direct):', $a.find('.test').text());

// Method 2: Using .load()
const $b = jq.load(testHtml);
console.log('Method 2 (.load):', $b.find('.test').text());

// Method 3: Two-step approach
const $c = jq.load(testHtml);
const testDiv = $c.find('.test');
console.log('Method 3 (two-step):', testDiv.text());

// Example 6: Table data extraction
console.log('\nExample 6: Extract table data to array');
const tableHtml = `
<table>
    <tr><th>Fruit</th><th>Color</th></tr>
    <tr><td>Apple</td><td>Red</td></tr>
    <tr><td>Banana</td><td>Yellow</td></tr>
    <tr><td>Grape</td><td>Purple</td></tr>
</table>
`;

const $table = jq.load(tableHtml);
const headers = $table
    .find('th')
    .map((i, th) => jq(th).text())
    .get();
const rows = $table
    .find('tbody tr, tr:not(:first-child)')
    .map(function (i, tr) {
        const $tr = jq(tr);
        const cells = $tr
            .find('td')
            .map((j, td) => jq(td).text())
            .get();
        if (cells.length === 0) return null;
        return { [headers[0]]: cells[0], [headers[1]]: cells[1] };
    })
    .get()
    .filter((row) => row !== null);

console.log('Extracted table data:', JSON.stringify(rows, null, 2));

console.log('\n=== Demo Complete ===');
