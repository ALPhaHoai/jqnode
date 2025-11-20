# toJSON() Method

## Overview
The `toJSON()` method converts HTML table elements into a JSON array of objects. Each object represents a table row with properties named after the table headers, making it easy to work with tabular data programmatically.

## Syntax
```javascript
jq(selector).toJSON(options)
```

### Parameters
- **options** (Object, optional): Configuration object
  - **ignoreColumns** (Array): Column indices to exclude from results (0-based)
  - **onlyColumns** (Array): Column indices to include exclusively (0-based)
  - **headings** (String): Custom selector for heading elements (reserved for future use)
  - **normalizeKeys** (Boolean): Replace non-alphanumeric characters in keys with underscores (default: false)

### Return Value
Returns an array of objects where each object represents a table row. Property names are derived from table headers.

## Features

### ✅ Flexible Table Structure Support
- Tables with `<thead>` elements
- Tables without `<thead>` (uses first row as headers)
- Tables with or without `<tbody>`
- Handles both `<th>` and `<td>` header cells

### ✅ Column Filtering
- Ignore specific columns by index
- Include only specific columns
- Automatic column naming for missing headers

### ✅ Data Cleaning
- Automatically trims whitespace from cell values
- Skips empty rows
- Generates default column names (`column_0`, `column_1`, etc.) for missing headers
- Optional key normalization for cleaner property names

## Examples

### Basic Usage
```javascript
const jq = require('@alphahoai/jqnode');

const html = `
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>30</td>
            </tr>
            <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>25</td>
            </tr>
        </tbody>
    </table>
`;

const data = jq(html).find('table').toJSON();
console.log(data);
// [
//   { Name: 'John Doe', Email: 'john@example.com', Age: '30' },
//   { Name: 'Jane Smith', Email: 'jane@example.com', Age: '25' }
// ]
```

### Table Without `<thead>`
```javascript
const html = `
    <table>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
        </tr>
        <tr>
            <td>Widget A</td>
            <td>$19.99</td>
            <td>50</td>
        </tr>
        <tr>
            <td>Widget B</td>
            <td>$29.99</td>
            <td>30</td>
        </tr>
    </table>
`;

const data = jq(html).find('table').toJSON();
console.log(data);
// [
//   { Product: 'Widget A', Price: '$19.99', Stock: '50' },
//   { Product: 'Widget B', Price: '$29.99', Stock: '30' }
// ]
```

### Ignoring Columns
```javascript
const html = `
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>001</td>
                <td>Alice</td>
                <td>alice@example.com</td>
            </tr>
            <tr>
                <td>002</td>
                <td>Bob</td>
                <td>bob@example.com</td>
            </tr>
        </tbody>
    </table>
`;

// Ignore first column (ID)
const data = jq(html).find('table').toJSON({
    ignoreColumns: [0]
});
console.log(data);
// [
//   { Name: 'Alice', Email: 'alice@example.com' },
//   { Name: 'Bob', Email: 'bob@example.com' }
// ]
```

### Including Only Specific Columns
```javascript
// Include only columns 0 and 2 (ID and Email)
const data = jq(html).find('table').toJSON({
    onlyColumns: [0, 2]
});
console.log(data);
// [
//   { ID: '001', Email: 'alice@example.com' },
//   { ID: '002', Email: 'bob@example.com' }
// ]
```

### Multiple Tables
```javascript
const html = `
    <div>
        <table id="employees">
            <tr><th>Name</th><th>Role</th></tr>
            <tr><td>Alice</td><td>Developer</td></tr>
        </table>
        <table id="contractors">
            <tr><th>Name</th><th>Role</th></tr>
            <tr><td>Bob</td><td>Designer</td></tr>
        </table>
    </div>
`;

// Convert all tables to JSON
const allData = jq(html).find('table').toJSON();
console.log(allData);
// [
//   { Name: 'Alice', Role: 'Developer' },
//   { Name: 'Bob', Role: 'Designer' }
// ]
```

### Chaining with findTableWithHeader()
```javascript
const html = `
    <div>
        <table>
            <tr><th>Product</th><th>Price</th></tr>
            <tr><td>Item A</td><td>$10</td></tr>
        </table>
        <table>
            <tr><th>Name</th><th>Email</th></tr>
            <tr><td>John</td><td>john@example.com</td></tr>
        </table>
    </div>
