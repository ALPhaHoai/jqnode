# removeData() Method

Remove stored data from elements.

## Syntax

```javascript
// Remove all data
jq(selector).removeData();

// Remove specific key
jq(selector).removeData(key);
```

## Parameters

- **key** (String, optional): Data key to remove. If omitted, removes all data.

## Returns

JQ instance (chainable)

## Examples

### Remove Specific Data

```javascript
const $ = jq('<div id="user">Content</div>');
$('#user').data('userId', 123);
$('#user').data('name', 'John');

$('#user').removeData('userId');
console.log($('#user').data('userId')); // undefined
console.log($('#user').data('name')); // "John" (still exists)
```

### Remove All Data

```javascript
$('#user').removeData(); // All data cleared
console.log($('#user').data()); // {}
```

### Remove from Multiple Elements

```javascript
const $ = jq('<div><span data-temp="1">A</span><span data-temp="2">B</span></div>');
$('span').removeData('temp');
```

## Use Cases

- Clean up temporary data
- Free memory from cached data
- Reset element state
- Remove event-related data

## Related

- **data()** - Store/retrieve data
- **removeAttr()** - Remove attributes
- **removeProp()** - Remove properties

## Note

Only removes data stored via `data()` method, not data-\* HTML attributes.
