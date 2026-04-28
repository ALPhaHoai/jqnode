# next() / prev() Methods

Get the immediately following or preceding sibling of each element.

## Syntax

```javascript
jq(selector).next([selector]);
jq(selector).prev([selector]);
```

## Parameters

- **selector** (String, optional): Filter the sibling

## Returns

JQ instance containing sibling element(s)

## Examples

### next()

```javascript
const $ = jq('<div><span>A</span><span id="mid">B</span><span>C</span></div>');
console.log($('#mid').next().text()); // "C"
```

### prev()

```javascript
const $ = jq('<div><span>A</span><span id="mid">B</span><span>C</span></div>');
console.log($('#mid').prev().text()); // "A"
```

### With Selector

```javascript
const $ = jq('<div><span>A</span><p id="target">B</p><span class="sibling">C</span></div>');
console.log($('#target').next('.sibling').text(); // "C"
```

## Related

- nextAll() - Get all following siblings
- prevAll() - Get all previous siblings
- siblings() - Get all siblings
