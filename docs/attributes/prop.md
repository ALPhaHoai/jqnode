# prop() Method

Get or set properties on DOM elements (not HTML attributes).

## Syntax
```javascript
jq(selector).prop(propertyName)
jq(selector).prop(propertyName, value)
```

## Parameters
- **propertyName** (String): Property name
- **value** (Any): Value to set

## Returns
- Get: Property value
- Set: JQ instance (chainable)

## Examples

### Checkbox
```javascript
const $ = jq('<input type="checkbox" checked>');
console.log($(':checkbox').prop('checked')); // true (boolean)
console.log($(':checkbox').attr('checked')); // "checked" (string)

$(':checkbox').prop('checked', false);
console.log($(':checkbox').prop('checked')); // false
```

### Selected Option
```javascript
const $ = jq('<select><option value="a">A</option><option value="b" selected>B</option></select>');
console.log($('option').eq(1).prop('selected')); // true
```

### Disabled
```javascript
const $ = jq('<button>Click</button>');
$('button').prop('disabled', true);
console.log($('button').prop('disabled')); // true
```

## prop() vs attr()
- **prop()**: DOM properties (true/false for booleans)
- **attr()**: HTML attributes (strings or undefined)

Use `prop()` for: checked, selected, disabled, readonly
Use `attr()` for: id, class, data-*, href, src

## Related
- attr() - Get/set HTML attributes
- removeProp() - Remove property
- val() - Get/set form values
