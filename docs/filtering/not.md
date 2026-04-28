# not() Method

Remove elements from the set that match the selector.

## Syntax

```javascript
jq(selector).not(selector)
jq(selector).not(function(index, element))
```

## Parameters

- **selector** (String): CSS selector of elements to exclude
- **function**: Function returning true to exclude element

## Returns

JQ instance with filtered elements

## Examples

### Exclude by Selector

```javascript
const $ = jq(`
    <ul>
        <li class="keep">Item 1</li>
        <li class="remove">Item 2</li>
        <li class="keep">Item 3</li>
        <li class="remove">Item 4</li>
    </ul>
`);

const filtered = $('li').not('.remove');
console.log(filtered.length); // 2 (only .keep items)
```

### Exclude by Function

```javascript
const $ = jq('<div><span>1</span><span>2</span><span>3</span><span>4</span></div>');
const odds = $('span').not(function (index) {
    return index % 2 === 0; // Exclude even indices
});
console.log(odds.length); // 2 (indices 1 and 3)
```

### Multiple Exclusions

```javascript
$('div').not('.exclude').not('#skip').not('[data-ignore]');
```

## Use Cases

- Exclude specific elements from selection
- Filter out unwanted items
- Inverse filtering
- Skip certain elements in iteration

## Related

- **filter()** - Keep matching elements (opposite of not)
- **is()** - Check if matches
- **has()** - Filter by descendants
