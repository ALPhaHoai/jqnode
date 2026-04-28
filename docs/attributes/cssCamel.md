# cssCamel() Method

## Overview

The `cssCamel()` method gets or sets CSS style properties on elements with **camelCase property names**, making it ideal for React inline style objects. Similar to `.css()`, but transforms all property names to camelCase format (React/JavaScript convention) instead of kebab-case (CSS convention).

## Key Difference from css()

- **css()**: Returns property names as provided (can be kebab-case or camelCase)
- **cssCamel()**: Always returns camelCase property names, perfect for React's `style` prop

## Syntax

### Getting a single CSS property:

```javascript
jq(selector).cssCamel(propertyName);
```

### Getting multiple CSS properties:

```javascript
jq(selector).cssCamel([propertyName1, propertyName2, ...])
// Returns: { camelCaseKey1: value1, camelCaseKey2: value2, ... }
```

### Setting a single CSS property:

```javascript
jq(selector).cssCamel(propertyName, value);
```

### Setting with callback function:

```javascript
jq(selector).cssCamel(propertyName, function(index, currentValue))
```

### Setting multiple CSS properties:

```javascript
jq(selector).cssCamel({property1: value1, property2: value2, ...})
```

### Parameters

- **propertyName** (String): CSS property name (hyphenated or camelCase, both accepted)
- **propertyNames** (Array): Array of CSS property names to get (returns object with camelCase keys)
- **value** (String|Number): The value to set. Numbers automatically get 'px' for applicable properties
- **function** (Function): Callback receiving (index, currentValue) and returning new value
- **properties** (Object): Object of property-value pairs to set (accepts both camelCase and kebab-case keys)

### Return Value

- **Getting single property**: Returns the computed style value as a string
- **Getting multiple properties**: Returns an object with **camelCase keys** and style values
- **Setting**: Returns the JQ instance for chaining

## Features

### ✅ React Inline Style Compatibility

- Returns objects with camelCase keys suitable for React's `style` prop
- Example: `backgroundColor` instead of `background-color`
- No conversion needed to use in JSX

### ✅ Flexible Input

- Accepts both kebab-case and camelCase property names when setting
- Automatically converts all to proper format
- Works seamlessly with existing CSS code

### ✅ Same Features as css()

- Automatic 'px' unit conversion for numbers
- Callback functions for dynamic values
- Method chaining support
- Multi-element support
- Cross-environment compatibility (Node.js + Browser)

## Examples

### Basic Usage - Getting Styles with camelCase Keys

```javascript
const jq = require('@alphahoai/jqnode');

const html = `
    <div style="background-color: red; font-size: 16px; margin-top: 10px">
        Content
    </div>
`;

const $ = jq(html);

// Get single property (input can be kebab-case or camelCase)
console.log($('div').cssCamel('background-color')); // "red"
console.log($('div').cssCamel('backgroundColor')); // "red"
console.log($('div').cssCamel('font-size')); // "16px"
```

### Getting Multiple Properties - Perfect for React

```javascript
const html = '<div style="background-color: blue; font-size: 14px; padding: 10px">Box</div>';
const $ = jq(html);

// Get multiple properties - returns camelCase object
const styles = $('div').cssCamel(['background-color', 'font-size', 'padding']);

console.log(styles);
// {
//   backgroundColor: "blue",
//   fontSize: "14px",
//   padding: "10px"
// }

// Use directly in React JSX:
// <div style={styles}>...</div>
```

### Setting Styles - Accepts Both Formats

```javascript
const html = '<div>Content</div>';
const $ = jq(html);

// Set with kebab-case property names
$('div').cssCamel('background-color', 'yellow');
console.log($('div').cssCamel('backgroundColor')); // "yellow"

// Set with camelCase property names
$('div').cssCamel('fontSize', '18px');
console.log($('div').cssCamel('font-size')); // "18px"
```

### Setting Multiple Properties - Mixed Formats

```javascript
const html = '<div>Styled Box</div>';
const $ = jq(html);

// Mix kebab-case and camelCase in the same object
$('div').cssCamel({
    'background-color': 'purple',
    fontSize: '20px',
    'border-width': '2px',
    paddingLeft: '15px',
});

// All properties are set correctly
console.log($('div').cssCamel('backgroundColor')); // "purple"
console.log($('div').cssCamel('fontSize')); // "20px"
console.log($('div').cssCamel('borderWidth')); // "2px"
console.log($('div').cssCamel('paddingLeft')); // "15px"
```

### React Component Integration

```javascript
const jq = require('@alphahoai/jqnode');

// Parse HTML from server/API
const html =
    '<div class="card" style="background-color: white; padding: 20px; border-radius: 8px">Card</div>';
const $ = jq(html);

// Extract styles for React component
const cardStyles = $('.card').cssCamel(['background-color', 'padding', 'border-radius']);

console.log(cardStyles);
// {
//   backgroundColor: "white",
//   padding: "20px",
//   borderRadius: "8px"
// }

// Use in React:
// function Card() {
//   return <div style={cardStyles}>Card Content</div>;
// }
```

### Numeric Values with Auto px

