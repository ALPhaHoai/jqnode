# prevAll() Method

Get all preceding siblings of each element.

## Syntax

```javascript
jq(selector).prevAll();
jq(selector).prevAll(selector);
```

## Parameters

- **selector** (String, optional): Filter siblings by selector

## Returns

JQ instance containing previous siblings

## Examples

### Get All Previous

```javascript
const $ = jq(`
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li id="current">Current</li>
    </ul>
`);

const previous = $('#current').prevAll();
console.log(previous.length); // 3
```

### Filter Previous

```javascript
const $ = jq(`
    <div>
        <span>Span 1</span>
        <p>Para 1</p>
        <span>Span 2</span>
        <p>Para 2</p>
        <span id="current">Current</span>
    </div>
`);

const prevSpans = $('#current').prevAll('span');
console.log(prevSpans.length); // 2
```

## Use Cases

- Process previous items
- Breadcrumb navigation
- Backward iteration
- Previous selections

## Related

- **prev()** - Get immediate previous sibling
- **prevUntil()** - Get siblings until selector
- **nextAll()** - Get all following siblings
- **siblings()** - Get all siblings
