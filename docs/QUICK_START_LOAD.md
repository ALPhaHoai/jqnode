# Quick Start: Using jq.load() with Node.js

## ✅ Installation

```bash
npm install @alphahoai/jqnode
```

## ✅ Your Requested Syntax (NEW!)

**The `.load()` method now returns a callable object!**

```javascript
const jq = require('@alphahoai/jqnode');

// Load HTML from API response
const $ = jq.load(result?.data || '');

// ✨ NEW: Use jQuery-like callable syntax!
const tables = $('table'); // This now works!
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
    `,
};

// Load and query
const $ = jq.load(result?.data || '');

// ✨ NEW: Use callable syntax (jQuery-like)!
const tables = $('table'); // Works!
// OR use traditional syntax:
// const tables = $.find("table");

console.log('Found', tables.length, 'tables'); // Found 2 tables

// Work with each table
tables.each(function (index, table) {
    const $table = jq(table);
    console.log('Table', index + 1, 'ID:', $table.attr('id'));
});
```

## ✅ Key Points

1. **Use `jq.load()`** to parse HTML strings
2. **NEW: Use callable syntax** `$("selector")` - jQuery-like!
3. **OR use `.find()`** - Traditional method syntax still works
4. **Always include fallback** with `|| ""` for safety
5. **Works with any HTML source**: API responses, files, strings, etc.

## ✅ Method Reference

| Method                    | Description                          | Example                   |
| ------------------------- | ------------------------------------ | ------------------------- |
| `jq.load(html)`           | Parse HTML string (returns callable) | `const $ = jq.load(html)` |
| `$("selector")`           | **NEW!** Find elements (callable)    | `$("table")`              |
| `$.find(selector)`        | Find elements (traditional)          | `$.find("table")`         |
| `$.find(selector).each()` | Iterate elements                     | See example above         |
| `jq(element)`             | Wrap single element                  | `const $el = jq(element)` |

**Note:** Both `$("selector")` and `$.find("selector")` work identically!

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