```javascript
const html = '<div>Element</div>';
const $ = jq(html);

// Numbers automatically get 'px' for dimensional properties
$('div').cssCamel({
    width: 300,
    height: 200,
    marginTop: 15,
    paddingLeft: 20,
    fontSize: 16,
});

// Get the React-friendly object
const styles = $('div').cssCamel(['width', 'height', 'marginTop', 'paddingLeft', 'fontSize']);
console.log(styles);
// {
//   width: "300px",
//   height: "200px",
//   marginTop: "15px",
//   paddingLeft: "20px",
//   fontSize: "16px"
// }

// Opacity and z-index don't get 'px'
$('div').cssCamel('opacity', 0.8);
$('div').cssCamel('zIndex', 100);
console.log($('div').cssCamel('opacity')); // "0.8"
console.log($('div').cssCamel('zIndex')); // "100"
```

### Callback Function

```javascript
const html = `
    <div style="width: 100px">Box 1</div>
    <div style="width: 150px">Box 2</div>
    <div style="width: 200px">Box 3</div>
`;
const $ = jq(html);

// Increase all widths by 50px using callback
$('div').cssCamel('width', function (index, currentValue) {
    const current = parseInt(currentValue);
    return current + 50 + 'px';
});

console.log($('div').eq(0).cssCamel('width')); // "150px"
console.log($('div').eq(1).cssCamel('width')); // "200px"
console.log($('div').eq(2).cssCamel('width')); // "250px"
```

### Chaining Operations

```javascript
const html = '<div>Content</div>';
const $ = jq(html);

// Chain multiple cssCamel calls
$('div')
    .cssCamel('backgroundColor', '#f0f0f0')
    .cssCamel('color', '#333')
    .cssCamel({
        padding: '10px',
        borderRadius: '4px',
    })
    .attr('data-styled', 'true');

// Extract final styles for React
const finalStyles = $('div').cssCamel(['backgroundColor', 'color', 'padding', 'borderRadius']);
console.log(finalStyles);
// {
//   backgroundColor: "#f0f0f0",
//   color: "#333",
//   padding: "10px",
//   borderRadius: "4px"
// }
```

### Complex Property Names

```javascript
const html = '<div>Rounded Box</div>';
const $ = jq(html);

// Works with complex multi-word properties
$('div').cssCamel({
    'border-top-left-radius': '10px',
    borderTopRightRadius: '10px',
    'border-bottom-left-radius': '5px',
    borderBottomRightRadius: '5px',
});

// Get all border radius values with camelCase keys
const radii = $('div').cssCamel([
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
]);

console.log(radii);
// {
//   borderTopLeftRadius: "10px",
//   borderTopRightRadius: "10px",
//   borderBottomLeftRadius: "5px",
//   borderBottomRightRadius: "5px"
// }
```

## Use Cases

1. **React Component Styling**: Extract styles from HTML and use in React components
2. **Server-Side Rendering**: Parse HTML on server, convert styles to React format
3. **HTML to React Migration**: Convert existing HTML with inline styles to React
4. **Dynamic Style Objects**: Build React style objects programmatically
5. **CSS-in-JS Preparation**: Convert CSS properties to JavaScript format
6. **API Response Styling**: Parse styled HTML from APIs for React rendering

## Comparison with css()

| Feature                    | cssCamel()                 | css()                         |
| -------------------------- | -------------------------- | ----------------------------- |
| Property name format (get) | Always camelCase           | As provided                   |
| Property name format (set) | Accepts both               | Accepts both                  |
| React compatibility        | ✅ Direct use              | ❌ Needs conversion           |
| Return object keys         | camelCase                  | As requested                  |
| Example return             | `{backgroundColor: "red"}` | `{"background-color": "red"}` |
| Best for                   | React/JSX                  | General CSS work              |

### Example Comparison

```javascript
const html = '<div style="background-color: red; font-size: 16px">Test</div>';
const $ = jq(html);

// css() - returns keys as requested
const cssResult = $('div').css(['background-color', 'font-size']);
console.log(cssResult);
// { "background-color": "red", "font-size": "16px" }

// cssCamel() - returns camelCase keys
const reactResult = $('div').cssCamel(['background-color', 'font-size']);
console.log(reactResult);
// { backgroundColor: "red", fontSize: "16px" }

// reactResult can be used directly in React:
// <div style={reactResult}>...</div>
```

## Performance Considerations

- Same performance as `.css()` method
- Getting styles is fast (reads from first element only)
- Setting styles iterates all elements in collection
- Property name conversion is minimal overhead
- Batch multiple property gets/sets for better performance

## Implementation Details

The method:

1. **Accepts flexible input**: Both kebab-case and camelCase property names
2. **Returns camelCase keys**: All returned object keys are in camelCase
3. **Property conversion**: Uses regex to convert between formats
4. **Inherits css() behavior**: Same auto-px logic and computed style handling
5. **Cross-environment**: Works in Node.js and browsers

## Related Methods

- **css()**: Get/set CSS styles with flexible property name format
- **attr()**: Get/set HTML attributes
- **addClass()/removeClass()**: Manipulate CSS classes

## Files

- **Implementation**: `methods/attributes-methods/cssCamel.js`
- **Tests**: `test/jqnode/attributes-methods/cssCamel.test.js`

## Browser Compatibility

Works in all environments:

- ✅ Node.js (via jsdom)
- ✅ Modern browsers
- ✅ Legacy browsers (with getComputedStyle support)

## Tips

1. **Use for React projects**: Perfect for server-side rendered React apps
2. **Batch property gets**: Use array notation to get multiple properties at once
3. **Direct JSX usage**: Return values can be used directly in React `style` prop
4. **Mix property formats**: Input can be kebab-case or camelCase when setting
5. **Consistent output**: Always get camelCase keys regardless of input format
6. **Chain with other methods**: Combine with other jqnode methods
7. **React migration**: Great tool for converting HTML to React components
