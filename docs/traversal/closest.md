# closest() Method

Get the first ancestor element that matches the selector, starting with the element itself.

## Syntax

```javascript
jq(selector).closest(selector);
```

## Parameters

- **selector** (String): Selector to match against ancestors

## Returns

JQ instance containing the closest matching ancestor (or empty if none found)

## Examples

### Find Closest Ancestor

```javascript
const $ = jq(`
    <div class="container">
        <div class="inner">
            <span id="target">Text</span>
        </div>
    </div>
`);
const container = $('#target').closest('.container');
console.log(container.attr('class')); // "container"
```

### No Match

```javascript
const $ = jq('<div><span id="test">Text</span></div>');
const result = $('#test').closest('.missing');
console.log(result.length); // 0
```

### Starts with Self

```javascript
const $ = jq('<div class="item" id="target">Text</div>');
const item = $('#target').closest('.item');
console.log(item.attr('id')); // "target" (found itself)
```

## Related

- parent() - Get immediate parent only
- parents() - Get all ancestors
- parentsUntil() - Get ancestors until selector
