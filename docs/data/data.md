# data() Method

## Overview

The `data()` method stores and retrieves arbitrary data associated with the matched elements. It provides a jQuery-compatible way to attach custom data to DOM elements without polluting the global namespace or using non-standard attributes.

## Syntax

### Get all data:

```javascript
jq(selector).data();
```

### Get specific data:

```javascript
jq(selector).data(key);
```

### Set single data value:

```javascript
jq(selector).data(key, value);
```

### Set multiple data values:

```javascript
jq(selector).data(object);
```

### Parameters

- **key** (String): The data key name (camelCase)
- **value** (Any): The value to store (any JavaScript type)
- **object** (Object): Multiple key-value pairs to set

### Return Value

- **Getting**: Returns the data value, all data as object, or `undefined`
- **Setting**: Returns the JQ instance for chaining

## Features

### ✅ Flexible Data Storage

- Store any JavaScript type (strings, numbers, booleans, objects, arrays)
- Automatic type conversion for string values
- Merge with HTML data-\* attributes
- camelCase key conversion

### ✅ jQuery-Compatible

- Gets data from first element
- Sets data on all elements
- Supports data-\* attribute fallback
- Automatic value parsing (true, false, null, numbers, JSON)

### ✅ Smart Type Conversion

- `"true"` → `true` (boolean)
- `"false"` → `false` (boolean)
- `"null"` → `null`
- `"123"` → `123` (number)
- `"[1,2,3]"` → `[1,2,3]` (array)
- `'{"key":"value"}'` → `{key: "value"}` (object)

## Examples

### Basic Usage - Setting Data

```javascript
const jq = require('@alphahoai/jqnode');

const html = `<div id="user">John Doe</div>`;
const $ = jq(html);

// Set single value
$('#user').data('userId', 12345);
$('#user').data('role', 'admin');
$('#user').data('active', true);

console.log($('#user').data('userId')); // 12345
console.log($('#user').data('role')); // "admin"
console.log($('#user').data('active')); // true
```

### Setting Multiple Values

```javascript
const html = `<div id="product"></div>`;
const $ = jq(html);

// Set multiple values at once
$('#product').data({
    productId: 'SKU-12345',
    name: 'Widget Pro',
    price: 49.99,
    inStock: true,
    tags: ['electronics', 'gadgets'],
});

console.log($('#product').data('productId')); // "SKU-12345"
console.log($('#product').data('price')); // 49.99
console.log($('#product').data('tags')); // ['electronics', 'gadgets']
```

### Getting All Data

```javascript
const html = `<div id="element" data-status="active" data-priority="high"></div>`;
const $ = jq(html);

// Add programmatic data
$('#element').data('createdAt', new Date());
$('#element').data('count', 42);

// Get all data (includes data-* attributes)
const allData = $('#element').data();
console.log(allData);
// {
//   status: 'active',
//   priority: 'high',
//   createdAt: Date object,
//   count: 42
// }
```

### Data Attributes Integration

```javascript
const html = `
    <div id="widget" 
         data-widget-id="widget-123" 
         data-enabled="true" 
         data-max-items="10">
    </div>
`;
const $ = jq(html);

// Automatically reads and converts data-* attributes
console.log($('#widget').data('widgetId')); // "widget-123" (camelCase conversion)
console.log($('#widget').data('enabled')); // true (boolean conversion)
console.log($('#widget').data('maxItems')); // 10 (number conversion)
```

### Storing Objects and Arrays

```javascript
const html = `<div id="user"></div>`;
const $ = jq(html);

// Store complex objects
$('#user').data('profile', {
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
        theme: 'dark',
        notifications: true,
    },
});

// Store arrays
$('#user').data('permissions', ['read', 'write', 'delete']);

// Retrieve and use
const profile = $('#user').data('profile');
console.log(profile.name); // "John Doe"

const permissions = $('#user').data('permissions');
console.log(permissions.includes('write')); // true
```

