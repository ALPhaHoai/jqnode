# css() Method

## Overview
The `css()` method gets or sets CSS style properties on elements. It provides full jQuery compatibility for working with inline styles and computed styles, supporting both hyphenated and camelCase property names.

## Syntax

### Getting a single CSS property:
```javascript
jq(selector).css(propertyName)
```

### Getting multiple CSS properties:
```javascript
jq(selector).css([propertyName1, propertyName2, ...])
```

### Setting a single CSS property:
```javascript
jq(selector).css(propertyName, value)
```

### Setting with callback function:
```javascript
jq(selector).css(propertyName, function(index, currentValue))
```

### Setting multiple CSS properties:
```javascript
jq(selector).css({property1: value1, property2: value2, ...})
```

### Parameters
- **propertyName** (String): The CSS property name (hyphenated or camelCase)
- **propertyNames** (Array): Array of CSS property names to get
- **value** (String|Number): The value to set. Numbers automatically get 'px' for applicable properties
- **function** (Function): Callback receiving (index, currentValue) and returning new value
- **properties** (Object): Object of property-value pairs to set

### Return Value
- **Getting single property**: Returns the computed style value as a string, or `undefined` if element doesn't exist
- **Getting multiple properties**: Returns an object with property-value pairs
- **Setting**: Returns the JQ instance for chaining

## Features

### ✅ jQuery-Compatible Behavior
- Gets computed styles from first element
- Sets styles on all elements in collection
- Returns `undefined` for missing elements
- Supports method chaining when setting

### ✅ Property Name Normalization
- Accepts hyphenated names: `'background-color'`, `'font-size'`
- Accepts camelCase names: `'backgroundColor'`, `'fontSize'`
- Automatically converts between formats

### ✅ Automatic Unit Conversion
- Numbers automatically get 'px' unit for dimensional properties
- Example: `.css('width', 100)` becomes `'100px'`
- Applies to: width, height, margins, padding, borders, fontSize, etc.

### ✅ Cross-Environment Support
- Works in Node.js (jsdom)
- Works in browsers
- Uses `getComputedStyle` for accurate computed values

## Examples

### Basic Usage - Getting Styles

```javascript
const jq = require('@alphahoai/jqnode');

const html = `
    <div style="color: red; width: 100px; font-size: 16px">
        <p style="background-color: blue">Text</p>
    </div>
`;

const $ = jq(html);

// Get single property
console.log($('div').css('color'));      // "red"
console.log($('div').css('width'));      // "100px"
console.log($('div').css('font-size'));  // "16px"

// Works with camelCase too
console.log($('div').css('fontSize'));   // "16px"
console.log($('p').css('backgroundColor')); // "blue"
```

### Getting Multiple Properties

```javascript
const html = '<div style="color: red; width: 100px; height: 50px">Box</div>';
const $ = jq(html);

// Get array of properties - returns object
const styles = $('div').css(['color', 'width', 'height']);
console.log(styles);
// { color: "red", width: "100px", height: "50px" }

// Access individual values
console.log(styles.color);  // "red"
console.log(styles.width);  // "100px"
```

### Basic Usage - Setting Styles

```javascript
const html = '<div id="box">Content</div>';
const $ = jq(html);

// Set single property with string
$('#box').css('color', 'blue');
console.log($('#box').css('color')); // "blue"

// Set with number (auto px conversion)
$('#box').css('width', 200);
console.log($('#box').css('width')); // "200px"

// Set with full CSS value
$('#box').css('margin', '10px 20px');
console.log($('#box').css('margin')); // "10px 20px"

// Chaining
$('#box')
    .css('background-color', 'yellow')
    .css('padding', '15px')
    .css('border', '1px solid black');
```

### Setting Multiple Properties

```javascript
const html = '<div id="styled">Text</div>';
const $ = jq(html);

// Set multiple properties at once
$('#styled').css({
    color: 'white',
    backgroundColor: '#333',
    fontSize: '18px',
    padding: '10px',
    borderRadius: '5px'
});

// Or with hyphenated names
$('#styled').css({
    'font-weight': 'bold',
    'text-align': 'center',
    'line-height': '1.5'
});

console.log($('#styled').css('color'));           // "white"
console.log($('#styled').css('background-color')); // "#333" or "rgb(51, 51, 51)"
```

### Setting with Callback Function

```javascript
const html = `
    <div style="width: 100px">Box 1</div>
    <div style="width: 150px">Box 2</div>
    <div style="width: 200px">Box 3</div>
`;
const $ = jq(html);

// Increase all widths by 50px
$('div').css('width', function(index, currentValue) {
    const current = parseInt(currentValue);
    return (current + 50) + 'px';
});

console.log($('div').eq(0).css('width')); // "150px"
console.log($('div').eq(1).css('width')); // "200px"
console.log($('div').eq(2).css('width')); // "250px"

// Set based on index
$('div').css('opacity', function(index) {
    return 1 - (index * 0.2); // Fade out effect
});
```

### Numeric Values with Auto px

```javascript
const html = '<div id="element">Resize me</div>';
const $ = jq(html);

// These automatically get 'px' appended
$('#element').css('width', 300);         // "300px"
$('#element').css('height', 200);        // "200px"
$('#element').css('margin-top', 15);     // "15px"
$('#element').css('padding-left', 20);   // "20px"
$('#element').css('font-size', 16);      // "16px"
$('#element').css('border-width', 2);    // "2px"

// These don't get 'px' (use string if needed)
$('#element').css('opacity', 0.5);       // "0.5" (no px)
$('#element').css('z-index', 10);        // "10" (no px)

// Use strings for non-px units
$('#element').css('width', '50%');       // "50%"
$('#element').css('font-size', '1.2em'); // "1.2em"
```

