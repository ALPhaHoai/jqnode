# jqnode

A lightweight jQuery-like library for DOM manipulation and traversal in both Node.js and browsers.

## Description

**jqnode** is a JavaScript library that provides a jQuery-compatible API for parsing, querying, and manipulating HTML documents. It works seamlessly in both Node.js environments and web browsers, making it ideal for server-side HTML processing, web scraping, and client-side DOM manipulation.

## Features

- **jQuery-style API**: Familiar syntax for DOM manipulation and traversal
- **CSS Selector Support**: Full CSS selector engine for element selection
- **DOM Traversal**: Navigate through DOM trees with methods like `find`, `parent`, `children`, `siblings`
- **Content Manipulation**: Get and set HTML/text content with `html()`, `text()`, `val()`
- **Attribute Management**: Work with element attributes using `attr()`, `prop()`, `removeAttr()`
- **Element Insertion**: Add content with `append()`, `prepend()`, `before()`, `after()`
- **Filtering Methods**: Filter selections with `filter()`, `not()`, `has()`, `is()`, `eq()`
- **Iteration**: Process collections with `each()`, `map()`
- **Chaining**: Method chaining for fluent API usage
- **Cross-platform**: Works identically in Node.js and browser environments
- **Comprehensive Testing**: 821 automated tests ensuring compatibility

## Installation

```bash
npm install @alphahoai/jqnode
```

## Building

The library supports both Node.js and browser environments. Build files are generated using Rollup.

```bash
# Build all targets (Node.js CommonJS + Browser UMD)
npm run build

# Build and watch for changes
npm run build:watch

# Build specific targets
npm run build:node      # Node.js only
npm run build:browser   # Browser only
```

## Usage

### Node.js

```javascript
const $ = require('@alphahoai/jqnode');

const html = `
<div class="container">
    <h1 class="title">Hello World</h1>
    <p>Some content</p>
</div>
`;

const root = $(html);
const title = root.find('.title');
console.log(title.text()); // "Hello World"
```

### Browser

Include the UMD build in your HTML:

```html
<script src="dist/jqnode.umd.js"></script>
<script>
    // The library is available as a global '$' variable
    const html = `
        <div class="container">
            <h1 class="title">Hello Browser!</h1>
            <p>Some content</p>
        </div>
    `;

    const root = $(html);
    const title = root.find('.title');
    console.log(title.text()); // "Hello Browser!"
</script>
```

Or with a module bundler:

```javascript
import $ from '@alphahoai/jqnode';

// Use the same API as in Node.js
const root = $('html content...');
```

## Browser Testing

jqnode includes comprehensive browser testing capabilities with 821+ automated tests comparing functionality against jQuery.

### Quick Start

```bash
# Build, convert tests, serve, and open browser automatically
npm run test:browser:serve
```

### Test Options

```bash
# Basic browser test (build and show instructions)
npm run test:browser

# Generate comprehensive browser test suite
npm run test:browser:generate

# Build + generate tests + show instructions
npm run test:browser:full

# Build + generate + serve locally + auto-open browser
npm run test:browser:serve
```

### Test Files

- **`browser-test/index.html`** - Basic smoke tests (~10 tests)
- **`browser-test/all-tests/index.html`** - Comprehensive test suite with jQuery comparison (821+ tests)
- **`browser-test/example-converted-attr-test.html`** - Detailed conversion examples

The comprehensive test suite covers:
- **Attributes Methods**: `attr()`, `hasClass()`, `prop()`, `removeAttr()`, `removeProp()`, `toggleClass()`, `val()`
- **Content Methods**: `html()`, `text()`
- **Traversal Methods**: `find()`, `parent()`, `children()`, `siblings()`, `closest()`, etc.
- **Filtering Methods**: `filter()`, `not()`, `has()`, `is()`, `eq()`, `first()`, `last()`, `slice()`
- **Insertion Methods**: `append()`, `prepend()`, `before()`, `after()`, `insertAfter()`, `insertBefore()`
- **Selector Methods**: CSS selectors, advanced selectors, edge cases, performance
- **Iteration Methods**: `each()`, `map()`
- **Chaining Patterns**: Method chaining compatibility

## Debug Logging

Debug logs are disabled by default. To enable debug logging for operations:

```bash
# Option 1: Using JQNODE_DEBUG (Node.js only)
JQNODE_DEBUG=1 node your-script.js

# Option 2: Using DEBUG (supports multiple debug namespaces, Node.js only)
DEBUG=jqnode node your-script.js

# Option 3: Using npm scripts
npm run example:debug
```

## API Reference

jqnode provides a jQuery-compatible API. Key methods include:

### Factory Function
- `$('html string')` - Parse HTML string
- `$('#id')` - Select by ID
- `$('.class')` - Select by class
- `$('tag')` - Select by tag name
- `$(nodeArray)` - Create from node array

### Traversal
- `find(selector)` - Find descendants
- `parent()` - Get parent element
- `children()` - Get child elements
- `siblings()` - Get sibling elements
- `closest(selector)` - Find closest ancestor

### Manipulation
- `html()` / `html(content)` - Get/set HTML content
- `text()` / `text(content)` - Get/set text content
- `attr(name)` / `attr(name, value)` - Get/set attributes
- `prop(name)` / `prop(name, value)` - Get/set properties
- `val()` / `val(value)` - Get/set form values

### Filtering
- `filter(selector)` - Filter elements
- `not(selector)` - Exclude elements
- `has(selector)` - Filter by descendants
- `is(selector)` - Test if matches selector
- `eq(index)` - Get element at index
- `first()` / `last()` - Get first/last element

### Insertion
- `append(content)` - Insert content at end
- `prepend(content)` - Insert content at beginning
- `before(content)` - Insert before element
- `after(content)` - Insert after element

### Iteration
- `each(callback)` - Iterate over elements
- `map(callback)` - Transform elements

See the test files in `test/` for comprehensive examples and edge cases.

## Available Scripts

- `npm run build` - Build all targets (Node.js + Browser)
- `npm run build:watch` - Build and watch for changes during development
- `npm run build:node` - Build Node.js CommonJS version only
- `npm run build:browser` - Build browser UMD version only
- `npm test` - Run Node.js Jest tests
- `npm run test:debug` - Run tests with debug logging
- `npm run test:browser` - Build and prepare basic browser tests
- `npm run test:browser:generate` - Convert Jest tests to browser format
- `npm run test:browser:full` - Build + generate comprehensive browser tests
- `npm run test:browser:serve` - Build + generate + serve + open browser
- `npm run example` - Run basic usage example
- `npm run example:debug` - Run example with debug logging
- `npm run debug` - Start Node.js with debug logging enabled
- `npm run refactor:scan` - Scan for test expression refactoring opportunities

## Contributing

The project includes comprehensive test suites and browser testing tools. Run the full test suite before contributing:

```bash
npm test                    # Run Node.js tests
npm run test:browser:serve  # Run browser compatibility tests
```

## License

ISC
