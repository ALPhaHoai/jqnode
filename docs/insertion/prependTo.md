# prependTo() Method

Insert elements at the beginning of target elements.

## Syntax

```javascript
jq(content).prependTo(target);
```

## Parameters

- **target** (String|Element|JQ): Target to prepend to

## Returns

JQ instance of inserted elements

## Examples

### Basic Usage

```javascript
jq('<li>First Item</li>').prependTo('ul');
// Inserts at beginning of <ul>
```

## Difference from prepend()

- **prepend()**: `$('ul').prepend('<li>Item</li>')` - called on target
- **prependTo()**: `$('<li>Item</li>').prependTo('ul')` - called on content

## Related

- **prepend()** - Insert content at beginning
- **appendTo()** - Insert at end of target
- **insertBefore()** - Insert before target
