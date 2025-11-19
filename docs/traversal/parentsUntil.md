# parentsUntil() Method

Get ancestors until (but not including) the element matched by selector.

## Syntax
```javascript
jq(selector).parentsUntil(selector)
jq(selector).parentsUntil(selector, filter)
```

## Parameters
- **selector** (String): Stop at this ancestor (not included)
- **filter** (String, optional): Filter the results

## Returns
JQ instance containing ancestors

## Examples

### Basic Usage
```javascript
const $ = jq(`
    <div class="outer">
        <div class="middle">
            <div class="inner">
                <span id="target">Text</span>
            </div>
        </div>
    </div>
`);

const between = $('#target').parentsUntil('.outer');
console.log(between.length); // 2 (.inner and .middle, not .outer)
```

### With Filter
```javascript
const divs = $('#target').parentsUntil('.outer', 'div');
// Only div ancestors until .outer
```

## Use Cases
- Get portion of ancestor chain
- Navigation hierarchies
- Breadcrumb building
- Partial tree traversal

## Related
- **parents()** - Get all ancestors
- **parent()** - Get immediate parent
- **closest()** - Get first matching ancestor
