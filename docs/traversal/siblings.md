# siblings() Method

Get all siblings of each element in the set.

## Syntax

```javascript
jq(selector).siblings();
jq(selector).siblings(selector);
```

## Parameters

- **selector** (String, optional): Filter siblings by selector

## Returns

JQ instance containing siblings

## Examples

### Get All Siblings

```javascript
const $ = jq('<div><span>A</span><span id="target">B</span><span>C</span></div>');
const siblings = $('#target').siblings();
console.log(siblings.length); // 2 (A and C)
```

### Filter Siblings

```javascript
const $ = jq(
    '<div><span class="item">A</span><span id="target">B</span><span class="item">C</span></div>',
);
const items = $('#target').siblings('.item');
console.log(items.length); // 2
```

## Related

- next() - Get next sibling
- prev() - Get previous sibling
- parent() - Get parent
