# .title() Method Documentation

## Overview

The `title()` method gets the document title by finding and extracting text from the `<title>` element within the `<head>` tag. This method is available both as an **instance method** (chainable) and as a **static method**.

## Implementation

The method uses jqnode's `find()` and `text()` methods:

```javascript
// Instance method
function title() {
    const titleElement = this.find('head > title');
    return titleElement.text().trim();
}

// Static method
function title() {
    const JQFactory = require('./index');
    return JQFactory('head > title').text().trim();
}
```

## Usage

### Instance Method (Recommended - Chainable)

The instance method allows you to chain `.title()` directly on a jqnode instance:

```javascript
const jq = require('@alphahoai/jqnode');

// Parse HTML and get title in one line
const title = jq('<html><head><title>My Website</title></head><body></body></html>').title();
console.log(title); // "My Website"
```

### Static Method

The static method works on the globally registered parsed HTML:

```javascript
const jq = require('@alphahoai/jqnode');

// Parse HTML first
jq('<html><head><title>My Website</title></head><body></body></html>');

// Then get the title using static method
const title = jq.title();
console.log(title); // "My Website"
```

## Features

- ✅ **Works in both Node.js and browser environments**: Uses jqnode's selector engine
- ✅ **Chainable**: Can be used as an instance method for cleaner syntax
- ✅ **Handles special characters**: HTML entities are automatically decoded
- ✅ **Trims whitespace**: Leading and trailing whitespace is automatically removed
- ✅ **Safe**: Returns empty string when no title found (no errors thrown)

## Examples

### Example 1: Simple document (chained)

```javascript
const title = jq('<html><head><title>Welcome</title></head><body></body></html>').title();
console.log(title); // "Welcome"
```

### Example 2: Special characters

```javascript
const title = jq('<html><head><title>Test &amp; Title &lt;World&gt;</title></head></html>').title();
console.log(title); // "Test & Title <World>"
```

### Example 3: Whitespace trimming

```javascript
const title = jq('<html><head><title>  Spaced  </title></head></html>').title();
console.log(title); // "Spaced"
```

### Example 4: No title element

```javascript
const title = jq('<html><head></head><body></body></html>').title();
console.log(title); // ""
```

### Example 5: Store instance and use later

```javascript
const $html = jq('<html><head><title>My Page</title></head><body></body></html>');
// ... do other work ...
const title = $html.title();
console.log(title); // "My Page"
```

### Example 6: Using static method

```javascript
jq('<html><head><title>Static Title</title></head><body></body></html>');
const title = jq.title();
console.log(title); // "Static Title"
```

## Files Modified

1. **methods/content-methods/title.js**: Instance method implementation
2. **jq.js**: Attached `title` to JQ prototype
3. **utils-static.js**: Static method implementation
4. **index.js**: Attached `title` to JQFactory as a static method
5. **test/title.test.js**: Comprehensive test suite for both instance and static methods
6. **examples/title-usage.js**: Usage examples

## Tests

All 16 tests pass successfully:

**Static method tests (8):**

- ✓ Should be accessible as a static method
- ✓ Should return empty string when no HTML is loaded
- ✓ Should get the document title from parsed HTML
- ✓ Should return empty string if no title element exists
- ✓ Should handle special characters in title
- ✓ Should trim whitespace from title
- ✓ Should work with nested head structure
- ✓ Should return concatenated text if multiple titles exist

**Instance method tests (8):**

- ✓ Should be accessible as an instance method
- ✓ Should get the document title using chained syntax
- ✓ Should return empty string when no title element exists
- ✓ Should handle special characters in title
- ✓ Should trim whitespace from title
- ✓ Should work with nested head structure
- ✓ Should work when called on the parsed HTML element
- ✓ Should return concatenated text if multiple titles exist

## API Reference

### Instance Method: .title()

**Returns:** `{string}` The current document title, or empty string if not found

**Description:** Gets the text content of the `<title>` element within the `<head>` tag of the JQ instance's HTML. The method uses `this.find("head > title")` and returns the trimmed text content.

**Example:**

```javascript
const title = jq('<html><head><title>Page Title</title></head></html>').title();
```

---

### Static Method: $.title()

**Returns:** `{string}` The current document title from globally registered HTML, or empty string if not found

**Description:** Gets the text content of the `<title>` element within the `<head>` tag of the globally registered HTML document. The method uses the selector `"head > title"` and returns the trimmed text content.

**Example:**

```javascript
jq('<html><head><title>Page Title</title></head></html>');
const title = jq.title();
```

## Recommended Usage

**Use the instance method (chained syntax) for cleaner, more maintainable code:**

```javascript
// ✅ Recommended: Chained syntax
const title = jq('<html>...</html>').title();

// ❌ Less ideal: Static method requires separate statements
jq('<html>...</html>');
const title = jq.title();
```

The chained syntax is more explicit about which HTML document you're extracting the title from, making your code easier to understand and less prone to bugs when working with multiple HTML documents.
