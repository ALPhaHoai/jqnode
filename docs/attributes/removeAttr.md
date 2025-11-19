# removeAttr() Method

Remove an attribute from all elements in the set.

## Syntax
```javascript
jq(selector).removeAttr(attributeName)
```

## Parameters
- **attributeName** (String): Name of the attribute to remove

## Returns
JQ instance (chainable)

## Examples

### Remove Single Attribute
```javascript
const $ = jq('<div id="box" class="active" data-info="test">Content</div>');
$('#box').removeAttr('data-info');
console.log($('#box').attr('data-info')); // undefined
```

### Remove Multiple Attributes
```javascript
$('#box').removeAttr('class');
$('#box').removeAttr('id');
// Now has no class or id
```

### Remove from Multiple Elements
```javascript
const $ = jq('<div><img src="a.jpg" alt="A"><img src="b.jpg" alt="B"></div>');
$('img').removeAttr('alt');
// Both images no longer have alt attribute
```

## Use Cases
- Clean up dynamically added attributes
- Remove data-* attributes
- Reset element state
- Clear temporary markers

## Related
- **attr()** - Get/set attributes
- **prop()** - Get/set properties
- **removeProp()** - Remove properties
