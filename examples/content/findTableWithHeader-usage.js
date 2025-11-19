/**
 * Example usage of the .findTableWithHeader() method
 * This method finds tables that contain specific headers
 */

const jq = require('../index');

console.log('=== findTableWithHeader() Method Examples ===\n');

// Example 1: Find table with a single header
console.log('Example 1: Find table with "Name" header');
const html1 = `
    <div>
        <table id="users">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>John Doe</td><td>john@example.com</td><td>30</td></tr>
                <tr><td>Jane Smith</td><td>jane@example.com</td><td>25</td></tr>
            </tbody>
        </table>
        <table id="products">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Widget</td><td>$10</td></tr>
            </tbody>
        </table>
    </div>
`;

const $tableWithName = jq(html1).findTableWithHeader('Name');
console.log(`Found ${$tableWithName.length} table(s) with "Name" header`);
console.log(`Table ID: ${$tableWithName.attr('id')}`);
console.log();

// Example 2: Find tables with multiple required headers
console.log('Example 2: Find tables with both "Name" AND "Email" headers');
const $tableWithBoth = jq(html1).findTableWithHeader(['Name', 'Email']);
console.log(`Found ${$tableWithBoth.length} table(s) with both headers`);
console.log(`Table ID: ${$tableWithBoth.attr('id')}`);
console.log();

// Example 3: Case-insensitive and partial matching
console.log('Example 3: Case-insensitive search for "name"');
const $caseInsensitive = jq(html1).findTableWithHeader('name');
console.log(`Found ${$caseInsensitive.length} table(s) (case-insensitive)`);
console.log();

// Example 4: Combine with table2json
console.log('Example 4: Find table and extract data with table2json()');
const userData = jq(html1)
    .findTableWithHeader('Name')
    .table2json();
console.log('User data:', JSON.stringify(userData, null, 2));
console.log();

// Example 5: Multiple tables matching
console.log('Example 5: Find all tables with "Name" header from multiple tables');
const html2 = `
    <div>
        <table id="employees">
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Department</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Alice</td><td>Engineering</td></tr>
            </tbody>
        </table>
        <table id="customers">
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>City</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Bob</td><td>New York</td></tr>
            </tbody>
        </table>
        <table id="products">
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>ABC123</td><td>$99</td></tr>
            </tbody>
        </table>
    </div>
`;

const $tablesWithName = jq(html2).findTableWithHeader('Name');
console.log(`Found ${$tablesWithName.length} table(s) with "Name" in header`);
$tablesWithName.each((i, node) => {
    console.log(`  - Table ${i + 1}: ${node.attributes.id}`);
});
console.log();

// Example 6: Filter tables and process data
console.log('Example 6: Process only tables with specific headers');
const html3 = `
    <body>
        <table id="sales-2023">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Widget A</td><td>100</td><td>$1000</td></tr>
                <tr><td>Widget B</td><td>200</td><td>$2000</td></tr>
            </tbody>
        </table>
        <table id="inventory">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Widget A</td><td>50</td></tr>
            </tbody>
        </table>
    </body>
`;

// Find only sales tables (with Revenue column)
const salesData = jq(html3)
    .findTableWithHeader(['Product Name', 'Revenue'])
    .table2json();

console.log('Sales data:', JSON.stringify(salesData, null, 2));
console.log();

// Example 7: Working with tables without thead
console.log('Example 7: Find tables using first row as headers');
const html4 = `
    <div>
        <table id="simple">
            <tr>
                <th>Name</th>
                <th>Score</th>
            </tr>
            <tr>
                <td>Alice</td>
                <td>95</td>
            </tr>
            <tr>
                <td>Bob</td>
                <td>87</td>
            </tr>
        </table>
    </div>
`;

const $simpleTable = jq(html4).findTableWithHeader('Score');
console.log(`Found ${$simpleTable.length} table(s) with "Score" header`);
const scores = $simpleTable.table2json();
console.log('Scores:', JSON.stringify(scores, null, 2));
console.log();

// Example 8: No matches
console.log('Example 8: Search for non-existent header');
const $noMatch = jq(html1).findTableWithHeader('Address');
console.log(`Found ${$noMatch.length} table(s) with "Address" header`);
console.log();

console.log('=== All examples completed ===');
