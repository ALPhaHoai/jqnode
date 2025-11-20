# Quick Start: Using jq.load() with Node.js

## ✅ Installation

```bash
npm install @alphahoai/jqnode
```

## ✅ Your Requested Syntax

```javascript
const jq = require('@alphahoai/jqnode');

// Load HTML from API response
const $ = jq.load(result?.data || "");

// Find tables
const tables = $.find("table");
```

## ✅ Complete Working Example

```javascript
const jq = require('@alphahoai/jqnode');

// Simulating an HTTP response (e.g., from axios)
const result = {
    data: `
        <table id="users">
            <tr><th>Name</th><th>Age</th></tr>
            <tr><td>John</td><td>30</td></tr>
            <tr><td>Jane</td><td>25</td></tr>
        </table>
        <table id="products">
            <tr><th>Product</th><th>Price</th></tr>
            <tr><td>Laptop</td><td>$999</td></tr>
        </table>
    `
};

// Load and query
const $ = jq.load(result?.data || "");
const tables = $.find("table");

console.log('Found', tables.length, 'tables'); // Found 2 tables

// Work with each table
tables.each(function(index, table) {
    const $table = jq(table);
    console.log('Table', index + 1, 'ID:', $table.attr('id'));
});
```

## ✅ Key Points

1. **Use `jq.load()`** to parse HTML strings
2. **Use `.find()`** to query the loaded HTML  
3. **Always include fallback** with `|| ""` for safety
4. **Works with any HTML source**: API responses, files, strings, etc.

## ✅ Method Reference

| Method | Description | Example |
|--------|-------------|---------|
| `jq.load(html)` | Parse HTML string | `const $ = jq.load(html)` |
| `$.find(selector)` | Find elements | `$.find("table")` |
| `$.find(selector).each()` | Iterate elements | See example above |
| `jq(element)` | Wrap single element | `const $el = jq(element)` |

## ✅ Run the Examples

```bash
# Simple test
node examples/simple-load-test.js

# API response pattern
node examples/api-response-example.js

# Full demo with multiple patterns
node examples/load-method-demo.js
```

## ✅ More Information

- See [LOAD_METHOD.md](./LOAD_METHOD.md) for comprehensive documentation
- See [README.md](../README.md) for full API reference
- See [examples/](../examples/) for more code examples

---

**You now have the `.load()` function working exactly as you requested! 🎉**
