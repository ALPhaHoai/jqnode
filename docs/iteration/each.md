# each() Method

## Overview

The `each()` method iterates over each element in a JQ collection, executing a callback function for each element. It provides jQuery-compatible iteration with the ability to break early by returning `false`.

## Syntax

```javascript
jq(selector).each(callback);
```

### Parameters

- **callback** (Function): Function to execute for each element
    - **index** (Number): The index of the current element (0-based)
    - **element** (Node): The current DOM node
    - **this**: The current element (same as the `element` parameter)
    - **Return `false`**: Breaks the loop early

### Return Value

Returns the JQ instance for method chaining.

## Features

### ✅ jQuery-Compatible Iteration

- Callback receives index and element
- `this` context is set to current element
- Return `false` to break loop early
- Chainable (returns JQ instance)

### ✅ Flexible Usage

- Iterate over any number of elements
- Access both index and element
- Use arrow functions or traditional functions
- Combine with other methods

## Examples

### Basic Iteration

```javascript
const jq = require('@alphahoai/jqnode');

const html = `
    <ul>
        <li>Apple</li>
        <li>Banana</li>
        <li>Cherry</li>
    </ul>
`;

const $ = jq(html);

$('li').each(function (index, element) {
    console.log(`Item ${index}: ${jq(element).text()}`);
});
// Output:
// Item 0: Apple
// Item 1: Banana
// Item 2: Cherry
```

### Using `this` Context

```javascript
$('li').each(function (index) {
    // 'this' refers to the current element
    const text = jq(this).text();
    console.log(`${index + 1}. ${text}`);
});
```

### Modifying Elements

```javascript
const html = `
    <div>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <p>Third paragraph</p>
    </div>
`;

const $ = jq(html);

$('p').each(function (index) {
    jq(this).addClass('paragraph').attr('data-index', index).attr('id', `para-${index}`);
});

// Verify modifications
$('p').each(function () {
    const $p = jq(this);
    console.log('ID:', $p.attr('id'), 'Index:', $p.attr('data-index'));
});
```

### Breaking Early with `false`

```javascript
const html = `
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li class="stop-here">Item 3</li>
        <li>Item 4</li>
        <li>Item 5</li>
    </ul>
`;

const $ = jq(html);

// Stop at element with class "stop-here"
$('li').each(function (index, element) {
    const $el = jq(element);
    console.log(`Processing: ${$el.text()}`);

    if ($el.hasClass('stop-here')) {
        console.log('Stopping here!');
        return false; // Break the loop
    }
});
// Output:
// Processing: Item 1
// Processing: Item 2
// Processing: Item 3
// Stopping here!
```

### Method Chaining

```javascript
const html = `<div class="items"><span>A</span><span>B</span><span>C</span></div>`;
const $ = jq(html);

$('span')
    .each(function (i) {
        jq(this).attr('data-order', i);
    })
    .addClass('processed')
    .first()
    .addClass('first-item');

// Verify
$('span').each(function () {
    const $span = jq(this);
    console.log('Order:', $span.attr('data-order'), 'Classes:', $span.attr('class'));
});
```

### Collecting Data

```javascript
const html = `
    <table>
        <tr><td>John</td><td>30</td></tr>
        <tr><td>Jane</td><td>25</td></tr>
        <tr><td>Bob</td><td>35</td></tr>
    </table>
`;

const $ = jq(html);
const people = [];

$('tr').each(function () {
    const $row = jq(this);
    const cells = $row.find('td');

    if (cells.length === 2) {
        people.push({
            name: cells.eq(0).text(),
            age: parseInt(cells.eq(1).text()),
        });
    }
});

console.log(people);
// [
//   { name: 'John', age: 30 },
//   { name: 'Jane', age: 25 },
//   { name: 'Bob', age: 35 }
// ]
```

### Conditional Processing

```javascript
const html = `
    <ul>
        <li class="active">Active Item 1</li>
        <li>Inactive Item</li>
        <li class="active">Active Item 2</li>
        <li class="active">Active Item 3</li>
    </ul>
`;

const $ = jq(html);

$('li').each(function (index) {
    const $item = jq(this);

    if ($item.hasClass('active')) {
        $item.attr('data-status', 'active');
        console.log(`Item ${index} is active`);
    } else {
        $item.attr('data-status', 'inactive');
        console.log(`Item ${index} is inactive`);
    }
});
```

### Building New HTML

```javascript
const html = `
    <div id="source">
        <span data-value="A">Value A</span>
        <span data-value="B">Value B</span>
        <span data-value="C">Value C</span>
    </div>
`;

const $ = jq(html);
let newHtml = '';

$('span').each(function () {
    const $span = jq(this);
    const value = $span.attr('data-value');
    newHtml += `<div class="item">${value}</div>`;
});

console.log(newHtml);
// <div class="item">A</div><div class="item">B</div><div class="item">C</div>
```

