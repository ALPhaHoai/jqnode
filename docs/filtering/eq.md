# eq() Method

Reduce the set of matched elements to the one at the specified index.

## Syntax
```javascript
jq(selector).eq(index)
```

## Parameters
- **index** (Number): Zero-based index (negative counts from end)

## Returns
JQ instance containing single element

## Examples

### Positive Index
```javascript
const $ = jq('<div><span>0</span><span>1</span><span>2</span></div>');
console.log($('span').eq(1).text()); // "1"
```

### Negative Index
```javascript
const $ = jq('<div><span>A</span><span>B</span><span>C</span></div>');
console.log($('span').eq(-1).text()); // "C" (last)
console.log($('span').eq(-2).text()); // "B" (second to last)
```

## Related
- first() - Get first element
- last() - Get last element
- get() - Get DOM element (not JQ instance)
- slice() - Get range of elements
