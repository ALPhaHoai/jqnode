# parent() Method

Get the immediate parent of each element in the set.

## Syntax
```javascript
jq(selector).parent()
jq(selector).parent(selector)
```

## Parameters
- **selector** (String, optional): Filter parents by selector

## Returns
JQ instance containing parents

## Examples

### Get Parent
```javascript
const $ = jq('<div id="parent"><span id="child">Text</span></div>');
const parent = $('#child').parent();
console.log(parent.attr('id')); // "parent"
```

### Filter Parent
```javascript
const $ = jq('<div class="container"><span>Text</span></div>');
const container = $('span').parent('.container');
console.log(container.length); // 1
```

## Related
- parents() - Get all ancestors
- closest() - Get closest ancestor matching selector
- children() - Get children
