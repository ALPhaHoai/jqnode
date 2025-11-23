# removeClass() Method

Remove one or more CSS classes from elements.

## Syntax

```javascript
jq(selector).removeClass(className)
jq(selector).removeClass(function(index, currentClass))
```

## Parameters

- **className** (String): Space-separated class names
- **function**: Return class names to remove

## Returns

JQ instance (chainable)

## Examples

### Remove Single Class

```javascript
$('div').removeClass('active');
```

### Remove Multiple Classes

```javascript
$('div').removeClass('foo bar baz');
```

### Using Function

```javascript
$('div').removeClass(function (index, className) {
    return className.match(/\bcolor-\S+/g).join(' ');
});
```

## Related

- addClass() - Add classes
- toggleClass() - Toggle classes
- hasClass() - Check for class