`;

// Find table with "Email" header and convert to JSON
const contacts = jq(html)
    .findTableWithHeader('Email')
    .toJSON();
    
console.log(contacts);
// [{ Name: 'John', Email: 'john@example.com' }]
```

### Handling Missing Headers
```javascript
const html = `
    <table>
        <tr>
            <th></th>
            <th>Value 1</th>
            <th></th>
        </tr>
        <tr>
            <td>A</td>
            <td>B</td>
            <td>C</td>
        </tr>
    </table>
`;

const data = jq(html).find('table').toJSON();
console.log(data);
// [{ column_0: 'A', 'Value 1': 'B', column_2: 'C' }]
```

### Complex Table Structure
```javascript
const html = `
    <table>
        <thead>
            <tr>
                <th>Quarter</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Q1 2024</td>
                <td>$100,000</td>
                <td>$60,000</td>
                <td>$40,000</td>
            </tr>
            <tr>
                <td>Q2 2024</td>
                <td>$120,000</td>
                <td>$65,000</td>
                <td>$55,000</td>
            </tr>
        </tbody>
    </table>
`;

const financialData = jq(html).find('table').toJSON();
console.log(financialData);
// [
//   { Quarter: 'Q1 2024', Revenue: '$100,000', Expenses: '$60,000', Profit: '$40,000' },
//   { Quarter: 'Q2 2024', Revenue: '$120,000', Expenses: '$65,000', Profit: '$55,000' }
// ]
```

### Normalizing Keys
```javascript
const html = `
    <table>
        <tr>
            <th>My Name</th>
            <th>E-mail Address</th>
        </tr>
        <tr>
            <td>Alice</td>
            <td>alice@example.com</td>
        </tr>
    </table>
`;

const data = jq(html).find('table').toJSON({ normalizeKeys: true });
console.log(data);
// [
//   { My_Name: 'Alice', E_mail_Address: 'alice@example.com' }
// ]
```

## Edge Cases

### Empty Table
```javascript
const html = `<table><thead><tr><th>Name</th></tr></thead></table>`;
const data = jq(html).find('table').toJSON();
console.log(data); // []
```

### Table with Only Headers
```javascript
const html = `
    <table>
        <thead><tr><th>Col1</th><th>Col2</th></tr></thead>
        <tbody></tbody>
    </table>
`;
const data = jq(html).find('table').toJSON();
console.log(data); // []
```

### Non-Table Elements
```javascript
const html = `<div>Not a table</div>`;
const data = jq(html).find('div').toJSON();
console.log(data); // []
```

## Use Cases

1. **Web Scraping**: Extract tabular data from web pages
2. **Data Migration**: Convert HTML tables to structured JSON for processing
3. **Report Generation**: Parse HTML reports into analyzable data
4. **Testing**: Verify table contents in automated tests
5. **API Integration**: Transform scraped table data for API consumption
6. **Excel/CSV Export**: Convert tables to JSON before exporting
7. **Analytics**: Extract metrics from HTML tables for analysis

## Performance Considerations

- Processes multiple tables efficiently in a single call
- Minimal memory footprint for small to medium tables
- Consider pagination for very large tables (1000+ rows)

## Implementation Details

The method:
1. Iterates through all selected nodes
2. Validates each node is a `<table>` element
3. Locates headers in `<thead>` or first row
4. Applies column filtering (ignoreColumns/onlyColumns)
5. Extracts cell text content with trimming
6. Constructs objects with header-named properties (optionally normalized)
7. Returns flattened array of all row objects

## Related Methods

- **findTableWithHeader()**: Find tables by header content
- **find()**: Select table elements
- **html()**: Get table HTML
- **text()**: Get table text content

## Files

- **Implementation**: `methods/content-methods/toJSON.js`
- **Tests**: `test/jqnode/content-methods/toJSON.test.js`
- **Examples**: `examples/content/toJSON-usage.js`

## Browser Compatibility

Works in all environments:
- ✅ Node.js (via jsdom)
- ✅ Modern browsers
- ✅ Legacy browsers (IE11+)

## Tips

1. **Data Validation**: Always validate the structure of returned data
2. **Column Selection**: Use `onlyColumns` for better performance when you need specific columns
3. **Header Names**: Ensure table headers are descriptive for better JSON property names
4. **Chaining**: Combine with other methods for powerful data extraction pipelines
5. **Error Handling**: Check for empty results before processing
