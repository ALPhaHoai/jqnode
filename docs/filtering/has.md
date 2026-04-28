# has() Method

Filter elements to those that have a descendant matching the selector.

## Syntax

```javascript
jq(selector).has(selector);
```

## Parameters

- **selector** (String): CSS selector to match descendants

## Returns

JQ instance containing filtered elements

## Examples

### Filter by Descendant

```javascript
const $ = jq(`
    <div>
        <div class="box"><p>Has paragraph</p></div>
        <div class="box">No paragraph</div>
        <div class="box"><p>Has paragraph</p></div>
    </div>
`);

const boxesWithP = $('.box').has('p');
console.log(boxesWithP.length); // 2
```

### Complex Nesting

```javascript
const $ = jq(`
    <ul>
        <li>Item 1 <ul><li>Nested</li></ul></li>
        <li>Item 2</li>
        <li>Item 3 <ul><li>Nested</li></ul></li>
    </ul>
`);

const itemsWithNested = $('li').has('ul');
console.log(itemsWithNested.length); // 2 (items with nested lists)
```

## Use Cases

- Find parents containing specific children
- Filter containers by content
- Locate elements with specific descendants
- Navigation menu filtering

## Related

- **filter()** - Filter by selector/function
- **find()** - Get descendants
- **children()** - Get immediate children
- **is()** - Check if matches selector
