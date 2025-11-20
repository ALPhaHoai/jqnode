# findTableWithHeader() Method

## Overview
The `findTableWithHeader()` method finds HTML table elements that contain specific headers. It's useful for locating tables based on their column structure.

## Syntax
```javascript
jq(selector).findTableWithHeader(headers)
```

### Parameters
- **headers** (String|Array): The header(s) to search for
  - Can be a single string: `'Name'`
  - Can be an array of strings: `['Name', 'Email']`
  - Matching is case-insensitive
  - Supports partial matching (e.g., `'Name'` matches `'User Name'`)

### Return Value
Returns a new JQ instance containing all matching table elements.

## Features

### ✅ Flexible Search
- Searches both current nodes (if they are tables) and descendant tables
- Case-insensitive matching
- Partial header matching support
- Handles multiple header requirements (ALL must match)

### ✅ Multiple Table Structures
- Tables with `<thead>` elements
- Tables without `<thead>` (uses first row)
- Tables with `<tbody>` but no `<thead>`
- Headers in `<th>` or `<td>` elements

### ✅ Chainable
- Returns JQ instance for method chaining
- Works seamlessly with other methods like `toJSON()`

## Examples

### Basic Usage
```javascript
const jq = require('@alphahoai/jqnode');

const html = `
    <table id="users">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>John</td><td>john@example.com</td><td>30</td></tr>
        </tbody>
    </table>
`;

// Find table with "Name" header
const $table = jq(html).findTableWithHeader('Name');
console.log($table.length); // 1
```

### Multiple Headers
```javascript
// Find tables that have BOTH "Name" AND "Email" headers
const $table = jq(html).findTableWithHeader(['Name', 'Email']);
```

### Case-Insensitive Search
```javascript
// All of these will match "Name" header
jq(html).findTableWithHeader('Name');
jq(html).findTableWithHeader('name');
jq(html).findTableWithHeader('NAME');
```

### Partial Matching
```javascript
const html = `
    <table>
        <tr>
            <th>User Name</th>
            <th>Email Address</th>
        </tr>
    </table>
`;

// "name" matches "User Name"
const $table = jq(html).findTableWithHeader('name');
```

### Multiple Tables
```javascript
const html = `
    <div>
        <table id="employees">
            <thead><tr><th>Employee Name</th><th>Department</th></tr></thead>
        </table>
        <table id="customers">
            <thead><tr><th>Customer Name</th><th>City</th></tr></thead>
        </table>
        <table id="products">
            <thead><tr><th>SKU</th><th>Price</th></tr></thead>
        </table>
    </div>
`;

// Find all tables with "Name" in their headers
const $tables = jq(html).findTableWithHeader('Name');
console.log($tables.length); // 2 (employees and customers)
```

### Combined with toJSON()
```javascript
// Find table and extract data in one chain
const data = jq(html)
    .findTableWithHeader('Name')
    .toJSON();

console.log(data);
// [{ Name: 'John', Email: 'john@example.com', Age: '30' }]
```

### Filter Specific Tables
```javascript
const html = `
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
            </tbody>
        </table>
        <table id="inventory">
            <thead>
                <tr><th>Item</th><th>Quantity</th></tr>
            </thead>
        </table>
    </body>
`;

// Find only tables with Revenue column (sales tables)
const salesData = jq(html)
    .findTableWithHeader(['Product Name', 'Revenue'])
    .toJSON();
```

## Edge Cases

### Empty String
```javascript
// Returns empty result
jq(html).findTableWithHeader(''); // length: 0
```

### Empty Array
```javascript
// Returns empty result
jq(html).findTableWithHeader([]); // length: 0
```

### No Match
```javascript
// Returns empty result if header not found
jq(html).findTableWithHeader('Address'); // length: 0
```

### Tables Without Headers
```javascript
const html = `
    <table>
        <tr><td>John</td><td>30</td></tr>
    </table>
`;

// Returns empty result (no headers found)
jq(html).findTableWithHeader('Name'); // length: 0
```

## Use Cases

1. **Data Extraction**: Find and extract data from specific tables
2. **Table Validation**: Verify that expected tables exist with correct structure
3. **Dynamic Reporting**: Process only tables with specific columns
4. **Web Scraping**: Identify and extract relevant tables from complex HTML
5. **Testing**: Verify table structure in automated tests

## Implementation Details

The method:
1. Converts headers to lowercase and trims whitespace
2. Searches current nodes (if they are tables)
3. Searches descendant table elements
4. Deduplicates results
5. Extracts headers from each table (from `<thead>` or first row)
6. Performs partial, case-insensitive matching
7. Returns only tables where ALL specified headers are found

## Related Methods

- **toJSON()**: Convert table to JSON data
- **find()**: Find descendant elements
- **filter()**: Filter current selection

## Files

- **Implementation**: `methods/content-methods/findTableWithHeader.js`
- **Tests**: `test/findTableWithHeader.test.js`
- **Examples**: `examples/findTableWithHeader-usage.js`
