# children() Method

Get the immediate children of each element in the set.

## Syntax
```javascript
jq(selector).children()
jq(selector).children(selector)
```

## Parameters
- **selector** (String, optional): Filter children by selector

## Returns
JQ instance containing children

## Examples

### Get All Children
```javascript
const $ = jq('<ul><li>A</li><li>B</li></ul>');
const children = $('ul').children();
console.log(children.length); // 2
```

### Filter Children
```javascript
const $ = jq('<div><span class="active">A</span><span>B</span></div>');
const active = $('div').children('.active');
console.log(active.length); // 1
```

## Note
Only gets immediate children, not all descendants.

## Related
- find() - Get all descendants
- parent() - Get parent element
- contents() - Get children including text nodes
