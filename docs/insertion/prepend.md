# prepend() Method

Insert content at the beginning of each element.

## Syntax

```javascript
jq(selector).prepend(content);
```

## Parameters

- **content** (String|Element|JQ): Content to insert

## Returns

JQ instance (chainable)

## Examples

### Insert at Beginning

```javascript
const $ = jq('<ul><li>Item 2</li></ul>');
$('ul').prepend('<li>Item 1</li>');
// Result: <ul><li>Item 1</li><li>Item 2</li></ul>
```

### Multiple Elements

```javascript
$('.container').prepend('<div class="header">Header</div>');
// Adds header to beginning of each .container
```

## Use Cases

- Add items to start of list
- Insert headers
- Prepend warnings/notices
- Add leading content

## Related

- **append()** - Insert at end
- **prependTo()** - Prepend to target
- **before()** - Insert before element
