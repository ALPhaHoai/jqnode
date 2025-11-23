# nextAll() Method

Get all following siblings of each element.

## Syntax

```javascript
jq(selector).nextAll();
jq(selector).nextAll(selector);
```

## Parameters

- **selector** (String, optional): Filter siblings by selector

## Returns

JQ instance containing following siblings

## Examples

### Get All Following

```javascript
const $ = jq(`
    <ul>
        <li id="start">Start</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
    </ul>
`);

const following = $('#start').nextAll();
console.log(following.length); // 3
```

### Filter Following

```javascript
const $ = jq(`
    <div>
        <span id="current">Current</span>
        <p>Para 1</p>
        <span>Span 1</span>
        <p>Para 2</p>
        <span>Span 2</span>
    </div>
`);

const followingSpans = $('#current').nextAll('span');
console.log(followingSpans.length); // 2
```

## Use Cases

- Select remaining items in list
- Process following elements
- Navigation menus
- Sequential processing

## Related

- **next()** - Get immediate next sibling
- **nextUntil()** - Get siblings until selector
- **prevAll()** - Get all previous siblings
- **siblings()** - Get all siblings