### Working with Multiple Elements

```javascript
const html = `
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
`;
const $ = jq(html);

// Set style on all list items at once
$('li').css({
    color: '#333',
    padding: '5px',
    borderBottom: '1px solid #ddd'
});

// Each item now has the styles
$('li').each(function() {
    console.log(jq(this).css('color')); // "#333" on each
});
```

### Positioning and Layout

```javascript
const html = '<div id="popup">Popup Content</div>';
const $ = jq(html);

// Position absolutely
$('#popup').css({
    position: 'absolute',
    top: 100,
    left: 200,
    width: 300,
    height: 150,
    zIndex: 1000
});

console.log($('#popup').css('position')); // "absolute"
console.log($('#popup').css('top'));      // "100px"
console.log($('#popup').css('z-index'));  // "1000"
```

### Colors

```javascript
const html = '<div id="colorful">Colorful Box</div>';
const $ = jq(html);

// Different color formats all work
$('#colorful').css('color', '#ff0000');           // Hex
$('#colorful').css('background-color', 'blue');   // Named
$('#colorful').css('border-color', 'rgb(0, 255, 0)'); // RGB

// Getting colors returns computed value (often rgb format)
console.log($('#colorful').css('color'));
// May return "rgb(255, 0, 0)" instead of "#ff0000"
```

### Show/Hide Elements

```javascript
const html = '<div id="content">Visibility test</div>';
const $ = jq(html);

// Hide element
$('#content').css('display', 'none');
console.log($('#content').css('display')); // "none"

// Show element
$('#content').css('display', 'block');
console.log($('#content').css('display')); // "block"

// Adjust opacity
$('#content').css('opacity', 0.5);
console.log($('#content').css('opacity')); // "0.5"
```

### Responsive Design Helpers

```javascript
const html = '<div class="responsive">Content</div>';
const $ = jq(html);

// Mobile-first approach
$('.responsive').css({
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '15px'
});

// Flexible box layout
$('.responsive').css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
});
```

### Complex Styling

```javascript
const html = '<button id="btn">Click Me</button>';
const $ = jq(html);

// Create a styled button
$('#btn').css({
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
});

// Hover effect (conceptual - would need event handling)
// $('#btn').on('hover', function() {
//     $(this).css('background-color', '#0056b3');
// });
```

## Edge Cases

### Empty Selection

```javascript
const $ = jq('<div></div>');

// Getting from non-existent element
console.log($('#missing').css('color')); // undefined

// Setting on non-existent element (no error)
$('#missing').css('color', 'red'); // No effect, no error
```

### Undefined and Null

```javascript
const html = '<div id="test" style="color: red">Test</div>';
const $ = jq(html);

// Getting non-existent property
console.log($('#test').css('non-existent')); // undefined or empty string
```

### Property Name Variations

```javascript
const html = '<div style="background-color: blue">Test</div>';
const $ = jq(html);

// Both work
console.log($('div').css('background-color'));  // "blue"
console.log($('div').css('backgroundColor'));   // "blue"

// Setting works with both too
$('div').css('font-size', '16px');
$('div').css('fontSize', '16px'); // Same effect
```

## Use Cases

1. **Dynamic Styling**: Change element appearance based on user interaction
2. **Layout Adjustment**: Position elements programmatically
3. **Responsive Design**: Adjust styles for different screen sizes
4. **Animation Preparation**: Set initial states before animations
5. **Theme Switching**: Apply different color schemes
6. **Show/Hide**: Toggle element visibility
7. **Computed Style Reading**: Get actual rendered values
8. **Style Inheritance**: Read computed styles including inherited values

## Performance Considerations

- Getting styles is fast (reads from first element only)
- Setting styles iterates all elements in collection
- `getComputedStyle` can be slower than reading inline styles
- Batch multiple property sets using object notation for better performance
- Setting the same property multiple times creates overhead

## Implementation Details

The method:
1. **Property name conversion**: Automatically converts between hyphenated and camelCase
2. **Unit detection**: Adds 'px' to numeric values for dimensional properties
3. **Computed styles**: Uses `getComputedStyle` in browsers and jsdom
4. **Setting styles**: Modifies the `style` property on DOM elements
5. **Cross-environment**: Works with both `_originalElement` (jsdom) and direct DOM elements

## Related Methods

- **attr()**: Get/set HTML attributes (different from styles)
- **addClass()/removeClass()**: Manipulate CSS classes
- **show()/hide()**: jQuery convenience methods for visibility (not implemented yet)
- **animate()**: jQuery animation method (not implemented yet)

## Differences from attr()

| Feature | css() | attr() |
|---------|-------|--------|
| Purpose | CSS styles | HTML attributes |
| Property names | Hyphenated or camelCase | As written in HTML |
| Reads | Computed styles | Attribute values |
| Units | Auto-appends 'px' | No unit handling |
| Example | `css('fontSize', 16)` | `attr('data-size', 16)` |

## Files

- **Implementation**: `methods/attributes-methods/css.js`
- **Tests**: `test/jquery-comparison/attributes-methods/css.test.js`
- **Examples**: `examples/css-usage.js`

## Browser Compatibility

Works in all environments:
- ✅ Node.js (via jsdom)
- ✅ Modern browsers
- ✅ Legacy browsers (with getComputedStyle support)

## Tips

1. **Use camelCase in code**: More JavaScript-friendly than hyphenated names
2. **Batch property sets**: Use object notation for setting multiple properties
3. **Read computed values**: Good for getting actual rendered dimensions
4. **Number shortcut**: Use numbers for pixel values on dimensional properties
5. **Callback for dynamic values**: Useful for relative adjustments
6. **Chain operations**: Combine with other methods for fluent API
7. **Check return value**: Always handle `undefined` when getting from potentially missing elements
