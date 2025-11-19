# map() Method

Pass each element through a function and build a new array of values.

## Syntax
```javascript
jq(selector).map(function(index, element))
```

## Parameters
- **function**: Callback returning value for each element

## Returns
JQ instance (array-like object). Use `.get()` to get plain array.

## Examples

### Map to Texts
```javascript
const $ = jq('<ul><li>A</li><li>B</li><li>C</li></ul>');
const texts = $('li').map(function() {
    return $(this).text();
}).get();
console.log(texts); // ["A", "B", "C"]
```

### Map to Numbers
```javascript
const $ = jq('<div><span>1</span><span>2</span><span>3</span></div>');
const doubled = $('span').map(function() {
    return parseInt($(this).text()) * 2;
}).get();
console.log(doubled); // [2, 4, 6]
```

### Map with Index
```javascript
const $ = jq('<div><p>A</p><p>B</p></div>');
const indexed = $('p').map(function(i) {
    return `${i}: ${$(this).text()}`;
}).get();
console.log(indexed); // ["0: A", "1: B"]
```

## Related
- each() - Iterate without building array
- filter() - Filter elements
- get() - Convert to plain array
