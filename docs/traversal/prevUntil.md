# prevUntil() Method

Get all preceding siblings until (but not including) the element matched by selector.

## Syntax
```javascript
jq(selector).prevUntil(selector)
jq(selector).prevUntil(selector, filter)
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
        <li>Item 1</li>
        <li class="stop">Stop</li>
        <li>Item 3</li>
        <li>Item 4</li>
        <li id="current">Current</li>
    </ul>
`);

const between = $('#current').prevUntil('.stop');
console.log(between.length); // 2 (Items 3 and 4, not .stop)
```

### With Filter
```javascript
const filtered = $('#current').prevUntil('.stop', 'li:not(.skip)');
// Only non-skipped items until .stop
```

## Use Cases
- Get range of previous siblings
- Backward processing until marker
- Section selection
- Navigation ranges

## Related
- **prevAll()** - Get all previous siblings
- **prev()** - Get immediate previous sibling
- **nextUntil()** - Get following siblings until selector
