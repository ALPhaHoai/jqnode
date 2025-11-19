# toggleClass() Method

Toggle one or more CSS classes on elements.

## Syntax
```javascript
jq(selector).toggleClass(className)
jq(selector).toggleClass(className, state)
jq(selector).toggleClass(function(index, className, state))
```

## Parameters
- **className** (String): Space-separated class names to toggle
- **state** (Boolean): If true, add only; if false, remove only
- **function**: Return class names to toggle

## Returns
JQ instance (chainable)

## Examples

### Toggle Class
```javascript
$('div').toggleClass('active'); // Add if missing, remove if present
```

### Force Add
```javascript
$('div').toggleClass('active', true); // Always add
```

### Force Remove
```javascript
$('div').toggleClass('active', false); // Always remove
```

### Using Function
```javascript
$('div').toggleClass(function(index) {
    return index % 2 === 0 ? 'even' : 'odd';
});
```

## Related
- addClass() - Add classes
- removeClass() - Remove classes
- hasClass() - Check for class
