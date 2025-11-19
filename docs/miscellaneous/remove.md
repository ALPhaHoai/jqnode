# remove() Method

Remove the set of matched elements from the DOM.

## Syntax
```javascript
jq(selector).remove()
jq(selector).remove(selector)
```

## Parameters
- **selector** (String, optional): Filter elements to remove

## Returns
JQ instance containing removed elements

## Examples

### Remove All Matched
```javascript
const $ = jq('<div><p>Para 1</p><p>Para 2</p></div>');
$('p').remove();
// Result: <div></div>
```

### Remove with Filter
```javascript
const $ = jq('<div><p class="keep">Keep</p><p class="remove">Remove</p></div>');
$('p').remove('.remove');
// Result: <div><p class="keep">Keep</p></div>
```

## Related
- empty() - Remove children only
- detach() - Remove but keep data
