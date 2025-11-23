# val() Method

Get or set the value of form elements (input, textarea, select).

## Syntax

```javascript
// Get value
jq(selector).val();

// Set value
jq(selector).val(value);
```

## Parameters

- **value** (String|Number|Array): Value to set

## Returns

- Get: String or Array (for multi-select)
- Set: JQ instance (chainable)

## Examples

### Text Input

```javascript
const $ = jq('<input type="text" value="hello">');
console.log($('input').val()); // "hello"
$('input').val('world');
console.log($('input').val()); // "world"
```

### Checkbox

```javascript
const $ = jq('<input type="checkbox" value="yes">');
console.log($('input').val()); // "yes"
```

### Select

```javascript
const $ = jq('<select><option value="a">A</option><option value="b" selected>B</option></select>');
console.log($('select').val()); // "b"
$('select').val('a');
```

## Related

- attr() - Get/set attributes
- prop() - Get/set properties
- text() - Get/set text content