### Setting Data on Multiple Elements

```javascript
const html = `
    <div>
        <button class="action-btn">Button 1</button>
        <button class="action-btn">Button 2</button>
        <button class="action-btn">Button 3</button>
    </div>
`;
const $ = jq(html);

// Set same data on all buttons
$('.action-btn').data('handler', 'clickHandler');
$('.action-btn').data('enabled', true);

// Verify each button has the data
$('.action-btn').each(function (index) {
    const $btn = jq(this);
    console.log(`Button ${index + 1}:`, $btn.data('handler'));
});
```

### Setting Unique Data per Element

```javascript
const html = `
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
`;
const $ = jq(html);

$('li').each(function (index) {
    jq(this).data('itemId', `ITEM-${index + 1}`);
    jq(this).data('position', index);
});

// Retrieve
$('li').each(function () {
    const $item = jq(this);
    console.log($item.data('itemId'), 'at position', $item.data('position'));
});
```

### Method Chaining

```javascript
const html = `<div id="element"></div>`;
const $ = jq(html);

$('#element')
    .data('step', 1)
    .data('status', 'initialized')
    .addClass('active')
    .attr('data-ready', 'true');

console.log($('#element').data('step')); // 1
console.log($('#element').data('status')); // "initialized"
```

### Caching DOM Queries

```javascript
const html = `
    <div class="widget" data-api-url="/api/data"></div>
`;
const $ = jq(html);

// Cache expensive computation results
$('.widget').data(
    'processedData',
    (function () {
        // Expensive operation
        return complexCalculation();
    })(),
);

// Retrieve cached data
const cached = $('.widget').data('processedData');
console.log(cached);
```

### Event Data Storage

```javascript
const html = `<button id="submit">Submit</button>`;
const $ = jq(html);

// Store event-related data
$('#submit').data('clickCount', 0);
$('#submit').data('lastClicked', null);

// Simulate click handling
function handleClick() {
    const $btn = jq('#submit');
    const count = $btn.data('clickCount') + 1;

    $btn.data('clickCount', count);
    $btn.data('lastClicked', new Date());

    console.log(`Button clicked ${count} times`);
}

// Simulate clicks
handleClick();
handleClick();
handleClick();
```

### State Management

```javascript
const html = `<div id="accordion"></div>`;
const $ = jq(html);

// Store component state
$('#accordion').data('state', {
    isExpanded: false,
    activePanel: null,
    history: [],
});

// Update state
function toggleAccordion() {
    const $accordion = jq('#accordion');
    const state = $accordion.data('state');

    state.isExpanded = !state.isExpanded;
    state.history.push({
        action: 'toggle',
        timestamp: Date.now(),
    });

    console.log('Accordion expanded:', state.isExpanded);
}
```

### API Response Caching

```javascript
const html = `<div id="user-profile" data-user-id="12345"></div>`;
const $ = jq(html);

async function loadUserProfile() {
    const $profile = jq('#user-profile');

    // Check cache first
    let userData = $profile.data('userData');

    if (!userData) {
        // Simulate API call
        userData = {
            id: $profile.data('userId'),
            name: 'John Doe',
            email: 'john@example.com',
            fetchedAt: new Date(),
        };

        // Cache the result
        $profile.data('userData', userData);
        console.log('Fetched from API');
    } else {
        console.log('Retrieved from cache');
    }

    return userData;
}
```

### Form Field Validation State

```javascript
const html = `
    <form>
        <input type="text" id="email" name="email">
        <input type="password" id="password" name="password">
    </form>
`;
const $ = jq(html);

function validateField($field, isValid, message) {
    $field.data('isValid', isValid);
    $field.data('validationMessage', message);
    $field.data('lastValidated', new Date());
}

// Validate email
validateField($('#email'), true, 'Valid email address');

// Validate password
validateField($('#password'), false, 'Password too short');

// Check validation state
$('input').each(function () {
    const $input = jq(this);
    const isValid = $input.data('isValid');
    const message = $input.data('validationMessage');

    console.log(`${$input.attr('name')}: ${isValid ? '✓' : '✗'} - ${message}`);
});
```

