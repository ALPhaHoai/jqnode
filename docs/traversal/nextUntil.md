# nextUntil() Method

Get all following siblings until (but not including) the element matched by selector.

## Syntax
```javascript
jq(selector).nextUntil(selector)
jq(selector).nextUntil(selector, filter)
```

## Parameters
- **selector** (String): Stop at this sibling (not included)
- **filter** (String, optional): Filter the results

## Returns
JQ instance containing sibling elements

## Examples

### Basic Usage
```javascript
const $ = jq(`
    <ul>
        <li id="start">Start</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li class="stop">Stop</li>
        <li>Item 5</li>
    </ul>
`);

const between = $('#start').nextUntil('.stop');
console.log(between.length); // 2 (Items 2 and 3, not .stop)
```

### With Filter
```javascript
const filtered = $('#start').nextUntil('.stop', ':not(.skip)');
// Only non-skipped items until .stop
```

## Use Cases
- Get range of siblings
- Process section of list
- Sequential operation until marker
- Menu item ranges

## Related
- **nextAll()** - Get all following siblings
- **next()** - Get immediate next sibling
- **prevUntil()** - Get previous siblings until selector
