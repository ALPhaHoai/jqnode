# addClass() Method

## Overview

The `addClass()` method adds one or more CSS classes to all elements in the matched set. This is one of the most commonly used jQuery methods for manipulating element classes.

## Syntax

### Add single class:

```javascript
jq(selector).addClass(className);
```

### Add multiple classes:

```javascript
jq(selector).addClass('class1 class2 class3');
```

### Add classes using function:

```javascript
jq(selector).addClass(function (index, currentClass) {
    return newClass;
});
```

### Parameters

- **className** (String): One or more space-separated classes to add
- **function(index, currentClass)**: Function returning class names to add
    - **index**: Element's index in the set
    - **currentClass**: Current class value
    - **Returns**: String of class names to add

### Return Value

Returns the JQ instance for method chaining.

## Features

### ✅ Multiple Classes

- Add single or multiple space-separated classes
- Duplicate classes are handled automatically
- Preserves existing classes

### ✅ Function Support

- Dynamically determine classes based on index
- Access current classes for conditional logic
- Apply different classes to different elements

### ✅ Chainable

- Returns JQ instance for method chaining
- Combine with other manipulation methods

## Examples

### Basic Usage

```javascript
const jq = require('@alphahoai/jqnode');

const html = `
    <div id="main">
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
        <p>Paragraph 3</p>
    </div>
`;

const $ = jq(html);

// Add single class
$('p').addClass('text');
console.log($('p').first().attr('class')); // "text"

// Add multiple classes
$('#main').addClass('container active');
console.log($('#main').attr('class')); // "container active"
```

### Multiple Classes

```javascript
const html = `<div id="box">Content</div>`;
const $ = jq(html);

$('#box').addClass('highlighted bordered rounded');
console.log($('#box').attr('class')); // "highlighted bordered rounded"
```

### Using Function

```javascript
const html = `
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
    </ul>
`;

const $ = jq(html);

// Add even/odd classes based on index
$('li').addClass(function (index) {
    return index % 2 === 0 ? 'even' : 'odd';
});

$('li').each(function (i) {
    console.log(`Item ${i}: ${jq(this).attr('class')}`);
});
// Item 0: even
// Item 1: odd
// Item 2: even
// Item 3: odd
```

### Preserving Existing Classes

```javascript
const html = `<div class="existing">Content</div>`;
const $ = jq(html);

$('div').addClass('new-class');
console.log($('div').attr('class')); // "existing new-class"
```

### Method Chaining

```javascript
const html = `<div id="element">Text</div>`;
const $ = jq(html);

$('#element').addClass('primary').addClass('highlighted').attr('data-status', 'active');

console.log($('#element').attr('class')); // "primary highlighted"
```

### Conditional Classes

```javascript
const html = `
    <div>
        <span data-status="active">Active</span>
        <span data-status="inactive">Inactive</span>
        <span data-status="active">Active</span>
    </div>
`;

const $ = jq(html);

$('span').addClass(function (index, currentClass) {
    const status = jq(this).attr('data-status');
    return status === 'active' ? 'text-success' : 'text-muted';
});

$('span').each(function () {
    const $span = jq(this);
    console.log($span.attr('data-status'), '->', $span.attr('class'));
});
```

### Form Field States

```javascript
const html = `
    <form>
        <input type="text" id="name" value="John">
        <input type="email" id="email" value="">
        <input type="password" id="password" value="secret">
    </form>
`;

const $ = jq(html);

$('input').addClass(function () {
    const value = jq(this).attr('value');
    return value ? 'filled' : 'empty';
});

$('input').each(function () {
    const $input = jq(this);
    console.log($input.attr('id'), ':', $input.attr('class'));
});
```

### Table Styling

```javascript
const html = `
    <table>
        <tr><td>Row 1 Cell 1</td><td>Row 1 Cell 2</td></tr>
        <tr><td>Row 2 Cell 1</td><td>Row 2 Cell 2</td></tr>
        <tr><td>Row 3 Cell 1</td><td>Row 3 Cell 2</td></tr>
    </table>
`;

const $ = jq(html);

// Stripe table rows
$('tr').addClass(function (index) {
    return index % 2 === 0 ? 'row-even' : 'row-odd';
});

// Add class to all cells
$('td').addClass('cell');
```

### Navigation Menu

```javascript
const html = `
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>
`;

const $ = jq(html);
const currentPage = '/about';

$('a')
    .addClass('nav-link')
    .addClass(function () {
        return jq(this).attr('href') === currentPage ? 'active' : '';
    });

$('a').each(function () {
    console.log(jq(this).attr('href'), '->', jq(this).attr('class'));
});
```

### Button States

```javascript
const html = `
    <div>
        <button data-type="primary">Primary</button>
        <button data-type="secondary">Secondary</button>
        <button data-type="danger">Delete</button>
    </div>
`;

const $ = jq(html);

$('button')
    .addClass('btn')
    .addClass(function () {
        const type = jq(this).attr('data-type');
        return `btn-${type}`;
    });

$('button').each(function () {
    console.log(jq(this).text(), ':', jq(this).attr('class'));
});
```

## Use Cases

1. **Styling Elements**: Add CSS classes for visual styling
2. **State Management**: Indicate active/selected states
3. **Conditional Formatting**: Apply classes based on data
4. **Interactive UI**: Toggle visibility, highlights
5. **Form Validation**: Show valid/invalid states
6. **Theming**: Apply theme-specific classes
7. **Accessibility**: Add ARIA-related class indicators

## Performance Considerations

- Operates on all elements in set
- Multiple classes can be added in one call
- No duplicate class checking needed (browser handles it)
- Use single `addClass()` call instead of multiple for better performance

## Common Patterns

### Pattern 1: Basic class addition

```javascript
$('element').addClass('className');
```

### Pattern 2: Multiple classes

```javascript
$('element').addClass('class1 class2 class3');
```

### Pattern 3: Conditional classes

```javascript
$('element').addClass(function () {
    return condition ? 'classA' : 'classB';
});
```

### Pattern 4: Index-based classes

```javascript
$('element').addClass(function (index) {
    return `item-${index}`;
});
```

## Related Methods

- **removeClass()**: Remove classes from elements
- **toggleClass()**: Toggle classes on/off
- **hasClass()**: Check if element has class
- **attr('class')**: Get/set class attribute directly

## Files

- **Implementation**: `methods/attributes-methods/addClass.js`
- **Tests**: `test/jquery-comparison/addClass.test.js`
- **Examples**: `examples/addClass-usage.js`

## Tips

1. **Multiple classes**: Separate with spaces: `addClass('a b c')`
2. **Chain calls**: Can call multiple times or chain with other methods
3. **No duplicates**: Browser automatically prevents duplicate classes
4. **Empty string**: Adding empty string has no effect
5. **Function return**: Can return empty string to skip adding classes
6. **Performance**: Add multiple classes at once instead of separate calls
