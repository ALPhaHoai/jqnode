# is() Method

Check if any element in the set matches the selector.

## Syntax

```javascript
jq(selector).is(selector);
```

## Parameters

- **selector** (String): CSS selector to test against

## Returns

Boolean - true if any element matches, false otherwise

## Examples

### Check Class

```javascript
const $ = jq('<div class="active highlighted">Content</div>');
console.log($('div').is('.active')); // true
console.log($('div').is('.inactive')); // false
```

### Check Tag

```javascript
const $ = jq('<p>Paragraph</p>');
console.log($('p').is('p')); // true
console.log($('p').is('div')); // false
```

### Multiple Elements

```javascript
const $ = jq('<div><span class="active">A</span><span>B</span></div>');
console.log($('span').is('.active')); // true (at least one matches)
```

### Complex Selectors

```javascript
console.log($('span').is(':first-child')); // Check if any span is first child
console.log($('div').is('[class]')); // Check if has class attribute
```

## Use Cases

- Conditional logic based on element type
- Check element state
- Validate selections
- Event handler filtering

## Related

- **hasClass()** - Check for specific class
- **filter()** - Filter to matching elements
- **not()** - Filter to non-matching elements
