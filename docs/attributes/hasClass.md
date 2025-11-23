# hasClass() Method

Check if any element in the set has the specified class.

## Syntax

```javascript
jq(selector).hasClass(className);
```

## Parameters

- **className** (String): Class name to check for

## Returns

Boolean - true if any element has the class, false otherwise

## Examples

### Check for Class

```javascript
const $ = jq('<div class="foo bar">Content</div>');
console.log($('div').hasClass('foo')); // true
console.log($('div').hasClass('baz')); // false
```

### Multiple Elements

```javascript
const $ = jq('<div><span class="active">A</span><span>B</span></div>');
console.log($('span').hasClass('active')); // true (first span has it)
```

## Related

- addClass() - Add classes
- removeClass() - Remove classes
- toggleClass() - Toggle classes
