# filter() Method

Reduce the set of matched elements to those that match the selector or pass the function test.

## Syntax

```javascript
jq(selector).filter(selector)
jq(selector).filter(function(index, element))
```

## Parameters

- **selector** (String): CSS selector to match
- **function**: Test function returning true to keep element

## Returns

JQ instance with filtered elements

## Examples

### Filter by Selector

```javascript
const $ = jq('<div><span class="keep">A</span><span>B</span><span class="keep">C</span></div>');
const filtered = $('span').filter('.keep');
console.log(filtered.length); // 2
```

### Filter by Function

```javascript
const $ = jq('<div><span>1</span><span>2</span><span>3</span></div>');
const evens = $('span').filter(function (i) {
    return i % 2 === 0;
});
console.log(evens.length); // 2 (indices 0, 2)
```

## Related

- not() - Remove matching elements
- has() - Filter by descendant
- is() - Check if matches