## Type Conversion Examples

```javascript
const html = `
    <div id="test"
         data-boolean="true"
         data-number="42"
         data-null="null"
         data-json='{"key":"value"}'
         data-array="[1,2,3]"
         data-string="hello">
    </div>
`;
const $ = jq(html);

console.log(typeof $('#test').data('boolean'), $('#test').data('boolean')); // boolean true
console.log(typeof $('#test').data('number'), $('#test').data('number')); // number 42
console.log($('#test').data('null')); // null
console.log(typeof $('#test').data('json'), $('#test').data('json')); // object {key: "value"}
console.log(Array.isArray($('#test').data('array'))); // true
console.log(typeof $('#test').data('string')); // string
```

## Edge Cases

### Non-Existent Data

```javascript
const html = `<div id="test"></div>`;
const $ = jq(html);

console.log($('#test').data('missing')); // undefined
```

### Empty Selection

```javascript
const $ = jq('<div></div>');

$('#missing').data('key', 'value'); // No effect, no error
console.log($('#missing').data('key')); // undefined
```

### Overriding Data Attributes

```javascript
const html = `<div id="element" data-value="original"></div>`;
const $ = jq(html);

console.log($('#element').data('value')); // "original"

// Override with programmatic data
$('#element').data('value', 'updated');
console.log($('#element').data('value')); // "updated"
```

## Use Cases

1. **State Management**: Store component state
2. **Caching**: Cache API responses or computed values
3. **Event Tracking**: Track clicks, interactions
4. **Validation**: Store validation state
5. **Configuration**: Store element-specific settings
6. **Data Binding**: Associate model data with views
7. **Metadata**: Store additional element information
8. **Performance**: Avoid repeated DOM queries

##Performance Considerations

- Stored in memory (not in DOM attributes)
- Faster than repeated `getAttribute()` calls
- Good for caching expensive computations
- Isolated per element (no namespace pollution)

## Implementation Details

The method:

1. **Storage**: Uses internal `_jqData` property on nodes
2. **Reading**: Checks programmatic data first, then data-\* attributes
3. **Setting**: Stores in `_jqData`, doesn't modify HTML attributes
4. **Conversion**: Automatically converts data-\* attribute strings to appropriate types
5. **Naming**: Converts kebab-case (data-foo-bar) to camelCase (fooBar)

## Related Methods

- **attr()**: Get/set HTML attributes (including data-\*)
- **removeAttr()**: Remove HTML attributes
- **removeData()**: Remove data values
- **prop()**: Get/set DOM properties

## Differences from attr()

| Feature           | data()              | attr('data-\*')  |
| ----------------- | ------------------- | ---------------- |
| Storage           | In-memory           | HTML attribute   |
| Type              | Any JavaScript type | String only      |
| Performance       | Faster (memory)     | Slower (DOM)     |
| Persistence       | Session only        | Persists in HTML |
| Automatic parsing | Yes                 | No               |
| Naming            | camelCase           | kebab-case       |

## Files

- **Implementation**: `methods/data-methods/data.js`
- **Tests**: `test/jquery-comparison/data.test.js`
- **Examples**: `examples/data-usage.js`

## Browser Compatibility

Works in all environments:

- ✅ Node.js (via jsdom)
- ✅ Modern browsers
- ✅ Legacy browsers (IE11+)

## Tips

1. **Use for temporary data**: data() stores in memory, not HTML
2. **Cache expensive operations**: Store results in data()
3. **Use camelCase keys**: `data('userId')` not `data('user_id')`
4. **Store objects freely**: No serialization needed
5. **Check for undefined**: Always check if data exists before using
6. **Clean up**: Use `removeData()` to free memory when done
7. **Combine with data-\***: Use HTML for static data, data() for dynamic
