# append() Method

Insert content at the end of each element in the set.

## Syntax
```javascript
jq(selector).append(content)
```

## Parameters
- **content** (String|Element|JQ): Content to insert

## Returns
JQ instance (chainable)

## Examples

### Append HTML String
```javascript
const $ = jq('<ul><li>Item 1</li></ul>');
$('ul').append('<li>Item 2</li>');
// Result: <ul><li>Item 1</li><li>Item 2</li></ul>
```

### Append Element
```javascript
const $ = jq('<div></div>');
const newEl = $('<p>New paragraph</p>');
$('div').append(newEl);
```

### Append to Multiple Elements
```javascript
const $ = jq('<div><ul></ul><ul></ul></div>');
$('ul').append('<li>Item</li>');
// Both ULs get the new item
```

## Related
- appendTo() - Insert elements at end of target
- prepend() - Insert at beginning
- after() - Insert after element
- before() - Insert before element
