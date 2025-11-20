# Using jqnode with `.load()` Method

## Overview

The `jq.load()` method is a static utility function that provides a convenient way to parse HTML strings and create jqnode instances. It's particularly useful when working with data from API responses or when you want to make your code more explicit.

## Basic Syntax

```javascript
const jq = require('@alphahoai/jqnode');
const $ = jq.load(htmlString);
```

## Usage Examples

### 1. Loading HTML from API Response

This is the primary use case - safely loading HTML from API responses with optional chaining:

```javascript
const jq = require('@alphahoai/jqnode');

// Example with axios or fetch
const result = await axios.get('https://example.com/data');
const $ = jq.load(result?.data || "");
const tables = $.find("table");

console.log('Found', tables.length, 'tables');
```

### 2. Finding and Extracting Table Data

```javascript
const jq = require('@alphahoai/jqnode');

const apiResponse = {
    data: `
        <table id="users">
            <tr><th>Name</th><th>Age</th></tr>
            <tr><td>John</td><td>30</td></tr>
            <tr><td>Jane</td><td>25</td></tr>
        </table>
    `
};

const $ = jq.load(apiResponse?.data ||"");
const table = $.find('#users');
const rows = table.find('tr');

console.log('Table has', rows.length, 'rows');
```

### 3. Working with Multiple Tables

```javascript
const jq = require('@alphahoai/jqnode');

const html = `
    <table class="data">...</table>
    <table class="summary">...</table>
`;

const $ = jq.load(html);
const dataTables = $.find('.data');
const summaryTables = $.find('.summary');
```

### 4. Extracting Structured Data

```javascript
const jq = require('@alphahoai/jqnode');

const result = {
    data: `
        <div class="products">
            <div class="product" data-id="1">Product A</div>
            <div class="product" data-id="2">Product B</div>
        </div>
    `
};

const $ = jq.load(result?.data || "");
const products = $.find('.product');

const productData = [];
products.each(function(index, element) {
    const $el = jq(element);
    productData.push({
        id: $el.attr('data-id'),
        name: $el.text()
    });
});

console.log(productData);
// [{ id: '1', name: 'Product A' }, { id: '2', name: 'Product B' }]
```

### 5. Safe Handling of Empty or Null Data

```javascript
const jq = require('@alphahoai/jqnode');

// Handles undefined/null gracefully
const result1 = { data: null };
const result2 = { data: undefined };
const result3 = {};

const $1 = jq.load(result1?.data || "");
const $2 = jq.load(result2?.data || "");
const $3 = jq.load(result3?.data || "");

console.log($1.length); // 0
console.log($2.length); // 0
console.log($3.length); // 0
```

## Comparison: `jq()` vs `jq.load()`

Both methods are functionally equivalent:

```javascript
const jq = require('@alphahoai/jqnode');
const html = '<div>Hello</div>';

// Method 1: Direct call
const $1 = jq(html);

// Method 2: Using .load()
const $2 = jq.load(html);

// Both work exactly the same way
$1.find('div').text() === $2.find('div').text(); // true
```

### When to Use Each

**Use `jq(html)`:**
- For simple, straightforward HTML parsing
- When the HTML source is always a string
- For quick one-liners

**Use `jq.load(html)`:**
- When loading data from API responses
- When working with optional/nullable data
- When you want to make the "loading" action explicit in your code
- For better code readability in complex scenarios

## Common Patterns

### Pattern 1: Web Scraping

```javascript
const jq = require('@alphahoai/jqnode');
const axios = require('axios');

async function scrapeData(url) {
    const response = await axios.get(url);
    const $ = jq.load(response?.data || "");
    
    const articles = $.find('article');
    return articles.map((i, article) => {
        const $article = jq(article);
        return {
            title: $article.find('h2').text(),
            content: $article.find('p').text()
        };
    }).get();
}
```

### Pattern 2: Table to JSON Conversion

```javascript
const jq = require('@alphahoai/jqnode');

function tableToJSON(htmlTable) {
    const $ = jq.load(htmlTable);
    const headers = $.find('th').map((i, th) => jq(th).text()).get();
    
    return $.find('tbody tr').map((i, tr) => {
        const $tr = jq(tr);
        const row = {};
        $tr.find('td').each((j, td) => {
            row[headers[j]] = jq(td).text();
        });
        return row;
    }).get();
}

const html = `
    <table>
        <thead><tr><th>Name</th><th>Age</th></tr></thead>
        <tbody>
            <tr><td>Alice</td><td>30</td></tr>
            <tr><td>Bob</td><td>25</td></tr>
        </tbody>
    </table>
`;

console.log(tableToJSON(html));
// [{ Name: 'Alice', Age: '30' }, { Name: 'Bob', Age: '25' }]
```

### Pattern 3: Conditional Loading

```javascript
const jq = require('@alphahoai/jqnode');

function processResponse(response) {
    // Safely load even if response structure is uncertain
    const $ = jq.load(response?.data?.html || response?.html || "");
    
    if ($.length === 0) {
        console.log('No HTML content to process');
        return null;
    }
    
    return $.find('.content').text();
}
```

## Error Handling

The `.load()` method includes built-in error handling:

```javascript
const jq = require('@alphahoai/jqnode');

// Non-string inputs return empty JQ instance with warning
jq.load(123);        // Warning + empty instance
jq.load(null);       // Warning + empty instance
jq.load(undefined);  // Warning + empty instance
jq.load({});         // Warning + empty instance

// Empty string returns empty instance (no warning)
jq.load("");         // Empty instance, no warning
```

## API Reference

### `jq.load(html)`

Loads and parses an HTML string, returning a JQ instance.

**Parameters:**
- `html` (string): HTML string to parse

**Returns:**
- `JQ` instance containing the parsed HTML nodes

**Example:**
```javascript
const $ = jq.load('<div>Hello</div>');
console.log($.find('div').text()); // "Hello"
```

## Best Practices

1. **Always use optional chaining for API data:**
   ```javascript
   const $ = jq.load(response?.data || "");
   ```

2. **Check length before processing:**
   ```javascript
   const $ = jq.load(html);
   if ($.length > 0) {
       // Process content
   }
   ```

3. **Use .find() for querying:**
   ```javascript
   const $ = jq.load(html);
   const elements = $.find('selector'); // ✅ Correct
   ```

4. **Reuse the jq factory for nested elements:**
   ```javascript
   $.find('div').each((i, div) => {
       const $div = jq(div); // Wrap individual elements
       console.log($div.text());
   });
   ```

## See Also

- [Main README](../README.md)
- [Basic Usage Example](../examples/basic-usage.js)
- [Load Method Demo](../examples/load-method-demo.js)
- [Simple Load Test](../examples/simple-load-test.js)
