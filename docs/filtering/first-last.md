# first() / last() Methods

Get the first or last element in the set.

## Syntax
```javascript
jq(selector).first()
jq(selector).last()
```

## Returns
JQ instance containing single element

## Examples

### first()
```javascript
const $ = jq('<ul><li>First</li><li>Middle</li><li>Last</li></ul>');
console.log($('li').first().text()); // "First"
```

### last()
```javascript
const $ = jq('<ul><li>First</li><li>Middle</li><li>Last</li></ul>');
console.log($('li').last().text()); // "Last"
```

### Chaining
```javascript
const $ = jq('<div><p class="text">A</p><p class="text">B</p></div>');
$('.text').first().addClass('first-paragraph');
```

## Related
- eq() - Get element at specific index
- slice() - Get range of elements
