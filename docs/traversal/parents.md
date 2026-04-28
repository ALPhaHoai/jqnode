# parents() Method

Get all ancestors of each element in the set.

## Syntax

```javascript
jq(selector).parents();
jq(selector).parents(selector);
```

## Parameters

- **selector** (String, optional): Filter ancestors by selector

## Returns

JQ instance containing ancestors

## Examples

### Get All Ancestors

```javascript
const $ = jq(`
    <div class="grandparent">
        <div class="parent">
            <span id="child">Text</span>
        </div>
    </div>
`);

const ancestors = $('#child').parents();
console.log(ancestors.length); // 2 (.parent and .grandparent)
```

### Filter Ancestors

```javascript
const divAncestors = $('#child').parents('div');
console.log(divAncestors.length); // 2 (both are divs)

const grandparent = $('#child').parents('.grandparent');
console.log(grandparent.length); // 1
```

## Use Cases

- Find all container elements
- Breadcrumb navigation
- Event delegation
- Hierarchy traversal

## Related

- **parent()** - Get immediate parent only
- **closest()** - Get first matching ancestor
- **parentsUntil()** - Get ancestors until selector
