# removeProp() Method

Remove a property from all elements in the set.

## Syntax

```javascript
jq(selector).removeProp(propertyName);
```

## Parameters

- **propertyName** (String): Name of the property to remove

## Returns

JQ instance (chainable)

## Examples

### Remove Custom Property

```javascript
const $ = jq('<div id="element">Content</div>');
$('#element').prop('customProp', 'value');
$('#element').removeProp('customProp');
console.log($('#element').prop('customProp')); // undefined
```

### Cannot Remove Native Properties

```javascript
// Native properties like 'className', 'id' cannot be removed
// They can only be set to empty/default values
```

## Use Cases

- Remove custom properties added via prop()
- Clean up element-specific data
- Reset dynamic property state

## Related

- **prop()** - Get/set properties
- **removeAttr()** - Remove attributes
- **removeData()** - Remove stored data

## Note

Cannot remove native DOM properties. Only removes properties added via `prop()` method.
