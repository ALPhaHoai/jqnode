# attr() Method

## Overview

The `attr()` method gets or sets HTML attributes on elements. It provides full jQuery compatibility for attribute manipulation, including special handling for boolean attributes.

## Syntax

### Getting an attribute:

```javascript
jq(selector).attr(name);
```

### Setting an attribute:

```javascript
jq(selector).attr(name, value);
```

### Parameters

- **name** (String): The attribute name to get or set
- **value** (String|Boolean, optional): The attribute value to set
    - If provided, sets the attribute
    - If omitted, gets the attribute value

### Return Value

- **Getting**: Returns the attribute value as a string, or `undefined` if not found
- **Setting**: Returns the JQ instance for chaining

## Features

### ✅ jQuery-Compatible Behavior

- Gets attribute from first element
- Sets attribute on all elements
- Returns `undefined` for missing attributes
- Supports method chaining when setting

### ✅ Boolean Attributes

Special handling for: `checked`, `selected`, `disabled`, `readonly`, `required`, `multiple`

- Returns attribute name when present
- Accepts `true`/`false` values
- Properly syncs with DOM

### ✅ Cross-Environment Support

- Works in Node.js (jsdom)
- Works in browsers
- Automatic DOM synchronization

## Examples

### Basic Usage - Getting Attributes

```javascript
const jq = require('@alphahoai/jqnode');

const html = `
    <div id="container" class="main" data-role="content">
        <a href="https://example.com" target="_blank">Link</a>
        <img src="image.jpg" alt="Description" width="200">
    </div>
`;

const $ = jq(html);

// Get single attribute
console.log($('#container').attr('class')); // "main"
console.log($('#container').attr('data-role')); // "content"

// Get from link
console.log($('a').attr('href')); // "https://example.com"
console.log($('a').attr('target')); // "_blank"

// Get from image
console.log($('img').attr('src')); // "image.jpg"
console.log($('img').attr('alt')); // "Description"
console.log($('img').attr('width')); // "200"
```

### Basic Usage - Setting Attributes

```javascript
const html = `<div id="box">Content</div>`;
const $ = jq(html);

// Set single attribute
$('#box').attr('class', 'highlighted');
console.log($('#box').attr('class')); // "highlighted"

// Set data attribute
$('#box').attr('data-info', 'important');
console.log($('#box').attr('data-info')); // "important"

// Chaining
$('#box').attr('title', 'Box Title').attr('role', 'region').attr('aria-label', 'Main Box');

console.log($('#box').attr('title')); // "Box Title"
```

### Setting on Multiple Elements

```javascript
const html = `
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
`;

const $ = jq(html);

// Set attribute on all list items
$('li').attr('class', 'list-item');

// Each item now has the class
$('li').each(function () {
    console.log(jq(this).attr('class')); // "list-item"
});
```

### Boolean Attributes

```javascript
const html = `
    <form>
        <input type="checkbox" id="agree">
        <input type="text" id="email">
        <select id="country" multiple>
            <option value="us">USA</option>
            <option value="uk">UK</option>
        </select>
    </form>
`;

const $ = jq(html);

// Setting boolean attributes with true
$('#agree').attr('checked', true);
console.log($('#agree').attr('checked')); // "checked"

$('#email').attr('disabled', true);
console.log($('#email').attr('disabled')); // "disabled"

$('#email').attr('required', true);
console.log($('#email').attr('required')); // "required"

// Setting to false removes the attribute
$('#email').attr('disabled', false);
console.log($('#email').attr('disabled')); // undefined

// String values work too
$('#agree').attr('checked', 'checked');
console.log($('#agree').attr('checked')); // "checked"
```

### Data Attributes

```javascript
const html = `<div id="user"></div>`;
const $ = jq(html);

// Set multiple data attributes
$('#user')
    .attr('data-id', '12345')
    .attr('data-name', 'John Doe')
    .attr('data-role', 'admin')
    .attr('data-active', 'true');

console.log($('#user').attr('data-id')); // "12345"
console.log($('#user').attr('data-name')); // "John Doe"
console.log($('#user').attr('data-role')); // "admin"
console.log($('#user').attr('data-active')); // "true"
```

### ARIA Attributes

```javascript
const html = `<button id="menu-btn">Menu</button>`;
const $ = jq(html);

$('#menu-btn')
    .attr('aria-label', 'Open menu')
    .attr('aria-expanded', 'false')
    .attr('aria-haspopup', 'true')
    .attr('role', 'button');

console.log($('#menu-btn').attr('aria-label')); // "Open menu"
console.log($('#menu-btn').attr('aria-expanded')); // "false"
```

### Getting Non-Existent Attributes

```javascript
const html = `<div id="test">Content</div>`;
const $ = jq(html);

console.log($('#test').attr('class')); // undefined
console.log($('#test').attr('data-missing')); // undefined
console.log($('#test').attr('href')); // undefined
```

### Modifying Links

```javascript
const html = `
    <div>
        <a href="/page1" class="nav-link">Page 1</a>
        <a href="/page2" class="nav-link">Page 2</a>
        <a href="/page3" class="nav-link">Page 3</a>
    </div>
`;

const $ = jq(html);

// Make all links open in new window
$('a.nav-link').attr('target', '_blank');

// Add rel attribute
$('a.nav-link').attr('rel', 'noopener noreferrer');

$('a').each(function () {
    const $link = jq(this);
    console.log($link.attr('href'), '->', $link.attr('target'));
});
```

