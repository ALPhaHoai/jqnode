# appendTo() Method

Insert elements at the end of target elements.

## Syntax
```javascript
jq(content).appendTo(target)
```

## Parameters
- **target** (String|Element|JQ): Target to append to

## Returns
JQ instance of inserted elements

## Examples

### Basic Usage
```javascript
const $ = jq('<li>New Item</li>').appendTo('ul');
// Inserts <li> at end of <ul>
```

### Multiple Targets
```javascript
jq('<span>Badge</span>').appendTo('.card');
// Adds span to each .card element
```

## Difference from append()
- **append()**: `$('ul').append('<li>Item</li>')` - called on target
- **appendTo()**: `$('<li>Item</li>').appendTo('ul')` - called on content

## Related
- **append()** - Insert content at end
- **prependTo()** - Insert at beginning of target
- **insertAfter()** - Insert after target