### Processing Form Fields

```javascript
const html = `
    <form>
        <input type="text" name="username" value="john123">
        <input type="email" name="email" value="john@example.com">
        <input type="number" name="age" value="30">
    </form>
`;

const $ = jq(html);
const formData = {};

$('input').each(function () {
    const $input = jq(this);
    const name = $input.attr('name');
    const value = $input.attr('value');
    formData[name] = value;
});

console.log(formData);
// { username: 'john123', email: 'john@example.com', age: '30' }
```

### Adding Sequential Numbers

```javascript
const html = `
    <ol>
        <li>First task</li>
        <li>Second task</li>
        <li>Third task</li>
    </ol>
`;

const $ = jq(html);

$('li').each(function (index) {
    const $li = jq(this);
    const taskNumber = index + 1;
    $li.attr('data-task-id', `TASK-${String(taskNumber).padStart(3, '0')}`);
});

// Verify
$('li').each(function () {
    console.log(jq(this).attr('data-task-id'), '-', jq(this).text());
});
// TASK-001 - First task
// TASK-002 - Second task
// TASK-003 - Third task
```

### Nested Iteration

```javascript
const html = `
    <div class="sections">
        <section>
            <h2>Section 1</h2>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
        </section>
        <section>
            <h2>Section 2</h2>
            <p>Paragraph 3</p>
        </section>
    </div>
`;

const $ = jq(html);

$('section').each(function (sectionIndex) {
    const $section = jq(this);
    const title = $section.find('h2').text();

    console.log(`\n${title}:`);

    $section.find('p').each(function (paraIndex) {
        console.log(`  ${paraIndex + 1}. ${jq(this).text()}`);
    });
});
```

### Finding Specific Element

```javascript
const html = `
    <ul>
        <li data-id="100">Item 100</li>
        <li data-id="200">Item 200</li>
        <li data-id="300">Item 300</li>
        <li data-id="400">Item 400</li>
    </ul>
`;

const $ = jq(html);
let found = null;

$('li').each(function () {
    const $li = jq(this);
    if ($li.attr('data-id') === '300') {
        found = $li;
        return false; // Stop searching
    }
});

if (found) {
    console.log('Found:', found.text());
}
```

## Use Cases

1. **Data Extraction**: Extract data from multiple elements
2. **Batch Modifications**: Apply changes to multiple elements
3. **Form Processing**: Collect or validate form field values
4. **List Processing**: Number items, add attributes
5. **Conditional Logic**: Apply different actions based on element properties
6. **Data Collection**: Build arrays or objects from DOM elements
7. **Early Exit**: Find specific elements and stop searching

## Performance Considerations

- More efficient than native `forEach` for small collections
- Use `return false` to exit early when possible
- For read-only operations, consider `map()` if building a new array
- O(n) complexity - scales linearly with collection size

## Differences from Array Methods

| Feature         | .each()                 | Array.forEach()       |
| --------------- | ----------------------- | --------------------- |
| Return value    | JQ instance (chainable) | undefined             |
| Break early     | Return `false`          | Not supported         |
| `this` context  | Current element         | undefined (or global) |
| Callback params | (index, element)        | (element, index)      |
| Use case        | DOM manipulation        | General iteration     |

## Common Patterns

### Pattern 1: Setting sequential data

```javascript
$('div').each(function (i) {
    jq(this).attr('data-index', i);
});
```

### Pattern 2: Conditional modification

```javascript
$('li').each(function () {
    const $li = jq(this);
    if ($li.text().includes('important')) {
        $li.addClass('highlight');
    }
});
```

### Pattern 3: Early exit on condition

```javascript
$('element').each(function () {
    if (someCondition) {
        return false; // Exit loop
    }
    // Process element
});
```

### Pattern 4: Building data structures

```javascript
const data = [];
$('item').each(function () {
    data.push(extractDataFrom(this));
});
```

## Related Methods

- **map()**: Transform elements and return array
- **filter()**: Select subset of elements
- **toArray()**: Convert to plain array
- **$.each()**: Static method for iterating over arrays/objects

## Files

- **Implementation**: `methods/iteration-methods/each.js`
- **Tests**: `test/jquery-comparison/each.test.js`
- **Examples**: `examples/each-usage.js`

## Tips

1. **Use `this` or `element`**: Both refer to the current element
2. **Wrap in jq()**: Use `jq(this)` or `jq(element)` to access jqnode methods
3. **Return false to break**: Only way to exit loop early
4. **Chain for brevity**: `$('div').each(...).addClass('done')`
5. **Collect data outside**: Build arrays/objects outside the each() callback
6. **Index is 0-based**: First element is index 0