### Form Elements

```javascript
const html = `
    <form>
        <input type="text" name="username">
        <input type="password" name="password">
        <input type="email" name="email">
        <button type="submit">Submit</button>
    </form>
`;

const $ = jq(html);

// Set placeholders
$('input[name="username"]').attr('placeholder', 'Enter username');
$('input[name="password"]').attr('placeholder', 'Enter password');
$('input[name="email"]').attr('placeholder', 'Enter email');

// Set required attribute
$('input').attr('required', true);

// Set autocomplete
$('input[name="username"]').attr('autocomplete', 'username');
$('input[name="password"]').attr('autocomplete', 'current-password');

// Disable submit button
$('button[type="submit"]').attr('disabled', true);
```

### Image Manipulation

```javascript
const html = `
    <div class="gallery">
        <img src="thumb1.jpg" data-full="full1.jpg">
        <img src="thumb2.jpg" data-full="full2.jpg">
        <img src="thumb3.jpg" data-full="full3.jpg">
    </div>
`;

const $ = jq(html);

// Add alt text to all images
$('img').each(function (index) {
    const $img = jq(this);
    $img.attr('alt', `Gallery image ${index + 1}`);
    $img.attr('loading', 'lazy');
});

// Get data-full attribute
$('img').each(function () {
    console.log('Thumbnail:', jq(this).attr('src'));
    console.log('Full size:', jq(this).attr('data-full'));
});
```

### Conditional Attributes

```javascript
const html = `<div id="status">Loading...</div>`;
const $ = jq(html);

const isLoading = true;
const hasError = false;

// Conditionally set attributes
if (isLoading) {
    $('#status').attr('data-loading', 'true');
    $('#status').attr('aria-busy', 'true');
}

if (hasError) {
    $('#status').attr('data-error', 'true');
    $('#status').attr('aria-invalid', 'true');
}

console.log($('#status').attr('data-loading')); // "true"
console.log($('#status').attr('aria-busy')); // "true"
```

## Edge Cases

### Empty Selection

```javascript
const $ = jq('<div></div>');

// Getting from non-existent element
console.log($('#missing').attr('class')); // undefined

// Setting on non-existent element (no error)
$('#missing').attr('class', 'test'); // No effect, no error
```

### Null and Undefined Values

```javascript
const html = `<div id="test" class="old">Content</div>`;
const $ = jq(html);

// Setting null removes the attribute
$('#test').attr('class', null);
console.log($('#test').attr('class')); // undefined

// Setting undefined removes the attribute
$('#test').attr('data-test', undefined);
console.log($('#test').attr('data-test')); // undefined
```

### Special Characters

```javascript
const html = `<div id="data"></div>`;
const $ = jq(html);

$('#data').attr('data-info', 'Value with "quotes" and \'apostrophes\'');
console.log($('#data').attr('data-info')); // Properly escaped
```

## Use Cases

1. **Dynamic Forms**: Set/get form field attributes
2. **Accessibility**: Add ARIA attributes
3. **Image Optimization**: Set lazy loading, srcset
4. **Link Management**: Modify href, target, rel attributes
5. **Data Storage**: Use data-\* attributes
6. **State Management**: Toggle disabled, checked, selected
7. **SEO**: Add meta information, alt tags
8. **Testing**: Verify element attributes

## Performance Considerations

- Getting is fast (first element only)
- Setting iterates all elements
- Boolean attributes have special handling overhead
- DOM synchronization is automatic

## Implementation Details

The method:

1. **Getting**: Returns attribute from first element, `undefined` if not found
2. **Setting**: Applies to all elements in collection
3. **Boolean attributes**: Special handling for checked, disabled, etc.
4. **DOM sync**: Automatically syncs with `_originalElement` when present
5. **Type coercion**: Converts boolean true to attribute name

## Related Methods

- **prop()**: Get/set properties (differs from attributes)
- **removeAttr()**: Remove attributes
- **hasClass()**: Check for class (use instead of `attr('class')`)
- **addClass()/removeClass()**: Manipulate classes
- **val()**: Get/set form values
- **data()**: Work with data attributes

## Differences from prop()

| Feature               | attr()                 | prop()                   |
| --------------------- | ---------------------- | ------------------------ |
| Purpose               | HTML attributes        | DOM properties           |
| Boolean attrs         | Returns attr name      | Returns true/false       |
| Changes reflect       | In HTML                | In DOM state             |
| `checked` on checkbox | "checked" or undefined | true or false            |
| Performance           | Slower (DOM access)    | Faster (property access) |

## Files

- **Implementation**: `methods/attributes-methods/attr.js`
- **Tests**: `test/jquery-comparison/attr.test.js`
- **Examples**: `examples/attr-usage.js`

## Browser Compatibility

Works in all environments:

- ✅ Node.js (via jsdom)
- ✅ Modern browsers
- ✅ Legacy browsers (IE11+)

## Tips

1. **Use prop() for boolean state**: For checkboxes, use `prop('checked')` to get true/false
2. **Chain for multiple attributes**: `$el.attr('a', '1').attr('b', '2')`
3. **Check for undefined**: Always check if result is undefined before using
4. **Data attributes**: Consider using `data()` method for data-\* attributes
5. **ARIA attributes**: Essential for accessibility
6. **Remove with null**: Set to `null` or `undefined` to remove
